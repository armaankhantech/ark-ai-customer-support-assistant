const axios = require("axios");
const { buildContext } = require("./contextEngine");
const env = require("../config/env");

const WEBHOOK_URL = env.N8N_WEBHOOK_URL;

async function chat(sessionId, userMessage) {

    try {

        const contextResult = await buildContext(
            1,
            userMessage
        );

        const response = await axios.post(WEBHOOK_URL, {

            sessionId,

            message: userMessage,

            context: contextResult.context,

            intent: contextResult.intent

        });

        return response.data;

    } catch (error) {

        console.error("Ollama Service Error:", error.message);

        throw error;

    }

}

module.exports = {

    chat

};