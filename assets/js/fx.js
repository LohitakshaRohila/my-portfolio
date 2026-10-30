/* Atmosphere and motion: boot screen, particle field, reveals, scramble text, tilt, magnetic buttons */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => [...r.querySelectorAll(s)];
  const here = location.pathname.split("/").pop() || "index.html";
  const add = (tag, id, cls) => { const e = document.createElement(tag); if (id) e.id = id; if (cls) e.className = cls; document.body.prepend(e); return e; };

  /* ambient layers */
  const glow = add("div", "glow");
  add("div", null, "blob").style.cssText = "width:420px;height:420px;background:#2be3ff;top:-120px;left:-100px";
  add("div", null, "blob").style.cssText = "width:380px;height:380px;background:#ff3d9a;bottom:-120px;right:-80px;animation-delay:-10s";
  const prog = add("div", "prog"), hud = add("div", "hud"), cv = add("canvas", "bg"), ctx = cv.getContext("2d");

  /* particle constellation that reacts to the cursor */
  let W, H, P = [], mx = -999, my = -999, gx = innerWidth / 2, gy = innerHeight / 2;
  function size() {
    const d = devicePixelRatio || 1; W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    P = Array.from({ length: Math.min(110, Math.floor(W * H / 14000)) }, () => ({ x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, c: Math.random() < .2 ? "255,61,154" : "43,227,255" }));
  }
  function step() {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      const dm = Math.hypot(p.x - mx, p.y - my);
      if (dm < 170) { ctx.strokeStyle = `rgba(${p.c},${(1 - dm / 170) * .6})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.stroke(); p.x += (mx - p.x) * .004; p.y += (my - p.y) * .004; }
      ctx.fillStyle = `rgba(${p.c},.85)`; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 7); ctx.fill();
    }
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
      if (d < 125) { ctx.strokeStyle = `rgba(43,227,255,${(1 - d / 125) * .22})`; ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke(); }
    }
    gx += (mx - gx) * .12; gy += (my - gy) * .12; glow.style.left = gx + "px"; glow.style.top = gy + "px";
  }
  let on = false;
  const loop = () => { if (document.hidden) { on = false; return; } step(); requestAnimationFrame(loop); };
  size(); addEventListener("resize", () => { size(); if (reduce) step(); });
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener("visibilitychange", () => { if (!reduce && !document.hidden && !on) { on = true; loop(); } });
  if (reduce) step(); else { on = true; loop(); }

  /* scroll progress and HUD */
  const upd = () => { const m = document.documentElement.scrollHeight - innerHeight, s = m > 0 ? scrollY / m : 0;
    prog.style.width = s * 100 + "%"; hud.textContent = `sys.time ${new Date().toTimeString().slice(0, 8)}  //  scroll ${Math.round(s * 100)}%`; };
  addEventListener("scroll", upd, { passive: true }); setInterval(upd, 1000); upd();

  /* text scramble that resolves into the real words */
  const G = "!<>-_\\/[]{}=+*^?#01";
  function scramble(el) {
    if (reduce) return;
    if (!el._n) { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); el._n = []; let n; while ((n = w.nextNode())) if (n.nodeValue.trim()) el._n.push([n, n.nodeValue]); }
    const total = el._n.reduce((a, [, t]) => a + t.length, 0); let f = 0; clearInterval(el._t);
    el._t = setInterval(() => {
      f++; let seen = 0; const done = f * total / 22;
      for (const [node, t] of el._n) { node.nodeValue = [...t].map((c, i) => c === " " || seen + i < done ? c : G[Math.random() * G.length | 0]).join(""); seen += t.length; }
      if (f > 26) { clearInterval(el._t); el._n.forEach(([nd, t]) => nd.nodeValue = t); }
    }, 38);
  }
  $("[data-scramble], #site-header a.font-display").forEach(el => el.addEventListener("mouseenter", () => scramble(el)));

  /* typewriter roles in the hero */
  const role = document.getElementById("role");
  if (role) { const R = ["builds robots that move", "tunes PID loops until they behave", "writes Python backends", "makes microcontrollers talk over Wi-Fi"]; let w = 0, c = 0, del = false;
    (function t() { const s = R[w]; role.textContent = s.slice(0, c);
      if (!del && c === s.length) { del = true; return setTimeout(t, 1400); }
      if (del && c === 0) { del = false; w = (w + 1) % R.length; }
      c += del ? -1 : 1; setTimeout(t, del ? 25 : 55); })(); }

  /* marquee strip under the hero */
  if (here === "index.html") { const s = document.querySelector("main > section");
    if (s) { const m = document.createElement("div"), sep = '<span class="text-neon">//</span>';
      const items = ["C++", "Python", "ESP32", "PID control", "FastAPI", "pathlib", "Robotics"].map(t => `<span>${t}</span>`).join(sep) + sep;
      m.className = "marquee font-mono text-sm text-mut"; m.innerHTML = `<div>${items}${items}</div>`; s.after(m); } }

  /* tilt cards and magnetic buttons */
  $("[data-tilt],[data-edge]").forEach(e => e.classList.add("edge"));
  if (!reduce) {
    $("[data-tilt]").forEach(el => { el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-3px)`; }); el.addEventListener("pointerleave", () => el.style.transform = ""); });
    $("[data-magnetic]").forEach(el => { el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; }); el.addEventListener("pointerleave", () => el.style.transform = ""); });
  }

  /* boot screen, then reveal everything on scroll */
  function boot() { return new Promise(res => {
    let seen = false; try { seen = sessionStorage.getItem("booted"); sessionStorage.setItem("booted", "1"); } catch {}
    if (seen || reduce) return res();
    const b = add("div", "boot"), L = ["> booting portfolio.sys", "> loading skills .......... ok", "> calibrating PID loop ... ok", "> system online"]; let i = 0;
    const done = () => { b.classList.add("off"); setTimeout(() => b.remove(), 700); res(); }; b.onclick = done;
    (function next() { if (i >= L.length) return setTimeout(done, 350); const d = document.createElement("div"); d.textContent = L[i++]; b.append(d); setTimeout(next, 330); })();
  }); }
  const R = $("[data-reveal],[data-tilt]"); R.forEach((el, i) => { el.classList.add("reveal"); el.style.transitionDelay = (i % 3) * 80 + "ms"; });
  boot().then(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target;
      if (el.matches("[data-reveal],[data-tilt]")) { el.classList.add("in"); setTimeout(() => el.classList.add("done"), 1100); }
      if (el.hasAttribute("data-scramble")) scramble(el); io.unobserve(el); }), { threshold: .15 });
    $("[data-reveal],[data-tilt],[data-scramble]").forEach(el => io.observe(el));
  });
})();
