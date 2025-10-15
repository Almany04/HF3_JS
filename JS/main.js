import APIHandler from "./apiHandler";
import Renderer from "./renderer.js";

document.addEventListener("DOMContentLoaded", async ()=>{
    console.log("Oldal betöltve!");

    try {
        const developers=await APIHandler.getAllDevelopers();
        console.log("Fejlesztők lekérve: ", developers);

        Renderer.renderDevelopers(developers, "app");

    } catch(error){
        console.error("Hiba történt az adatok lekérésekor:", error);
    }
});