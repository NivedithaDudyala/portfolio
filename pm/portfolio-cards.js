document.querySelectorAll(".project-card[data-card-href]").forEach((card) => {
  const getRoleContext = () => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = (params.get("role") || params.get("from") || "").toLowerCase().trim();
    if (["pm", "research", "design"].includes(roleParam)) return roleParam;
    const path = window.location.pathname.toLowerCase();
    if (path.includes("/pm/")) return "pm";
    if (path.includes("/research/")) return "research";
    if (path.includes("/design/")) return "design";
    return null;
  };

  const openCard = () => {
    let href = card.dataset.cardHref;
    const roleContext = getRoleContext();
    if (href && roleContext && !href.includes("role=")) {
      const sep = href.includes("?") ? "&" : "?";
      href += `${sep}role=${encodeURIComponent(roleContext)}`;
    }
    window.location.href = href;
  };

  card.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.target.closest("a, button")) return;
    openCard();
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.target.closest("a, button")) return;
    event.preventDefault();
    openCard();
  });
});
