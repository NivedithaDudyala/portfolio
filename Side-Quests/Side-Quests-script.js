document.addEventListener('DOMContentLoaded', () => {
  // Make complete quest cards clickable
  document.querySelectorAll('.quest-card[data-card-href]').forEach(card => {
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', (e) => {
      // If user clicked directly on an anchor or button inside card, let default anchor handle it
      if (e.target.closest('a') || e.target.closest('button')) return;
      
      const href = card.getAttribute('data-card-href');
      const target = card.getAttribute('data-card-target');
      
      if (href) {
        if (target === '_blank') {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = href;
        }
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        // Prevent scroll on Space
        if (e.key === ' ') e.preventDefault();
        
        const href = card.getAttribute('data-card-href');
        const target = card.getAttribute('data-card-target');
        
        if (href) {
          if (target === '_blank') {
            window.open(href, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = href;
          }
        }
      }
    });
  });

  // Smooth scroll to top for footer link
  const backToTopLink = document.querySelector('.site-footer a[href="#top"]');
  if (backToTopLink) {
    backToTopLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
