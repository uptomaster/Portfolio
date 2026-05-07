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
    duration: 650,
    once: true,
    offset: 48,
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

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (window.scrollY > 10) {
          header.classList.add("scrolled");
          header.style.boxShadow = "0 3px 18px rgba(0,0,0,0.1)";
        } else {
          header.classList.remove("scrolled");
          header.style.boxShadow = "none";
        }
      });
    },
    { passive: true }
  );
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
  /* 미디어 포트폴리오 테마은 CSS 호버만 사용 (인라인이 글래스·그라데이션을 덮어씀) */
  if (document.body.classList.contains("media-portfolio")) return;

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
  const root = document.getElementById("home-project-slider");
  if (!root) return;

  const isSpotlight = root.classList.contains("projects-spotlight");
  const track = root.querySelector(".slider-track");
  const viewport = root.querySelector(".slider-viewport");
  const prevBtn = root.querySelector(".slider-btn.prev");
  const nextBtn = root.querySelector(".slider-btn.next");
  const cards = root.querySelectorAll(".slider-track .project-card");
  const rail = document.getElementById("projects-picker-rail");

  const elCur = document.getElementById("projects-slider-current");
  const elTotal = document.getElementById("projects-slider-total");
  const elBarFill = document.getElementById("projects-slider-bar-fill");
  const elBar = document.getElementById("projects-slider-bar");

  if (!track || !viewport || !prevBtn || !nextBtn || !cards.length) return;

  let index = 0;

  function getGapPx() {
    const g = window.getComputedStyle(track).gap;
    if (g && g !== "normal") {
      const n = parseFloat(g);
      if (!Number.isNaN(n)) return n;
    }
    return isSpotlight ? 14 : 36;
  }

  function getVisibleCount() {
    if (isSpotlight) return 1;
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function syncSpotlightWidths() {
    if (!isSpotlight) return;
    const w = viewport.getBoundingClientRect().width;
    if (w <= 0) return;
    cards.forEach((card) => {
      card.style.flex = "0 0 " + w + "px";
      card.style.width = w + "px";
      card.style.maxWidth = w + "px";
      card.style.minWidth = "0";
    });
  }

  function clampIndex(v) {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);
    return Math.max(0, Math.min(maxIndex, v));
  }

  function buildPickerRail() {
    if (!isSpotlight || !rail) return;
    rail.innerHTML = "";
    cards.forEach((card, i) => {
      const imgEl = card.querySelector(".project-thumb img");
      const src = imgEl ? imgEl.getAttribute("src") : "";
      const h3 = card.querySelector(".project-header h3");
      const title = h3 ? h3.textContent.replace(/\s+/g, " ").trim() : "Project " + (i + 1);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "projects-pick-chip";
      btn.setAttribute("role", "tab");
      btn.id = "projects-pick-" + i;
      btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
      btn.setAttribute("data-index", String(i));
      btn.setAttribute(
        "aria-label",
        (i + 1) + ". " + (title.length > 80 ? title.slice(0, 79) + "…" : title)
      );

      const num = document.createElement("span");
      num.className = "projects-pick-chip__num";
      num.textContent = String(i + 1).padStart(2, "0");

      const thumb = document.createElement("span");
      thumb.className = "projects-pick-chip__thumb";
      const img = document.createElement("img");
      img.src = src || "";
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      thumb.appendChild(img);

      const cap = document.createElement("span");
      cap.className = "projects-pick-chip__caption";
      cap.textContent = title;

      btn.appendChild(num);
      btn.appendChild(thumb);
      btn.appendChild(cap);

      btn.addEventListener("click", () => {
        index = clampIndex(i);
        updateSlider(true);
      });

      rail.appendChild(btn);
    });
  }

  function updatePickerSelection() {
    if (!rail) return;
    rail.querySelectorAll(".projects-pick-chip").forEach((chip, i) => {
      const on = i === index;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function scrollRailToActive(prefersSmooth) {
    if (!rail || !rail.children[index]) return;
    const motionReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const railVertical = window.getComputedStyle(rail).flexDirection === "column";
    rail.children[index].scrollIntoView({
      block:
        railVertical && prefersSmooth ? "center" : "nearest",
      inline: railVertical ? "nearest" : "center",
      behavior: motionReduce || !prefersSmooth ? "auto" : "smooth",
    });
  }

  function updateIndicators(maxIndex, total, pctStep) {
    if (elCur) elCur.textContent = String(index + 1);
    if (elTotal) elTotal.textContent = String(total);
    if (elBarFill) elBarFill.style.width = pctStep + "%";
    if (elBar) {
      elBar.setAttribute("aria-valuemax", String(maxIndex + 1));
      elBar.setAttribute("aria-valuenow", String(index + 1));
      elBar.setAttribute("aria-valuetext", "프로젝트 " + (index + 1) + " / " + total);
    }

    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= maxIndex;
    prevBtn.setAttribute("aria-disabled", prevBtn.disabled ? "true" : "false");
    nextBtn.setAttribute("aria-disabled", nextBtn.disabled ? "true" : "false");

    updatePickerSelection();
  }

  function updateSlider(fromChipClick) {
    syncSpotlightWidths();
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);
    const total = cards.length;
    const pct = maxIndex <= 0 ? 100 : Math.round((index / maxIndex) * 100);

    const gap = getGapPx();
    const cardWidth =
      isSpotlight
        ? viewport.getBoundingClientRect().width
        : cards[index].offsetWidth || cards[0].offsetWidth || 0;
    const moveX = (cardWidth + gap) * index;
    track.style.transform = "translateX(-" + moveX + "px)";

    updateIndicators(maxIndex, total, pct);
    scrollRailToActive(!!fromChipClick);
  }

  function goNext() {
    const maxIndex = Math.max(0, cards.length - getVisibleCount());
    if (index < maxIndex) {
      index++;
      updateSlider(false);
    }
  }

  function goPrev() {
    if (index > 0) {
      index--;
      updateSlider(false);
    }
  }

  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);

  window.addEventListener("resize", () => {
    index = clampIndex(index);
    updateSlider(false);
  });

  if (viewport) {
    let touchStartX = 0;
    viewport.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (dx < -48) goNext();
        else if (dx > 48) goPrev();
      },
      { passive: true }
    );
  }

  buildPickerRail();
  index = clampIndex(index);
  updateSlider(false);
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
