const embeddingService = require("../embeddings");
const vectorStore = require("../vectorStore");
const config = require("./retrieverConfig");

class Retriever {

    async retrieve(question) {

        const embedding =
        await embeddingService.generateEmbedding(
        question
    );

    const results =
    await vectorStore.similaritySearch(
        embedding,
        config.topK
    );

    return results.map(result => ({

    source: result.source,

    chunkIndex: result.chunk_index,

    content: result.content,

    score: result.distance

}));

}

}
module.exports = new Retriever();