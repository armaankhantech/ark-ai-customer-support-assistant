const { classifyIntent } = require("../context/intentClassifier");
const { buildContextText } = require("../context/contextBuilder");
const { getKnowledgeByIntent } = require("./knowledgeService");
const contextRetriever = require("../context/contextRetriever");
const shouldUseRag = require("../rag/shouldUseRag");

async function buildContext(companyId, message) {

    const greetings = [
        "hello",
        "hi",
        "hey",
        "good morning",
        "good afternoon",
        "good evening",
        "thanks",
        "thank you",
        "bye",
        "goodbye"
    ];

    const normalizedMessage = message
        .toLowerCase()
        .trim();

    if (greetings.includes(normalizedMessage)) {

        return {
            intent: "greeting",
            knowledge: {},
            businessContext: "",
            documentContext: ""
        };

    }

    const intent = classifyIntent(message);

    const knowledge = await getKnowledgeByIntent(
        companyId,
        intent
    );

    const businessContext = buildContextText(
        intent,
        knowledge
    );

    let documentContext = "";

    if (shouldUseRag(intent)) {

        const result = await contextRetriever.retrieve(message);

        documentContext = result.documentContext;

    }

    return {

        intent,

        knowledge,

        businessContext,

        documentContext

    };

}

module.exports = {

    buildContext

};