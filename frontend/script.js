const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const chatMessages = document.getElementById("chat-messages");

const BACKEND_URL = "http://localhost:3000/chat";

// Send button
sendButton.addEventListener("click", sendMessage);

// Press Enter
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

    const text = input.value.trim();

    if (text === "") return;

    // Show user message
    addUserMessage(text);

    // Clear input
    input.value = "";

    try {

        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        if (!response.ok) {
            throw new Error("Backend returned an error.");
        }

        const data = await response.json();

        console.log("Backend Response:", data);

        // Show AI reply
        addBotMessage(data.reply);

    } catch (error) {

        console.error(error);

        addBotMessage("⚠️ Sorry, something went wrong. Please try again.");

    }

}

// ----------------------------
// User Message
// ----------------------------

function addUserMessage(text) {

    const message = document.createElement("div");

    message.classList.add("message");
    message.classList.add("user-message");

    message.textContent = text;

    chatMessages.appendChild(message);

    scrollToBottom();

}

// ----------------------------
// Bot Message
// ----------------------------

function addBotMessage(text) {

    const message = document.createElement("div");

    message.classList.add("message");
    message.classList.add("bot-message");

    message.textContent = text;

    chatMessages.appendChild(message);

    scrollToBottom();

}

// ----------------------------
// Auto Scroll
// ----------------------------

function scrollToBottom() {

    chatMessages.scrollTop = chatMessages.scrollHeight;

}