// JS/main.js
import Renderer from "./renderer.js";
import Logic from "./logic.js";

const logic = new Logic();

function render() {
  Renderer.renderDevelopers(logic.filteredDevelopers, "app");
  attachCardEvents();
}

function attachCardEvents() {
  // Update gomb kártyán → form kitöltése
  document.querySelectorAll(".update-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const dev = logic.filteredDevelopers.find(d => d.id == id || d._id == id);
      if (!dev) return;

      document.getElementById("editId").value = dev.id || dev._id || "";
      document.getElementById("editName").value = dev.name || "";
      document.getElementById("editEmail").value = dev.email || "";
      document.getElementById("editJob").value = dev.job || "";
      document.getElementById("editAge").value = dev.age ?? "";
      document.getElementById("editSalary").value = dev.salary ?? "";
      document.getElementById("editImage").value = dev.image || "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Delete
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await logic.deleteDeveloper(id);
      render();
    });
  });
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
  filterSel.addEventListener("change", () => {
    logic.setFilter(filterSel.value);
    render();
  });
  resetBtn.addEventListener("click", () => {
    filterSel.value = "";
    logic.setFilter("");
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

  // Update
  document.getElementById("updateBtn").addEventListener("click", async () => {
    const id = document.getElementById("editId").value;
    if (!id) return;

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
