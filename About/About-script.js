document.addEventListener('DOMContentLoaded', () => {
  // Girl wink scheduler
  const heroGirl = document.querySelector('.hero-girl');
  if (!heroGirl) return;

  let timerId = null;

  function performWink() {
    heroGirl.classList.add('is-winking');

    // Wink duration 200ms to 260ms (occasional 320ms hold)
    const isPlayfulHold = Math.random() < 0.25;
    const winkDuration = isPlayfulHold ? 320 : Math.floor(Math.random() * 60) + 200;

    setTimeout(() => {
      heroGirl.classList.remove('is-winking');
      scheduleNextWink();
    }, winkDuration);
  }

  function scheduleNextWink() {
    // Randomized interval between 3500ms and 5500ms (3.5–5.5 seconds)
    const nextInterval = Math.floor(Math.random() * 2000) + 3500;
    timerId = setTimeout(performWink, nextInterval);
  }

  function startScheduler() {
    if (!timerId) {
      // First wink occurs 800ms after load so it is immediately visible
      timerId = setTimeout(performWink, 800);
    }
  }

  function stopScheduler() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
      if (heroGirl) {
        heroGirl.classList.remove('is-winking');
      }
    }
  }

  // Handle visibility change (pause timer when page is hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopScheduler();
    } else {
      startScheduler();
    }
  });

  // Start scheduler immediately on load
  startScheduler();
});
