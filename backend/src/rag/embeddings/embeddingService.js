const axios = require("axios");
const config = require("./embeddingConfig");
const AppError = require("../../errors/AppError");
class EmbeddingService {

    async generateEmbedding(text) {

        if (!text || !text.trim()) {
            throw new AppError(
         "Text is required to generate an embedding.",
          400,
         "TEXT_REQUIRED"
      );
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
                throw new AppError(
             "Embedding service did not return an embedding.",
              502,
             "EMBEDDING_GENERATION_FAILED"
             );
                
            }

            return response.data.embedding;

        } catch (error) {

         throw new AppError(
         "Failed to generate embedding.",
          503,
         "EMBEDDING_SERVICE_UNAVAILABLE"
        );

        }

    }

}

module.exports = new EmbeddingService();