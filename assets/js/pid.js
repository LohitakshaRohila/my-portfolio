/* Live PID tuner: a mass with friction pushed toward a target of 1 */
(() => {
  const cv = document.getElementById("cv"); if (!cv) return;
  const ctx = cv.getContext("2d"), $ = id => document.getElementById(id);
  const kp = $("kp"), ki = $("ki"), kd = $("kd"), shove = $("shove");
  const clamp = (x,a,b) => Math.max(a, Math.min(b, x));
  kp.value = 6; ki.value = 1; kd.value = 3;

  function simulate(P, I, D, kick) {
    const dt = .02, out = []; let p = 0, v = 0, integ = 0, prev = 1;
    for (let i = 0; i < 400; i++) {
      if (kick && i === 220) v -= 4;                       /* a sudden shove */
      const e = 1 - p; integ = clamp(integ + e*dt, -2, 2);  /* anti-windup clamp */
      const u = clamp(P*e + I*integ + D*(e - prev)/dt, -15, 15); prev = e;
      v += (u - .8*v) * dt; p += v * dt; out.push(p);
    }
    return out;
  }
  let raf;
  function animate() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return render(1);
    cancelAnimationFrame(raf); const t0 = performance.now();
    const f = t => { const p = Math.min(1, (t - t0) / 900); render(p); if (p < 1) raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
  }
  function render(prog = 1) {
    const [P,I,D] = [+kp.value, +ki.value, +kd.value];
    $("okp").textContent = P.toFixed(1); $("oki").textContent = I.toFixed(1); $("okd").textContent = D.toFixed(1);
    const data = simulate(P, I, D, shove.checked), dpr = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight;
    cv.width = w*dpr; cv.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const Y = v => h - (clamp(v,-.2,2.2) + .2) / 2.4 * h;
    ctx.strokeStyle = "#16222f"; for (let g = 0; g <= 2; g += .5) { ctx.beginPath(); ctx.moveTo(0,Y(g)); ctx.lineTo(w,Y(g)); ctx.stroke(); }
    ctx.setLineDash([6,5]); ctx.strokeStyle = "#ff3d9a"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0,Y(1)); ctx.lineTo(w,Y(1)); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = "#2be3ff"; ctx.lineWidth = 2.5; ctx.shadowColor = "rgba(43,227,255,.7)"; ctx.shadowBlur = 10; ctx.beginPath();
    const n = Math.max(2, Math.floor(prog * 400)); data.slice(0, n).forEach((v,i) => { const x = i/399*w; i ? ctx.lineTo(x,Y(v)) : ctx.moveTo(x,Y(v)); }); ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff"; ctx.shadowColor = "#2be3ff"; ctx.shadowBlur = 14; ctx.beginPath(); ctx.arc((n-1)/399*w, Y(data[n-1]), 4.5, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    $("ov").textContent = Math.max(0, (Math.max(...data) - 1) * 100).toFixed(0) + "%";
    $("en").textContent = data[399].toFixed(2);
  }
  [kp,ki,kd,shove].forEach(el => el.addEventListener("input", () => { cancelAnimationFrame(raf); render(1); }));
  document.querySelectorAll("[data-p]").forEach(b => b.addEventListener("click", () => { [kp.value,ki.value,kd.value] = b.dataset.p.split(","); animate(); }));
  addEventListener("resize", () => render(1)); animate();
})();
