// ======================= JS/apiHandler.js =======================
const BASE_URL = "https://api.siposm.hu";

export default class APIHandler {
  static async getAllDevelopers() {
    const res = await fetch(`${BASE_URL}/getDevelopers`);
    if (!res.ok) throw new Error("GET /getDevelopers failed");
    return res.json();
  }

  static async createDeveloper(devObj) {
    const res = await fetch(`${BASE_URL}/createDeveloper`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(devObj),
    });
    if (!res.ok) throw new Error("POST /createDeveloper failed");
    return res.json();
  }

  static async updateDeveloper(updateObjWithId) { // Most egyetlen objektumot vár, amiben az ID is benne van
    if (!updateObjWithId.id) throw new Error("Nincs ID az update híváshoz");

    // Az ID már nem kerül az URL-be!
    const res = await fetch(`${BASE_URL}/updateDeveloper`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // Az ID most már a body része
      body: JSON.stringify(updateObjWithId),
    });
    if (!res.ok) throw new Error("PUT /updateDeveloper failed");
    return res.json();
  }

  static async deleteDeveloper(id) {
    if (!id) throw new Error("Nincs ID a delete híváshoz");

    // Az ID már nem kerül az URL-be!
    const res = await fetch(`${BASE_URL}/deleteDeveloper`, {
      method: "DELETE", // A DELETE metódus is küldhet body-t
      headers: { "Content-Type": "application/json" },
      // A body-ba egy JSON objektumot teszünk, ami tartalmazza az ID-t
      body: JSON.stringify({ id: id }),
    });
    if (!res.ok) throw new Error("DELETE /deleteDeveloper failed");
    return res.json();
  }
}
