# ARK AI Customer Support Assistant

An AI-powered customer support chat system: a browser chat widget talks to an Express backend, which triggers an n8n workflow that retrieves conversation history, grounds responses in real business data, runs a local LLM (Ollama / Qwen3 8B), and logs everything to PostgreSQL.

**Status: v1 — working end-to-end pipeline with conversation memory and business knowledge grounding, active development**
The assistant remembers prior messages within a session, answers business-specific questions (hours, services, refund policy) from a trusted data source instead of guessing, and responds with "I don't have that information" when asked something outside that data. Category classification is currently non-functional (hardcoded) — see Known Issues.


## ✨ Features

💬 Real-time AI chat interface

🧠 Persistent conversation memory

🆔 Session-based chat history

🗄️ PostgreSQL message storage

🔄 Conversation retrieval & prompt construction

🏢 Business knowledge grounding (companyInfo.js as single source of truth)

🛡️ Hallucination fallback for out-of-scope questions

📏 Rolling 20-message context window

🤖 Ollama (Qwen3:8B) integration

⚡ n8n workflow automation

📜 Ordered chat history

👥 Multiple independent chat sessions

📊 Support ticket logging

## NEW FEATURES ADDED :

Instead of simply sending messages to an AI model, the project focuses on building a **production-style chatbot**, including:

- Premium chat UI
  
- AI workflow automation
  
- Long-term memory
  
- Session management
  
- Backend API
  
- Responsive user experience
  
- Professional frontend interactions


  ## 🎨 Premium UI

Inspired by modern AI applications like:

- ChatGPT
- Claude
- Gemini

Current UI includes:

- Modern chat layout
- Rounded message bubbles
- Responsive design
- Professional color palette

## Architecture

Frontend (HTML/CSS/JS)

│

▼

Express Backend (REST API — POST /chat)
— passes companyInfo.js data along with every request

│

▼

n8n Workflow (webhook trigger)

│

├─▶ Insert user message → messages table

│

├─▶ Retrieve conversation history (by session_id)

│

├─▶ Count messages → apply rolling 20-message window

│

├─▶ Build prompt (company info + conversation history + current message)

│

▼

Ollama (Qwen3 8B) — local LLM inference, grounded in company data

│

├─▶ Insert assistant response → messages table

│

├─▶ Insert ticket → support_tickets table

│

▼

Response returned to Express → rendered in chat UI

## 🧠 Conversation Memory Flow

Generate persistent Session ID

Store user message in PostgreSQL

Retrieve previous conversation (rolling 20-message window)

Build contextual prompt grounded in company data

Send prompt to Ollama

Store assistant response

Return response to frontend

## Tech Stack


Frontend: HTML5, CSS3, JavaScript
Backend: Node.js, Express.js
Automation: n8n
AI: Ollama running Qwen3 8B (local inference, think: false mode)
Database: PostgreSQL — two tables: messages (conversation history) and support_tickets (ticket log)
Tunneling: ngrok (for exposing local n8n webhook)


## Known Issues


**Category classification is not currently functional.** Category is hardcoded to "general" in the workflow. The original zero-shot classification attempt was unreliable (e.g. "i can't login" was classified as "cancellation" instead of "account_access") and was dropped entirely when the prompt pipeline was rebuilt to support conversation memory, rather than shipping two half-working features at once. Re-implementing classification without breaking memory is planned.
**No authentication on session IDs**. Session IDs are generated client-side and stored in localStorage with no server-side validation. Anyone who obtains or guesses a session ID can read or append to that conversation's history. Acceptable for a portfolio v1; would need fixing before any real deployment.
Business knowledge is static, not dynamic. companyInfo.js is hardcoded into the deployed backend. Updating business hours, services, or refund policy requires a code change and redeploy — there's no admin interface or database-backed config yet. Fine for a portfolio demo, not production-grade.
Response latency depends on local hardware running Ollama; not optimized for concurrent users.


## Setup

## Prerequisites


Node.js and npm
Docker (for PostgreSQL)
n8n instance (self-hosted or Docker)
Ollama installed locally with qwen3:8b pulled
ngrok account (for exposing local n8n webhook)


### Steps


Clone this repo :

git clone :

https://github.com/armaankhantech/ark-ai-customer-support-assistant.git

cd ark-ai-customer-support-assistant

Install backend dependencies:

cd backend

npm install

Start Ollama: ollama serve

Start your PostgreSQL container and create the messages and support_tickets tables

Import the n8n workflow (workflows/ark-support.json) into your n8n instance

Start an ngrok tunnel pointing to your n8n webhook

In backend/server.js, set WEBHOOK_URL to your ngrok tunnel URL

Edit backend/companyInfo.js with your own business details

Start the Express server:

node server.js

Open frontend/index.html in a browser


## Project Structure

├── backend/

│   ├── server.js          # Express backend / REST API
│   ├── companyInfo.js     # Business knowledge — single source of truth
│   ├── package.json
│   └── package-lock.json

├── frontend/
│   ├── index.html         # Chat widget UI
│   ├── script.js          # Session handling + fetch calls to backend
│   ├── style.css
│   └── assets/

├── workflows/
│   └── ark-support.json   # n8n workflow export

└── README.md

## 📸 Demo

<img width="1911" height="929" alt="Image" src="https://github.com/user-attachments/assets/2e71caaf-d7b0-4a33-a4da-be5932dddb7a" />
<img width="1919" height="915" alt="Image" src="https://github.com/user-attachments/assets/15a01f09-33d9-4f48-a48f-a58d30ed5afa" />

## 📚 What I Learned

Building AI memory is not just storing messages.

It requires session management, conversation retrieval, prompt engineering, response persistence, and workflow orchestration.

Grounding an AI in trusted data is not just adding more context to a prompt. It requires a single source of truth, a clear path for that data to reach the model on every request, and an explicit instruction for the model to admit what it doesn't know instead of guessing.

## Roadmap


 Re-implement category classification without breaking conversation memory
 Add authentication / server-side validation for session IDs
 Add basic rate limiting on Express layer
 Deploy frontend to GitHub Pages
 Rolling conversation window (last 20 messages)
 Conversation summarization for long sessions beyond the rolling window
 Move business knowledge from static file to database-backed config


## Author

Armaan Khan — building in public, AI Automation Engineering journey.
[GitHub](https://github.com/armaankhantech) · [Twitter/X](https://twitter.com/armaankhantech)
