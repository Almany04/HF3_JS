// JS/logic.js
import APIHandler from "./apiHandler.js";

export default class Logic {
  constructor() {
    this.allDevelopers = [];
    this.filteredDevelopers = [];
    this.currentFilter = "";
    this.loggedUser = null;
  }

  setLoggedUser(userObj) {
    this.loggedUser = userObj;
  }

  getInitials() {
    const u = this.loggedUser;
    if (!u) return "XX";
    const ln = (u.lastName || "").trim();
    const fn = (u.firstName || "").trim();
    const initials =
      (ln ? ln[0].toUpperCase() : "") + (fn ? fn[0].toUpperCase() : "");
    return initials || "XX";
  }

  async loadDevelopers() {
    const data = await APIHandler.getAllDevelopers();
    this.allDevelopers = data;
    this.applyFilter(); // initialize filteredDevelopers
    return this.filteredDevelopers;
  }

  applyFilter() {
    if (this.currentFilter) {
      this.filteredDevelopers = this.allDevelopers.filter(d => (d.job || "") === this.currentFilter);
    } else {
      this.filteredDevelopers = this.allDevelopers.slice();
    }
    return this.filteredDevelopers;
  }

  setFilter(jobValue) {
    this.currentFilter = jobValue || "";
    return this.applyFilter();
  }

  async createDeveloperFromJSON(rawJson) {
    let obj;
    try {
      obj = JSON.parse(rawJson);
    } catch {
      throw new Error("Hibás JSON");
    }

    // Prefix hozzáadása (ha még nincs)
    const initials = this.getInitials();
    if (obj.name && !obj.name.startsWith(initials + "-")) {
      obj.name = `${initials}-${obj.name}`;
    }

    await APIHandler.createDeveloper(obj);
    await this.loadDevelopers();
    return this.filteredDevelopers;
  }

  async updateDeveloper(id, updateObj) {
    await APIHandler.updateDeveloper(id, updateObj);

    // Kliens oldali frissítés csak az adott elemre
    const idx = this.allDevelopers.findIndex(d => d.id == id || d._id == id);
    if (idx !== -1) {
      this.allDevelopers[idx] = { ...this.allDevelopers[idx], ...updateObj };
    }
    return this.applyFilter();
  }

  async deleteDeveloper(id) {
    await APIHandler.deleteDeveloper(id);

    // Kliens oldali eltávolítás
    this.allDevelopers = this.allDevelopers.filter(d => d.id != id && d._id != id);
    return this.applyFilter();
  }
}
