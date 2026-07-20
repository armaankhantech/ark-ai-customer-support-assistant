// ===============================
// Intent Keywords
// ===============================

const INTENT_KEYWORDS = {

    business: [
        "hours",
        "open",
        "timing",
        "working",
        "office hours",
        "company"
    ],

    contacts: [
        "email",
        "phone",
        "contact",
        "support",
        "call",
        "whatsapp",
        "support",
        "sales"
    ],

    services: [
        "service",
        "services",
        "offer",
        "pricing",
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
        "previous",
        "earlier",
        "before",
        "remember",
        "last"
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