require("dotenv").config();
const path = require("path");

const pdfLoader = require("../src/rag/documentLoader/pdfLoader");
const chunker = require("../src/rag/chunker");
const embeddingService = require("../src/rag/embeddings");
const vectorStore = require("../src/rag/vectorStore");

async function testVectorStore() {

    try {

        const pdfPath = path.join(
            __dirname,
            "../knowledge/ARK_AI_Company.pdf"
        );

        const document = await pdfLoader.load(pdfPath);

        const chunks = chunker.chunk(document);

        const firstChunk = chunks[0];

        const embedding = await embeddingService.generateEmbedding(
            firstChunk.content
        );

        await vectorStore.storeChunk(
            firstChunk,
            embedding
        );

        console.log("\n========== VECTOR STORE TEST ==========\n");

        console.log("Source :", firstChunk.metadata.source);
        console.log("Chunk :", firstChunk.metadata.chunkIndex);
        console.log("Length :", firstChunk.content.length);

        console.log("\n✅ Chunk stored successfully!");

    } catch (error) {

        console.error(error);

    }

}

testVectorStore();