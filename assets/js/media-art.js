/**
 * 미디어 아트 레이어 — pm 포트폴리오와 동일 인터랙션
 * portfolio-theme.json: assets/data/portfolio-theme.json
 *
 * 성능: 탭 비가시 시 애니메이션 일시정지, 저사양·모바일에서 플루이드 생략,
 *       파티클에서 shadowBlur/getComputedStyle 제거, 리사이즈 디바운스
 */

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** 패럴랙스 보간값 — 파티클이 getComputedStyle 대신 직접 참조 */
const motion = { mx: 0, my: 0 };

function isLowEndDevice() {
  if (prefersReducedMotion()) return true;
  if (window.matchMedia("(max-width: 768px)").matches) return true;
  const mem = navigator.deviceMemory;
  if (mem && mem <= 4) return true;
  const cores = navigator.hardwareConcurrency;
  if (cores && cores <= 4) return true;
  const conn = navigator.connection;
  if (conn && conn.saveData === true) return true;
  return false;
}

const lowEnd = isLowEndDevice();

function debounce(fn, ms) {
  let t = null;
  return function debounced(...args) {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * 탭이 보일 때만 rAF 연속 실행 (백그라운드에서 GPU/CPU 점유 방지)
 */
function startVisibilityLoop(frameFn) {
  let id = null;
  function loop() {
    if (document.visibilityState !== "visible") {
      id = null;
      return;
    }
    frameFn();
    id = requestAnimationFrame(loop);
  }
  function resume() {
    if (id == null) id = requestAnimationFrame(loop);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") resume();
  });
  resume();
}

async function loadTheme() {
  const url = new URL("../data/portfolio-theme.json", import.meta.url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Theme load failed");
  return res.json();
}

function applyTheme(theme) {
  const root = document.documentElement;
  const v = theme.visuals || {};
  const { colorPalette, rotationSpeed, distortionIntensity, backgrounds } = v;

  if (colorPalette?.[0]) root.style.setProperty("--warm-1", colorPalette[0]);
  if (colorPalette?.[1]) root.style.setProperty("--warm-2", colorPalette[1]);
  if (colorPalette?.[2]) root.style.setProperty("--cool-1", colorPalette[2]);
  if (colorPalette?.[3]) root.style.setProperty("--cool-2", colorPalette[3]);
  if (colorPalette?.[4]) root.style.setProperty("--cool-3", colorPalette[4]);

  if (backgrounds) {
    if (backgrounds.primary) {
      root.style.setProperty("--bg-a", `url("${backgrounds.primary}")`);
      document.getElementById("photo-a")?.style.setProperty("background-image", `url("${backgrounds.primary}")`);
    }
    if (backgrounds.secondary) {
      root.style.setProperty("--bg-b", `url("${backgrounds.secondary}")`);
      document.getElementById("photo-b")?.style.setProperty("background-image", `url("${backgrounds.secondary}")`);
    }
    if (backgrounds.accent) {
      root.style.setProperty("--bg-accent", `url("${backgrounds.accent}")`);
      document.getElementById("photo-accent")?.style.setProperty("background-image", `url("${backgrounds.accent}")`);
    }
  }

  const speed = typeof rotationSpeed === "number" ? rotationSpeed : 1.1;
  root.style.setProperty("--rotation-speed", `${Math.max(20, 80 / speed)}s`);

  const d =
    typeof distortionIntensity === "number"
      ? Math.min(1, Math.max(0, distortionIntensity))
      : 0.45;
  root.style.setProperty("--distortion", String(d));

  return theme;
}

function initParticles(keywords, canvas, palette) {
  const warmHex = palette?.[0] ?? "#ea580c";
  const coolHex = palette?.[2] ?? "#0d9488";
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return;

  const items = [];
  let cw = window.innerWidth;
  let ch = window.innerHeight;
  let particleCap = 1;
  let t = 0;

  const list = keywords.length ? keywords : ["API", "Linux", "PM"];
  const baseCount = Math.min(22, Math.max(14, Math.ceil(list.length * 1.2)));
  const count = lowEnd ? Math.max(6, Math.floor(baseCount * 0.45)) : baseCount;

  function applyParticleResize() {
    cw = window.innerWidth;
    ch = window.innerHeight;
    const maxSide = lowEnd ? 1280 : 1680;
    particleCap = Math.min(1, maxSide / Math.max(cw, ch, 1));
    const bw = Math.floor(cw * particleCap);
    const bh = Math.floor(ch * particleCap);
    canvas.width = bw;
    canvas.height = bh;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
  }
  const resize = debounce(applyParticleResize, 120);

  for (let i = 0; i < count; i++) {
    items.push({
      text: list[i % list.length],
      x: Math.random() * cw,
      y: Math.random() * ch,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      alpha: 0.035 + Math.random() * 0.07,
      warm: Math.random() > 0.5,
      z: Math.random(),
    });
  }

  const fontBase = lowEnd ? 9 : 10;
  const fontRange = lowEnd ? 3 : 4;

  function frame() {
    t += 0.008;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particleCap < 1) ctx.setTransform(particleCap, 0, 0, particleCap, 0, 0);
    const mx = motion.mx;
    const my = motion.my;

    for (const p of items) {
      p.x += p.vx + mx * 0.06 * p.z;
      p.y += p.vy + my * 0.05 * p.z;
      if (p.x < -120) p.x = cw + 60;
      if (p.x > cw + 120) p.x = -60;
      if (p.y < -30) p.y = ch + 30;
      if (p.y > ch + 30) p.y = -30;

      const pulse = 0.92 + Math.sin(t * 1.2 + p.z * 10) * 0.08;
      const fs = fontBase + p.z * fontRange;
      ctx.font = `500 ${fs}px Pretendard, sans-serif`;
      ctx.fillStyle = p.warm
        ? hexToRgba(warmHex, p.alpha * pulse)
        : hexToRgba(coolHex, p.alpha * pulse);
      ctx.fillText(p.text, p.x, p.y);
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  applyParticleResize();
  startVisibilityLoop(frame);
}

function initFluidCanvas(canvas, palette) {
  if (prefersReducedMotion() || lowEnd) return;

  const warm = palette?.[0] ?? "#ea580c";
  const cool = palette?.[2] ?? "#0d9488";
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return;

  let w = 0;
  let h = 0;
  const blobs = [
    { x: 0, y: 0, tx: 0, ty: 0, r: 100, lag: 0.035, hue: 0 },
    { x: 0, y: 0, tx: 0, ty: 0, r: 140, lag: 0.022, hue: 1 },
    { x: 0, y: 0, tx: 0, ty: 0, r: 75, lag: 0.05, hue: 2 },
  ];

  let tickCount = 0;

  function applyFluidResize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }
  const resizeFluid = debounce(applyFluidResize, 120);

  window.addEventListener(
    "mousemove",
    (e) => {
      blobs[0].tx = e.clientX;
      blobs[0].ty = e.clientY;
      blobs[1].tx = e.clientX + Math.sin(Date.now() * 0.0006) * 48;
      blobs[1].ty = e.clientY + Math.cos(Date.now() * 0.0007) * 40;
      blobs[2].tx = e.clientX * 0.55 + w * 0.22;
      blobs[2].ty = e.clientY * 0.55 + h * 0.22;
    },
    { passive: true }
  );

  function tick() {
    tickCount++;
    if (tickCount % 2 !== 0) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(5, 8, 13, 0.22)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "screen";

    for (const b of blobs) {
      b.x += (b.tx - b.x) * b.lag;
      b.y += (b.ty - b.y) * b.lag;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      if (b.hue % 2 === 0) {
        g.addColorStop(0, `${warm}28`);
        g.addColorStop(0.5, `${cool}14`);
      } else {
        g.addColorStop(0, `${cool}24`);
        g.addColorStop(0.5, `${warm}10`);
      }
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  window.addEventListener("resize", resizeFluid, { passive: true });
  applyFluidResize();
  startVisibilityLoop(tick);
}

function initParallax() {
  if (prefersReducedMotion()) return;

  const root = document.documentElement;
  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;
  let frame = 0;

  window.addEventListener(
    "mousemove",
    (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  function smooth() {
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    motion.mx = mx;
    motion.my = my;

    frame++;
    if (frame % 2 === 0) {
      root.style.setProperty("--mx", mx.toFixed(4));
      root.style.setProperty("--my", my.toFixed(4));
    }
  }

  startVisibilityLoop(smooth);

  window.addEventListener(
    "scroll",
    () => {
      root.style.setProperty("--scroll", String(window.scrollY));
    },
    { passive: true }
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  if (lowEnd) document.body.classList.add("media-portfolio--lite");

  initParallax();

  try {
    const theme = await loadTheme();
    applyTheme(theme);
    const palette = theme.visuals?.colorPalette;

    const pCanvas = document.getElementById("particles-canvas");
    if (pCanvas && theme.floatingParticles?.length) {
      initParticles(theme.floatingParticles, pCanvas, palette);
    }

    const fCanvas = document.getElementById("fluid-canvas");
    if (fCanvas) initFluidCanvas(fCanvas, palette);
  } catch (e) {
    console.warn("[media-art]", e);
    const pCanvas = document.getElementById("particles-canvas");
    if (pCanvas) initParticles([], pCanvas, null);
    const fCanvas = document.getElementById("fluid-canvas");
    if (fCanvas) initFluidCanvas(fCanvas, null);
  }
});
