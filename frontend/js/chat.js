/* ============================================================
   ARK AI — chat.js
   Conversation model, markdown renderer, message rendering,
   typing / loading / error UX and the backend API adapter.

Backend contract:

  POST /chat
    { message, sessionId }
    → streaming response

  GET /history/:sessionId
    → [ { role, content } ]

  DELETE /conversation/:sessionId
    → deletes conversation
   ============================================================ */
(function (global) {
  "use strict";

  const { escapeHtml, icon, copyText, toast, formatTime } = global.ARKUI;

  /* ---------------------------------------------------------
     Configuration
 * `ark.apiBase` lets the UI point to the Express backend.
 * Default: http://localhost:3000
     --------------------------------------------------------- */
   const config = {
    apiBase:
    localStorage.getItem("ark.apiBase") ||
    "http://localhost:3000",

  timeoutMs: 60000,
};

const url = (path) => config.apiBase.replace(/\/$/, "") + path;

  /* ---------------------------------------------------------
     Session management (persistent session ids)
     --------------------------------------------------------- */
/* ---------------------------------------------------------
   Session management
   Single source of truth: Session module
   --------------------------------------------------------- */

const SESSION_KEY = "ark.sessionId";

function makeSessionId() {
  if (global.crypto && global.crypto.randomUUID) {
    return global.crypto.randomUUID();
  }

  return (
    "s-" +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10)
  );
}

function sessionId() {
  let id = localStorage.getItem(SESSION_KEY);

  if (!id) {
    id = makeSessionId();
    localStorage.setItem(SESSION_KEY, id);
  }

  return id;
}

function setSessionId(id) {
  if (!id) {
    id = makeSessionId();
  }

  localStorage.setItem(SESSION_KEY, id);
  state.sessionId = id;
}

function newSession() {
  const id = makeSessionId();

  setSessionId(id);

  return id;
}

  /* ---------------------------------------------------------
     State
     --------------------------------------------------------- */
  const state = {
    messages: [], // { id, role: 'user'|'ai', text, ts, feedback }
    busy: false,
    sessionId: sessionId(),
    stick: true, // auto-scroll only while the user is at the bottom
  };

  let els = {};
  function mount(refs) {
    els = refs;
    if (els.thread) {
      els.thread.addEventListener("scroll", () => {
        const el = els.thread;
        state.stick = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      });
    }
  }

  function renderMarkdown(src) {
    const codeBlocks = [];
    let text = String(src).replace(/\r\n/g, "\n");

    // 1. Extract fenced code blocks first so their content is untouched.
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const i = codeBlocks.push({ lang: lang || "", code }) - 1;
      return "\u0000CODE" + i + "\u0000";
    });

    text = escapeHtml(text);

    // 2. Tables (| a | b | / |---|---| / rows)
    text = text.replace(
      /(^\|.+\|\n\|[ :|-]+\|\n(?:\|.*\|\n?)+)/gm,
      (block) => {
        const rows = block.trim().split("\n");
        const cells = (row) =>
          row.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        const head = cells(rows[0]);
        const body = rows.slice(2).map(cells);
        return (
          "<table><thead><tr>" +
          head.map((h) => "<th>" + h + "</th>").join("") +
          "</tr></thead><tbody>" +
          body.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") +
          "</tbody></table>"
        );
      }
    );

    // 3. Headings, quotes, inline styles, links
    text = text
      .replace(/^###\s+(.*)$/gm, "<h3>$1</h3>")
      .replace(/^##\s+(.*)$/gm, "<h2>$1</h2>")
      .replace(/^#\s+(.*)$/gm, "<h1>$1</h1>")
      .replace(/^&gt;\s?(.*)$/gm, "<blockquote>$1</blockquote>")
      .replace(/`([^`\n]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>")
      .replace(
        /\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
      );

    // 4. Lists
    text = text.replace(/(?:^(?:\d+\.)\s+.*(?:\n|$))+/gm, (block) => {
      const items = block.trim().split("\n").map((l) => l.replace(/^\d+\.\s+/, ""));
      return "<ol>" + items.map((i) => "<li>" + i + "</li>").join("") + "</ol>";
    });
    text = text.replace(/(?:^[-*]\s+.*(?:\n|$))+/gm, (block) => {
      const items = block.trim().split("\n").map((l) => l.replace(/^[-*]\s+/, ""));
      return "<ul>" + items.map((i) => "<li>" + i + "</li>").join("") + "</ul>";
    });

    // 5. Paragraphs for remaining loose lines
    text = text
      .split(/\n{2,}/)
      .map((chunk) => {
        const t = chunk.trim();
        if (!t) return "";
        if (/^<(h\d|ul|ol|table|blockquote|pre)/.test(t)) return t;
        return "<p>" + t.replace(/\n/g, "<br>") + "</p>";
      })
      .join("");

    // 6. Restore code blocks
    text = text.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => {
      const b = codeBlocks[Number(i)];
      return (
        '<pre><code data-lang="' + escapeHtml(b.lang) + '">' + escapeHtml(b.code.trim()) + "</code></pre>"
      );
    });

    return text;
  }

  /* ---------------------------------------------------------
     Rendering
     --------------------------------------------------------- */
  function actionBtn(name, label, action, tip) {
    return (
      '<button class="act" type="button" data-msg-action="' + action + '" ' +
      'aria-label="' + label + '" data-tip="' + (tip || label) + '">' + icon(name, 15) + "</button>"
    );
  }

  function aiAvatar() {
    return '<span class="avatar avatar--ai" aria-hidden="true"><img src="assets/logo/ark-logo.svg" alt="" width="22" height="22"></span>';
  }

  /** Create and append a message element; returns the element. */
  function renderMessage(msg) {
    const wrap = document.createElement("article");
    wrap.className = "msg msg--" + msg.role;
    wrap.dataset.id = msg.id;

    const isAI = msg.role === "ai";
    const avatar = isAI ? aiAvatar() : '<span class="avatar avatar--user" aria-hidden="true">You</span>';

    const actions = isAI
      ? '<div class="msg__actions">' +
        actionBtn("copy", "Copy response", "copy") +
        actionBtn("refresh", "Regenerate response", "regenerate") +
        actionBtn("thumbs-up", "Mark as helpful", "up", "Helpful") +
        actionBtn("thumbs-down", "Mark as not helpful", "down", "Not helpful") +
        '<span class="msg__time">' + formatTime(msg.ts) + "</span>" +
        "</div>"
      : '<div class="msg__actions">' +
        actionBtn("copy", "Copy message", "copy") +
        '<span class="msg__time">' + formatTime(msg.ts) + "</span>" +
        "</div>";

    wrap.innerHTML =
      avatar +
      '<div class="msg__body">' +
      '<p class="msg__author">' + (isAI ? "ARK AI" : "You") + "</p>" +
      '<div class="bubble bubble--' + (isAI ? "ai" : "user") + '">' +
      (isAI ? renderMarkdown(msg.text) : escapeHtml(msg.text).replace(/\n/g, "<br>")) +
      "</div>" +
      actions +
      "</div>";

    els.threadInner.appendChild(wrap);
    return wrap;
  }

  /** Typing indicator shown while awaiting a response. */
function showTyping() {
    hideTyping();

    const wrap = document.createElement("article");

    wrap.className = "msg msg--ai";
    wrap.id = "typingMsg";

    wrap.innerHTML =
        aiAvatar() +
        '<div class="msg__body">' +

        '<p class="msg__author">ARK AI</p>' +

        '<div class="typing-stack">' +

        '<div class="typing" aria-label="ARK AI is thinking">' +

        '<span class="typing-dots">' +
        '<i></i>' +
        '<i></i>' +
        '<i></i>' +
        '</span>' +

        '<span class="typing__label">Thinking...</span>' +

        '</div>' +

        '<div class="skeleton-block">' +
        '<span class="skeleton-line skeleton-line--lg"></span>' +
        '<span class="skeleton-line skeleton-line--md"></span>' +
        '<span class="skeleton-line skeleton-line--sm"></span>' +
        '</div>' +

        '</div>' +

        '</div>';

    els.threadInner.appendChild(wrap);

    scrollToEnd(true);

    return wrap;
}

  function hideTyping() {
    const t = document.getElementById("typingMsg");
    if (t) t.remove();
  }

  /** Friendly, non-technical error card with a retry affordance. */
  function showError(retryFn) {
    const wrap = document.createElement("article");
    wrap.className = "msg msg--ai";
    wrap.innerHTML =
      aiAvatar() +
      '<div class="msg__body"><div class="alert" role="alert">' +
      '<span class="alert__icon">' + icon("alert", 18) + "</span><div>" +
      '<p class="alert__title">I\'m having trouble connecting right now</p>' +
      '<p class="alert__text">Your message is safe. Please try again in a few seconds — I\'ll pick up right where we left off.</p>' +
      '<div class="alert__actions"><button class="btn btn--primary btn--sm" data-retry>' +
      icon("refresh", 15) + "Try again</button>" +
      '<button class="btn btn--glass btn--sm" data-dismiss>Dismiss</button></div>' +
      "</div></div></div>";
    els.threadInner.appendChild(wrap);
    wrap.querySelector("[data-retry]").addEventListener("click", () => {
      wrap.remove();
      retryFn();
    });
    wrap.querySelector("[data-dismiss]").addEventListener("click", () => wrap.remove());
    scrollToEnd(true);
  }

  /** Smooth auto-scroll that respects manual scroll-up. */
  function scrollToEnd(force) {
    if (!els.thread) return;
    if (!force && !state.stick) return;
    requestAnimationFrame(() => {
      els.thread.scrollTo({ top: els.thread.scrollHeight, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     Backend adapter — Express API
     --------------------------------------------------------- */
  async function api(path, options) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);
    try {
      const res = await fetch(url(path), Object.assign({ signal: controller.signal }, options));
      if (!res.ok) throw new Error("Request failed with status " + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }


async function streamAnswer(text) {

    const response = await fetch(url("/chat"), {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: text,
            sessionId: state.sessionId
        })
    });

    if (!response.ok) {
        throw new Error(
            "Streaming request failed: " + response.status
        );
    }

    if (!response.body) {
        throw new Error(
            "Streaming is not supported by this response."
        );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let firstChunk = true;

    while (true) {

        const { value, done } = await reader.read();

        if (done) {
            break;
        }

        const chunk = decoder.decode(value, {
            stream: true
        });

        if (!chunk) {
            continue;
        }

        // Remove "Thinking..." when first response arrives
        if (firstChunk) {

            hideTyping();

            beginStream();

            firstChunk = false;
        }

        appendStream(chunk);
    }

    // Backend returned no content
    if (firstChunk) {

        hideTyping();

        addMessage(
            "ai",
            "I couldn't find an answer for that yet."
        );

        return;
    }

    endStream();
}

  /** Normalise a stored history row into the UI message shape. */
  function normalise(row, i) {
    const role = /^(ai|assistant|bot|ark)$/i.test(String(row.role || row.sender || "")) ? "ai" : "user";
    const text = row.content || row.message || row.text || row.reply || "";
    const ts = Date.parse(row.created_at || row.createdAt || row.timestamp || "") || Date.now();
    return { id: "h" + i + "-" + ts, role, text: String(text), ts };
  }

  /** Load a stored conversation from GET /history/:sessionId. */
async function loadHistory(id) {
    const data = await api(
        "/history/" + encodeURIComponent(id),
        {
            method: "GET"
        }
    );


    const rows =
        Array.isArray(data)
            ? data
            : Array.isArray(data.data)
                ? data.data
                : data.messages ||
                  data.history ||
                  data.rows ||
                  [];

    return rows
        .map(normalise)
        .filter((m) => m.text);
}
async function deleteConversation(id) {
    await api(
        "/conversation/" + encodeURIComponent(id),
        {
            method: "DELETE"
        }
    );

    return true;
}
  /** Replace the thread with a stored conversation. */
async function openSession(id) {

    setSessionId(id);

    const rows = await loadHistory(id);

    state.messages = rows;

    els.threadInner.innerHTML = "";
    rows.forEach(renderMessage);

    scrollToEnd(true);

    return rows;
}


  /* ---------------------------------------------------------
     Streaming-ready assistant message
     Call beginStream() → appendStream(chunk)… → endStream()
     --------------------------------------------------------- */
  let stream = null;

  function beginStream() {
    hideTyping();
    const msg = { id: "m" + Date.now(), role: "ai", text: "", ts: Date.now() };
    const node = renderMessage(msg);
    node.classList.add("is-streaming");
    stream = { msg, node, bubble: node.querySelector(".bubble") };
    return stream;
  }

  function appendStream(chunk) {
    if (!stream) beginStream();
    stream.msg.text += chunk;
    stream.bubble.innerHTML = renderMarkdown(stream.msg.text);
    scrollToEnd();
  }

  function endStream() {
    if (!stream) return;
    stream.node.classList.remove("is-streaming");
    if (stream.msg.text) state.messages.push(stream.msg);
    else stream.node.remove();
    stream = null;
    scrollToEnd();
  }

  /* ---------------------------------------------------------
     Public actions
     --------------------------------------------------------- */
  function addMessage(role, text) {
    const msg = { id: "m" + Date.now() + Math.random().toString(36).slice(2, 6), role, text, ts: Date.now() };
    state.messages.push(msg);
    renderMessage(msg);
    scrollToEnd(role === "user");
    return msg;
  }

async function send(text) {

    const clean = String(text || "").trim();

    if (!clean || state.busy) return;

    if (els.onFirstMessage) {
        els.onFirstMessage();
    }

    // Show user message immediately
    addMessage("user", clean);

    // WAIT for backend/database/AI to finish
    await respond(clean);

  
}
async function respond(prompt) {

    setBusy(true);

    state.stick = true;

    showTyping();

    try {

        await streamAnswer(prompt);

    } catch (err) {

        console.error("Streaming error:", err);

        hideTyping();

        showError(() => respond(prompt));

    } finally {

        setBusy(false);

    }
}

  function regenerate(id) {
    const idx = state.messages.findIndex((m) => m.id === id);
    if (idx < 1 || state.busy) return;
    const prompt = state.messages[idx - 1].text;
    const node = els.threadInner.querySelector('[data-id="' + id + '"]');
    if (node) node.remove();
    state.messages.splice(idx, 1);
    respond(prompt);
  }

  function setBusy(v) {
    state.busy = v;
    if (els.onBusyChange) els.onBusyChange(v);
  }

  function clear() {
    state.messages = [];
    els.threadInner.innerHTML = "";
  }

  function transcript() {
    return state.messages
      .map((m) => (m.role === "ai" ? "ARK AI" : "You") + " (" + formatTime(m.ts) + "):\n" + m.text)
      .join("\n\n");
  }

  /* ---------------------------------------------------------
     Message action delegation (copy / regenerate / feedback)
     --------------------------------------------------------- */
  function bindMessageActions(root) {
    root.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-msg-action]");
      if (!btn) return;
      const article = btn.closest(".msg");
      const id = article && article.dataset.id;
      const msg = state.messages.find((m) => m.id === id);
      const action = btn.dataset.msgAction;

      if (action === "copy" && msg) {
        const ok = await copyText(msg.text);
        toast(ok ? "Copied to clipboard" : "Copy is unavailable here", ok ? "success" : "error");
      } else if (action === "regenerate" && msg) {
        regenerate(msg.id);
      } else if (action === "up" || action === "down") {
        const group = btn.parentElement.querySelectorAll('[data-msg-action="up"],[data-msg-action="down"]');
        group.forEach((b) => b.classList.remove("is-on"));
        btn.classList.add("is-on");
        if (msg) msg.feedback = action;
        toast(action === "up" ? "Thanks — marked as helpful" : "Thanks — we'll improve this answer", "success");
      }
    });
  }

  global.ARKChat = {
    config, state, mount, send, respond, clear, transcript,
    addMessage, bindMessageActions, renderMarkdown, scrollToEnd,
    sessionId, newSession, setSessionId, openSession, loadHistory,
    deleteConversation, beginStream, appendStream, endStream,
  };
})(window);
