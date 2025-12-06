/* =========================================================
    AOS (Animate On Scroll)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    duration: 900,
    once: true,
    offset: 60,
    easing: "ease-out-cubic",
  });
});

/* =========================================================
    Mobile Navigation (햄버거 메뉴)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("open");
    });
  }
});

/* =========================================================
    Smooth Scroll (부드러운 스크롤)
========================================================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetID = this.getAttribute("href");

    if (targetID !== "#" && targetID !== "#!") {
      e.preventDefault();
      const headerHeight = document.querySelector(".header").offsetHeight;
      const target = document.querySelector(targetID);

      const position =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight +
        10;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    }

    // 모바일이면 자동으로 메뉴 닫기
    if (window.innerWidth < 768) {
      const navMenu = document.getElementById("navMenu");
      const navToggle = document.getElementById("navToggle");

      if (navMenu) navMenu.classList.remove("active");
      if (navToggle) navToggle.classList.remove("open");
    }
  });
});

/* =========================================================
    Header Scroll Shadow
========================================================= */
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
    header.style.boxShadow = "0 3px 18px rgba(0,0,0,0.1)";
  } else {
    header.classList.remove("scrolled");
    header.style.boxShadow = "none";
  }
});

/* =========================================================
    Footer Year Auto Insert
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

/* =========================================================
    Project Card Hover Effect
========================================================= */
function addHoverEffect() {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-6px)";
      card.style.transition = "0.3s";
      card.style.boxShadow = "0 14px 30px rgba(0,0,0,0.13)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
    });
  });
}
addHoverEffect();

/* =========================================================
    Pentagon Rotation (옵션)
========================================================= */
function rotatePentagon() {
  const pentagon = document.querySelector(".pentagon");
  if (!pentagon) return;

  let angle = 0;
  setInterval(() => {
    angle += 0.3;
    pentagon.style.transform = `rotate(${angle}deg)`;
  }, 50);
}
// rotatePentagon(); // 필요 시 활성화

/* =========================================================
    Mobile Navigation + Neon Animation
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("open");
    });
  }
});
