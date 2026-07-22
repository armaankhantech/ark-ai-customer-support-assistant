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
- Streaming (typewriter) AI responses
- Markdown rendering
- Syntax highlighted code blocks
- Copy code button
- Auto-resizing textarea
- Typing indicator
- Auto-scroll
- Session persistence using Local Storage

---

## ⚙ Backend Features

- Layered Express.js architecture
- REST API
- Environment variables
- Centralized configuration
- Logger utility
- Error handling middleware
- Service layer
- Controller layer
- Route layer
- PostgreSQL integration
- n8n webhook integration
- Rule-Based Intent Classifier
- Intent-Specific Knowledge Retrieval
- Modular Context Builder
- Formatter Registry Pattern
- Production-Ready Architecture
- Reduced Prompt Size
- Future-Ready Design for RAG Integration

---

## 🚀 ARK AI Customer Support Assistant — Performance Benchmark :
| Metric | Before (Day 26) | After (Day 27) | Improvement |
| --- | --- | --- | --- |
| **LLM Model** | Qwen3:4B | Llama 3.2:3B | ✅ Better fit for hardware |
| **Prompt Size** | ~2157 characters | ~989 characters | **↓ 54%** |
| **Context Strategy** | Entire Business Knowledge | Intent-Based Context Retrieval | ✅ Optimized |
| **Knowledge Retrieval** | Load all tables | Load only relevant table | ✅ Efficient |
| **Average Response Time** | ~31 seconds | **2.37 seconds** | **🚀 ~13× Faster** |
| **Response Quality** | Reasoning leaked into output, inconsistent | Direct, concise, accurate | ✅ Improved |
| **Architecture** | Static Knowledge Loading | Modular Context Engine | ✅ Production-ready |
| **Scalability** | Difficult to extend | Ready for RAG & new data sources | ✅ Future-proof |

## ✨ What's New
Added a scalable PostgreSQL knowledge schema:
-Company
-Services
-FAQs
-Policies
-Contacts

- Created knowledgeService.js to load business knowledge dynamically
-Refactored the n8n workflow into modular stages:
-Prepare Knowledge
-Prepare Conversation
-Build Prompt
-HTTP Request
-Built a dynamic prompt builder that injects live business information from the database.
-Eliminated hardcoded company data from the AI pipeline.

---

# 🏗 Architecture

```
Frontend (HTML/CSS/JavaScript)
            │
            ▼
Express REST API
            │
            ▼
Routes
            │
            ▼
Controller
            │
            ▼
Service Layer
            │
            ▼
n8n Workflow
            │
    ┌───────┼──────────────────────┐
    │       │                      │
    ▼       ▼                      ▼
PostgreSQL  Prompt Builder    Ollama (Qwen3 8B)
    │                              │
    └──────────────┬───────────────┘
                   ▼
          AI Response Returned
                   │
                   ▼
              Frontend UI
```

---

# 📂 Project Structure

```
ARK AI
│
├── backend
│   │
│   ├── src
│   │   │
│   │   ├── config
│   │   │     └── env.js
│   │   │
│   │   ├── controllers
│   │   │     └── chatController.js
│   │   │
│   │   ├── services
│   │   │     └── ollamaService.js
│   │   │
│   │   ├── routes
│   │   │     └── chatRoutes.js
│   │   │
│   │   ├── middleware
│   │   │     └── errorHandler.js
│   │   │
│   │   ├── database
│   │   │     └── postgres.js
│   │   │
│   │   ├── prompts
│   │   │     └── systemPrompt.js
│   │   │
│   │   ├── utils
│   │   │     └── logger.js
│   │   │
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend
│   ├── assets
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── workflows
│   └── ark-support.json
│
└── README.md
```

---

# 🧠 Conversation Memory Flow

```
User Message

↓

Express API

↓

n8n Workflow

↓

Store User Message

↓

Retrieve Previous Messages

↓

Rolling Context Window

↓

Build AI Prompt

↓

Ollama (Qwen3 8B)

↓

Store AI Response

↓

Return Response

↓

Frontend
```

---

# 🛠 Tech Stack

| Layer | Technology |
|---------|------------|
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

---

## 2. Install Backend Dependencies

```bash
cd backend

npm install
```

---

## 3. Install Ollama

Download Ollama and pull the model:

```bash
ollama pull qwen3:8b
```

Start Ollama:

```bash
ollama serve
```

---

## 4. Start PostgreSQL

Run PostgreSQL locally or using Docker.

Create required tables:

- messages
- support_tickets

---

## 5. Import n8n Workflow

Import

```
workflows/ark-support.json
```

into your n8n instance.

---

## 6. Create Environment Variables

Create

```
backend/.env
```

Example:

```env
PORT=3000

N8N_WEBHOOK_URL=https://your-ngrok-url/webhook/ark-support

POSTGRES_HOST=localhost

POSTGRES_USER=postgres

POSTGRES_PASSWORD=your_password

POSTGRES_DB=ark_ai

OLLAMA_URL=http://localhost:11434
```

---

## 7. Start Express Server

```bash
node server.js
```

---

## 8. Open Frontend

Open

```
frontend/index.html
```

inside your browser.

---

# 🔄 Request Flow

```
User

↓

Frontend

↓

Express Route

↓

Controller

↓

Service

↓

n8n Workflow

↓

PostgreSQL

↓

Ollama

↓

Express

↓

Frontend
```

---

# 📸 Screenshots

## Chat Interface
```

```
<img width="634" height="936" alt="Image" src="https://github.com/user-attachments/assets/6d208fd8-69f2-4397-96af-9daade3f1fd6" />
<img width="1099" height="910" alt="Image" src="https://github.com/user-attachments/assets/4aacd55f-4b37-4762-acb4-349e96627646" />
<img width="1911" height="929" alt="Image" src="https://github.com/user-attachments/assets/2e71caaf-d7b0-4a33-a4da-be5932dddb7a" />
<img width="1919" height="915" alt="Image" src="https://github.com/user-attachments/assets/15a01f09-33d9-4f48-a48f-a58d30ed5afa" />

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

[GitHub](https://github.com/armaankhantech)
· [Twitter/X](https://twitter.com/armaankhantech)
 
