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

  static async updateDeveloper(updateObjWithId) {
    if (!updateObjWithId.id) throw new Error("Nincs ID az update híváshoz");

    const res = await fetch(`${BASE_URL}/updateDeveloper`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateObjWithId),
    });
    if (!res.ok) throw new Error("PUT /updateDeveloper failed");
    return res.json();
  }

  static async deleteDeveloper(id) {
    if (!id) throw new Error("Nincs ID a delete híváshoz");

    const res = await fetch(`${BASE_URL}/deleteDeveloper`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    if (!res.ok) throw new Error("DELETE /deleteDeveloper failed");
    return res.json();
  }
}