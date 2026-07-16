/* ======================================================
   ARK AI Frontend V2
   Part 3.1 - Foundation
====================================================== */

/* ===============================
   DOM Elements
=============================== */

const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const chatMessages = document.getElementById("chat-messages");


/* ===============================
   Backend Configuration
=============================== */

const API_URL = "http://localhost:3000/chat";

/* ===============================
   Session
=============================== */

let sessionId = localStorage.getItem("ark-session-id");

if (!sessionId) {

    sessionId = crypto.randomUUID();

    localStorage.setItem("ark-session-id", sessionId);

}

/* ===============================
   Time
=============================== */

function getCurrentTime() {

    return new Date().toLocaleTimeString([], {

        hour: "2-digit",
        minute: "2-digit"

    });

}

/* ===============================
   Scroll
=============================== */

function scrollToBottom() {

    chatMessages.scrollTop = chatMessages.scrollHeight;

}

/* ===============================
   Auto Resize Textarea
=============================== */

messageInput.addEventListener("input", () => {

    messageInput.style.height = "auto";

    messageInput.style.height = messageInput.scrollHeight + "px";

});

/* ===============================
   Welcome
=============================== */
window.addEventListener("DOMContentLoaded", () => {

    console.log("ARK AI Loaded");

    appendMessage(
        "👋 Welcome to ARK AI. How can I help you today?",
        "ai"
    );

});
/* ===============================
   Create Message Component
=============================== */

function createMessage(text, sender = "ai") {

    const message = document.createElement("div");
    message.className = `message ${sender}`;

    // Avatar (only for AI)
    let avatarHTML = "";

    if (sender === "ai") {
        avatarHTML = `
            <div class="message-avatar">
                🤖
            </div>
        `;
    }

    // Name
    const name = sender === "ai" ? "ARK AI" : "You";

    message.innerHTML = `
        ${avatarHTML}

        <div class="message-content">

            <div class="message-meta">

                <span>${name}</span>

                <span>${getCurrentTime()}</span>

            </div>

        <div class="message-bubble">

        ${
            sender === "ai"
              ? marked.parse(text)
              : text
        }

        </div>
        </div>
    `;

    return message;

}

/* ===============================
   Append Message
=============================== */

function appendMessage(text, sender = "ai") {

    const message = createMessage(text, sender);

    chatMessages.appendChild(message);
    highlightCode();

    scrollToBottom();

}

/* ===============================
   Stream AI Message
=============================== */

async function streamMessage(text) {

    // Create an empty AI message
    const message = createMessage("", "ai");

    chatMessages.appendChild(message);

    scrollToBottom();

    // Find the bubble inside the message
    const bubble = message.querySelector(".message-bubble");

    // Type one character at a time
    let current = "";

   for (let i = 0; i < text.length; i++) {

    current += text.charAt(i);

    bubble.innerHTML = marked.parse(current);

    highlightCode();
    addCopyButtons();

    scrollToBottom();
    

    let delay = 15;

    if (text[i] === ".") delay = 100;
    else if (text[i] === ",") delay = 60;
    else if (text[i] === "\n") delay = 80;

    await new Promise(resolve => setTimeout(resolve, delay));

}
}

/* ===============================
   Loading Statex   
=============================== */
let typingElement = null;

function setLoading(isLoading) {

    const sendButton = document.getElementById("send-btn");

    if (isLoading) {

        sendButton.disabled = true;
        messageInput.disabled = true;

        sendButton.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i>`;

        if (!typingElement) {

            typingElement = document.createElement("div");

            typingElement.className = "message ai";

            typingElement.innerHTML = `
                <div class="message-avatar">🤖</div>

                <div class="message-content">

                    <div class="message-bubble typing-bubble">

                        <span></span>
                        <span></span>
                        <span></span>

                    </div>

                </div>
            `;

            chatMessages.appendChild(typingElement);

            scrollToBottom();

        }

    } else {

        sendButton.disabled = false;
        messageInput.disabled = false;

        messageInput.disabled = false;

        sendButton.innerHTML =
            `<i class="fa-solid fa-paper-plane"></i>`;

        if (typingElement) {

            typingElement.remove();

            typingElement = null;

        }

        messageInput.focus();

    }

}

/* ===============================
   Get AI Response
=============================== */

async function getAIResponse(message) {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                sessionId,
                message
            })

        });

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data = await response.json();

        console.log("API Response:", data);

        return data;

    }

    catch(error){

        console.error(error);

        return null;

    }

}
async function sendMessage() {

    const text = messageInput.value.trim();

    if (!text) return;

    appendMessage(text, "user");

    messageInput.value = "";
    messageInput.style.height = "auto";

    setLoading(true);

    const result = await getAIResponse(text);

    setLoading(false);

    if (!result) return;
    console.log("RESULT:", result);
console.log("TYPE:", typeof result);
console.log("REPLY:", result.reply);
console.log("AI:", result.ai_response);

    await streamMessage(result.reply);


}


/* ===============================
   Form Submit
=============================== */

chatForm.addEventListener("submit", function (e) {

    e.preventDefault();

    sendMessage();

});
/* ===============================
   Keyboard Shortcuts
=============================== */

messageInput.addEventListener("keydown", function (e) {

    // Shift + Enter → New Line
    if (e.key === "Enter" && e.shiftKey) {
        return;
    }

    // Enter → Send
    if (e.key === "Enter") {

        e.preventDefault();

        sendMessage();

    }

});

/* ===============================
   Highlight Code
=============================== */

function highlightCode() {

    document.querySelectorAll("pre code").forEach(block => {

        hljs.highlightElement(block);

    });

}
/* ===============================
   Add Copy Buttons
=============================== */

function addCopyButtons() {

    document.querySelectorAll("pre").forEach(pre => {

        if (pre.querySelector(".copy-btn")) return;

        const button = document.createElement("button");

        button.className = "copy-btn";

        button.textContent = "Copy";

        button.onclick = async () => {

            await navigator.clipboard.writeText(

                pre.querySelector("code").innerText

            );

            button.textContent = "Copied!";

            setTimeout(() => {

                button.textContent = "Copy";

            },1500);

        };

        pre.appendChild(button);

    });

}