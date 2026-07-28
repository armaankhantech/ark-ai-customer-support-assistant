const { SYSTEM_PROMPT } = require("./systemPrompt");

function buildPrompt({
    businessContext,
    documentContext,
    conversationHistory,
    userMessage
}) {
    
  const sections = []; 

  sections.push(SYSTEM_PROMPT);

  if (businessContext?.trim()) {

    sections.push(`
Business Context:
${businessContext}
    `.trim());

}

if (documentContext?.trim()) {

    sections.push(`
Document Context:
${documentContext}
    `.trim());

}

if (conversationHistory?.trim()) {

    sections.push(`
Conversation History:
${conversationHistory}
    `.trim());

}

sections.push(`
User:
${userMessage}
`.trim());

return sections.join("\n\n");

sections.push(`
Instructions:

• If the user asks about ARK AI, answer ONLY from the provided context.

• If the required company information is missing, reply exactly:
"I'm sorry, but I don't have that information."

• Never guess company information.

• General knowledge questions may be answered normally.

Assistant:
`.trim());

}


module.exports = {
    buildPrompt
};
