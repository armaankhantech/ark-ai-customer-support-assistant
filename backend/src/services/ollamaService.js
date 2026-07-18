const axios = require("axios");
const knowledgeService = require("./knowledgeService");
const env = require("../config/env");

const WEBHOOK_URL = env.N8N_WEBHOOK_URL;

async function chat(sessionId, userMessage) {
    try {
        // Load latest business knowledge from PostgreSQL
        const knowledge = await knowledgeService.getKnowledge(1);

        // Temporary Debug (Remove later)
        console.log("========== KNOWLEDGE LOADED ==========");
        console.log(JSON.stringify(knowledge, null, 2));
        console.log("======================================");

        const response = await axios.post(WEBHOOK_URL, {
            sessionId,
            message: userMessage,
            company: knowledge
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