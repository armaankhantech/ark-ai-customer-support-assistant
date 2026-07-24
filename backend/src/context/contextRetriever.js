const retriever = require("../rag/retriever");

class ContextRetriever {

    async retrieve(question) {

        const retrievedChunks = await retriever.retrieve(question);

        const documentContext = retrievedChunks
            .map(chunk => chunk.content)
            .join("\n\n");

        return {
            documentContext
        };
    }

}

module.exports = new ContextRetriever();