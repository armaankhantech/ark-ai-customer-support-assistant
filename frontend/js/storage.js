/* ============================================================
   ARK AI — storage.js
   Persistent browser storage and session management
   ============================================================ */

(function (global) {
  "use strict";

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

  function getSessionId() {
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

    return id;
  }

  function newSession() {
    return setSessionId(makeSessionId());
  }

  global.ARKStorage = {
    makeSessionId,
    getSessionId,
    setSessionId,
    newSession
  };
})(window);