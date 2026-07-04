# 🚀 ARK AI Customer Support Assistant

A full-stack AI customer support chatbot built with HTML, CSS, JavaScript, Node.js, PostgreSQL, n8n, and Ollama.

This project started as a simple chatbot and evolved into a context-aware AI assistant with persistent conversation memory.

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

## 🏗️ Architecture

Frontend (HTML/CSS/JS)
        │
        ▼
Express Backend (REST API — POST /chat)
        │
        ▼
n8n Workflow (webhook trigger)
        │
        ▼
Ollama (Qwen3 8B) — local LLM inference
        │
        ▼
PostgreSQL (support_tickets table)
        │
        ▼
Response rendered back in chat UI


## 🧠 Conversation Memory Flow

Generate persistent Session ID

Store user message in PostgreSQL

Retrieve previous conversation

Build contextual prompt

Send prompt to Ollama

Store assistant response

Return response to frontend

## 🛠️ Tech Stack

Layer

	
Technology


Frontend
	

HTML, CSS, JavaScript


Backend

	
Node.js, Express


Automation

	
n8n


Database

	
PostgreSQL


LLM

	
Ollama + Qwen3:8B


Containerization

	
Docker


## Project Structure

├── index.html          # Chat widget frontend
├── server.js           # Express backend / REST API
├── workflows/
│   └── ark-support.json  # n8n workflow export
└── README.md

## 🚀 Local Setup

### 1. Clone the repository

git clone 
https://github.com/armaankhantech/ark-ai-customer-support-assistant.git

cd ark-ai-customer-support-assistant

### 2. Install backend dependencies

cd backend

npm install

### 3. Start the backend

node server.js

### 4. Open the frontend

Open frontend/index.html in your browser.

## 📸 Demo

<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/d5b4b224-e960-455c-a3f8-77e99cb63b93" />


## 🎯 Day 18 Milestone

✅ Persistent Session IDs

✅ PostgreSQL Conversation Storage

✅ Conversation Retrieval

✅ Prompt Construction from Chat History

✅ Context-Aware AI Responses

✅ Multiple Independent Chat Sessions

✅ Ordered Message History

✅ Assistant Responses Stored in Database

## 📚 What I Learned

Building AI memory is not just storing messages.

It requires session management, conversation retrieval, prompt engineering, response persistence, and workflow orchestration.

## Known Issues


Category classification is unreliable. The AI-driven category tagging currently returns "general" for most inputs instead of the correct category. Root cause under investigation — likely related to prompt structure sent to /api/generate vs /api/chat.
No conversation memory yet. Each message is processed independently; the assistant does not retain context across turns. Planned for the next iteration.
Response latency depends on local hardware running Ollama; not optimized for concurrent users.



## Prerequisites

Node.js and npm
Docker (for PostgreSQL)
n8n instance (self-hosted or Docker)
Ollama installed locally with qwen3:8b pulled
ngrok account (for exposing n8n webhook publicly)

## 🔮 Next Steps

Long-term memory summarization

Context window optimization

RAG (Retrieval-Augmented Generation)

User authentication

Admin dashboard

Streaming responses

## 👨‍💻 Author

Armaan Khan

Building AI systems in public 🚀

GitHub: https://github.com/armaankhantech
