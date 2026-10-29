document.addEventListener('DOMContentLoaded', () => {
  const mobileMenu = document.getElementById('mobileMenu');
  const sidebar = document.getElementById('sidebar');
  const scrim = document.getElementById('scrim');
  const navLinks = [...document.querySelectorAll('.contents-card a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function setActiveLink(hash) {
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === hash;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

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
      setActiveLink(link.getAttribute('href'));
      if (window.innerWidth <= 860) {
        closeMenu();
      }
    });
  });

  const contentsLinksContainer = document.getElementById('contentsLinks');

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
          behavior: 'smooth'
        });
      }
    }
  }

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

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  window.addEventListener('load', updateActiveFromScroll);
  updateActiveFromScroll();
});
