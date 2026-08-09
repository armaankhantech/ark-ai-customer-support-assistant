// ===============================
// Gemini Embedding Configuration
// ===============================

module.exports = {

    // Google Gemini embedding model
    model: "gemini-embedding-001",

    // Keep 768 because your existing pgvector column is vector(768)
    dimensions: 768,

    // Gemini API endpoint
    apiUrl:
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent",

    // Request timeout
    timeout: 30000

};