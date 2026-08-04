/* ============================================================
   ARK AI — api.js
   Central backend API adapter
   ============================================================ */

(function (global) {
  "use strict";

  const BASE_URL =
    localStorage.getItem("ark.apiBase") ||
    "http://localhost:3000";

  function url(path) {
    return BASE_URL.replace(/\/$/, "") + path;
  }

  async function request(path, options = {}) {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      controller.abort();
    }, options.timeoutMs || 60000);

    try {
      const fetchOptions = { ...options };

      delete fetchOptions.timeoutMs;

      const response = await fetch(
        url(path),
        {
          ...fetchOptions,
          signal: controller.signal
        }
      );

      if (!response.ok) {
        throw new Error(
          "Request failed with status " + response.status
        );
      }

      return await response.json();

    } finally {
      clearTimeout(timer);
    }
  }

  async function health() {
    return request("/health");
  }

  async function getConversations() {
    const result = await request(
      "/conversations?_=" + Date.now(),
      {
        method: "GET",
        cache: "no-store"
      }
    );

    return Array.isArray(result.data)
      ? result.data
      : [];
  }

  async function getHistory(sessionId) {
    const data = await request(
      "/history/" + encodeURIComponent(sessionId),
      {
        method: "GET"
      }
    );

    return Array.isArray(data)
      ? data
      : Array.isArray(data.data)
        ? data.data
        : data.messages ||
          data.history ||
          data.rows ||
          [];
  }

  async function deleteConversation(sessionId) {
    return request(
      "/conversation/" + encodeURIComponent(sessionId),
      {
        method: "DELETE"
      }
    );
  }

  async function streamChat(message, sessionId) {
    const response = await fetch(
      url("/chat"),
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message,
          sessionId
        })
      }
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

    return response;
  }

  global.API = {
    health,
    getConversations,
    getHistory,
    deleteConversation,
    streamChat
  };

})(window);