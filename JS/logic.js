import APIHandler from "./apiHandler.js";
import Developer from "./developer.js";

function genUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default class Logic {
  constructor() {
    this.allDevelopers = [];
    this.filteredDevelopers = [];
    this.currentFilter = "";
    this.loggedUser = null;
    this.showInvalid = false;
  }

  setLoggedUser(userObj) {
    this.loggedUser = userObj;
  }

  getInitials() {
    const u = this.loggedUser;
    if (!u) return "XX";
    const ln = (u.lastName || "").trim();
    const fn = (u.firstName || "").trim();
    const initials = (ln ? ln[0].toUpperCase() : "") + (fn ? fn[0].toUpperCase() : "");
    return initials || "XX";
  }

  async loadDevelopers() {
    const data = await APIHandler.getAllDevelopers();
    this.allDevelopers = (data || []).map(d => new Developer(d));
    this.applyFilter();
    return this.filteredDevelopers;
  }

  get invalidCount() {
    return this.allDevelopers.filter(d => !d.cid).length;
  }

  applyFilter() {
    let arr = this.allDevelopers.slice();
    if (!this.showInvalid) {
      arr = arr.filter(d => !!d.cid);
    }
    if (this.currentFilter) {
      arr = arr.filter(d => (d.job || "") === this.currentFilter);
    }
    this.filteredDevelopers = arr;
    return this.filteredDevelopers;
  }

  setFilter(jobValue) {
    this.currentFilter = jobValue || "";
    return this.applyFilter();
  }

  setShowInvalid(v) {
    this.showInvalid = !!v;
    return this.applyFilter();
  }

  async createDeveloperFromJSON(rawJson) {
    let obj;
    try {
      obj = JSON.parse(rawJson);
    } catch {
      throw new Error("Hibás JSON formátum!");
    }

    if (!Array.isArray(obj.skills)) obj.skills = [];
    
    const initials = this.getInitials();
    if (obj.name && !obj.name.startsWith(initials + "-")) {
      obj.name = `${initials}-${obj.name}`;
    }

    if (!obj.id || !obj.id.toString().trim()) {
      obj.id = genUUID();
    }

    const newDevData = await APIHandler.createDeveloper(obj);
    const created = new Developer(newDevData.data || obj);
    
    if (created.cid) {
      this.allDevelopers.push(created);
    } else {
      await this.loadDevelopers();
    }
    return this.applyFilter();
  }

  async updateDeveloper(id, updateObj) {
    if (!id) {
      throw new Error("Nincs érvényes ID – ezt a rekordot nem lehet frissíteni.");
    }

    const payload = { id: id, ...updateObj };
    await APIHandler.updateDeveloper(payload);

    const idx = this.allDevelopers.findIndex(d => d.cid == id);
    if (idx !== -1) {
      const updatedDev = new Developer({ ...this.allDevelopers[idx], ...updateObj });
      this.allDevelopers[idx] = updatedDev;
    } else {
      await this.loadDevelopers();
    }
    return this.applyFilter();
  }

  async deleteDeveloper(id) {
    if (!id) {
      alert("Nincs érvényes ID – ezt a rekordot nem lehet törölni.");
      return this.applyFilter();
    }

    const initials = this.getInitials();
    const target = this.allDevelopers.find(d => d.cid == id);
    if (!target || !target.name.startsWith(initials + "-")) {
      alert("Csak a saját (monogrammal jelölt) rekordjaidat törölheted.");
      return this.applyFilter();
    }

    await APIHandler.deleteDeveloper(id);
    this.allDevelopers = this.allDevelopers.filter(d => d.cid != id);
    return this.applyFilter();
  }
}