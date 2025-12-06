/* =========================================================
   BACKEND PAGE — NEON INTERACTION SCRIPT
   Floating Shapes / Neon Pulse / Card Hover / Scroll Highlight
========================================================= */

/* =============================
   1) FLOATING SHAPES (부드러운 네온 도형 움직임)
============================= */
const floatingShapes = document.querySelectorAll(".shape");

floatingShapes.forEach((shape) => {
  const randX = Math.random() * 40 + 15;
  const randY = Math.random() * 35 + 15;
  const duration = Math.random() * 2500 + 3500;

  shape.animate(
    [
      { transform: "translate(0,0)" },
      { transform: `translate(${randX}px, ${randY}px)` },
      { transform: "translate(0,0)" }
    ],
    {
      duration: duration,
      iterations: Infinity,
      easing: "ease-in-out",
      direction: "alternate"
    }
  );
});

/* =============================
   2) NEON CARD HOVER GLOW
============================= */
const neonCards = document.querySelectorAll(".backend-card, .admin-card, .info-card");

neonCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow =
      "0 0 30px rgba(77,163,255,0.55), 0 0 45px rgba(161,124,255,0.55)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow =
      "0 0 18px rgba(77,163,255,0.25), 0 0 28px rgba(161,124,255,0.25)";
  });
});

/* =============================
   3) TIMELINE ACTIVATION (스크롤 시 네온 글로우)
============================= */
const timelineItems = document.querySelectorAll(".backend-timeline-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("timeline-active");
      }
    });
  },
  { threshold: 0.35 }
);

timelineItems.forEach((item) => observer.observe(item));

/* =============================
   4) TIMELINE ACTIVE CSS 삽입 (JS에서 동적 추가)
============================= */
const dynamicStyle = document.createElement("style");
dynamicStyle.innerHTML = `
  .timeline-active {
    transform: translateX(8px);
    transition: 0.35s ease;
    filter: drop-shadow(0 0 18px rgba(77,163,255,0.55));
  }
`;
document.head.appendChild(dynamicStyle);

/* =============================
   5) PDF DOWNLOAD BUTTON NEON PULSE
============================= */
const pdfBtn = document.querySelector(".backend-btn");

if (pdfBtn) {
  pdfBtn.animate(
    [
      { boxShadow: "0 0 16px rgba(77,163,255,0.45)" },
      { boxShadow: "0 0 32px rgba(161,124,255,0.75)" },
      { boxShadow: "0 0 16px rgba(77,163,255,0.45)" }
    ],
    {
      duration: 2600,
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
}

/* =============================
   6) SCROLL HEADER SHADOW (선택 사항)
============================= */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
    header.style.boxShadow = "0 3px 18px rgba(0,0,0,0.25)";
  } else {
    header.classList.remove("scrolled");
    header.style.boxShadow = "none";
  }
});
/* =========================================================
    PROJECT DROPDOWN (클릭 시 토글)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("projectDropdownBtn");
  const menu = document.getElementById("projectDropdownMenu");

  if (btn && menu) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("open");
    });

    // 화면 다른 곳 클릭하면 닫힘
    document.addEventListener("click", () => {
      menu.classList.remove("open");
    });
  }
});
