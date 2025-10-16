export default class Developer {
  constructor(input) {
    const d = typeof input === "object" && input !== null ? input : {};
    const idValue = d.id ?? d._id ?? d.Id ?? null;

    this.id = idValue;
    this._id = idValue;

    this.name = d.name ?? "";
    this.email = d.email ?? "";
    this.job = d.job ?? "";
    this.age = Number(d.age ?? 0);
    this.salary = Number(d.salary ?? 0);
    this.image = d.image ?? "https://picsum.photos/seed/placeholder/200/200";
    this.skills = Array.isArray(d.skills) ? d.skills.slice() : [];
  }

  get cid() {
    const idStr = (this.id || "").toString().trim();
    return idStr || null;
  }

  isOld() { return this.age > 45; }
  isYoung() { return this.age <= 25; }
}