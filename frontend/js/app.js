/* ============================================================
   ARK AI — app.js
   Application bootstrap: wires the UI kernel, chat engine and
   animation helpers together. Keep feature logic in chat.js /
   ui.js; this file only orchestrates.
   ============================================================ */
(function () {
  "use strict";

const UI = window.ARKUI;
const Chat = window.ARKChat;
const Anim = window.ARKAnim;
const API = window.API;
const { $, $$ } = UI;

  /* ---------------- Static content ------------------------ */
  const PROMPTS = [
    { icon: "🕒", title: "Business Hours", sub: "Support availability by region" },
    { icon: "💰", title: "Pricing", sub: "Plans, limits and add-ons" },
    { icon: "📧", title: "Contact Support", sub: "Email, chat and phone routes" },
    { icon: "↩️", title: "Refund Policy", sub: "Eligibility and timelines" },
    { icon: "📚", title: "Documentation", sub: "Guides and API reference" },
    { icon: "🧩", title: "Our Services", sub: "Learn about products and services we offer." },
  ];

/* ---------------- Conversations -------------------------- */

let conversations = [];


/* Load conversations from backend */
async function loadConversations() {
    try {

        const data = await window.API.getConversations();

        conversations = (data || []).map((conversation) => {

            let updatedAt;

            if (typeof conversation.updatedAt === "number") {
                updatedAt = conversation.updatedAt;
            } else {
                updatedAt = Date.parse(conversation.updatedAt);
            }

            return {
                id: conversation.sessionId,
                title: conversation.title || "New conversation",
                updatedAt: Number.isFinite(updatedAt)
                    ? updatedAt
                    : Date.now(),
                messageCount: conversation.messageCount || 0
            };
        });

        renderHistory(filtered());

    } catch (error) {

        console.error(
            "Failed to load conversations:",
            error
        );

        conversations = [];

        renderHistory([]);
    }
}


/* Search / filter conversations */
function filtered() {
  const q = (els.searchInput.value || "").trim().toLowerCase();

  if (!q) {
    return conversations;
  }

  return conversations.filter((c) =>
    String(c.title || "").toLowerCase().includes(q)
  );
}


/* Relative timestamp */
function relativeTime(ts) {
  let time;

  if (typeof ts === "number") {
    time = ts;
  } else {
    time = Date.parse(ts);
  }

  if (!Number.isFinite(time)) {
    return "";
  }

  const diff = Math.max(0, Date.now() - time);

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return minutes === 1
      ? "1 min ago"
      : `${minutes} mins ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return hours === 1
      ? "1 hour ago"
      : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return new Date(time).toLocaleDateString();
}
  /* ---------------- Element references -------------------- */
  const els = {
    app: $("#app"),
    sidebar: $("#sidebar"),
    scrim: $("#scrim"),
    thread: $("#thread"),
    threadInner: $("#threadInner"),
    empty: $("#emptyState"),
    promptGrid: $("#promptGrid"),
    historyList: $("#historyList"),
    historyEmpty: $("#historyEmpty"),
    searchInput: $("#searchInput"),
    composer: $("#composer"),
    field: $("#composer-field"),
    sendBtn: $("#sendBtn"),
    title: $("#conversationTitle"),
    statusDot: $("#statusDot"),
    statusText: $("#statusText"),
  };

  /* ---------------- Boot ---------------------------------- */
  async function init() {
    UI.hydrateIcons();
    UI.bindRipples();
    Anim.mountParticles(14);

    renderPrompts();
  
Chat.mount({
    thread: els.thread,
    threadInner: els.threadInner,

    onFirstMessage: dismissEmptyState,

    onBusyChange: setBusyUI,

    onExchange: async () => {
        console.log("🔄 Refreshing sidebar from database...");
        await loadConversations();
    }
});
    Chat.bindMessageActions(els.threadInner);
      await loadConversations();

    await restoreSession();

    bindComposer();
    bindSidebar();
    bindHeader();
    bindPreferences();
    bindShortcuts();
    bindConnectivity();

    document.body.classList.add("a-fade");
    Anim.observeReveals();
  }

  /* ---------------- Session restore ----------------------- */
  /** Rehydrate the persistent session from GET /history/:sessionId. */
async function restoreSession() {

    try {

        const rows = await Chat.openSession(Chat.state.sessionId);

        if (rows.length === 0) {

            restoreEmptyState();

            els.title.textContent = "New conversation";

            return;

        }

        dismissEmptyState();

        const entry = conversations.find(
            (c) => c.id === Chat.state.sessionId
        );

        const first = rows.find(
            (m) => m.role === "user"
        );

        const title =
            (entry && entry.title) ||
            (first ? first.text.slice(0, 46) : "Conversation");

        els.title.textContent = title;


    } catch (error) {

        console.error(error);

        restoreEmptyState();

    }

}

  /* ---------------- Empty state --------------------------- */
  function renderPrompts() {
    els.promptGrid.innerHTML = PROMPTS.map(
      (p) =>
        '<button class="prompt-card" type="button" data-prompt="' +
        UI.escapeHtml(p.title) +
        '"><span class="prompt-card__icon" aria-hidden="true">' +
        p.icon +
        '</span><span><span class="prompt-card__title">' +
        UI.escapeHtml(p.title) +
        '</span><span class="prompt-card__sub">' +
        UI.escapeHtml(p.sub) +
        "</span></span></button>"
    ).join("");

    els.promptGrid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-prompt]");
      if (!card) return;
      if (els.title.textContent === "New conversation") {
        els.title.textContent = card.dataset.prompt;
      }
      Chat.send(card.dataset.prompt);
      resetField();
    });
  }

  function dismissEmptyState() {
    if (!els.empty || !els.empty.isConnected) return;
    els.empty.style.transition = "opacity 200ms, transform 200ms";
    els.empty.style.opacity = "0";
    els.empty.style.transform = "translateY(-8px)";
    setTimeout(() => els.empty.remove(), 210);
  }

  function restoreEmptyState() {
    if (els.empty.isConnected) return;
    els.empty.style.opacity = "";
    els.empty.style.transform = "";
    els.threadInner.appendChild(els.empty);
    els.empty.classList.add("a-fade-up");
  }

  /* ---------------- Conversation list --------------------- */
  function renderHistory(items) {
    els.historyList.innerHTML = items
      .map(
        (h) =>
          '<button class="history-item' +
          (h.id === Chat.state.sessionId ? " is-active" : "") +
          '" type="button" role="listitem" data-id="' +
          UI.escapeHtml(h.id) +
          '" data-title="' +
          UI.escapeHtml(h.title) +
          '">' +
          UI.icon("message", 18) +
          '<span class="history-item__meta"><span class="nav-item__text">' +
          UI.escapeHtml(h.title) +
          '</span><span class="history-item__time">' +
          UI.escapeHtml(relativeTime(h.updatedAt)) +
          "</span></span></button>"
      )
      .join("");

    els.historyEmpty.textContent = conversations.length
      ? "No conversations match your search."
      : "Your conversations will appear here.";
    els.historyEmpty.style.display = items.length ? "none" : "block";

    els.historyList.querySelectorAll(".history-item").forEach((btn) => {
      btn.addEventListener("click", () => openConversation(btn.dataset.id, btn.dataset.title));
    });
  }

async function openConversation(id, title) {
  closeDrawer();

  if (
    id === Chat.state.sessionId &&
    Chat.state.messages.length
  ) {
    return;
  }

  els.title.textContent = title || "Conversation";

  els.historyList
    .querySelectorAll(".history-item")
    .forEach((b) => {
      b.classList.toggle(
        "is-active",
        b.dataset.id === id
      );
    });

  try {
    const rows = await Chat.openSession(id);

    if (rows.length) {
      dismissEmptyState();
    } else {
      restoreEmptyState();
    }

  } catch (error) {
    console.error("Failed to open conversation:", error);

    UI.toast(
      "Couldn't load that conversation",
      "error"
    );
  }
}
  /* ---------------- Composer ------------------------------ */
  function autoGrow() {
    els.field.style.height = "auto";
    els.field.style.height = Math.min(els.field.scrollHeight, 200) + "px";
  }

  function resetField() {
    els.field.value = "";
    autoGrow();
    els.sendBtn.disabled = true;
  }

  function bindComposer() {
    const box = els.composer;

    els.field.addEventListener("input", () => {
      autoGrow();
      els.sendBtn.disabled = !els.field.value.trim() || Chat.state.busy;
    });

    els.field.addEventListener("focus", () => box.classList.add("is-focused"));
    els.field.addEventListener("blur", () => box.classList.remove("is-focused"));

    // Enter sends, Shift+Enter inserts a newline.
    els.field.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    });

    box.addEventListener("submit", (e) => {
      e.preventDefault();
      submit();
    });

async function submit() {
  const text = els.field.value.trim();

  if (!text || Chat.state.busy) return;

  if (els.title.textContent === "New conversation") {
    els.title.textContent =
      text.length > 42 ? text.slice(0, 42) + "…" : text;
  }

  resetField();

  await Chat.send(text);
}}

  /** Reflect busy/loading state across the composer. */
  function setBusyUI(busy) {
    els.composer.classList.toggle("is-busy", busy);
    els.field.setAttribute("aria-busy", String(busy));
    els.sendBtn.disabled = busy || !els.field.value.trim();
    els.sendBtn.innerHTML = busy
      ? '<span class="spinner" aria-hidden="true"></span>'
      : UI.icon("send", 19);
    els.sendBtn.setAttribute("aria-label", busy ? "Generating response" : "Send message");
  }

  /* ---------------- Sidebar ------------------------------- */
  const isMobile = () => window.matchMedia("(max-width: 900px)").matches;

  function openDrawer() {
    els.app.classList.add("is-drawer-open");
    els.scrim.classList.add("is-open");
    setMenuState(true);
    const first = els.sidebar.querySelector("button, input");
    if (first) first.focus();
  }

  function closeDrawer() {
    els.app.classList.remove("is-drawer-open");
    els.scrim.classList.remove("is-open");
    if (isMobile()) setMenuState(false);
  }

  function setMenuState(open) {
    const btn = $("#menuBtn");
    if (!btn) return;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("data-tip", open ? "Hide sidebar" : "Show sidebar");
  }

  /** One hamburger for both modes: collapse on desktop, drawer on mobile. */
  function toggleSidebar() {
    if (isMobile()) {
      els.app.classList.contains("is-drawer-open") ? closeDrawer() : openDrawer();
      return;
    }
    const collapsed = els.app.classList.toggle("is-collapsed");
    setMenuState(!collapsed);
  }

  function bindSidebar() {
    $("#menuBtn").addEventListener("click", toggleSidebar);
    $("#drawerCloseBtn").addEventListener("click", closeDrawer);
    els.scrim.addEventListener("click", closeDrawer);

    // Leaving the mobile breakpoint should never strand the drawer open.
    window.addEventListener("resize", () => {
      if (!isMobile() && els.app.classList.contains("is-drawer-open")) closeDrawer();
      if (!isMobile()) setMenuState(!els.app.classList.contains("is-collapsed"));
    });

    $("#newChatBtn").addEventListener("click", newChat);

    // Live filter over the conversation list
    els.searchInput.addEventListener("input", () => renderHistory(filtered()));

    $("#aboutBtn").addEventListener("click", () => UI.openModal("aboutModal"));
    $("#themeBtn").addEventListener("click", () => toggleTheme());
  }

function newChat() {
  // Create a completely fresh backend conversation
  Chat.newSession();

  // Clear current UI
  Chat.clear();

  // Restore welcome / hero section
  restoreEmptyState();

  // Reset title
  els.title.textContent = "New conversation";

  // Reset composer
  resetField();

  // Close mobile drawer
  closeDrawer();

  // Focus input
  els.field.focus();

  UI.toast("Started a new conversation", "success");
}

  /* ---------------- Header -------------------------------- */
  function bindHeader() {
    UI.bindDropdown("moreBtn", "moreMenu");

$("#clearBtn").addEventListener("click", async () => {

    const currentSession = Chat.sessionId();

    if (!Chat.state.messages.length) {
        UI.toast("Nothing to delete yet", "info");
        return;
    }

    try {

        await Chat.deleteConversation(currentSession);

        // Clear frontend state
        Chat.clear();

        // Create completely new conversation
        Chat.newSession();

        // Restore hero
        restoreEmptyState();

        // Reset title
        els.title.textContent = "New conversation";

        // Reset composer
        resetField();

        UI.toast("Conversation deleted", "success");

    } catch (error) {

        console.error("Delete conversation error:", error);

        UI.toast(
            "Could not delete conversation",
            "error"
        );
    }
});

    $("#moreMenu").addEventListener("click", async (e) => {
      const item = e.target.closest("[data-action]");
      if (!item) return;
      const action = item.dataset.action;
      if (action === "export") {
        if (!Chat.state.messages.length) return UI.toast("Nothing to export yet", "info");
        const ok = await UI.copyText(Chat.transcript());
        UI.toast(ok ? "Transcript copied to clipboard" : "Export unavailable here", ok ? "success" : "error");
      } else if (action === "about") {
        UI.openModal("aboutModal");
      }
    });
  }

  /* ---------------- Theme & preferences ------------------- */
  function toggleTheme(force) {
    const root = document.documentElement;
    const light = typeof force === "boolean" ? force : root.dataset.theme !== "light";
    root.dataset.theme = light ? "light" : "dark";
    localStorage.setItem("ark.theme", root.dataset.theme);
    const btn = $("#themeBtn");
    btn.innerHTML = UI.icon(light ? "sun" : "moon", 18) +
      '<span class="nav-item__text">Theme</span>';
    UI.toast(light ? "Light theme enabled" : "Dark theme enabled", "info");
  }

  function bindPreferences() {
    // Restore persisted theme
    if (localStorage.getItem("ark.theme") === "light") toggleTheme(true);

    $$("[data-close-modal]").forEach((b) =>
      b.addEventListener("click", () => UI.closeModal(b.closest(".modal")))
    );
    $$(".modal").forEach((m) =>
      m.addEventListener("click", (e) => {
        if (e.target === m) UI.closeModal(m);
      })
    );
  }

  /* ---------------- Keyboard shortcuts -------------------- */
  function bindShortcuts() {
    document.addEventListener("keydown", (e) => {
      const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);

      if (e.key === "Escape") {
        UI.closeAllModals();
        closeDrawer();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        newChat();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
        return;
      }
      if (e.key === "/" && !typing) {
        e.preventDefault();
        els.field.focus();
      }
    });
  }

  /* ---------------- Connection status --------------------- */
  function bindConnectivity() {
    const paint = () => {
      const online = navigator.onLine;
      els.statusDot.className = "dot " + (online ? "dot--online" : "dot--offline");
      els.statusText.textContent = online ? "Connected" : "Offline — reconnecting";
    };
    window.addEventListener("online", paint);
    window.addEventListener("offline", paint);
    paint();
  }

  /* ---------------- Go ------------------------------------ */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
