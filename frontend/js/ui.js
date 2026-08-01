/* ============================================================
   ARK AI — ui.js
   Shared UI kernel: icon system, toasts, modals, dropdowns,
   ripples, tooltips-free helpers and small DOM utilities.
   No dependencies. Exposed as `window.ARKUI`.
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------------------------------------------------------
     DOM helpers
     --------------------------------------------------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* ---------------------------------------------------------
     Icon system
     Minimal Lucide-style stroke icons, inlined so the app works
     fully offline with one consistent stroke width (1.8).
     Usage: <span data-icon="send"></span>  → hydrated on boot.
     --------------------------------------------------------- */
  const PATHS = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .9-1 1.6v.3"/><path d="M12 17.2h.01"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
    more: '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
    download: '<path d="M12 4v11m0 0 4-4m-4 4-4-4"/><path d="M4 19h16"/>',
    send: '<path d="M4.5 12 20 4.6 13.2 20l-2.1-6.2L4.5 12Z"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/>',
    "thumbs-up": '<path d="M7 21V10l4.5-7a2 2 0 0 1 3 2.2L13.5 9H19a2 2 0 0 1 2 2.4l-1.4 7A2.5 2.5 0 0 1 17 21H7Z"/><path d="M7 10H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3"/>',
    "thumbs-down": '<path d="M17 3v11l-4.5 7a2 2 0 0 1-3-2.2L10.5 15H5a2 2 0 0 1-2-2.4l1.4-7A2.5 2.5 0 0 1 7 3h10Z"/><path d="M17 14h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-3"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    alert: '<path d="M12 4.5 2.8 20h18.4L12 4.5Z"/><path d="M12 10v4.2M12 17.4h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    message: '<path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z"/>',
    sparkle: '<path d="M12 3.5 13.8 9 19 10.8 13.8 12.6 12 18l-1.8-5.4L5 10.8 10.2 9 12 3.5Z"/>',
  };

  /** Build an inline SVG string for the given icon name. */
  function icon(name, size) {
    const d = PATHS[name] || PATHS.info;
    const s = size || 18;
    return (
      '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" ' +
      'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + "</svg>"
    );
  }

  /** Replace every [data-icon] placeholder in `root` with its SVG. */
  function hydrateIcons(root) {
    $$("[data-icon]", root).forEach((el) => {
      const name = el.getAttribute("data-icon");
      if (el.dataset.iconDone === name) return;
      const svg = icon(name);
      if (el.hasAttribute("data-icon-prepend") || el.children.length || el.textContent.trim()) {
        el.insertAdjacentHTML("afterbegin", svg);
      } else {
        el.innerHTML = svg;
      }
      el.dataset.iconDone = name;
    });
  }

  /* ---------------------------------------------------------
     Toasts
     --------------------------------------------------------- */
  function toast(message, type, ms) {
    const host = $("#toasts");
    if (!host) return;
    const kind = type || "info";
    const el = document.createElement("div");
    el.className = "toast toast--" + kind;
    el.innerHTML =
      icon(kind === "success" ? "check" : kind === "error" ? "alert" : "info", 17) +
      "<span></span>";
    el.querySelector("span").textContent = message;
    host.appendChild(el);
    window.setTimeout(() => {
      el.style.transition = "opacity 220ms, transform 220ms";
      el.style.opacity = "0";
      el.style.transform = "translateY(6px)";
      window.setTimeout(() => el.remove(), 240);
    }, ms || 2600);
  }

  /* ---------------------------------------------------------
     Modals — with focus trap + restore
     --------------------------------------------------------- */
  let lastFocused = null;
  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    lastFocused = document.activeElement;
    m.classList.add("is-open");
    const first = $(FOCUSABLE, m);
    if (first) first.focus();
    m.addEventListener("keydown", trapFocus);
  }

  function closeModal(el) {
    const m = typeof el === "string" ? document.getElementById(el) : el;
    if (!m) return;
    m.classList.remove("is-open");
    m.removeEventListener("keydown", trapFocus);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function closeAllModals() {
    $$(".modal.is-open").forEach(closeModal);
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
    const nodes = $$(FOCUSABLE, e.currentTarget).filter((n) => n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---------------------------------------------------------
     Dropdowns
     --------------------------------------------------------- */
  function bindDropdown(triggerId, menuId) {
    const trigger = document.getElementById(triggerId);
    const menu = document.getElementById(menuId);
    if (!trigger || !menu) return;

    const close = () => {
      menu.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(open));
      if (open) {
        const first = $(".dropdown__item", menu);
        if (first) first.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && e.target !== trigger) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    menu.addEventListener("click", close);
  }

  /* ---------------------------------------------------------
     Ripple micro-interaction on buttons
     --------------------------------------------------------- */
  function bindRipples() {
    document.addEventListener("pointerdown", (e) => {
      const btn = e.target.closest(".btn, .btn-new, .send-btn, .prompt-card");
      if (!btn || btn.disabled) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = btn.getBoundingClientRect();
      const r = document.createElement("span");
      r.className = "ripple";
      r.style.left = e.clientX - rect.left + "px";
      r.style.top = e.clientY - rect.top + "px";
      if (getComputedStyle(btn).position === "static") btn.style.position = "relative";
      btn.appendChild(r);
      window.setTimeout(() => r.remove(), 640);
    });
  }

  /* ---------------------------------------------------------
     Misc
     --------------------------------------------------------- */
  /** Copy text with a graceful fallback for file:// / older browsers. */
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {
      /* fall through */
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (_) {
      ok = false;
    }
    ta.remove();
    return ok;
  }

  /** Escape untrusted text before injecting into innerHTML. */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  global.ARKUI = {
    $, $$,
    icon, hydrateIcons,
    toast,
    openModal, closeModal, closeAllModals,
    bindDropdown, bindRipples,
    copyText, escapeHtml, formatTime,
  };
})(window);
