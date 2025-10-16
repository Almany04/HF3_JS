// ======================= JS/auth.js =======================
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function validateRegForm() {
  const ln = document.getElementById("regLastName").value.trim();
  const fn = document.getElementById("regFirstName").value.trim();
  const un = document.getElementById("regUsername").value.trim();
  const p1 = document.getElementById("regPassword").value;
  const p2 = document.getElementById("regPassword2").value;

  const btn = document.getElementById("regBtn");
  const alertBox = document.getElementById("regAlert");

  let msg = "";
  if (!ln || !fn || !un || !p1 || !p2) {
    msg = "Minden mező kitöltése kötelező.";
  } else if (p1 !== p2) {
    msg = "A két jelszó nem egyezik.";
  } else {
    msg = "";
  }

  if (msg) {
    alertBox.textContent = msg;
    alertBox.classList.remove("d-none");
    btn.disabled = true;
  } else {
    alertBox.classList.add("d-none");
    btn.disabled = false;
  }
}

function register() {
  const ln = document.getElementById("regLastName").value.trim();
  const fn = document.getElementById("regFirstName").value.trim();
  const un = document.getElementById("regUsername").value.trim();
  const p1 = document.getElementById("regPassword").value;

  const users = getUsers();
  if (users.some(u => u.username === un)) {
    const alertBox = document.getElementById("regAlert");
    alertBox.textContent = "Ez a felhasználónév már létezik.";
    alertBox.classList.remove("d-none");
    return;
  }

  users.push({ lastName: ln, firstName: fn, username: un, password: p1 });
  setUsers(users);

  alert("Sikeres regisztráció! Most jelentkezz be.");
  document.getElementById("loginUsername").value = un;
}

function login() {
  const un = document.getElementById("loginUsername").value.trim();
  const pw = document.getElementById("loginPassword").value;

  const users = getUsers();
  const found = users.find(u => u.username === un && u.password === pw);
  const alertBox = document.getElementById("loginAlert");

  if (!found) {
    alertBox.classList.remove("d-none");
    return;
  }

  // bejelentkezés állapot
  localStorage.setItem("loggedInUser", JSON.stringify(found));
  window.location.href = "app.html";
}

// Event kötés
document.addEventListener("DOMContentLoaded", () => {
  ["regLastName","regFirstName","regUsername","regPassword","regPassword2"]
    .forEach(id => document.getElementById(id).addEventListener("input", validateRegForm));

  document.getElementById("regBtn").addEventListener("click", register);
  document.getElementById("loginBtn").addEventListener("click", login);
});
