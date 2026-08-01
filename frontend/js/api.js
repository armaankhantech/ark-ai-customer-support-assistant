window.API = (() => {

    const BASE_URL = "http://localhost:3000";


    // ==========================================
    // SEND MESSAGE
    // ==========================================

    async function sendMessage(message) {

        const sessionId = Session.getSessionId();

        const response = await fetch(`${BASE_URL}/chat`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                sessionId,
                message
            })

        });

        if (!response.ok) {

            throw new Error(
                `Chat request failed: ${response.status}`
            );

        }

        const result = await response.json();


        return result;

    }


    // ==========================================
    // HEALTH
    // ==========================================

    async function health() {

        const response =
            await fetch(`${BASE_URL}/health`);

        return response.json();

    }


    // ==========================================
    // CURRENT SESSION HISTORY
    // ==========================================

    async function getHistory() {

        const sessionId =
            Session.getSessionId();

        const response = await fetch(
            `${BASE_URL}/history/${sessionId}`
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load history."
            );

        }

        return await response.json();

    }


    // ==========================================
    // ALL CONVERSATIONS
    // ==========================================

    async function getConversations() {

    const response = await fetch(
    `${BASE_URL}/conversations?_=${Date.now()}`,
    {
        cache: "no-store"
    }
);

        if (!response.ok) {

            throw new Error(
                `Failed to load conversations: ${response.status}`
            );

        }

        const result =
            await response.json();


        return result.data || [];

    }


    // ==========================================
    // PUBLIC API
    // ==========================================

    return {

        sendMessage,
        health,
        getHistory,
        getConversations

    };

})();