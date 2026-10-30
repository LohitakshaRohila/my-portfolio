/* Project filters and expandable details */
(() => {
  const chips = document.querySelectorAll("[data-filter]"), cards = document.querySelectorAll("[data-cat]"), count = document.getElementById("count");
  chips.forEach(c => c.addEventListener("click", () => {
    chips.forEach(x => { const on = x === c; x.setAttribute("aria-pressed", on); x.classList.toggle("bg-neon", on); x.classList.toggle("text-ink", on); });
    let n = 0; cards.forEach(k => { const show = c.dataset.filter === "all" || k.dataset.cat.split(" ").includes(c.dataset.filter); k.hidden = !show; n += show; });
    count.textContent = `Showing ${n} of ${cards.length}`;
  }));
  document.querySelectorAll("[data-toggle]").forEach(b => b.addEventListener("click", () => {
    const p = document.getElementById(b.dataset.toggle), open = p.hidden; p.hidden = !open;
    b.setAttribute("aria-expanded", open); b.textContent = open ? "Hide the details" : "How it works";
  }));
})();
