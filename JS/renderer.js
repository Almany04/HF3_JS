// ======================= JS/renderer.js =======================
import Developer from "./developer.js";

export default class Renderer {
  static renderDevelopers(developers, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    (developers || []).forEach(raw => {
      const dev = raw instanceof Developer ? raw : new Developer(raw);

      let cardClass = "card mb-3";
      if (dev.isOld()) cardClass += " old-dev";
      else if (dev.isYoung()) cardClass += " young-dev";

      const hasId = !!dev.cid;
      const updateAttrs = hasId ? `data-id="${dev.cid}"` : `disabled title="Érvénytelen (üres) ID"`;
      const deleteAttrs = hasId ? `data-id="${dev.cid}"` : `disabled title="Érvénytelen (üres) ID"`;

      const cardHTML = `
        <div class="${cardClass}" style="width:18rem">
          <img src="${dev.image}" class="card-img-top" alt="${dev.name}">
          <div class="card-body">
            <h5 class="card-title mb-1">${dev.name}</h5>
            <p class="text-muted small mb-2 id-line"><span class="fw-semibold">id:</span> <span class="id-text">${hasId ? dev.cid : "(nincs)"}</span></p>
            <p class="card-text">
              Email: ${dev.email || "-"}<br>
              Job: ${dev.job || "-"}<br>
              Age: ${Number.isFinite(dev.age) ? dev.age : "-"}<br>
              Salary: ${Number.isFinite(dev.salary) ? dev.salary : "-"}
            </p>
            <div class="d-flex gap-2">
              <button class="btn btn-primary btn-sm update-btn" ${updateAttrs}>Update</button>
              <button class="btn btn-danger btn-sm delete-btn" ${deleteAttrs}>Delete</button>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", cardHTML);
    });
  }
}
