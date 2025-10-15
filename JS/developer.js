// JS/developer.js
export default class Developer {
  constructor(input) {
    const d = typeof input === "object" ? input : {};
    this.id     = d.id ?? d._id ?? null;
    this._id    = d._id ?? d.id ?? null;

    this.name   = d.name   ?? "";
    this.email  = d.email  ?? "";
    this.job    = d.job    ?? "";
    this.age    = Number(d.age ?? 0);
    this.salary = Number(d.salary ?? 0);
    this.image  = d.image  ?? "https://picsum.photos/seed/placeholder/200/200";
  }

  isOld()   { return this.age > 45; }
  isYoung() { return this.age <= 25; }
}
