require("dotenv").config();

const path = require("path");

const pdfLoader = require("../documentLoader/pdfLoader");
const chunker = require("../chunker");
const embeddingService = require("../embeddings");
const vectorStore = require("../vectorStore");

async function ingestDocuments() {

    try {

        const pdfPath = path.join(
            __dirname,
            "../../../knowledge/ARK_AI_Company.pdf"
        );

        const document = await pdfLoader.load(pdfPath);

        const chunks = chunker.chunk(document);

        console.log(`Chunks Created: ${chunks.length}\n`);

        for (const chunk of chunks) {

            const embedding =
                await embeddingService.generateEmbedding(
                    chunk.content
                );

            await vectorStore.storeChunk(
                chunk,
                embedding
            );

            console.log(
                `Indexed Chunk ${chunk.metadata.chunkIndex}/${chunks.length}`
            );

        }

        console.log("\n============================");
        console.log("Document indexed successfully!");
        console.log("============================");

    } catch (error) {

        console.error(error);

    }

}

ingestDocuments();