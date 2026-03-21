/* =========================================================
   GETOH — GOLD NEON INTERACTION SCRIPT
========================================================= */

/* Glow cards */
const neonCards = document.querySelectorAll(
  ".summary-card, .ps-card, .role-card, .server-card, .shot-card"
);

neonCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow =
      "0 0 35px rgba(255, 210, 76, 0.55), 0 0 55px rgba(255,179,0,0.65)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow =
      "0 0 22px rgba(255, 210, 76, 0.45)";
  });
});


/* Timeline Activation */
const timelineItems = document.querySelectorAll(".gold-timeline-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("timeline-active");
    });
  },
  { threshold: 0.35 }
);

timelineItems.forEach((item) => observer.observe(item));
