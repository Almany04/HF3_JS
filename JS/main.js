import Renderer from "./renderer.js";
import Logic from "./logic.js";

const logic = new Logic();

function render() {
  Renderer.renderDevelopers(logic.filteredDevelopers, "app");
  const ic = document.getElementById("invalidCount");
  if (ic) ic.textContent = String(logic.invalidCount);
}

function clearEditForm() {
    document.getElementById("editId").value = "";
    document.getElementById("editName").value = "";
    document.getElementById("editEmail").value = "";
    document.getElementById("editJob").value = "";
    document.getElementById("editAge").value = "";
    document.getElementById("editSalary").value = "";
    document.getElementById("editImage").value = "";
}

document.addEventListener("DOMContentLoaded", async () => {
  const userStr = localStorage.getItem("loggedInUser");
  if (!userStr) {
    window.location.href = "index.html";
    return;
  }
  const user = JSON.parse(userStr);
  logic.setLoggedUser(user);
  document.getElementById("welcomeUser").textContent = `Belépve: ${user.username}`;

  const filterSel = document.getElementById("jobFilter");
  filterSel?.addEventListener("change", () => {
    logic.setFilter(filterSel.value);
    render();
  });
  document.getElementById("resetFilterBtn")?.addEventListener("click", () => {
    filterSel.value = "";
    logic.setFilter("");
    render();
  });

  document.getElementById("showInvalid")?.addEventListener("change", (e) => {
    logic.setShowInvalid(e.target.checked);
    render();
  });

  document.getElementById("createBtn").addEventListener("click", async () => {
    const raw = document.getElementById("newDevJson").value;
    try {
      await logic.createDeveloperFromJSON(raw);
      document.getElementById("newDevJson").value = "";
      render();
    } catch (e) {
      alert(e.message || "Hiba a létrehozás során.");
    }
  });

  document.getElementById("updateBtn").addEventListener("click", async () => {
    const id = document.getElementById("editId").value.trim();
    if (!id) return;
    
    try {
      const updateObj = {
        name: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        job: document.getElementById("editJob").value,
        age: Number(document.getElementById("editAge").value),
        salary: Number(document.getElementById("editSalary").value),
        image: document.getElementById("editImage").value,
      };
      await logic.updateDeveloper(id, updateObj);
      clearEditForm();
      render();
    } catch (e) {
      alert(e.message || "Hiba a frissítés során.");
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });

  await logic.loadDevelopers();
  render();
});

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
    document.getElementById("editAge").value = dev.age ?? "";
    document.getElementById("editSalary").value = dev.salary ?? "";
    document.getElementById("editImage").value = dev.image || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (btn.classList.contains("delete-btn")) {
    const id = btn.dataset.id;
    if (confirm("Biztosan törölni szeretnéd ezt a rekordot?")) {
        try {
            await logic.deleteDeveloper(id);
            render();
        } catch (e) {
            alert(e.message || "Hiba a törlés során.");
        }
    }
  }
});