document.querySelectorAll(".project-card[data-card-href]").forEach((card) => {
  const openCard = () => {
    window.location.href = card.dataset.cardHref;
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
