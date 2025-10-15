import APIHandler from "./apiHandler.js";
import Renderer from "./renderer.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Oldal betöltve!");

  let developers = [];

  try {
    developers = await APIHandler.getAllDevelopers();
    console.log("Fejlesztők lekérve:", developers);
    Renderer.renderDevelopers(developers, "app");
  } catch (error) {
    console.error("Hiba történt az adatok lekérésekor:", error);
  }

  // 🔴 DELETE funkció
  document.getElementById("app").addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const id = event.target.getAttribute("data-id");
      console.log("Törlendő fejlesztő ID:", id);
      try {
        await APIHandler.deleteDeveloper(id);
        developers = developers.filter(dev => dev.id != id);
        Renderer.renderDevelopers(developers, "app");
      } catch (error) {
        console.log("Hiba történt törlés közben:", error);
      }
    }
  });

  // 🟢 CREATE funkció
  document.getElementById("createBtn").addEventListener("click", async () => {
    const raw = document.getElementById("newDevJson").value.trim();
    if (!raw) {
      alert("Adj meg JSON-t a textarea-ban!");
      return;
    }

    let newDev;
    try {
      newDev = JSON.parse(raw);
    } catch (err) {
      alert("❌ Hibás JSON: " + err.message);
      console.error("JSON parse error:", raw);
      return;
    }

    // automatikus prefix
    if (typeof newDev.name === "string" && !newDev.name.startsWith("BD-")) {
      newDev.name = "BD-" + newDev.name;
    }

    try {
      const created = await APIHandler.createDeveloper(newDev);
      console.log("Létrehozott fejlesztő:", created);

      developers.push(created);
      Renderer.renderDevelopers(developers, "app");
      document.getElementById("newDevJson").value = "";
    } catch (error) {
      alert("❌ Hiba a létrehozáskor (API): nézd meg a Console-t!");
      console.error(error);
    }
  });
});
