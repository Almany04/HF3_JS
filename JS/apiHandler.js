// JS/apiHandler.js
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

  static async updateDeveloper(id, updateObj) {
    const res = await fetch(`${BASE_URL}/updateDeveloper/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateObj),
    });
    if (!res.ok) throw new Error("PUT /updateDeveloper/{id} failed");
    return res.json();
  }

  static async deleteDeveloper(id) {
    const res = await fetch(`${BASE_URL}/deleteDeveloper/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("DELETE /deleteDeveloper/{id} failed");
    return res.json();
  }
}
