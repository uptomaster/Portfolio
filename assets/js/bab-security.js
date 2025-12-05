/* =========================================================
   BAB SECURITY PROJECT — NEON INTERACTION SCRIPT
   Floating Shapes / Neon Hover / Timeline Activation / PDF Glow
========================================================= */

/* ---------------------------------------------------------
   1) FLOATING SHAPES (배경 도형 은은히 움직임)
--------------------------------------------------------- */
const floatShapes = document.querySelectorAll(".shape");

floatShapes.forEach((shape) => {
  const randX = Math.random() * 35 + 15;
  const randY = Math.random() * 30 + 15;
  const duration = Math.random() * 3500 + 4500;

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


/* ---------------------------------------------------------
   2) NEON CARD HOVER GLOW (붉은 네온 강조)
--------------------------------------------------------- */
const neonCards = document.querySelectorAll(
  ".bab-summary-card, .bab-server-card, .bab-ps-card, .bab-shot-card"
);

neonCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow =
      "0 0 30px rgba(212,20,90,0.85), 0 0 45px rgba(255,79,129,0.85)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow =
      "0 0 18px rgba(212,20,90,0.6), 0 0 28px rgba(255,79,129,0.6)";
  });
});


/* ---------------------------------------------------------
   3) TIMELINE SCROLL ACTIVATION
--------------------------------------------------------- */
const timelineItems = document.querySelectorAll(".bab-timeline-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("timeline-active");
    });
  },
  { threshold: 0.35 }
);

timelineItems.forEach((item) => observer.observe(item));

/* 동적 CSS 삽입 */
const style = document.createElement("style");
style.innerHTML = `
  .timeline-active {
    transform: translateX(10px);
    transition: 0.4s ease;
    filter: drop-shadow(0 0 22px rgba(212,20,90,0.85));
  }
`;
document.head.appendChild(style);


/* ---------------------------------------------------------
   4) PDF DOWNLOAD BUTTON NEON PULSE
--------------------------------------------------------- */
const pdfBtn = document.querySelector(".pdf-btn");

if (pdfBtn) {
  pdfBtn.animate(
    [
      { boxShadow: "0 0 16px rgba(212,20,90,0.6)" },
      { boxShadow: "0 0 36px rgba(255,79,129,0.95)" },
      { boxShadow: "0 0 16px rgba(212,20,90,0.6)" }
    ],
    {
      duration: 2600,
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
}


/* ---------------------------------------------------------
   5) HEADER SCROLL SHADOW
--------------------------------------------------------- */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  if (window.scrollY > 10) {
    header.style.boxShadow = "0 3px 18px rgba(0,0,0,0.35)";
    header.style.background = "rgba(255,255,255,0.75)";
    header.style.backdropFilter = "blur(12px)";
  } else {
    header.style.boxShadow = "none";
    header.style.background = "rgba(255,255,255,0.6)";
  }
});
