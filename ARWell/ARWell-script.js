const menuButton = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("scrim");
const navLinks = [...document.querySelectorAll(".contents-card a[href^='#']")];

function setActiveLink(hash) {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === hash;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function setNavigation(open) {
  sidebar.classList.toggle("open", open);
  scrim.classList.toggle("show", open);
  document.body.classList.toggle("nav-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => setNavigation(!sidebar.classList.contains("open")));
scrim.addEventListener("click", () => setNavigation(false));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") setNavigation(false); });

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveLink(link.getAttribute("href"));
    if (window.innerWidth <= 860) setNavigation(false);
  });
});

const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
let scrollUpdateQueued = false;

function updateActiveFromScroll() {
  scrollUpdateQueued = false;
  if (!sections.length) return;

  const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
  const readingLine = window.scrollY + Math.min(window.innerHeight * 0.28, 220);
  let current = sections[0];

  for (const section of sections) {
    if (section.offsetTop <= readingLine) current = section;
    else break;
  }

  if (pageBottom) current = sections[sections.length - 1];
  setActiveLink(`#${current.id}`);
}

function requestScrollUpdate() {
  if (scrollUpdateQueued) return;
  scrollUpdateQueued = true;
  window.requestAnimationFrame(updateActiveFromScroll);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
window.addEventListener("load", updateActiveFromScroll);
updateActiveFromScroll();

(function initRoleContextRouting() {
  const urlParams = new URLSearchParams(window.location.search);
  let role = (urlParams.get("role") || urlParams.get("from") || "").toLowerCase().trim();

  if (!["pm", "research", "design"].includes(role)) {
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes("/pm/")) role = "pm";
    else if (referrer.includes("/research/")) role = "research";
    else if (referrer.includes("/design/")) role = "design";
  }

  if (["pm", "research", "design"].includes(role)) {
    const backBtn = document.querySelector(".back-btn, .back, .back-link, #backToDesk");
    if (backBtn) {
      backBtn.href = `../${role}/index.html`;
    }

    document.querySelectorAll(".other-projects-grid a[href], .case-footer a[href], .footer-inner a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("http")) {
        const url = new URL(href, window.location.href);
        url.searchParams.set("role", role);
        link.setAttribute("href", url.pathname + url.search + url.hash);
      }
    });
  }
})();
