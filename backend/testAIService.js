require("dotenv").config();

const { generatePrompt } = require("./src/services/aiService");

async function test() {

    const testMessages = [

        "What services do you offer?",

        "How do I contact support?",

        "What are your business hours?",

        "Can I get a refund?"

    ];

    for (const message of testMessages) {

        console.log("\n========================================");
        console.log("USER:", message);

        const result = await generatePrompt(1, message);

        console.log("\nDetected Intent:");
        console.log(result.intent);

        console.log("\nGenerated Prompt:\n");

        console.log(result.prompt);

    }

}

test();