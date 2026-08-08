const axios = require("axios");
const env = require("../config/env");
const logger = require("../utils/logger");

async function sendConversation(sessionId, message, response) {
    try {
        await axios.post(
            env.N8N_MEMORY_WEBHOOK_URL,
            {
                session_id: sessionId,
                message,
                response
            },
            {
                timeout: env.N8N_MEMORY_TIMEOUT_MS
            }
        );

        logger.info("Memory workflow triggered");

    } catch (error) {
        logger.error(error.message);
    }
}

module.exports = {
    sendConversation
};