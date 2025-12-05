/* =========================================================
   SUN PROJECT — NEON INTERACTION SCRIPT
   Floating Shapes / Neon Hover / Timeline Activation / PDF Glow
========================================================= */

/* ---------------------------------------------------------
   1) FLOATING SHAPES (배경에서 천천히 움직이는 도형)
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
   2) NEON CARD HOVER GLOW
--------------------------------------------------------- */

const neonCards = document.querySelectorAll(
  ".summary-card, .role-card, .ps-card, .server-card, .shot-card"
);

neonCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow =
      "0 0 30px rgba(0,240,255,0.55), 0 0 45px rgba(41,182,246,0.55)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow =
      "0 0 18px rgba(0,240,255,0.25), 0 0 28px rgba(41,182,246,0.25)";
  });
});


/* ---------------------------------------------------------
   3) TIMELINE SCROLL ACTIVATION
--------------------------------------------------------- */

const timelineItems = document.querySelectorAll(".sun-timeline-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("timeline-active");
    });
  },
  { threshold: 0.35 }
);

timelineItems.forEach((item) => observer.observe(item));

/* JS에서 동적으로 CSS 삽입 */
const style = document.createElement("style");
style.innerHTML = `
  .timeline-active {
    transform: translateX(10px);
    transition: 0.4s ease;
    filter: drop-shadow(0 0 22px rgba(0,240,255,0.55));
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
      { boxShadow: "0 0 16px rgba(0,240,255,0.45)" },
      { boxShadow: "0 0 32px rgba(41,182,246,0.75)" },
      { boxShadow: "0 0 16px rgba(0,240,255,0.45)" }
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
