/* ===== EDIT THIS BLOCK: replace every YOUR_ value with your own ===== */
const SITE = {
  name: "Lohitaksha Rohila",
  github: "https://github.com/LohitakshaRohila",
  linkedin: "",
  email: "mailto:lohitaksharohila@gmail.com",
  study: "https://github.com/YOUR_USERNAME/ai-study-companion",
  organizer: "https://github.com/YOUR_USERNAME/file-organizer"
};
const isTodo = v => v.includes("YOUR_");

/* Shared header and footer, so every page stays in sync */
const PAGES = [["index.html","Home"],["projects.html","Projects"],["contact.html","Contact"]];
const here = location.pathname.split("/").pop() || "index.html";
const [first, ...rest] = SITE.name.split(" ");
const links = PAGES.map(([h,l]) => `<a href="${h}" class="${h===here?'text-neon':'text-mut hover:text-white'} transition-colors" ${h===here?'aria-current="page"':''}>${l}</a>`).join("");
document.getElementById("site-header").innerHTML = `
<header class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between relative">
  <a href="index.html" class="font-display font-bold text-xl">${first}<span class="text-neon">${rest.join(" ")}</span></a>
  <nav class="hidden sm:flex gap-7" aria-label="Main">${links}</nav>
  <button id="menu-btn" class="sm:hidden border border-line rounded px-3 py-1 font-mono text-sm" aria-expanded="false" aria-controls="menu">Menu</button>
  <nav id="menu" class="hidden absolute top-16 right-6 z-10 bg-panel border border-line rounded-lg p-4 flex-col gap-3" aria-label="Mobile">${links}</nav>
</header>`;
document.getElementById("site-footer").innerHTML = `
<footer class="max-w-6xl mx-auto px-6 py-10 mt-20 border-t border-line text-mut text-sm flex flex-wrap justify-between gap-3">
  <span>Built by hand with Tailwind, HTML, and JavaScript.</span><a href="#top" class="hover:text-neon">Back to top</a>
</footer>`;
const btn = document.getElementById("menu-btn"), menu = document.getElementById("menu");
btn.onclick = () => { const open = menu.classList.toggle("hidden") === false; menu.classList.toggle("flex", open); btn.setAttribute("aria-expanded", open); };

/* Fill links; unfilled ones get a dashed border so they're easy to spot */
document.querySelectorAll("[data-link]").forEach(a => {
  const v = SITE[a.dataset.link]; a.href = v;
  if (isTodo(v)) a.classList.add("todo");
  if (!v.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener"; }
});
document.querySelectorAll("[data-show]").forEach(s => {
  const v = SITE[s.dataset.show];
  s.textContent = isTodo(v) ? "add your link in assets/js/site.js" : v.replace(/^mailto:|^https?:\/\/(www\.)?/, "");
});
/* Copy email */
document.querySelectorAll("[data-copy-email]").forEach(b => b.addEventListener("click", async () => {
  const old = b.textContent;
  try { await navigator.clipboard.writeText(SITE.email.replace("mailto:", "")); b.textContent = "Copied"; } catch { b.textContent = "Copy failed"; }
  setTimeout(() => b.textContent = old, 1500);
}));
