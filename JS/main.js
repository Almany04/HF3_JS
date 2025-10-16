// ======================= JS/main.js =======================
import Renderer from "./renderer.js";
import Logic from "./logic.js";

const logic = new Logic();

function render() {
  Renderer.renderDevelopers(logic.filteredDevelopers, "app");
  // NINCS szükség újra esemény-kötésre, delegálunk az #app konténerre
  const ic = document.getElementById("invalidCount");
  if (ic) ic.textContent = String(logic.invalidCount);
}

document.addEventListener("DOMContentLoaded", async () => {
  // Auth guard
  const userStr = localStorage.getItem("loggedInUser");
  if (!userStr) {
    window.location.href = "index.html";
    return;
  }
  const user = JSON.parse(userStr);
  logic.setLoggedUser(user);
  document.getElementById("welcomeUser").textContent = `Belépve: ${user.username}`;

  // Szűrés UI
  const filterSel = document.getElementById("jobFilter");
  const resetBtn = document.getElementById("resetFilterBtn");
  filterSel?.addEventListener("change", () => {
    logic.setFilter(filterSel.value);
    render();
  });
  resetBtn?.addEventListener("click", () => {
    filterSel.value = "";
    logic.setFilter("");
    render();
  });

  // Mutasd az érvényteleneket
  const showInvalid = document.getElementById("showInvalid");
  showInvalid?.addEventListener("change", () => {
    logic.setShowInvalid(showInvalid.checked);
    render();
  });

  // Create
  document.getElementById("createBtn").addEventListener("click", async () => {
    const raw = document.getElementById("newDevJson").value;
    try {
      await logic.createDeveloperFromJSON(raw);
      document.getElementById("newDevJson").value = "";
      render();
    } catch (e) {
      alert(e.message || "Hiba a létrehozás során");
    }
  });

  // Update form gomb
  document.getElementById("updateBtn").addEventListener("click", async () => {
    const id = document.getElementById("editId").value.trim();
    if (!id) {
      alert("Nincs érvényes ID – ezt a rekordot nem lehet frissíteni.");
      return;
    }

    const updateObj = {
      name: document.getElementById("editName").value,
      email: document.getElementById("editEmail").value,
      job: document.getElementById("editJob").value,
      age: Number(document.getElementById("editAge").value),
      salary: Number(document.getElementById("editSalary").value),
      image: document.getElementById("editImage").value,
    };

    await logic.updateDeveloper(id, updateObj);
    render();
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });

  // Adatok betöltése és első render
  await logic.loadDevelopers();
  render();
});

// <<< ESEMÉNYDELEGÁLÁS: minden kártyagomb itt kezelve, biztosan működik render után is
document.getElementById("app").addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.classList.contains("update-btn")) {
    const id = btn.dataset.id;
    const dev = logic.filteredDevelopers.find(d => d.cid == id);
    if (!dev) return;

    document.getElementById("editId").value = dev.cid || "";
    document.getElementById("editName").value = dev.name || "";
    document.getElementById("editEmail").value = dev.email || "";
    document.getElementById("editJob").value = dev.job || "";
    document.getElementById("editAge").value = Number.isFinite(dev.age) ? dev.age : "";
    document.getElementById("editSalary").value = Number.isFinite(dev.salary) ? dev.salary : "";
    document.getElementById("editImage").value = dev.image || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (btn.classList.contains("delete-btn")) {
    const id = btn.dataset.id;
    await logic.deleteDeveloper(id);
    render();
  }
});
