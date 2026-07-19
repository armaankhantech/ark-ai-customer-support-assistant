const { classifyIntent } = require("../context/intentClassifier");
const { buildContextText } = require("../context/contextBuilder");
const { getKnowledgeByIntent } = require("./knowledgeService");

async function buildContext(companyId, message) {

    // Step 1: Detect intent
    const intent = classifyIntent(message);

    // Step 2: Retrieve relevant data
    const knowledge = await getKnowledgeByIntent(companyId, intent);

    // Step 3: Convert data into LLM-friendly text
    const context = buildContextText(intent, knowledge);

    return {
        intent,
        knowledge,
        context
    };

}

module.exports = {
    buildContext
};