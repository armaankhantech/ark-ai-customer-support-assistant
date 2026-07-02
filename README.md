# ARK AI Customer Support Assistant

An AI-powered customer support chat system built with open-source tools: a browser chat widget talks to an Express backend, which triggers an n8n workflow that runs a local LLM (Ollama / Qwen3 8B) and logs every ticket to PostgreSQL.

**Status: v1 — working end-to-end pipeline, active development.**
Messages flow from the chat UI through to the database and back. Known issue: category classification currently defaults to "general" in most cases — this is being actively debugged (see Known Issues below).

---

## Architecture

```
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
```

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **Automation:** n8n
- **AI:** Ollama running Qwen3 8B (local inference, `think: false` mode)
- **Database:** PostgreSQL
- **Tunneling:** ngrok (for exposing local n8n webhook)

## Features

- Chat interface for real-time-feeling user interaction
- REST API endpoint (`POST /chat`) handling frontend requests
- CORS handling via Express middleware
- n8n workflow orchestrating the AI request → response cycle
- Local LLM inference — no external API calls, no per-token cost
- Every conversation logged as a support ticket in PostgreSQL (five fields: [list your actual schema fields here])

## Known Issues

- **Category classification is unreliable.** The model sometimes returns a category and response unrelated to the actual user message — e.g. "i can't login" was classified as "cancellation" instead of "account_access." Confirmed via raw model output, not a parsing bug (the regex correctly extracts what the model returns). Likely cause: zero-shot classification with reasoning mode disabled (`think: false`) gives the model no room to self-correct. Planned fix: add few-shot examples to the prompt, or re-enable reasoning mode and accept the latency tradeoff.
- **No conversation memory yet.** Each message is processed independently.
  
## Setup

### Prerequisites
- Node.js and npm
- Docker (for PostgreSQL)
- n8n instance (self-hosted or Docker)
- Ollama installed locally with `qwen3:8b` pulled
- ngrok account (for exposing n8n webhook publicly)

### Steps
1. Clone this repo
2. Install backend dependencies: `npm install`
3. Set your ngrok URL in `index.html` (see `NGROK_URL` constant at top of file)
4. Start Ollama: `ollama serve`
5. Start your PostgreSQL container
6. Import the n8n workflow JSON (`/workflows/ark-support.json`) into your n8n instance
7. Start ngrok tunnel pointing to n8n
8. Start the Express server: `node server.js`
9. Open `index.html` in a browser

## Project Structure

```
├── index.html          # Chat widget frontend
├── server.js           # Express backend / REST API
├── workflows/
│   └── ark-support.json  # n8n workflow export
└── README.md
```

## Roadmap

- [ ] Fix category classification accuracy
- [ ] Add conversation memory (context across messages)
- [ ] Add basic auth / rate limiting on Express layer
- [ ] Deploy frontend to GitHub Pages

## Author

Armaan Khan — building in public, Day 17 of an AI Automation Engineering journey.
[GitHub](https://github.com/armaankhantech) · [Twitter/X](https://twitter.com/armaankhantech)

