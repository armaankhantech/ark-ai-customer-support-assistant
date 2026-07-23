const axios = require("axios");
const config = require("./embeddingConfig");

class EmbeddingService {

    async generateEmbedding(text) {

        if (!text || !text.trim()) {
            throw new Error("Text is required to generate an embedding.");
        }

        const { model, ollamaUrl, timeout } = config;

        try {

            const response = await axios.post(
                ollamaUrl,
                {
                    model,
                    prompt: text
                },
                {
                    timeout
                }
            );

            if (!response.data.embedding) {
                throw new Error("Embedding was not returned by Ollama.");
            }

            return response.data.embedding;

        } catch (error) {

            throw new Error(
                `Failed to generate embedding: ${error.message}`
            );

        }

    }

}

module.exports = new EmbeddingService();