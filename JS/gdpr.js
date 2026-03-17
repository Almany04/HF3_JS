function getConsent() {
  return localStorage.getItem("gdprConsent");
}

function setConsent(val) {
  localStorage.setItem("gdprConsent", val);
}

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("gdprBanner");
  if (!banner) return;

  const accept = document.getElementById("gdprAccept");
  const decline = document.getElementById("gdprDecline");

  const consent = getConsent();
  if (!consent) {
    banner.classList.remove("d-none");
  }

  accept.addEventListener("click", () => {
    setConsent("accepted");
    banner.classList.add("d-none");
  });

  decline.addEventListener("click", () => {
    setConsent("declined");
    banner.classList.add("d-none");
  });
});
