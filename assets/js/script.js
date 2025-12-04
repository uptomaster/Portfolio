/* =========================================================
    AOS (Animate On Scroll)
========================================================= */
// AOS 초기화
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 900,
    once: true,
    offset: 60,
    easing: "ease-out-cubic"
  });
});

/* =========================================================
    Mobile Navigation (햄버거 메뉴)
========================================================= */
const navToggle = document.getElementById("navToggle");
const navMenu = document.querySelector(".nav");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("open");

  if (navMenu.classList.contains("active")) {
    navMenu.style.display = "flex";
  } else {
    navMenu.style.display = "none";
  }
});

/* =========================================================
    Smooth Scroll (부드러운 스크롤 이동)
========================================================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetID = this.getAttribute("href");

    // #이 아니면 스크롤
    if (targetID !== "#" && targetID !== "#!") {
      e.preventDefault();
      const target = document.querySelector(targetID);
      const headerHeight = document.querySelector(".header").offsetHeight;

      const position =
        target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 10;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });
    }

    // 모바일에서 메뉴 자동 닫기
    if (window.innerWidth < 768) {
      navMenu.style.display = "none";
      navToggle.classList.remove("open");
    }
  });
});

/* =========================================================
    Header Scroll Shadow (스크롤 시 헤더에 그림자 추가)
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
    Year Auto Insert (Footer)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

/* =========================================================
    Future Expand Zones (향후 기능 확장용)
========================================================= */

// 프로젝트 카드 hover 효과 강화할 때 활용 가능
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

// 스킬 오각형이 유동적으로 빙글 돌도록 애니메이션 추가 가능
function rotatePentagon() {
  const pentagon = document.querySelector(".pentagon");
  if (!pentagon) return;

  let angle = 0;
  setInterval(() => {
    angle += 0.3;
    pentagon.style.transform = `rotate(${angle}deg)`;
  }, 50);
}

// rotatePentagon(); ← 필요 시 활성화

