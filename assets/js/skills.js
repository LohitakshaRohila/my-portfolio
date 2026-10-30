/* Skill tabs: click or use arrow keys */
(() => {
  const tabs = [...document.querySelectorAll("[data-skill]")], out = document.getElementById("skill-detail"); if (!out) return;
  const INFO = {
    cpp: ["C++", "Firmware and control logic for motors and sensors, where timing matters and mistakes show up as a robot driving into a wall."],
    python: ["Python", "Backends like the AI Study Companion (FastAPI) and handy scripts like the file organizer (pathlib)."],
    esp32: ["ESP32", "Wi-Fi enabled microcontroller projects that drive motors and talk over the network."],
    pid: ["PID control", "Tuning loops until a robot goes where it’s told, smoothly. The tuner at the top of this page is the short version."]
  };
  function pick(t) {
    tabs.forEach(x => { const on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1;
      x.classList.toggle("border-neon", on); x.classList.toggle("text-neon", on); x.classList.toggle("border-line", !on); });
    const [h, p] = INFO[t.dataset.skill]; out.querySelector("h3").textContent = h; out.querySelector("p").textContent = p;
  }
  tabs.forEach((t,i) => { t.onclick = () => pick(t);
    t.onkeydown = e => { const d = {ArrowRight:1, ArrowLeft:-1}[e.key]; if (d) { const n = tabs[(i+d+tabs.length) % tabs.length]; n.focus(); pick(n); } }; });
  pick(tabs[0]);
})();
