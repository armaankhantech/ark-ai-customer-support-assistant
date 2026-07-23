const path = require("path");

const pdfLoader = require("../src/rag/documentLoader/pdfLoader");

const chunker = require("../src/rag/chunker");

async function testChunker() {

    try {

        const pdfPath = path.join(
            __dirname,
            "../knowledge/ARK_AI_Company.pdf"
        );

        const document = await pdfLoader.load(pdfPath);

        const chunks = chunker.chunk(document);

        console.log("\n========== CHUNKER TEST ==========\n");

        console.log("Document :", document.fileName);
        console.log("Characters :", document.text.length);
        console.log("Chunks Created :", chunks.length);

        console.log("\n========== FIRST CHUNK ==========\n");
        console.log(chunks[0]);

        console.log("\n========== SECOND CHUNK ==========\n");
        console.log(chunks[1]);

        console.log("\n========== LAST CHUNK ==========\n");
        console.log(chunks[chunks.length - 1]);

        const chunkLengths = chunks.map(chunk => chunk.content.length);

        console.log("\n========== STATISTICS ==========\n");

        console.log("Smallest Chunk :", Math.min(...chunkLengths));
        console.log("Largest Chunk :", Math.max(...chunkLengths));
        console.log("Configured Chunk Size :", 500);
        console.log("Configured Overlap :", 100);

    } catch (error) {

        console.error(error);

    }

}

testChunker();