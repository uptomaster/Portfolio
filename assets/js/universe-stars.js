/**
 * 참고 HTML과 동일: Three.js Points 별 필드 (#canvas-stars)
 * 성능: 탭 비가시 시 rAF 중단
 */
(function () {
  const container = document.getElementById("canvas-stars");
  if (!container || typeof THREE === "undefined") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const starScene = new THREE.Scene();
  const starCam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const starRenderer = new THREE.WebGLRenderer({
    canvas: document.createElement("canvas"),
    antialias: true,
    alpha: true,
  });
  starRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  starRenderer.setSize(window.innerWidth, window.innerHeight);
  starRenderer.setClearColor(0x000000, 0);
  container.appendChild(starRenderer.domElement);

  const starsGeo = new THREE.BufferGeometry();
  const count = reduced ? 4000 : 15000;
  const posArray = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) posArray[i] = (Math.random() - 0.5) * 12;
  starsGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
  const starMesh = new THREE.Points(
    starsGeo,
    new THREE.PointsMaterial({
      size: 0.003,
      color: 0xffffff,
      transparent: true,
      opacity: reduced ? 0.35 : 0.6,
    })
  );
  starScene.add(starMesh);
  starCam.position.z = 2;

  let rafId = null;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    starCam.aspect = w / h;
    starCam.updateProjectionMatrix();
    starRenderer.setSize(w, h);
  }

  function frame() {
    if (document.visibilityState !== "visible") {
      rafId = null;
      return;
    }
    if (!reduced) starMesh.rotation.y = Date.now() * 0.0001;
    starRenderer.render(starScene, starCam);
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (rafId == null) rafId = requestAnimationFrame(frame);
  }

  window.addEventListener(
    "resize",
    (function () {
      let t = null;
      return function () {
        window.clearTimeout(t);
        t = window.setTimeout(resize, 100);
      };
    })(),
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") start();
  });

  resize();
  start();
})();
