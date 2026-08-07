(function initRoleCardRouting() {
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

  const roleContext = getRoleContext();

  document.querySelectorAll(".project-card[data-card-href]").forEach((card) => {
    if (!card.dataset.cardHref) return;

    let resolvedCardUrl;
    try {
      resolvedCardUrl = new URL(card.dataset.cardHref, window.location.href);
    } catch (e) {
      return;
    }

    if (roleContext) {
      card.querySelectorAll("a[href]").forEach((anchor) => {
        const rawHref = anchor.getAttribute("href");
        if (!rawHref) return;

        if (
          rawHref.startsWith("mailto:") ||
          rawHref.startsWith("#") ||
          rawHref.startsWith("javascript:")
        ) {
          return;
        }

        let resolvedAnchorUrl;
        try {
          resolvedAnchorUrl = new URL(rawHref, window.location.href);
        } catch (e) {
          return;
        }

        if (
          resolvedAnchorUrl.origin === resolvedCardUrl.origin &&
          resolvedAnchorUrl.pathname === resolvedCardUrl.pathname
        ) {
          resolvedAnchorUrl.searchParams.set("role", roleContext);
          anchor.setAttribute(
            "href",
            resolvedAnchorUrl.pathname + resolvedAnchorUrl.search + resolvedAnchorUrl.hash
          );
        }
      });
    }

    const openCard = () => {
      let href = card.dataset.cardHref;
      if (href && roleContext) {
        const url = new URL(href, window.location.href);
        url.searchParams.set("role", roleContext);
        href = url.pathname + url.search + url.hash;
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
})();
