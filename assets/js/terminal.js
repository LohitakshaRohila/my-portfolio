/* A tiny fake terminal: type "help" */
(() => {
  const form = document.getElementById("term-form"); if (!form) return;
  const input = document.getElementById("term-in"), out = document.getElementById("term-out"), hist = []; let hi = 0;
  const CMDS = {
    help: "Try: whoami, skills, projects, contact, clear",
    whoami: "First-year B.Tech builder. Robots that move, code that makes them smarter.",
    skills: "C++, Python, ESP32, PID control",
    projects: "AI Study Companion backend (Python, FastAPI) and a Python file organizer (pathlib). Details on the Projects page.",
    contact: "GitHub, LinkedIn, and email are on the Contact page."
  };
  const add = (text, cls) => { const d = document.createElement("div"); d.textContent = text; if (cls) d.className = cls; out.append(d); out.scrollTop = out.scrollHeight; };
  add("Type help and press Enter.", "text-mut");
  form.addEventListener("submit", e => {
    e.preventDefault(); const c = input.value.trim().toLowerCase(); input.value = ""; if (!c) return;
    hist.push(c); hi = hist.length; add("$ " + c, "text-lime");
    if (c === "clear") out.textContent = ""; else add(CMDS[c] || `Command not found: ${c}. Type help for the list.`, CMDS[c] ? "" : "text-hot");
  });
  input.addEventListener("keydown", e => { if (e.key === "ArrowUp" && hist.length) { hi = Math.max(0, hi-1); input.value = hist[hi]; e.preventDefault(); } });
})();
