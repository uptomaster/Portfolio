/* =========================================================
   GLOBAL INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initAOS();
  initMobileNav();
  initSmoothScroll();
  initHeaderShadow();
  initFooterYear();
  initProjectHover();
  initProjectSlider();
  initCertTrackSwitch();
});

/* =========================================================
   AOS
========================================================= */
function initAOS() {
  if (!window.AOS) return;

  AOS.init({
    duration: 900,
    once: true,
    offset: 60,
    easing: "ease-out-cubic",
  });
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */
function initMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("open");
  });
}

/* =========================================================
   SMOOTH SCROLL
========================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetID = anchor.getAttribute("href");
      if (targetID === "#" || targetID === "#!") return;

      const target = document.querySelector(targetID);
      if (!target) return;

      e.preventDefault();

      const header = document.querySelector(".header");
      const offset = header ? header.offsetHeight : 0;

      const top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        offset +
        10;

      window.scrollTo({ top, behavior: "smooth" });

      // 모바일 네비 닫기
      if (window.innerWidth < 768) {
        document.getElementById("navMenu")?.classList.remove("active");
        document.getElementById("navToggle")?.classList.remove("open");
      }
    });
  });
}

/* =========================================================
   HEADER SCROLL SHADOW
========================================================= */
function initHeaderShadow() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
      header.style.boxShadow = "0 3px 18px rgba(0,0,0,0.1)";
    } else {
      header.classList.remove("scrolled");
      header.style.boxShadow = "none";
    }
  });
}

/* =========================================================
   FOOTER YEAR
========================================================= */
function initFooterYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

/* =========================================================
   PROJECT CARD HOVER
========================================================= */
function initProjectHover() {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-6px)";
      card.style.boxShadow = "0 14px 30px rgba(0,0,0,0.13)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 8px 25px rgba(0,0,0,0.08)";
    });
  });
}

/* =========================================================
   PROJECT SLIDER (통합 관리)
========================================================= */
function initProjectSlider() {
  const track = document.querySelector(".slider-track");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const nextBtn = document.querySelector(".slider-btn.next");
  const cards = document.querySelectorAll(".slider-track .project-card");

  if (!track || !prevBtn || !nextBtn || !cards.length) return;

  let index = 0;
  const GAP = 36;

  function getVisibleCount() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateSlider() {
    const cardWidth = cards[0].offsetWidth;
    const moveX = (cardWidth + GAP) * index;
    track.style.transform = `translateX(-${moveX}px)`;
  }

  nextBtn.addEventListener("click", () => {
    const visible = getVisibleCount();
    if (index < cards.length - visible) {
      index++;
      updateSlider();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateSlider();
    }
  });

  window.addEventListener("resize", () => {
    index = 0;
    updateSlider();
  });
}

/* =========================================================
   CERTIFICATIONS TRACK SWITCH
========================================================= */
function initCertTrackSwitch() {
  const buttons = document.querySelectorAll(".cert-track-btn");
  const panels = document.querySelectorAll(".cert-panel");

  if (!buttons.length || !panels.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.track;
      panels.forEach((panel) => {
        panel.classList.toggle(
          "active",
          panel.dataset.panel === target
        );
      });
    });
  });
}
