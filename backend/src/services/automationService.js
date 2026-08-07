const axios = require("axios");
const env = require("../config/env");
const logger = require("../utils/logger");

async function sendConversation(sessionId, message, response) {


    try {

        const result = await axios.post(
            env.N8N_MEMORY_WEBHOOK_URL,
            {
                sessionId,
                message,
                response
            },
            {
                timeout: env.N8N_MEMORY_TIMEOUT_MS
            }
        );


        logger.info("Memory workflow triggered");

    }

    catch (error) {

        console.log("Memory Error:", error.message);

        logger.error(error.message);

    }

}

module.exports = {
    sendConversation
};