// Import the classifier
const { classifyIntent } = require("./src/context/intentClassifier");

// Test questions
const testMessages = [

    "What are your business hours?",

    "How do I contact support?",

    "What services do you offer?",

    "Can I get a refund?",

    "Continue our previous conversation.",

    "Tell me a joke."

];

// Test every message
testMessages.forEach(message => {

    const intent = classifyIntent(message);

    console.log("----------------------------");
    console.log("Message :", message);
    console.log("Intent  :", intent);

});