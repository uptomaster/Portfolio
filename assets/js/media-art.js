/**
 * 미디어 아트 레이어 — pm 포트폴리오와 동일 인터랙션
 * portfolio-theme.json: assets/data/portfolio-theme.json
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
  const warmHex = palette?.[0] ?? "#E07A5F";
  const coolHex = palette?.[2] ?? "#2A9D8F";
  const ctx = canvas.getContext("2d");
  const items = [];
  let cw = window.innerWidth;
  let ch = window.innerHeight;
  let t = 0;

  function resize() {
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;
  }

  const list = keywords.length ? keywords : ["API", "Linux", "PM"];
  const count = Math.min(22, Math.max(14, Math.ceil(list.length * 1.2)));
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

  function frame() {
    t += 0.008;
    ctx.clearRect(0, 0, cw, ch);
    const mx =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mx")) || 0;
    const my =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--my")) || 0;

    for (const p of items) {
      p.x += p.vx + mx * 0.06 * p.z;
      p.y += p.vy + my * 0.05 * p.z;
      if (p.x < -120) p.x = cw + 60;
      if (p.x > cw + 120) p.x = -60;
      if (p.y < -30) p.y = ch + 30;
      if (p.y > ch + 30) p.y = -30;

      const pulse = 0.92 + Math.sin(t * 1.2 + p.z * 10) * 0.08;
      const fs = 10 + p.z * 4;
      ctx.font = `500 ${fs}px Pretendard, sans-serif`;
      ctx.shadowBlur = 4 + p.z * 8;
      ctx.shadowColor = p.warm ? hexToRgba(warmHex, 0.2) : hexToRgba(coolHex, 0.2);
      ctx.fillStyle = p.warm
        ? hexToRgba(warmHex, p.alpha * pulse)
        : hexToRgba(coolHex, p.alpha * pulse);
      ctx.fillText(p.text, p.x, p.y);
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
}

function initFluidCanvas(canvas, palette) {
  if (prefersReducedMotion()) return;

  const warm = palette?.[0] ?? "#E07A5F";
  const cool = palette?.[2] ?? "#2A9D8F";
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  const blobs = [
    { x: 0, y: 0, tx: 0, ty: 0, r: 100, lag: 0.035, hue: 0 },
    { x: 0, y: 0, tx: 0, ty: 0, r: 140, lag: 0.022, hue: 1 },
    { x: 0, y: 0, tx: 0, ty: 0, r: 75, lag: 0.05, hue: 2 },
  ];

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }

  window.addEventListener("mousemove", (e) => {
    blobs[0].tx = e.clientX;
    blobs[0].ty = e.clientY;
    blobs[1].tx = e.clientX + Math.sin(Date.now() * 0.0006) * 48;
    blobs[1].ty = e.clientY + Math.cos(Date.now() * 0.0007) * 40;
    blobs[2].tx = e.clientX * 0.55 + w * 0.22;
    blobs[2].ty = e.clientY * 0.55 + h * 0.22;
  });

  function tick() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(5, 8, 13, 0.2)";
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
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
}

function initParallax() {
  if (prefersReducedMotion()) return;

  const root = document.documentElement;
  let mx = 0;
  let my = 0;
  let tx = 0;
  let ty = 0;

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
    root.style.setProperty("--mx", mx.toFixed(4));
    root.style.setProperty("--my", my.toFixed(4));
    requestAnimationFrame(smooth);
  }
  smooth();

  window.addEventListener(
    "scroll",
    () => {
      root.style.setProperty("--scroll", String(window.scrollY));
    },
    { passive: true }
  );
}

function initCursor() {
  if (prefersReducedMotion()) return;

  const glow = document.getElementById("cursor-glow");
  const dot = document.getElementById("cursor-dot");
  if (!glow || !dot) return;

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.body.classList.add("media-cursor");

  let gx = 0;
  let gy = 0;
  let dx = 0;
  let dy = 0;

  window.addEventListener(
    "mousemove",
    (e) => {
      dx = e.clientX;
      dy = e.clientY;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    },
    { passive: true }
  );

  function follow() {
    gx += (dx - gx) * 0.12;
    gy += (dy - gy) * 0.12;
    glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
    requestAnimationFrame(follow);
  }
  follow();
}

document.addEventListener("DOMContentLoaded", async () => {
  initParallax();
  initCursor();

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
