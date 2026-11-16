"use strict";
(() => {
/* ---- navigation.js ---- */
/** Навигация: активно състояние + мобилно меню. */

function markActiveLinks() {
  const key = document.body.dataset.page;
  if (!key) return;

  document.querySelectorAll(`[data-nav]`).forEach((link) => {
    link.removeAttribute("aria-current");
  });

  document.querySelectorAll(`[data-nav="${key}"]`).forEach((link) => {
    link.setAttribute("aria-current", "page");
  });

  // Подстраниците на услугите маркират и родителя.
  if (["civil-law", "family-law", "inheritance-law", "commercial-law", "administrative-law"].includes(key)) {
    document
      .querySelectorAll('.nav-desktop [data-nav="services"]')
      .forEach((link) => link.setAttribute("aria-current", "page"));
  }
}

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-mobile]");
  if (!toggle || !panel) return;

  const setState = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    const label = toggle.querySelector(".nav-toggle__label");
    if (label) label.textContent = open ? "Затвори" : "Меню";
  };

  setState(false);

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setState(!open);
    if (!open) {
      const first = panel.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setState(false);
      toggle.focus();
    }
  });

  panel.addEventListener("click", (event) => {
    if (event.target.closest("a")) setState(false);
  });

  const desktop = window.matchMedia("(min-width: 60rem)");
  desktop.addEventListener("change", (event) => {
    if (event.matches) setState(false);
  });
}

/* ---- faq.js ---- */
/** FAQ: само едно отворено запитване в група (progressive enhancement). */

function initFaq() {
  document.querySelectorAll("[data-faq]").forEach((group) => {
    const items = Array.from(group.querySelectorAll("details"));
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.filter((other) => other !== item && other.open).forEach((other) => {
          other.open = false;
        });
      });
    });
  });
}

/* ---- reveal.js ---- */
/** Сдържано появяване при скрол. */

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---- init ---- */
function init() {
  initMobileNav(); initFaq(); initReveal();
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
  document.querySelectorAll("[data-nav-mobile] a").forEach((a) => a.addEventListener("click", () => document.querySelector("[data-nav-toggle]")?.click()));
  document.addEventListener("click", (e) => {
    const t = document.querySelector("[data-nav-toggle]"), m = document.querySelector("[data-nav-mobile]");
    if (t?.getAttribute("aria-expanded") === "true" && !e.target.closest(".nav-mobile__list, .nav-mobile__footer, [data-nav-toggle]")) t.click();
  });
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
