import Developer from "./developer.js";

export default class Renderer {
  static renderDevelopers(developers, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    if (!developers || developers.length === 0) {
        container.innerHTML = `<p class="text-muted">Nincsenek megjeleníthető fejlesztők.</p>`;
        return;
    }

    developers.forEach(raw => {
      const dev = raw instanceof Developer ? raw : new Developer(raw);

      let cardClass = "card mb-3";
      if (dev.isOld()) cardClass += " old-dev";
      else if (dev.isYoung()) cardClass += " young-dev";

      const hasId = !!dev.cid;
      const btnAttrs = hasId ? `data-id="${dev.cid}"` : `disabled title="Érvénytelen (üres) ID"`;

      const cardHTML = `
        <div class="${cardClass}">
          <img src="${dev.image}" class="card-img-top" alt="${dev.name}" onerror="this.onerror=null;this.src='https://picsum.photos/seed/placeholder/200/200';">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mb-1">${dev.name || "(Nincs név)"}</h5>
            <p class="text-muted small mb-2 id-line"><span class="fw-semibold">id:</span> <span class="id-text">${hasId ? dev.cid : "(nincs)"}</span></p>
            <div class="card-text">
              <strong>Email:</strong> ${dev.email || "-"}<br>
              <strong>Job:</strong> ${dev.job || "-"}<br>
              <strong>Age:</strong> ${dev.age || "-"}<br>
              <strong>Salary:</strong> ${dev.salary || "-"}
            </div>
            <div class="d-flex gap-2 mt-auto pt-2">
              <button class="btn btn-primary btn-sm update-btn w-50" ${btnAttrs}>Update</button>
              <button class="btn btn-danger btn-sm delete-btn w-50" ${btnAttrs}>Delete</button>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", cardHTML);
    });
  }
}