/* ============================================================
   ARK AI — animations.js
   Purely decorative motion helpers. Everything here is optional
   and respects prefers-reduced-motion.
   ============================================================ */
(function (global) {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** Spawn a few soft floating particles inside the ambient layer. */
  function mountParticles(count) {
    const host = document.getElementById("ambient");
    if (!host || reduced.matches) return;
    const n = count || 14;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "ambient__particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.animationDuration = 18 + Math.random() * 22 + "s, " + (4 + Math.random() * 5) + "s";
      p.style.animationDelay = -Math.random() * 20 + "s";
      p.style.opacity = String(0.15 + Math.random() * 0.3);
      frag.appendChild(p);
    }
    host.appendChild(frag);
  }

  /** Reveal `.reveal` elements as they scroll into view. */
  function observeReveals(root) {
    const scope = root || document;
    const items = scope.querySelectorAll(".reveal:not(.is-visible)");
    if (!items.length) return;
    if (reduced.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    items.forEach((el) => io.observe(el));
  }

  /** Enable/disable ambient drift (used by the settings switch). */
  function setAmbientMotion(on) {
    const host = document.getElementById("ambient");
    if (!host) return;
    host.querySelectorAll(".ambient__blob, .ambient__particle").forEach((el) => {
      el.style.animationPlayState = on ? "running" : "paused";
    });
  }

  global.ARKAnim = { mountParticles, observeReveals, setAmbientMotion, reduced };
})(window);
