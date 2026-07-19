// ======================================
// Prompt Builder
// ======================================

function buildPrompt({

    systemPrompt,

    context,

    conversationHistory,

    userMessage

}) {

    return `

========================
SYSTEM
========================

${systemPrompt}

========================
BUSINESS CONTEXT
========================

${context}

========================
CONVERSATION HISTORY
========================

${conversationHistory}

========================
CURRENT USER QUESTION
========================

${userMessage}

========================
INSTRUCTIONS
========================

Answer using ONLY the provided business context.

If the information is unavailable, politely say you don't know.

Do not invent facts.

`;

}

module.exports = {
    buildPrompt
};