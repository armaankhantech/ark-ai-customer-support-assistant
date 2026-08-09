// ===============================
// Intent Keywords
// ===============================

const INTENT_KEYWORDS = {

    // ===============================
    // Technical / RAG Intents
    // ===============================

    handbook: [
        "chapter",
        "handbook",
        "documentation",
        "knowledge base",
        "manual"
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

    architecture: [
        "architecture",
        "system architecture",
        "backend",
        "frontend",
        "database",
        "design"
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
        "whatsapp",
        "human representative"
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
    ]
};

// ===============================
// Intent Classifier
// ===============================

function classifyIntent(message) {

    // Convert message to lowercase
    const normalizedMessage = message.toLowerCase();

    // Check higher-priority / specific intents first
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {

        const hasMatch = keywords.some(keyword =>
            normalizedMessage.includes(keyword)
        );

        // Return the first matching intent
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