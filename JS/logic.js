// ======================= JS/logic.js =======================
import APIHandler from "./apiHandler.js";
import Developer from "./developer.js";

function genUUID() {
  // crypto.randomUUID, ha van
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4
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
    this.showInvalid = false; // ID nélküli mutatása
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
      arr = arr.filter(d => !!d.cid); // alapból rejtsük az üres ID-s rekordokat
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

  // CREATE: kötelezően generálunk kliensoldali UUID-t
  async createDeveloperFromJSON(rawJson) {
    let obj;
    try {
      obj = JSON.parse(rawJson);
    } catch {
      throw new Error("Hibás JSON");
    }

    // skills legyen tömb
    if (!Array.isArray(obj.skills)) obj.skills = [];

    // prefix
    const initials = this.getInitials();
    if (obj.name && !obj.name.startsWith(initials + "-")) {
      obj.name = `${initials}-${obj.name}`;
    }

    // ha nincs/üres id, generálunk
    if (!obj.id || !obj.id.toString().trim()) {
      obj.id = genUUID();
    }

    const resp = await APIHandler.createDeveloper(obj);

    // Ha a backend visszaad teljes objektumot, azzal dolgozunk, különben a kliensoldali obj-t használjuk
    let created = null;
    if (resp && typeof resp === "object" && (resp.id || resp._id || resp.Id)) {
      created = new Developer(resp);
    } else if (resp && resp.data && (resp.data.id || resp.data._id || resp.data.Id)) {
      created = new Developer(resp.data);
    } else {
      created = new Developer(obj);
    }

    // csak akkor tesszük be a listába, ha van érvényes ID
    if (created.cid) {
      this.allDevelopers.push(created);
    } else {
      // ha bármilyen okból üres maradt, teljes újratöltés
      await this.loadDevelopers();
      return this.filteredDevelopers;
    }
    return this.applyFilter();
  }

  async updateDeveloper(id, updateObj) {
    if (!id) {
      alert("Nincs érvényes ID – ezt a rekordot nem lehet frissíteni.");
      return this.applyFilter();
    }

    const payload = {
      id: id,
      ...updateObj
    };
    await APIHandler.updateDeveloper(payload);

    const idx = this.allDevelopers.findIndex(d => d.cid == id);
    if (idx !== -1) {
      this.allDevelopers[idx] = new Developer({ ...this.allDevelopers[idx], ...updateObj });
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

    // Csak a saját (monogrammal kezdődő) rekordjaid törölhetők
    const initials = this.getInitials();
    const target = this.allDevelopers.find(d => d.cid == id);
    const isMine = target && (target.name || "").startsWith(initials + "-");
    if (!isMine) {
      alert("Csak a saját (monogrammal jelölt) rekordjaid törölheted.");
      return this.applyFilter();
    }

    await APIHandler.deleteDeveloper(id);

    this.allDevelopers = this.allDevelopers.filter(d => d.cid != id);
    return this.applyFilter();
  }
}
