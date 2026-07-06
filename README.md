# ARK AI Customer Support Assistant

An AI-powered customer support chat system: a browser chat widget talks to an Express backend, which triggers an n8n workflow that retrieves conversation history, runs a local LLM (Ollama / Qwen3 8B), and logs everything to PostgreSQL.

**Status: v1 — working end-to-end pipeline with conversation memory, active development.**
The assistant remembers prior messages within a session and responds with that context. Category classification is currently non-functional (hardcoded) — see Known Issues.

---

## ✨ Features

💬 Real-time AI chat interface

🧠 Persistent conversation memory

🆔 Session-based chat history

🗄️ PostgreSQL message storage

🔄 Conversation retrieval & prompt construction

🤖 Ollama (Qwen3:8B) integration

⚡ n8n workflow automation

📜 Ordered chat history

👥 Multiple independent chat sessions


📊 Support ticket logging


## Architecture


Frontend (HTML/CSS/JS)

│

▼

Express Backend (REST API — POST /chat)

│

▼

n8n Workflow (webhook trigger)

│

├─▶ Insert user message → messages table

│

├─▶ Retrieve full conversation history (by session_id)

│

├─▶ Build prompt from history

│

▼

Ollama (Qwen3 8B) — local LLM inference

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

Retrieve previous conversation

Build contextual prompt

Send prompt to Ollama

Store assistant response

Return response to frontend

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Automation:** n8n
- **AI:** Ollama running Qwen3 8B (local inference, `think: false` mode)
- **Database:** PostgreSQL — two tables: `messages` (conversation history) and `support_tickets` (ticket log)
- **Tunneling:** ngrok (for exposing local n8n webhook)

## Known Issues

- **Category classification is not currently functional.** Category is hardcoded to `"general"` in the workflow. The original zero-shot classification attempt was unreliable (e.g. "i can't login" was classified as "cancellation" instead of "account_access") and was dropped entirely when the prompt pipeline was rebuilt to support conversation memory, rather than shipping two half-working features at once. Re-implementing classification without breaking memory is planned.
- **No authentication on session IDs.** Session IDs are generated client-side and stored in `localStorage` with no server-side validation. Anyone who obtains or guesses a session ID can read or append to that conversation's history. Acceptable for a portfolio v1; would need fixing before any real deployment.
- Response latency depends on local hardware running Ollama; not optimized for concurrent users.


## Setup

### Prerequisites
- Node.js and npm
- Docker (for PostgreSQL)
- n8n instance (self-hosted or Docker)
- Ollama installed locally with `qwen3:8b` pulled
- ngrok account (for exposing local n8n webhook)


### Steps
1. Clone this repo :
git clone :
https://github.com/armaankhantech/ark-ai-customer-support-assistant.git
cd ark-ai-customer-support-assistant

2. Install backend dependencies:
cd backend
npm install
3. Start Ollama: `ollama serve`
4. Start your PostgreSQL container and create the `messages` and `support_tickets` tables
5. Import the n8n workflow (`workflows/ark-support.json`) into your n8n instance
6. Start an ngrok tunnel pointing to your n8n webhook
7. In `backend/server.js`, set `WEBHOOK_URL` to your ngrok tunnel URL
8. Start the Express server:
node server.js
9. Open `frontend/index.html` in a browser


## Project Structure

├── backend/

│   ├── server.js          # Express backend / REST API
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

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/d5b4b224-e960-455c-a3f8-77e99cb63b93" />


## 📚 What I Learned

Building AI memory is not just storing messages.

It requires session management, conversation retrieval, prompt engineering, response persistence, and workflow orchestration.


## Roadmap

- [ ] Re-implement category classification without breaking conversation memory
- [ ] Add authentication / server-side validation for session IDs
- [ ] Add basic rate limiting on Express layer
- [ ] Deploy frontend to GitHub Pages
- [ ] Rolling conversation window / summarization for long sessions

## Author

Armaan Khan — building in public, AI Automation Engineering journey.
[GitHub](https://github.com/armaankhantech) · [Twitter/X](https://twitter.com/armaankhantech)
