require("dotenv").config();
const { buildContext } = require("./src/services/contextEngine");

async function test() {

    const testMessages = [

        "What are your business hours?",

        "How do I contact support?",

        "What services do you offer?",

        "Can I get a refund?",

        "Continue our previous conversation."

    ];

    for (const message of testMessages) {

        console.log("\n====================================");

        console.log("Message:", message);

        const result = await buildContext(1, message);

        console.log("\nIntent:");

        console.log(result.intent);

        console.log("\nKnowledge:");

      console.log("\nKnowledge:");
console.log(JSON.stringify(result.knowledge, null, 2));

console.log("\nContext:");
console.log(result.context);

    }

}

test();