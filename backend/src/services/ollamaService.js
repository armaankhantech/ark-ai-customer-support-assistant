const axios = require("axios");
const companyInfo = require("../prompts/systemPrompt");

const env = require("../config/env");

const WEBHOOK_URL = env.N8N_WEBHOOK_URL;

async function chat(sessionId, userMessage) {

    try {

        const response = await axios.post(WEBHOOK_URL, {
    sessionId,
    message: userMessage,
    company: companyInfo
});



return response.data;

    } catch (error) {

        throw error;

    }

}

module.exports = {
    chat
};