// JS/renderer.js
import Developer from "./developer.js";

export default class Renderer {
  static renderDevelopers(developers, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    developers.forEach(raw => {
      const dev = raw instanceof Developer ? raw : new Developer(raw);

      let cardClass = "card mb-3";
      if (dev.isOld()) cardClass += " old-dev";
      else if (dev.isYoung()) cardClass += " young-dev";

      const cardHTML = `
        <div class="${cardClass}">
          <img src="${dev.image}" class="card-img-top" alt="${dev.name}">
          <div class="card-body">
            <h5 class="card-title">${dev.name}</h5>
            <p class="card-text">
              Email: ${dev.email}<br>
              Job: ${dev.job}<br>
              Age: ${dev.age}<br>
              Salary: ${dev.salary}
            </p>
            <button class="btn btn-primary btn-sm update-btn" data-id="${dev.id ?? dev._id}">Update</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${dev.id ?? dev._id}">Delete</button>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", cardHTML);
    });
  }
}
