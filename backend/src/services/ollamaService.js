const axios = require("axios");
const { buildContext } = require("./contextEngineService");
const { buildPrompt } = require("../prompts/promptBuilder");
const { SYSTEM_PROMPT } = require("../prompts/systemPrompt");
const env = require("../config/env");
const directResponses = require("../rules");

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
        reply: directAnswer
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

console.log(
    `⚡ Context Engine: ${Date.now() - contextStart} ms`
);
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
        console.log(
    `⚡ Prompt Builder: ${Date.now() - promptStart} ms`
);

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
    }
);
console.log(
    `⚡ n8n Workflow: ${Date.now() - webhookStart} ms`
);
        
        console.log("--------------------------------");
console.log(
    `✅ TOTAL: ${Date.now() - totalStart} ms`
);
console.log("--------------------------------");
        const reply =
    response.data.reply ||
    response.data.response ||
    response.data.ai_response ||
    response.data.output ||
    "";

return {
    success: true,
    reply
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