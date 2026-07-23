require("dotenv").config();

const retriever = require("../src/rag/retriever");

async function testRetriever() {

    try {

        const question = "What services does ARK AI provide?";

        console.log("\n========== RETRIEVER TEST ==========\n");

        console.log("Question:");
        console.log(question);

        console.log("\nSearching...\n");

        const results = await retriever.retrieve(question);

        console.log(`Retrieved ${results.length} chunks\n`);

        results.forEach((result, index) => {

            console.log(`========== RESULT ${index + 1} ==========\n`);

            console.log("Source :", result.source);
            console.log("Chunk  :", result.chunkIndex);
            console.log("Score  :", result.score);

            console.log("\nContent:\n");

            console.log(result.content);

            console.log("\n----------------------------------------\n");

        });

    } catch (error) {

        console.error(error);

    }

}

testRetriever();