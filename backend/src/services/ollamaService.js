const axios = require("axios");
const { buildContext } = require("./contextEngine");
const { buildPrompt } = require("../prompts/promptBuilder");
const { SYSTEM_PROMPT } = require("../prompts/systemPrompt");
const env = require("../config/env");
const directResponses = require("../rules");

const WEBHOOK_URL = env.N8N_WEBHOOK_URL;


async function chat(sessionId, userMessage) {

    try {

        // =====================================
        // Direct Response Engine
        // =====================================
 
        const directAnswer = directResponses.find(userMessage);

        if (directAnswer) {

     return {
        reply: directAnswer
     };

}
       
        // =====================================
        // Build Context
        // =====================================

        const contextResult = await buildContext(
            1,
            userMessage
        );

        // =====================================
        // Build Final Prompt
        // =====================================

        const prompt = buildPrompt({

            systemPrompt: SYSTEM_PROMPT,

            businessContext: contextResult.businessContext,

            documentContext: contextResult.documentContext,

            conversationHistory: "",

            userMessage

        });

        // =====================================
        // Send Prompt to n8n
        // =====================================

        const response = await axios.post(
    WEBHOOK_URL,
    {
        sessionId,

        message: userMessage,

        prompt,

        intent: contextResult.intent,

        businessContext: contextResult.businessContext,

        documentContext: contextResult.documentContext
    }
);

        
        console.log(response.data);
        return response.data;

    }

    catch (error) {

        console.error("Ollama Service Error:", error.message);

        throw error;

    }

}

module.exports = {

    chat

};