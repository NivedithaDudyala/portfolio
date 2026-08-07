document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('minimal-access-form');
  const select = document.getElementById('casestudy-select');
  const msgBox = document.getElementById('form-message');

  if (form && select && msgBox) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const selectedStudy = select.value;

      // 1. Require selection before opening email
      if (!selectedStudy) {
        msgBox.textContent = 'Please select a case study.';
        msgBox.className = 'info-message status-error';
        return;
      }

      // 2. Open prefilled email draft
      const recipient = 'dudyalaniveditha@gmail.com';
      const subject = `Case Study Access Request — ${selectedStudy}`;
      const body = `Hi Niveditha,\n\nI’d like to request access to your ${selectedStudy} case study.\n\nThank you.`;

      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;

      // 3. Display explicit status message informing user to press Send
      msgBox.textContent = 'Your email draft has been opened. Please press Send to complete your request.';
      msgBox.className = 'info-message status-success';
    });

    // Hide message on dropdown change
    select.addEventListener('change', () => {
      if (select.value) {
        msgBox.className = 'info-message hidden';
      }
    });
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
    }
  })();
});
