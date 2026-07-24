const { SYSTEM_PROMPT } = require("./systemPrompt");

function buildPrompt({
    businessContext,
    documentContext,
    conversationHistory,
    userMessage
}) {

    return `
${SYSTEM_PROMPT}

Business Context:
${businessContext || "None"}

Document Context:
${documentContext || "None"}

Conversation History:
${conversationHistory || "None"}

User:
${userMessage}

Instructions:

• If the user asks about ARK AI, answer ONLY from the provided context.

• If the required company information is missing, reply exactly:
"I'm sorry, but I don't have that information."

• Never guess company information.

• General knowledge questions may be answered normally.

Assistant:
`;

}

module.exports = {
    buildPrompt
};