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