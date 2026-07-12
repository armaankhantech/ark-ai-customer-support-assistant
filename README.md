# ARK AI Customer Support Assistant
 
An AI-powered customer support chat system: a browser chat widget talks to an Express backend, which triggers an n8n workflow that retrieves conversation history, grounds responses in real business data, runs a local LLM (Ollama / Qwen3 8B), and logs everything to PostgreSQL.
 
**Status: v1 — working end-to-end pipeline with conversation memory, business knowledge grounding, and a premium streaming chat UI. Active development.**
 
The assistant remembers prior messages within a session, answers business-specific questions (hours, services, refund policy) from a trusted data source instead of guessing, and responds with "I don't have that information" when asked something outside that data. Category classification is currently non-functional (hardcoded) — see Known Issues.
 
---
 
## ✨ Features
 
- 💬 Real-time AI chat interface with streaming responses
- 🧠 Persistent conversation memory
- 🆔 Session-based chat history
- 🗄️ PostgreSQL message storage
- 🔄 Conversation retrieval & prompt construction
- 🏢 Business knowledge grounding (`companyInfo.js` as single source of truth)
- 🛡️ Hallucination fallback for out-of-scope questions
- 📏 Rolling 20-message context window
- 🤖 Ollama (Qwen3:8B) integration
- ⚡ n8n workflow automation
- 📜 Ordered chat history
- 👥 Multiple independent chat sessions
- 📊 Support ticket logging
Instead of simply sending messages to an AI model, the project focuses on building a **production-style chatbot**, including AI workflow automation, long-term memory, session management, a real backend API, and a polished, responsive frontend.
 
---
 
## 🎨 Premium UI
 
Inspired by modern AI applications like ChatGPT, Claude, and Gemini.
 
- Premium purple UI with glassmorphism
- Responsive layout
- Distinct AI & user message bubbles
- Auto-scroll to latest message
- Auto-resizing input textarea
- Enter to send, Shift+Enter for new line
- Loading state with disabled input
- Typing indicator
- Streaming (typewriter) response effect
- Markdown rendering
- Syntax highlighting for code blocks
- Copy-to-clipboard button on code blocks
---
 
## ✅ Completed
 
**Frontend**
- Premium purple UI
- Glassmorphism
- Responsive layout
- AI & user message bubbles
- Auto-scroll
- Auto-resize
- Enter to send / Shift+Enter
- Loading state
- Typing indicator
- Streaming effect
- Markdown rendering
- Syntax highlighting
- Copy code button
- Error handling
**Backend**
- Express API
- n8n integration
- Ollama integration
- PostgreSQL conversation memory
- Session handling
---
 
## 🚧 Currently Working On
 
- Better animations
- Re-implementing category classification
- Session ID authentication
---
 
 ## Architecture
 
```
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

```
## 🧠 Conversation Memory Flow
 
1. Generate persistent Session ID
2. Store user message in PostgreSQL
3. Retrieve previous conversation (rolling 20-message window)
4. Build contextual prompt grounded in company data
5. Send prompt to Ollama
6. Store assistant response
7. Return response to frontend
---
 
## Tech Stack
 
| Layer | Tech |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Automation | n8n |
| AI | Ollama running Qwen3 8B (local inference, `think: false` mode) |
| Database | PostgreSQL — `messages` (conversation history), `support_tickets` (ticket log) |
| Tunneling | ngrok (for exposing local n8n webhook) |
 
---
 
## Known Issues
 
- **Category classification is not currently functional.** Category is hardcoded to `"general"` in the workflow. The original zero-shot classification attempt was unreliable (e.g. "i can't login" was classified as "cancellation" instead of "account_access") and was dropped entirely when the prompt pipeline was rebuilt to support conversation memory, rather than shipping two half-working features at once. Re-implementing classification without breaking memory is planned.
- **No authentication on session IDs.** Session IDs are generated client-side and stored in `localStorage` with no server-side validation. Anyone who obtains or guesses a session ID can read or append to that conversation's history. Acceptable for a portfolio v1; would need fixing before any real deployment.
- **Business knowledge is static, not dynamic.** `companyInfo.js` is hardcoded into the deployed backend. Updating business hours, services, or refund policy requires a code change and redeploy — there's no admin interface or database-backed config yet. Fine for a portfolio demo, not production-grade.
- **Response latency depends on local hardware running Ollama;** not optimized for concurrent users.
---
 
## Setup
 
### Prerequisites
 
- Node.js and npm
- Docker (for PostgreSQL)
- n8n instance (self-hosted or Docker)
- Ollama installed locally with `qwen3:8b` pulled
- ngrok account (for exposing local n8n webhook)
### Steps
 
1. Clone this repo:
```
   git clone https://github.com/armaankhantech/ark-ai-customer-support-assistant.git
   cd ark-ai-customer-support-assistant
```
 
2. Install backend dependencies:
```
   cd backend
   npm install
```
 
3. Start Ollama:
```
   ollama serve
```
 
4. Start your PostgreSQL container and create the `messages` and `support_tickets` tables.
5. Import the n8n workflow (`workflows/ark-support.json`) into your n8n instance.
6. Start an ngrok tunnel pointing to your n8n webhook.
7. In `backend/server.js`, set `WEBHOOK_URL` to your ngrok tunnel URL.
8. Edit `backend/companyInfo.js` with your own business details.
9. Start the Express server:
```
   node server.js
```
 
10. Open `frontend/index.html` in a browser.
---
 
## Project Structure
 
```
├── backend/
│   ├── server.js          # Express backend / REST API
│   ├── companyInfo.js     # Business knowledge — single source of truth
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── index.html         # Chat widget UI
│   ├── script.js          # Session handling, streaming, markdown + fetch calls
│   ├── style.css
│   └── assets/
│
├── workflows/
│   └── ark-support.json   # n8n workflow export
│
└── README.md
```
 
---
 
## 📸 Demo
 
<img width="1911" height="929" alt="Image" src="https://github.com/user-attachments/assets/2e71caaf-d7b0-4a33-a4da-be5932dddb7a" />
<img width="1919" height="915" alt="Image" src="https://github.com/user-attachments/assets/15a01f09-33d9-4f48-a48f-a58d30ed5afa" />
---
 
## 📚 What I Learned
 
Building AI memory is not just storing messages. It requires session management, conversation retrieval, prompt engineering, response persistence, and workflow orchestration.
 
Grounding an AI in trusted data is not just adding more context to a prompt. It requires a single source of truth, a clear path for that data to reach the model on every request, and an explicit instruction for the model to admit what it doesn't know instead of guessing.
 
Building a streaming, markdown-aware chat UI also surfaced a subtler lesson: rendering partial markdown character-by-character means intermediate states (like a half-typed code fence language tag) are technically invalid input to downstream parsers, and need to be handled deliberately rather than assumed away.
 
---
 
## Roadmap
 
- [ ] Re-implement category classification without breaking conversation memory
- [ ] Add authentication / server-side validation for session IDs
- [ ] Add basic rate limiting on Express layer
- [ ] Deploy frontend to GitHub Pages
- [ ] Conversation summarization for long sessions beyond the rolling window
- [ ] Move business knowledge from static file to database-backed config
---
 
## Author
 
Armaan Khan — building in public, AI Automation Engineering journey.
[GitHub](https://github.com/armaankhantech) · [Twitter/X](https://twitter.com/armaankhantech)
 