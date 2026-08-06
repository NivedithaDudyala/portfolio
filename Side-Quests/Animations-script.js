document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll to top for footer link
  const backToTopLink = document.querySelector('.site-footer a[href="#top"]');
  if (backToTopLink) {
    backToTopLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
