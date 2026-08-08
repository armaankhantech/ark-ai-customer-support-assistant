// =====================================
// AI Service
// =====================================

const { buildContext } = require("./contextEngineService");
const { buildPrompt } = require("../prompts/promptBuilder");
const { generateResponse } = require("./ollamaService");

async function generatePrompt(
    companyId,
    sessionId,
    userMessage
) {

    // -----------------------------------------
    // 1. Retrieve Context
    // -----------------------------------------

    const contextResult = await buildContext(
        companyId,
        sessionId,
        userMessage
    );


    // -----------------------------------------
    // 2. Build Prompt
    // -----------------------------------------

    const prompt = buildPrompt({

        businessContext:
            contextResult.businessContext,

        documentContext:
            contextResult.documentContext,

        conversationMemory:
            contextResult.conversationMemory,

        conversationHistory:
            "",

        userMessage

    });


    // -----------------------------------------
    // 3. Generate Response
    // -----------------------------------------

    const response =
        await generateResponse(prompt);


    return {

        response,

        prompt,

        intent:
            contextResult.intent,

        context:
            contextResult.context,

        businessContext:
            contextResult.businessContext,

        documentContext:
            contextResult.documentContext,

        conversationMemory:
            contextResult.conversationMemory

    };

}


module.exports = {
    generatePrompt
};