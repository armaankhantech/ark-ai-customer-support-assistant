// ===============================
// Intent Keywords
// ===============================

const INTENT_KEYWORDS = {

    // ===============================
    // Business Intents
    // ===============================

    business: [
        "company",
        "about",
        "hours",
        "open",
        "timing",
        "working"
    ],

    contacts: [
        "contact",
        "email",
        "phone",
        "support",
        "sales",
        "call",
        "whatsapp"
    ],

    services: [
        "service",
        "services",
        "offer",
        "pricing",
        "price",
        "automation",
        "chatbot",
        "consulting",
        "package"
    ],

    policies: [
        "refund",
        "return",
        "cancel",
        "privacy",
        "terms",
        "policy"
    ],

    faq: [
        "faq",
        "question",
        "help"
    ],

    conversation: [
        "continue",
        "remember",
        "previous",
        "earlier",
        "before",
        "last"
    ],

    // ===============================
    // Technical / RAG Intents
    // ===============================

    architecture: [
        "architecture",
        "system architecture",
        "backend",
        "frontend",
        "database",
        "design"
    ],

    rag: [
        "rag",
        "retrieval",
        "retrieval augmented generation",
        "vector",
        "embedding",
        "pgvector",
        "similarity search"
    ],

    context_engineering: [
        "context engineering",
        "context engine",
        "context builder",
        "context retriever",
        "intent classifier"
    ],

    memory: [
        "memory",
        "conversation memory",
        "long term memory",
        "summary",
        "summarization"
    ],

    handbook: [
        "chapter",
        "handbook",
        "documentation",
        "knowledge base",
        "manual"
    ]

};


// ===============================
// Intent Classifier
// ===============================

function classifyIntent(message) {

    // Convert message to lowercase
    const normalizedMessage = message.toLowerCase();

    // Loop through each intent
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {

        // Check if any keyword matches
        const hasMatch = keywords.some(keyword =>
            normalizedMessage.includes(keyword)
        );

        // Return the intent immediately
        if (hasMatch) {
            return intent;
        }

    }

    // Default intent
    return "general";

}


// ===============================
// Export
// ===============================

module.exports = {
    classifyIntent
};