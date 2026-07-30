const axios = require("axios");
const { buildContext } = require("./contextEngineService");
const { buildPrompt } = require("../prompts/promptBuilder");
const { SYSTEM_PROMPT } = require("../prompts/systemPrompt");
const env = require("../config/env");
const directResponses = require("../rules");
const logger = require("../utils/logger");
const WEBHOOK_URL = env.N8N_WEBHOOK_URL;


async function chat(sessionId, userMessage) {

    try {
        const totalStart = Date.now();

        // =====================================
        // Direct Response Engine
        // =====================================
 
        const directAnswer = directResponses.find(userMessage);

        if (directAnswer) {

     return {
        success: true,
        data: {
        reply: directAnswer
     }
    };
}
       
        // =====================================
        // Build Context
        // =====================================
const contextStart = Date.now();

const contextResult = await buildContext(
    1,
    userMessage
);

logger.info("Context Engine completed", {

    duration: `${Date.now() - contextStart} ms`

});
        // =====================================
        // Build Final Prompt
        // =====================================

         const promptStart = Date.now();

         const prompt = buildPrompt({

            systemPrompt: SYSTEM_PROMPT,

            businessContext: contextResult.businessContext,

            documentContext: contextResult.documentContext,

            conversationHistory: "",

            userMessage

        });
       
logger.info("Prompt built", {
    promptLength: prompt.length
});

// Existing log
logger.info("Prompt Builder completed", {
    duration: `${Date.now() - promptStart} ms`
});

        // =====================================
        // Send Prompt to n8n
        // =====================================

        const webhookStart = Date.now();

const response = await axios.post(
    WEBHOOK_URL,
    {
        sessionId,
        message: userMessage,
        prompt,
        intent: contextResult.intent,
        businessContext: contextResult.businessContext,
        documentContext: contextResult.documentContext
    },
    {
        timeout: 120000
    }
);
logger.info("n8n Workflow completed", {
    duration: `${Date.now() - webhookStart} ms`
});
        
logger.info("Chat request completed", {
    totalDuration: `${Date.now() - totalStart} ms`
});
        const reply =
    response.data.reply ||
    response.data.response ||
    response.data.ai_response ||
    response.data.output ||
    "";

return {
    success: true,
    data: {
        reply
    }
};

    }

    catch (error) {

        console.error("Ollama Service Error:", error.message);

        throw error;

    }

}

module.exports = {

    chat

};