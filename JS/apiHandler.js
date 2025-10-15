const BASE_URL = "https://api.siposm.hu/";

export default class APIHandler {

  // READ (Fejlesztők listázása)
  static async getAllDevelopers() {
    const response = await fetch(BASE_URL + "getDevelopers");
    return await response.json();
  }

  // CREATE (Új fejlesztő létrehozása)
  static async createDeveloper(developerObj) {
    const response = await fetch(BASE_URL + "createDeveloper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(developerObj)
    });
    return await response.json();
  }

  // UPDATE (Fejlesztő frissítése)
  static async updateDeveloper(id, updateObj) {
    const response = await fetch(BASE_URL + "updateDeveloper/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateObj)
    });
    return await response.json();
  }

  // DELETE (Fejlesztő törlése)
  static async deleteDeveloper(id) {
    const response = await fetch(BASE_URL + "deleteDeveloper/" + id, {
      method: "DELETE"
    });
    return await response.json();
  }
}
