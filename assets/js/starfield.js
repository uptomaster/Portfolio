/**
 * 심오한 우주 느낌 — 작은 별이 천천히 낙하 (본문·카드 뒤에서만, 시야 방해 최소)
 * 성능: 탭 비가시 시 일시정지, 리사이즈 디바운스
 */
(function () {
  const canvas = document.getElementById("starfield-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const lowMem = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;

  let w = 0;
  let h = 0;
  const stars = [];
  let STAR_N = reduced ? 90 : mobile || lowMem ? 160 : 280;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const resizeDebounced = (function () {
    let t = null;
    return function () {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        resize();
        initStars();
      }, 100);
    };
  })();

  function initStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_N; i++) {
      const cool = Math.random() > 0.35;
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 0.38 + 0.06,
        base: 0.08 + Math.random() * 0.32,
        tw: 0.35 + Math.random() * 1.1,
        ph: Math.random() * Math.PI * 2,
        vy: reduced ? 0 : 0.035 + Math.random() * 0.09,
        vx: (Math.random() - 0.5) * 0.04,
        cool,
      });
    }
  }

  let t0 = performance.now();

  let rafId = null;

  function frame(now) {
    if (document.visibilityState !== "visible") {
      rafId = null;
      return;
    }

    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      if (!reduced) {
        s.y += s.vy;
        s.x += s.vx;
        if (s.y > h + 3) s.y = -3;
        if (s.x < -4) s.x = w + 4;
        if (s.x > w + 4) s.x = -4;
      }
      const tw = reduced ? 1 : 0.82 + Math.sin(t * s.tw + s.ph) * 0.18;
      const a = s.base * tw;
      const r = s.r * (0.92 + Math.sin(t * 0.7 + s.ph * 2) * 0.08);
      if (s.cool) {
        ctx.fillStyle = `rgba(200, 230, 255, ${a})`;
      } else {
        ctx.fillStyle = `rgba(255, 248, 240, ${a * 0.95})`;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(frame);
  }

  function resumeLoop() {
    if (rafId == null) rafId = requestAnimationFrame(frame);
  }

  function boot() {
    resize();
    initStars();
    resumeLoop();
  }

  window.addEventListener("resize", resizeDebounced, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      t0 = performance.now();
      resumeLoop();
    }
  });

  boot();
})();
