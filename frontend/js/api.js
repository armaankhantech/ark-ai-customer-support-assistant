/* ============================================================
   ARK AI — api.js
   REST API adapter
   ============================================================ */

window.API = (() => {

    const BASE_URL =
        localStorage.getItem("ark.apiBase") ||
        "http://localhost:3000";


    function url(path) {
        return BASE_URL.replace(/\/$/, "") + path;
    }


    // =========================================================
    // HEALTH
    // =========================================================

    async function health() {

        const response = await fetch(
            url("/health")
        );

        if (!response.ok) {
            throw new Error(
                `Health check failed: ${response.status}`
            );
        }

        return response.json();
    }


    // =========================================================
    // ALL CONVERSATIONS
    // =========================================================

    async function getConversations() {

        const response = await fetch(
            url("/conversations?_=" + Date.now()),
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load conversations: ${response.status}`
            );
        }

        const result = await response.json();

        return Array.isArray(result.data)
            ? result.data
            : [];
    }


    // =========================================================
    // PUBLIC API
    // =========================================================

    return {
        health,
        getConversations
    };

})();