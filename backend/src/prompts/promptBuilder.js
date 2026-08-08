const { SYSTEM_PROMPT } = require("./systemPrompt");

function buildPrompt({
    businessContext,
    documentContext,
    conversationHistory,
    conversationMemory,
    userMessage
}) {

    const sections = [];

    // -----------------------------------------
    // SYSTEM INSTRUCTIONS
    // -----------------------------------------

    sections.push(
        SYSTEM_PROMPT.trim()
    );


    // -----------------------------------------
    // BUSINESS CONTEXT
    // -----------------------------------------

    if (businessContext?.trim()) {

        sections.push(`
Business Context:
${businessContext.trim()}
        `.trim());

    }


    // -----------------------------------------
    // DOCUMENT / RAG CONTEXT
    // -----------------------------------------

    if (documentContext?.trim()) {

        sections.push(`
Document Context:
${documentContext.trim()}
        `.trim());

    }


    // -----------------------------------------
    // LONG-TERM MEMORY
    // -----------------------------------------

    if (conversationMemory?.trim()) {

        sections.push(`
Long-Term Memory:
${conversationMemory.trim()}
        `.trim());

    }


    // -----------------------------------------
    // SHORT-TERM CONVERSATION HISTORY
    // -----------------------------------------

    if (conversationHistory?.trim()) {

        sections.push(`
Conversation History:
${conversationHistory.trim()}
        `.trim());

    }


    // -----------------------------------------
    // CURRENT USER MESSAGE
    // -----------------------------------------

    sections.push(`
User:
${userMessage.trim()}
    `.trim());


    // -----------------------------------------
    // FINAL INSTRUCTIONS
    // -----------------------------------------

    sections.push(`
Instructions:

• If the user asks about ARK AI, answer ONLY from the provided business context, document context, and relevant memory.

• Do not invent company information.

• If required company information is missing, reply exactly:
"I'm sorry, but I don't have that information."

• General knowledge questions may be answered normally.

• Use Long-Term Memory only as background about the user.

• Do not treat Long-Term Memory as company documentation.

Assistant:
    `.trim());


    return sections.join("\n\n");
}


module.exports = {
    buildPrompt
};