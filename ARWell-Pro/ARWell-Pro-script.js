document.addEventListener('DOMContentLoaded', () => {
  const mobileMenu = document.getElementById('mobileMenu');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  const navLinks = document.querySelectorAll('.contents-card a');
  const sections = document.querySelectorAll('main section[id]');

  function openMenu() {
    sidebar.classList.add('open');
    scrim.classList.add('show');
    document.body.classList.add('nav-open');
    mobileMenu.setAttribute('aria-expanded', 'true');
  }

  function closeMenu(restoreFocus = false) {
    sidebar.classList.remove('open');
    scrim.classList.remove('show');
    document.body.classList.remove('nav-open');
    mobileMenu.setAttribute('aria-expanded', 'false');
    if (restoreFocus && mobileMenu) {
      mobileMenu.focus();
    }
  }

  if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (scrim) {
    scrim.addEventListener('click', () => closeMenu(true));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeMenu(true);
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        closeMenu();
      }
    });
  });

  // ScrollObserver for active contents links & aria-current="location" across 8 sections
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href').replace('#', '');
            if (href === id) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'location');
            } else {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

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
});
