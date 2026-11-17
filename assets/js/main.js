/* Minimal progressive enhancement — no dependencies.
   1. Mobile navigation toggle
   2. Subtle reveal-on-scroll (respects prefers-reduced-motion)
   3. Footer copyright year
   4. Mark the current page in the navigation
*/
(function () {
  "use strict";

  /* ------------------------------------------------ mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    var label = toggle.querySelector(".nav-toggle__label");
    var setState = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      if (label) label.textContent = open ? "Close" : "Menu";
    };

    toggle.addEventListener("click", function () {
      setState(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after choosing a destination
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setState(false);
    });

    // Escape closes the menu
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setState(false);
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------ current page marker */
  var here = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#site-nav a").forEach(function (link) {
    var target = link.getAttribute("href");
    if (target === here) link.setAttribute("aria-current", "page");
  });

  /* ------------------------------------------------ reveal on scroll */
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------ scroll hints for wide tables */
  document.querySelectorAll(".table-wrap").forEach(function (wrap) {
    var hint = wrap.parentElement.querySelector(".table-hint");
    if (!hint) return;
    var check = function () {
      hint.hidden = wrap.scrollWidth <= wrap.clientWidth + 1;
    };
    check();
    window.addEventListener("resize", check);
  });

  /* ------------------------------------------------ year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
