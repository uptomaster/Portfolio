/**
 * 인터랙티브 구체 포털 — 확대 시 프로젝트 섹션으로 전환
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const PROJECTS = [
  { img: "./assets/img/bab-logo.png", title: "밥세권" },
  { img: "./assets/img/yit-logo.png", title: "대학 인프라" },
  { img: "./assets/img/foodfighter_portfolio_img.png", title: "보안 강화" },
  { img: "./assets/img/getoh_portfolio_logo.png", title: "GetOh" },
  { img: "./assets/img/bookmarker_add.png", title: "Bookmarker" },
  { img: "./assets/img/fortunebear.png", title: "FortuneBear" },
  { img: "./assets/img/futurebox.png", title: "FutureBox" },
  { img: "./assets/img/yeolhil-card.png", title: "열흘" },
  /* Playground · 기획 실험장 (projects/playground.html) */
  { img: "./assets/img/playground-indiefilm.png", title: "IndieFilm" },
  { img: "./assets/img/playground-gonggangpick.png", title: "공강픽" },
  { img: "./assets/img/playground-goalchain.png", title: "GoalChain" },
  { img: "./assets/img/playground-ppojiki.png", title: "뽀직이" },
];

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 이미지 텍스처를 원형으로 마스크 + 얇은 테두리 (스프라이트용) */
function createCircularTexture(sourceTex, size = 256) {
  const img = sourceTex.image;
  if (!img || !(img.naturalWidth || img.width)) return sourceTex;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return sourceTex;

  const cx = size / 2;
  const R = size / 2 - 4;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cx, R, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(size / iw, size / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (size - dw) / 2;
  const dy = (size - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cx, R + 0.5, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cx, R - 1, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(61,214,195,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const out = new THREE.CanvasTexture(canvas);
  if ("colorSpace" in out) out.colorSpace = THREE.SRGBColorSpace;
  out.minFilter = THREE.LinearFilter;
  out.generateMipmaps = false;
  out.needsUpdate = true;
  return out;
}

function main() {
  const canvas = document.getElementById("sphere-canvas");
  const section = document.getElementById("sphere-portal");
  const flash = document.getElementById("sphere-portal-flash");
  const enterBtn = document.getElementById("sphere-portal-enter");
  const projectsEl = document.getElementById("projects");

  if (!canvas || !section || !projectsEl) return;

  let portalDone = false;
  let expanding = false;

  let controlsRef = null;

  const triggerPortal = () => {
    if (portalDone || expanding) return;
    expanding = true;
    portalDone = true;
    if (controlsRef) controlsRef.enabled = false;
    if (flash) {
      flash.setAttribute("aria-hidden", "false");
      flash.classList.add("is-active");
    }
    window.setTimeout(() => {
      projectsEl.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }, prefersReducedMotion() ? 0 : 380);
    window.setTimeout(() => {
      if (flash) {
        flash.classList.remove("is-active");
        flash.setAttribute("aria-hidden", "true");
      }
      expanding = false;
    }, 900);
  };

  enterBtn?.addEventListener("click", triggerPortal);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    section.classList.add("is-fallback");
    return;
  }
  if (!renderer.getContext()) {
    section.classList.add("is-fallback");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
  camera.position.set(0, 0.28, 6.4);

  const controls = new OrbitControls(camera, canvas);
  controlsRef = controls;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.55;
  /* 페이지 스크롤과 충돌하지 않도록 휠 줌 끔 — 회전은 드래그만 */
  controls.enableZoom = false;
  controls.minDistance = 3.2;
  controls.maxDistance = 8.5;
  controls.enablePan = false;
  controls.target.set(0, 0, 0);

  const group = new THREE.Group();
  scene.add(group);

  const sphereR = 1.18;
  const seg = prefersReducedMotion() ? 48 : 80;
  const sphereGeo = new THREE.SphereGeometry(sphereR, seg, Math.max(32, Math.floor(seg * 0.75)));

  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a1218,
    emissive: 0x143d38,
    emissiveIntensity: 0.38,
    metalness: 0.42,
    roughness: 0.35,
    transparent: true,
    opacity: 0.9,
    clearcoat: 0.85,
    clearcoatRoughness: 0.18,
  });
  const shell = new THREE.Mesh(sphereGeo, shellMat);
  group.add(shell);

  /* 구 겉면과 동일한 구에 와이어 — 아이코보다 자연스러운 실루엣 */
  const wireGeo = new THREE.SphereGeometry(sphereR * 1.0012, 36, 28);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x8ef0e4,
    wireframe: true,
    transparent: true,
    opacity: 0.1,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  group.add(wire);

  const ringGeo = new THREE.TorusGeometry(1.82, 0.028, 32, 160);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x3dd6c3,
    transparent: true,
    opacity: 0.32,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.12;
  group.add(ring);

  const ring2 = ring.clone();
  ring2.scale.setScalar(1.1);
  ring2.material = ringMat.clone();
  ring2.material.opacity = 0.14;
  ring2.rotation.x = Math.PI / 2.38;
  ring2.rotation.z = 0.35;
  group.add(ring2);

  const pCount = prefersReducedMotion() ? 800 : 2400;
  const pPos = new Float32Array(pCount * 3);
  const pCol = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = sphereR * 1.006 + Math.random() * 0.025;
    const i3 = i * 3;
    pPos[i3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPos[i3 + 2] = r * Math.cos(phi);
    const warm = Math.random() > 0.5;
    pCol[i3] = warm ? 0.88 : 0.2;
    pCol[i3 + 1] = warm ? 0.45 : 0.75;
    pCol[i3 + 2] = warm ? 0.38 : 0.72;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  const pMat = new THREE.PointsMaterial({
    size: prefersReducedMotion() ? 0.018 : 0.024,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pGeo, pMat);
  group.add(points);

  const satGroup = new THREE.Group();
  const orbitR = 2.22;
  const loader = new THREE.TextureLoader();
  PROJECTS.forEach((p, i) => {
    loader.load(
      p.img,
      (tex) => {
        if ("colorSpace" in tex) tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        const roundMap = createCircularTexture(tex, 280);
        const mat = new THREE.SpriteMaterial({
          map: roundMap,
          transparent: true,
          opacity: 0.96,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(mat);
        const phi = (i / PROJECTS.length) * Math.PI * 2 + 0.4;
        const theta = Math.PI / 3 + (i % 4) * 0.22;
        sprite.position.set(
          orbitR * Math.sin(theta) * Math.cos(phi),
          orbitR * Math.cos(theta) * 0.85,
          orbitR * Math.sin(theta) * Math.sin(phi)
        );
        const s = 0.48;
        sprite.scale.set(s, s, 1);
        satGroup.add(sprite);
      },
      undefined,
      () => {}
    );
  });
  group.add(satGroup);

  const amb = new THREE.AmbientLight(0xffffff, 0.35);
  scene.add(amb);
  const pl = new THREE.PointLight(0x9ef5ea, 1.05, 22);
  pl.position.set(2.2, 3.2, 4);
  scene.add(pl);
  const pl2 = new THREE.PointLight(0xe8b896, 0.65, 18);
  pl2.position.set(-3, -1, 2);
  scene.add(pl2);

  const clock = new THREE.Clock();

  const onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w < 1 || h < 1) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  controls.addEventListener("start", () => section.classList.add("is-dragging"));
  controls.addEventListener("end", () => section.classList.remove("is-dragging"));

  canvas.addEventListener(
    "dblclick",
    (e) => {
      e.preventDefault();
      triggerPortal();
    },
    { passive: false }
  );

  window.addEventListener("resize", onResize);
  onResize();

  const animate = () => {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const rotSpeed = prefersReducedMotion() ? 0.025 : 0.07;
    ring.rotation.z = t * 0.055;
    ring2.rotation.z = -t * 0.04;
    wire.rotation.y = t * rotSpeed * 0.85;
    shell.rotation.y = t * rotSpeed * 0.28;
    points.rotation.y = t * rotSpeed * 0.42;
    satGroup.rotation.y = t * 0.11;

    controls.update();
    renderer.render(scene, camera);
  };
  animate();
}

document.addEventListener("DOMContentLoaded", main);
