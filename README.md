# 🤖 ARK AI — AI Customer Support Assistant

> **ARK AI V1.0 — Public Release 🚀**

An AI-powered customer support assistant designed to answer business-specific questions using **company knowledge, RAG, conversation memory, long-term memory, context engineering, and streaming AI responses**.

Built end-to-end as a **production-oriented portfolio project** using modern AI, backend, database, and automation technologies.

<p align="center">

  <a href="https://ark-ai-customer-support-assistant-1.onrender.com/">
    <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Try%20ARK%20AI-6C63FF?style=for-the-badge" alt="Live Demo">
  </a>

  <a href="https://github.com/armaankhantech/ark-ai-customer-support-assistant/releases/tag/v1.0.0">
    <img src="https://img.shields.io/badge/Version-v1.0.0-00C853?style=for-the-badge" alt="Version">
  </a>

  <img src="https://img.shields.io/badge/Status-Public%20Release-2196F3?style=for-the-badge" alt="Status">

</p>

<p align="center">

  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/n8n-Automation-EA4B71?logo=n8n&logoColor=white" alt="n8n">
  <img src="https://img.shields.io/badge/Groq-Llama%203.3%2070B-F55036?logo=meta&logoColor=white" alt="Groq">

</p>

---

# 📸 SCREENSHOTS

## 💬 Main Chat Interface


<p align="center">
 <img width="1919" height="909" alt="Image" src="https://github.com/user-attachments/assets/d33cef03-8222-43c1-84a2-b9c0faa45293" />
</p>

---

## 🤖 AI Customer Support Response

<p align="center">
  <img width="1919" height="918" alt="Image" src="https://github.com/user-attachments/assets/f1d00b7a-f4cf-456a-b048-628c056ac342" />
</p>

---

## 📚 RAG / Knowledge Retrieval

<p align="center">
  <img width="1917" height="980" alt="Image" src="https://github.com/user-attachments/assets/52c711ac-6800-4607-bce0-a02591c320c8" />
</p>

---

## 🧠 Conversation Memory

<p align="center">
  <img width="1920" height="1006" alt="Image" src="https://github.com/user-attachments/assets/6923daad-ceeb-4add-815e-bb7c5a7ba933" />
</p>

---

## Video Demo

<https://github.com/user-attachments/assets/16ce7011-544c-42cd-83fe-21efcc470d1a>

---


# ⚠️ READ THIS BEFORE USING THE LIVE DEMO

> **ARK AI V1.0 is a portfolio and demonstration project.**
>
> It is intentionally deployed using **free-tier and self-hosted infrastructure**. The application is designed to demonstrate AI engineering, automation, backend architecture, RAG, memory, and deployment  **not to provide production-grade service guarantees**.

## 💤 1. Render Free-Tier Cold Start

The public backend is deployed using **Render's Free Web Service**.

Render automatically spins down a Free Web Service after **15 minutes without inbound traffic**.

When someone opens ARK AI after the service has been inactive, the first request wakes the service back up. Render states that this startup normally takes **about one minute**.

Therefore:

```text
User opens ARK AI
       ↓
Server may be sleeping
       ↓
First request wakes server
       ↓
~ startup delay
       ↓
ARK AI becomes available
       ↓
Normal usage
```

### What this means

If the website appears to take a while to load initially, **this is expected behavior of the Render Free tier and does not necessarily indicate an application failure.**

Once the service is running, subsequent requests should not experience that initial cold-start delay.

Render also notes that Free Web Services have a **750-hour monthly included runtime allowance**, plus other free-tier restrictions.

**Official documentation:**
https://render.com/docs/free

---

# 🆓 2. Free Infrastructure

ARK AI V1.0 intentionally uses free or self-hosted infrastructure wherever practical.

Current infrastructure includes:

| Component        | Infrastructure          | Purpose                                     |
| ---------------- | ----------------------- | ------------------------------------------- |
| 🌐 Frontend      | HTML / CSS / JavaScript | Chat interface                              |
| ⚙️ Backend       | Node.js + Express.js    | API and application logic                   |
| 🗄️ Database     | PostgreSQL / Supabase   | Conversations, knowledge & application data |
| 🔎 Vector Search | pgvector                | Semantic retrieval / RAG                    |
| 🔄 Automation    | Self-hosted n8n         | Workflow orchestration                      |
| 🧠 LLM           | GPT-OSS-120B via Groq  | AI generation                               |
| 🚀 Deployment    | Render Free             | Public backend deployment                   |
| 🧠 AI API        | Groq                    | LLM inference                               |

Because these services are free-tier or self-hosted, **availability, quotas, latency, storage, and throughput are limited.**

---

# 🧠 3. OpenAI GPT-OSS-120B Model


ARK AI currently uses:

Model:
gpt-oss-120b

The model is an open-weight reasoning model released by OpenAI and is used by ARK AI as the primary production AI model.

Model Specifications
117B total parameters
5.1B active parameters per token
128 total experts
4 experts active per token
128K-token context window
36 transformer layers
Mixture-of-Experts (MoE) architecture
Low / Medium / High reasoning levels
Supports tool use and agentic workflows
Apache 2.0 license

OpenAI lists the context length as approximately 128K tokens for GPT-OSS-120B.

Important: API & Rate Limits

Unlike models accessed through the OpenAI API, gpt-oss-120b is an open-weight model.

It is not served through the OpenAI API, meaning:

OpenAI API pricing does not apply
OpenAI API rate limits do not apply
Inference depends on the infrastructure/provider running the model
Hosting-provider limits may still apply

This distinction is important for ARK AI's production deployment.

Current ARK AI Configuration
Primary Production Model
        ↓
gpt-oss-120b
        ↓
AI Customer Support
        ↓
RAG + Context Engine
        ↓
PostgreSQL + pgvector
        ↓
Response

ARK AI also uses a separate lightweight local model for its
long-term-memory workflow:

Conversation
      ↓
n8n
      ↓
Llama 3.2 3B
      ↓
Memory Extraction
      ↓
PostgreSQL
What can happen?

If the infrastructure hosting gpt-oss-120b experiences:

High traffic
Provider quota exhaustion
GPU capacity limitations
Network failures
Provider downtime

the AI request may fail or become slower.

Possible symptoms include:

AI response unavailable
Temporary request failure
Timeout
Slow response
Provider rate-limit error

This does not necessarily mean the ARK AI backend is broken.

The issue may originate from the infrastructure serving the model.

For model specifications and deployment information, see the official OpenAI and Hugging Face model documentation.

OpenAI Model Information:
https://openai.com/index/introducing-gpt-oss/

Hugging Face Model:
https://huggingface.co/openai/gpt-oss-120b

---

# 🗄️ 4. Supabase Free Tier

ARK AI uses PostgreSQL infrastructure through Supabase for persistent application data.

The current Supabase Free Plan includes:

| Resource                  |           Free Plan |
| ------------------------- | ------------------: |
| PostgreSQL Database       |          **500 MB** |
| Egress                    |            **5 GB** |
| File Storage              |            **1 GB** |
| Cached Egress             |            **5 GB** |
| Monthly Active Users      |          **50,000** |
| Realtime Messages         | **2 million/month** |
| Peak Realtime Connections |             **200** |

Supabase also states that Free projects can be paused after **one week of inactivity**.

For ARK AI V1.0, these limits are more than sufficient for demonstration purposes, but they are **not intended to support unrestricted production traffic**.

Official documentation:

https://supabase.com/docs

---

# 🔄 5. Self-Hosted n8n

ARK AI uses **self-hosted n8n** for workflow orchestration.

Because the n8n instance is self-hosted, its practical limits depend on the machine/server running it.

Factors include:

* CPU
* RAM
* Storage
* Docker configuration
* Concurrent executions
* Workflow complexity
* Database performance
* Network availability

Therefore, the public ARK AI demo should not be treated as an unlimited automation platform.

---

# 🔐 6. PLEASE DON'T SUBMIT SENSITIVE INFORMATION

ARK AI V1.0 is a public portfolio demonstration.

**Do not enter:**

* Passwords
* API keys
* Authentication tokens
* Payment information
* Credit/debit card details
* Confidential company information
* Private customer information
* Sensitive personal information

Use fictional or non-sensitive information when testing the chatbot.

---

# 🚀 LIVE DEMO

## 👉 Try ARK AI

**https://ark-ai-customer-support-assistant-1.onrender.com/**

### Recommended testing sequence

Try:

```text
1. Open ARK AI
        ↓
2. Wait for the server to wake if necessary
        ↓
3. Ask a company-specific question
        ↓
4. Ask a follow-up question
        ↓
5. Test conversation memory
        ↓
6. Test a knowledge/document question
        ↓
7. Test an unknown question
        ↓
8. Try the interface on mobile
```

### Example conversation

**User:**

> What are your business hours?

**ARK AI:**

> Provides the business hours from its available knowledge.

Then ask:

> Are they the same on weekends?

The second question tests whether ARK AI can use the **previous conversation context** instead of treating every message as an isolated request.

---

# 🎯 WHAT PROBLEM DOES ARK AI SOLVE?

Businesses often have information distributed across:

```text
FAQs
Documents
Policies
Databases
Business information
Previous conversations
Support knowledge
```

Traditional support systems often require customers to manually search through this information.

ARK AI provides a conversational interface:

```text
Customer
   │
   │ "What is your refund policy?"
   ▼
┌─────────────────────┐
│       ARK AI        │
└─────────────────────┘
   │
   ├── Conversation Memory
   ├── Business Knowledge
   ├── RAG Retrieval
   ├── Context Engineering
   └── AI Reasoning
   │
   ▼
Context-aware response
```

The goal is not simply:

> **"Send a question to an LLM."**

The goal is:

> **"Build a complete system around an LLM."**

---

# ✨ KEY FEATURES

### 💬 AI Customer Support

Answers customer questions through a conversational interface.

### 🧠 Conversation Memory

Maintains relevant previous messages so conversations remain contextual.

### 🗃️ Long-Term Memory

Important conversation information can be summarized and persisted for future contextual use.

### 📚 RAG

Retrieves relevant information from the knowledge base before generating an answer.

### 🔎 PostgreSQL + pgvector

Stores structured information and supports vector-based semantic retrieval.

### 🔄 n8n Automation

Uses workflow automation to orchestrate parts of the AI pipeline.

### 🧩 Context Engine

Selects and prepares relevant information before sending it to the LLM.

### 📝 Prompt Engineering

Uses structured system instructions and dynamically assembled context.

### ⚡ Streaming Responses

AI responses can be displayed progressively rather than waiting for the entire response.

### 🆔 Session-Based Conversations

Individual conversations are separated using session identifiers.

### 📱 Responsive UI

Designed for desktop, tablet, and mobile experiences.

---

# 🏗️ SYSTEM ARCHITECTURE

```text
                         👤 CUSTOMER
                             │
                             ▼
                 ┌──────────────────────┐
                 │    ARK AI FRONTEND   │
                 │ HTML / CSS / JS      │
                 └──────────┬───────────┘
                            │
                            │ HTTP
                            ▼
                 ┌──────────────────────┐
                 │    EXPRESS.JS API    │
                 │      BACKEND         │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   CONTEXT ENGINE     │
                 └──────────┬───────────┘
                            │
              ┌─────────────┼──────────────┐
              │             │              │
              ▼             ▼              ▼
        🧠 Memory       📚 RAG        🗄️ Knowledge
              │             │              │
              └─────────────┼──────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    PROMPT BUILDER    │
                 │ Dynamic Context      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │      n8n FLOW        │
                 │ Workflow Automation  │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    GROQ API          │
                 │ Llama 3.3 70B        │
                 └──────────┬───────────┘
                            │
                            │ Streaming
                            ▼
                 ┌──────────────────────┐
                 │     EXPRESS API      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    ARK AI CHAT UI    │
                 └──────────────────────┘
```

---

# 🔄 COMPLETE REQUEST FLOW

When a customer sends a message:

```text
1️⃣ Customer sends message

        ↓

2️⃣ Frontend sends request

        ↓

3️⃣ Express receives request

        ↓

4️⃣ Session is identified

        ↓

5️⃣ Conversation history is retrieved

        ↓

6️⃣ Relevant knowledge is retrieved

        ↓

7️⃣ RAG searches relevant information

        ↓

8️⃣ Context Engine prepares relevant context

        ↓

9️⃣ Prompt Builder creates the AI prompt

        ↓

🔟 n8n orchestrates the workflow

        ↓

1️⃣1️⃣ Groq processes the request

        ↓

1️⃣2️⃣ Llama 3.3 70B generates response

        ↓

1️⃣3️⃣ Response streams through backend

        ↓

1️⃣4️⃣ Frontend displays response

        ↓

1️⃣5️⃣ Conversation is persisted
```

---

# 🧠 HOW MEMORY WORKS

ARK AI separates memory into multiple layers.

```text
                    CONVERSATION
                         │
                         ▼
                ┌─────────────────┐
                │ Recent Messages │
                └────────┬────────┘
                         │
                         ▼
                 Short-Term Memory
                         │
                         ▼
                ┌─────────────────┐
                │ Summarization   │
                │ / Long-Term     │
                │ Memory Pipeline │
                └────────┬────────┘
                         │
                         ▼
                    PostgreSQL
```

### Short-Term Memory

Keeps relevant recent conversation messages available for the current interaction.

### Long-Term Memory

Important information can be summarized and persisted instead of continuously sending the entire conversation to the model.

This reduces unnecessary context and helps keep the system more efficient.

---

# 📚 HOW RAG WORKS

RAG stands for:

> **Retrieval-Augmented Generation**

Instead of asking the LLM to answer everything from its internal knowledge:

```text
User Question
      ↓
Retrieve relevant information
      ↓
Add relevant context
      ↓
Send context + question to LLM
      ↓
Generate grounded answer
```

For ARK AI:

```text
Customer Question
       ↓
Semantic Retrieval
       ↓
Relevant Knowledge
       ↓
Context Engine
       ↓
Prompt
       ↓
Llama 3.3 70B
       ↓
Grounded Response
```

This architecture helps reduce the risk of the model inventing business-specific information.

---

# 🧩 CONTEXT ENGINEERING

One of the biggest lessons from building ARK AI was:

> **More context does not automatically mean better AI.**

Instead of blindly sending everything to the model:

```text
Entire Database
+
Entire Conversation
+
Every FAQ
+
Every Document
+
Every Instruction
```

ARK AI attempts to select relevant information:

```text
User Question
      │
      ▼
What information is actually needed?
      │
      ├── Conversation Context
      ├── Business Knowledge
      ├── Retrieved Documents
      └── System Instructions
              │
              ▼
        Relevant Context
              │
              ▼
             LLM
```

This improves maintainability and can reduce unnecessary prompt processing.

---

# ⚡ STREAMING

Instead of:

```text
User
 ↓
Wait...
 ↓
Wait...
 ↓
Complete response
 ↓
Display everything
```

ARK AI can stream the response:

```text
User
 ↓
AI starts generating
 ↓
"Hello..."
 ↓
"Hello! How..."
 ↓
"Hello! How can I..."
 ↓
"Hello! How can I help..."
 ↓
Complete response
```

This creates a more natural ChatGPT-style experience.

Groq also supports streaming chat completions through its API.

---

# 🗄️ DATA ARCHITECTURE

The application uses PostgreSQL for persistent data.

Conceptually:

```text
                    PostgreSQL
                        │
          ┌─────────────┼──────────────┐
          │             │              │
          ▼             ▼              ▼
    Conversations    Knowledge       Memory
          │             │              │
          ▼             ▼              ▼
       Messages      Documents      Summaries
                                     
                        │
                        ▼
                    pgvector
                        │
                        ▼
                 Semantic Retrieval
```

---

# 🛠️ TECH STACK

| Layer                      | Technology              |
| -------------------------- | ----------------------- |
| 🎨 Frontend                | HTML5, CSS3, JavaScript |
| ⚙️ Backend                 | Node.js, Express.js     |
| 🗄️ Database               | PostgreSQL              |
| 🔎 Vector Search           | pgvector                |
| 🔄 Automation              | n8n                     |
| 🧠 LLM                     | Llama 3.3 70B           |
| ⚡ AI Inference             | Groq API                |
| 🐳 Containers              | Docker                  |
| ☁️ Deployment              | Render                  |
| ☁️ Database Infrastructure | Supabase                |
| 🔐 Configuration           | Environment Variables   |
| 📡 Communication           | REST APIs / Webhooks    |

---

# 📂 PROJECT STRUCTURE

```text
ARK AI
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── prompts/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── assets/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── workflows/
│   └── ark-support.json
│
├── README.md
└── LICENSE
```

> The exact file structure may evolve as ARK AI continues development.

---

# 💻 RUN ARK AI LOCALLY

Want to explore the project yourself?

## 1️⃣ Prerequisites

Install:

* Node.js
* npm
* PostgreSQL
* Docker
* n8n
* Git

For the current AI provider configuration, you'll also need a Groq API key.

---

# 📥 2️⃣ Clone the Repository

Open your terminal:

```bash
git clone https://github.com/armaankhantech/ark-ai-customer-support-assistant.git
```

Move into the project:

```bash
cd ark-ai-customer-support-assistant
```

Verify:

```bash
git status
```

---

# 📦 3️⃣ Install Backend Dependencies

```bash
cd backend
```

Then:

```bash
npm install
```

---

# 🔐 4️⃣ Create Environment Variables

Create:

```text
backend/.env
```

Use `.env.example` as your template.

Example structure:

```env
PORT=3000

GROQ_API_KEY=your_groq_api_key

DATABASE_URL=your_postgresql_connection_string

N8N_WEBHOOK_URL=your_n8n_webhook_url
```

### 🚨 IMPORTANT

Never commit:

```text
.env
```

to GitHub.

Never put real API keys inside:

```text
README.md
JavaScript files
n8n workflows
screenshots
Git commits
```

---

# 🗄️ 5️⃣ Configure PostgreSQL

Create your PostgreSQL database.

Then configure the required database schema used by ARK AI.

The database is responsible for persistent application data such as:

```text
Conversation data
Knowledge data
Memory
Vector data
Support-related records
```

> Use the current SQL/schema files in the repository as the source of truth for the V1.0 database structure.

---

# 🔄 6️⃣ Configure n8n

Start your self-hosted n8n instance.

Import the workflow from:

```text
workflows/ark-support.json
```

Then configure the required credentials and webhook settings.

Your architecture should look approximately like:

```text
Express
   ↓
n8n Webhook
   ↓
ARK AI Workflow
   ↓
Database / Retrieval / Memory
   ↓
LLM
```

---

# 🧠 7️⃣ Configure Groq

Create your own Groq API key.

Then add it to:

```text
backend/.env
```

```env
GROQ_API_KEY=your_key_here
```

The current ARK AI model configuration uses:

```text
llama-3.3-70b-versatile
```

Do **not** put your API key directly in source code.

---

# ▶️ 8️⃣ Start the Backend

From:

```text
backend/
```

run:

```bash
node server.js
```

Your backend should start on:

```text
http://localhost:3000
```

---

# 🌐 9️⃣ Open the Frontend

Open the frontend through a local development server rather than relying on `file://` when possible.

For example, using VS Code's Live Server or another local static server:

```text
frontend/
```

Then open the displayed local URL.

---

# 🩺 1️⃣0️⃣ Test the Backend

Check:

```text
GET /health
```

Expected behavior:

```text
Backend
  ↓
Health endpoint
  ↓
Healthy response
```

Then test the chat endpoint through the frontend.

---

# 🧪 TESTING CHECKLIST

Before considering a local deployment successful:

### Basic

* [ ] Backend starts
* [ ] Frontend loads
* [ ] `/health` responds
* [ ] Chat request succeeds

### Memory

* [ ] Session is created
* [ ] Previous messages are retrieved
* [ ] Follow-up questions use context

### Knowledge

* [ ] Business-specific questions retrieve relevant data
* [ ] RAG returns relevant information
* [ ] Unknown information is handled safely

### Streaming

* [ ] Response begins streaming
* [ ] UI updates progressively
* [ ] Final response renders correctly

### Error Handling

* [ ] Invalid request handled
* [ ] Missing configuration handled
* [ ] AI provider failure handled
* [ ] Database failure handled

---

# 📊 PERFORMANCE & ENGINEERING JOURNEY

ARK AI was not built in one attempt.

The system went through multiple optimization cycles.

### Earlier architecture

```text
Large Prompt
+
Large Context
+
Larger Local Model
+
More Processing
```

This resulted in slower responses.

### Optimized architecture

```text
User Question
      ↓
Relevant Context
      ↓
Smaller / Better Prompt
      ↓
Optimized Workflow
      ↓
Faster Inference
      ↓
Streaming Response
```

### Biggest performance lesson

> **Profile first. Optimize second.**

During development, inference and pipeline timing were benchmarked to identify where latency was actually being introduced rather than assuming that n8n, the database, or the model was automatically responsible.

---

# 🧠 WHAT I LEARNED BUILDING ARK AI

Building ARK AI taught me that an AI application is much more than an LLM API call.

### 1. AI is a system

```text
LLM
+
Database
+
Retrieval
+
Memory
+
Backend
+
Automation
+
Frontend
=
AI Application
```

### 2. Context matters

Giving an LLM more information is not always better.

The right information at the right time is more useful.

### 3. Memory is an architecture problem

Conversation memory requires:

* Session management
* Data persistence
* Retrieval
* Context selection
* Summarization
* Prompt construction

### 4. RAG is not just vector search

A useful RAG system requires:

```text
Question
 ↓
Retrieval
 ↓
Relevance
 ↓
Context
 ↓
Prompt
 ↓
Generation
```

### 5. Performance requires profiling

Instead of guessing:

> "n8n is slow."

or:

> "The database is slow."

Measure the pipeline and identify the actual bottleneck.

### 6. Production thinking starts before production

Even a portfolio project should consider:

* Error handling
* Security
* Configuration
* Logging
* Memory
* Scalability
* Deployment
* Observability
* Failure scenarios

---

# ⚠️ CURRENT LIMITATIONS

ARK AI V1.0 is **not a production SaaS platform**.

Current limitations include:

### Infrastructure

* Render Free cold starts
* Free-tier resource limits
* Self-hosted n8n availability
* External API quotas
* Limited database resources

### Security

The V1.0 portfolio architecture should not be treated as a hardened enterprise deployment.

Future production work should include stronger:

* Authentication
* Authorization
* Session validation
* Rate limiting
* Abuse prevention
* Secret management
* Security monitoring
* Audit logging

### Scalability

The current free infrastructure is designed for:

> **Demonstration → Portfolio → Learning → Recruiter/Client Evaluation**

not:

> **Thousands of concurrent production customers.**

---

# 🛡️ SECURITY PRINCIPLES

Never commit:

```text
.env
API keys
Database passwords
OAuth secrets
Private tokens
Production credentials
```

Use:

```text
.env
```

locally and:

```text
.env.example
```

for documentation.

Example:

```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=your_database_url_here
N8N_WEBHOOK_URL=your_webhook_url_here
```

---

# 🗺️ ROADMAP

## ✅ V1.0 — Completed

* [x] Responsive AI chat interface
* [x] Express backend
* [x] PostgreSQL integration
* [x] Session-based conversations
* [x] Conversation memory
* [x] Long-term memory
* [x] RAG
* [x] pgvector
* [x] Context engine
* [x] Prompt engineering
* [x] Streaming responses
* [x] n8n workflow automation
* [x] LLM integration
* [x] Performance optimization
* [x] Production-oriented architecture
* [x] Public deployment
* [x] GitHub V1.0 release

## 🔮 Future Versions

Potential future improvements:

* [ ] Authentication
* [ ] Server-side session validation
* [ ] API rate limiting
* [ ] Advanced monitoring
* [ ] Better observability
* [ ] Admin dashboard
* [ ] Analytics
* [ ] Multi-business support
* [ ] Improved document ingestion
* [ ] Advanced RAG evaluation
* [ ] Automated testing
* [ ] Production-grade infrastructure
* [ ] Horizontal scaling

---

# 📚 RESOURCES

### AI / LLM

* Groq Documentation
  https://console.groq.com/docs

* Llama 3.3 70B Documentation
  https://console.groq.com/docs/model/llama-3.3-70b-versatile

### Database

* PostgreSQL
  https://www.postgresql.org/

* Supabase
  https://supabase.com/docs

* pgvector
  https://github.com/pgvector/pgvector

### Automation

* n8n Documentation
  https://docs.n8n.io/

### Deployment

* Render Documentation
  https://render.com/docs

### Development

* Node.js
  https://nodejs.org/

* Express.js
  https://expressjs.com/

* Docker
  https://docs.docker.com/

---

# 📜 VERSION

Current release:

```text
ARK AI V1.0.0
```

Release:

**ARK AI V1.0 — Public Release**

The V1.0 release represents the first publicly deployed milestone of the project.

---

# 👩‍💻 AUTHOR

## Armaan Khan

Building in public while learning and developing in:

**AI Automation • AI Engineering • Backend Systems • AI Applications**

### Connect with me

* 💻 GitHub: https://github.com/armaankhantech
* 💼 LinkedIn: https://www.linkedin.com/in/armaankhan-tech/
* 🐦 X / Twitter: https://twitter.com/armaankhantech

---

# ⭐ SUPPORT THE PROJECT

If ARK AI helped you understand how AI applications can be built around:

**RAG + Memory + Automation + Databases + LLMs**

consider giving the repository a ⭐ on GitHub.

If you have feedback:

> **What would you improve first in ARK AI?**

I'd love to hear it.

---

<p align="center">

### 🚀 Build → Learn → Debug → Optimize → Deploy → Repeat

**ARK AI V1.0**

</p>
