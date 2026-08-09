const axios = require("axios");
const config = require("./embeddingConfig");
const AppError = require("../../errors/AppError");

class EmbeddingService {

    /**
     * Generate a text embedding using Gemini.
     *
     * @param {string} text
     * @param {string} taskType
     * @returns {Promise<number[]>}
     */
    async generateEmbedding(
        text,
        taskType = "RETRIEVAL_QUERY"
    ) {

        // ===============================
        // Validate input
        // ===============================

        if (!text || !text.trim()) {
            throw new AppError(
                "Text is required to generate an embedding.",
                400,
                "TEXT_REQUIRED"
            );
        }

        // ===============================
        // Validate API key
        // ===============================

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new AppError(
                "GEMINI_API_KEY is not configured.",
                500,
                "EMBEDDING_API_KEY_MISSING"
            );
        }

        try {

            // ===============================
            // Call Gemini Embedding API
            // ===============================

            const response = await axios.post(
                config.apiUrl,
                {
                    model: `models/${config.model}`,

                    content: {
                        parts: [
                            {
                                text: text
                            }
                        ]
                    },

                    taskType,

                    outputDimensionality: config.dimensions
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key": apiKey
                    },

                    timeout: config.timeout
                }
            );

            // ===============================
            // Extract embedding
            // ===============================

            const embedding =
                response.data?.embedding?.values;

            if (!Array.isArray(embedding)) {
                throw new AppError(
                    "Embedding service did not return a valid embedding.",
                    502,
                    "EMBEDDING_GENERATION_FAILED"
                );
            }

            // ===============================
            // Validate dimensions
            // ===============================

            if (embedding.length !== config.dimensions) {
                throw new AppError(
                    `Expected ${config.dimensions}-dimension embedding but received ${embedding.length}.`,
                    502,
                    "EMBEDDING_DIMENSION_MISMATCH"
                );
            }

            // ===============================
            // Normalize vector
            // ===============================

            const magnitude = Math.sqrt(
                embedding.reduce(
                    (sum, value) => sum + value * value,
                    0
                )
            );

            if (magnitude === 0) {
                throw new AppError(
                    "Embedding vector has zero magnitude.",
                    502,
                    "INVALID_EMBEDDING_VECTOR"
                );
            }

            const normalizedEmbedding = embedding.map(
                value => value / magnitude
            );

            return normalizedEmbedding;

        } catch (error) {

            // Preserve our own AppErrors
            if (error instanceof AppError) {
                throw error;
            }

            console.error(
                "Gemini Embedding Error:",
                error.response?.data || error.message
            );

            throw new AppError(
                "Failed to generate embedding.",
                503,
                "EMBEDDING_SERVICE_UNAVAILABLE"
            );
        }
    }
}

module.exports = new EmbeddingService();