const menuButton = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("scrim");
const navLinks = [...document.querySelectorAll(".contents-card a[href^='#']")];

const contentsLinksContainer = document.getElementById("contentsLinks");
let lastActiveHash = null;

function scrollActiveLinkIntoView(activeLink) {
  if (!activeLink || !contentsLinksContainer) return;

  if (contentsLinksContainer.scrollHeight > contentsLinksContainer.clientHeight) {
    const containerTop = contentsLinksContainer.scrollTop;
    const containerHeight = contentsLinksContainer.clientHeight;
    const linkTop = activeLink.offsetTop;
    const linkHeight = activeLink.offsetHeight;

    const isAbove = linkTop < containerTop + 6;
    const isBelow = (linkTop + linkHeight) > (containerTop + containerHeight - 6);

    if (isAbove || isBelow) {
      const targetScrollTop = linkTop - (containerHeight / 2) + (linkHeight / 2);
      contentsLinksContainer.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth"
      });
    }
  }
}

function setActiveLink(hash) {
  if (lastActiveHash === hash) return;
  lastActiveHash = hash;

  let activeLink = null;
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === hash;
    link.classList.toggle("active", active);
    if (active) {
      link.setAttribute("aria-current", "location");
      activeLink = link;
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (activeLink) {
    scrollActiveLinkIntoView(activeLink);
  }
}

function setNavigation(open) {
  sidebar.classList.toggle("open", open);
  scrim.classList.toggle("show", open);
  document.body.classList.toggle("nav-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => {
  setNavigation(!sidebar.classList.contains("open"));
});

scrim.addEventListener("click", () => setNavigation(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavigation(false);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveLink(link.getAttribute("href"));
    if (window.innerWidth <= 860) setNavigation(false);
  });
});

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

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
