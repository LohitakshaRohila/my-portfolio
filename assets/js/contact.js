/* Builds a mailto link from the form, so no server is needed */
(() => {
  const f = document.getElementById("msg-form"); if (!f) return;
  f.addEventListener("submit", e => {
    e.preventDefault(); const d = new FormData(f), to = SITE.email.replace("mailto:", "");
    const body = `${d.get("message")}\n\nFrom: ${d.get("name")}`;
    location.href = `mailto:${to}?subject=${encodeURIComponent("Hello from your site: " + d.get("name"))}&body=${encodeURIComponent(body)}`;
  });
})();
