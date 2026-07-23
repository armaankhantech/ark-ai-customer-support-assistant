const path = require("path");

const pdfLoader = require("../src/rag/documentLoader/pdfLoader");
const chunker = require("../src/rag/chunker");
const embeddingService = require("../src/rag/embeddings");

async function testEmbeddingService() {

    try {

        const pdfPath = path.join(
     __dirname,
     "../knowledge/ARK_AI_Company.pdf"
     );

     const document = await pdfLoader.load(pdfPath);

     const chunks = chunker.chunk(document);
     const firstChunk = chunks[0];

     const startTime = Date.now();

     const embedding = await embeddingService.generateEmbedding(
     firstChunk.content
     );
     const endTime = Date.now();

     console.log("\n========== EMBEDDING TEST ==========\n");

     console.log("Source File :", firstChunk.metadata.source);

     console.log("Chunk Index :", firstChunk.metadata.chunkIndex);

     console.log("Chunk Length :", firstChunk.content.length);

     console.log("Embedding Dimensions :", embedding.length);

     console.log("Response Time :", `${endTime - startTime} ms`);

     

     console.log("\nFirst 10 Vector Values:\n");

     console.log(embedding.slice(0, 10));


    } catch (error) {

        console.error(error);

    }

}

testEmbeddingService();