const retriever = require("../rag/retriever");
const contextCompressor = require("./contextCompressor");
class ContextRetriever {

    async retrieve(question) {

        const retrievedChunks = await retriever.retrieve(question);

        const rawDocumentContext = retrievedChunks
    .map(chunk => chunk.content)
    .join("\n\n");

const documentContext = contextCompressor.compress(
    rawDocumentContext
);
console.log("📄 Raw Context Length:", rawDocumentContext.length);
console.log("🗜️ Compressed Context Length:", documentContext.length);
        return {
            documentContext
        };
    }

}

module.exports = new ContextRetriever();