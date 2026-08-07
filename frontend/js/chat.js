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
  const Storage = global.ARKStorage;
  const API = global.API;

  /* ---------------------------------------------------------
     State
     --------------------------------------------------------- */
  const state = {
    messages: [], // { id, role: 'user'|'ai', text, ts, feedback }
    busy: false,
    sessionId: Storage.getSessionId(),
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

  function sessionId() {
  return state.sessionId;
}

function setSessionId(id) {
  state.sessionId = Storage.setSessionId(id);
}

function newSession() {
  state.sessionId = Storage.newSession();
  return state.sessionId;
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

function aiAvatar(){

return `
<span class="avatar avatar--ai" aria-hidden="true">
<img
src="assets/logo/ark-icon.png"
alt="ARK AI"
width="22"
height="22">
</span>
`;

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
      (isAI ? ARKMarkdown.renderMarkdown(msg.text) : escapeHtml(msg.text).replace(/\n/g, "<br>")) +
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


async function streamAnswer(text) {

    const response = await API.streamChat(
        text,
        state.sessionId
    );

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

    let buffer = "";
    let firstChunk = true;

    while (true) {

        const { value, done } = await reader.read();

        if (done) {
            break;
        }

        buffer += decoder.decode(value, {
            stream: true
        });

        const events = buffer.split("\n\n");

        buffer = events.pop() || "";

        for (const event of events) {

            const lines = event.split("\n");

            for (const line of lines) {

                if (!line.startsWith("data:")) {
                    continue;
                }

                const data = line
                    .slice(5)
                    .trim();

                if (!data) {
                    continue;
                }

                if (data === "[DONE]") {
                    continue;
                }

                let content;

                try {
                    content = JSON.parse(data);
                }

                catch (error) {
                    console.warn(
                        "Could not parse SSE data:",
                        data
                    );
                    continue;
                }

                if (!content) {
                    continue;
                }

                if (firstChunk) {

                    hideTyping();

                    beginStream();

                    firstChunk = false;

                }

                appendStream(content);
            }
        }
    }

    // Flush decoder
    buffer += decoder.decode();

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

  const rows = await API.getHistory(id);

  return rows
    .map(normalise)
    .filter((m) => m.text);
}

async function deleteConversation(id) {
  await API.deleteConversation(id);
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
    stream.bubble.innerHTML = ARKMarkdown.renderMarkdown(stream.msg.text);
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
     state, mount, send, respond, clear, transcript,
    addMessage, bindMessageActions, scrollToEnd,
    sessionId, newSession, setSessionId, openSession, loadHistory,
    deleteConversation, beginStream, appendStream, endStream,
  };
})(window);
