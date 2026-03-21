/**
 * 잔잔한 우주 별 / 은은한 낙하 (시야 방해 최소)
 */
(function () {
  const canvas = document.getElementById("starfield-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w = 0;
  let h = 0;
  const stars = [];
  const STAR_N = reduced ? 90 : 180;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_N; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.85 + 0.35,
        base: 0.12 + Math.random() * 0.22,
        tw: 0.4 + Math.random() * 1.2,
        ph: Math.random() * Math.PI * 2,
        vy: reduced ? 0 : 0.06 + Math.random() * 0.14,
      });
    }
  }

  let t0 = performance.now();

  function frame(now) {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      if (!reduced) {
        s.y += s.vy;
        if (s.y > h + 2) s.y = -2;
      }
      const tw = 0.85 + Math.sin(t * s.tw + s.ph) * 0.15;
      const a = s.base * tw;
      ctx.beginPath();
      ctx.fillStyle = `rgba(230, 240, 255, ${a})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  function boot() {
    resize();
    initStars();
    requestAnimationFrame(frame);
  }

  window.addEventListener(
    "resize",
    () => {
      resize();
      initStars();
    },
    { passive: true }
  );

  boot();
})();
