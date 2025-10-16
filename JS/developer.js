// ======================= JS/developer.js =======================
export default class Developer {
  constructor(input) {
    const d = typeof input === "object" ? input : {};
    this.id     = d.id ?? d._id ?? d.Id ?? "";
    this._id    = d._id ?? d.id ?? d.Id ?? "";

    this.name   = d.name   ?? "";
    this.email  = d.email  ?? "";
    this.job    = d.job    ?? "";
    this.age    = Number(d.age ?? 0);
    this.salary = Number(d.salary ?? 0);
    this.image  = d.image  ?? "https://picsum.photos/seed/placeholder/200/200";
    this.skills = Array.isArray(d.skills) ? d.skills.slice() : [];
  }

  // Kanonikus ID – üres string esetén is null-t adunk
  get cid() {
    const a = (this._id ?? "").toString().trim();
    const b = (this.id ?? "").toString().trim();
    return a || b || null;
  }

  isOld()   { return this.age > 45; }
  isYoung() { return this.age <= 25; }
}
