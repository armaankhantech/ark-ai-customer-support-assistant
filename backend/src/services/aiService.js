// =====================================
// AI Service
// =====================================

const { buildContext } = require("./contextEngine");
const { buildPrompt } = require("../prompts/promptBuilder");
const { SYSTEM_PROMPT } = require("../prompts/systemPrompt");
const { generateResponse } = require("./ollamaService");

async function generatePrompt(companyId, userMessage) {

    // Step 1: Retrieve context
    const contextResult = await buildContext(
        companyId,
        userMessage
    );

    // Step 2: Build the final prompt
    const prompt = buildPrompt({

        systemPrompt: SYSTEM_PROMPT,

        context: contextResult.context,

        conversationHistory: "",

        userMessage

    });

    // Step 3: Generate AI response
    const response = await generateResponse(prompt);

    return {

        response,

        prompt,

        intent: contextResult.intent,

        context: contextResult.context

    };

}

module.exports = {

    generatePrompt

};