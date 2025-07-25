# 📦 OneSync Backend

This is the backend service for **OneSync**, a onebox email aggregator platform. It handles real-time email synchronization via IMAP, categorizes emails using an AI model, and stores/searches emails using Elasticsearch.

---

## 📁 Project Structure

```bash
backend/
├── src/
│   ├── ai/
│   │   ├── classifier.ts           # AI logic for categorizing emails
│   │   ├── geminiClient.ts         # Gemini API client instance
│   │   └── types.ts                # Type definitions for AI module
│   ├── elastic/
│   │   ├── client.ts               # Elasticsearch client setup and helpers
│   │   ├── emailIndex.ts           # Email index management for Elasticsearch
│   │   └── types.ts                # Type definitions for Elasticsearch
│   ├── imap/
│   │   ├── config.ts               # IMAP configuration
│   │   ├── emailService.ts         # IMAP email sync logic
│   │   ├── imapClient.ts           # IMAP client instance
│   │   └── types.ts                # Type definitions for IMAP
│   ├── slack/
│   │   └── notify.ts               # Slack notification integration
│   ├── utils/
│   │   ├── logger.ts               # Logging utility
│   │   └── uidTracker.ts           # Utility for tracking IMAP UIDs
│   ├── routes/
│   │   └── search.ts               # Get emails with filters
│   └── index.ts                    # Entry point for backend service
├── .env                            # Environment variables
├── package.json                    # NPM dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── Dockerfile                      # Dockerfile for backend service
├── docker-compose.yml              # Docker Compose configuration
└── README.md                       # Project documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/imtiaj-007/One-Sync.git
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `backend/` directory. Required environment variables:

```env
PORT=8000
IMAP_HOST=imap.example.com
IMAP_PORT=993
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_INDEX=emails

// The following values should be updated

EMAIL_USER_1=test.email1@gmail.com
EMAIL_PASS_1=app_password_1
EMAIL_USER_2=test.email2@gmail.com
EMAIL_PASS_2=app_password_2

GEMINI_API_KEY=your_gemini_api_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

---

## 🚀 Running the Backend

### 1. Start Elasticsearch using Docker

If you don’t already have Elasticsearch running, you can start it using Docker:

```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  docker.elastic.co/elasticsearch/elasticsearch:9.0.4
```

### 2. Start the backend service

```bash
npm run dev
```

This triggers:

* IMAP sync for the last 30 days (with IDLE mode for real-time updates)
* AI-based categorization using Gemini
* Indexing emails into Elasticsearch for fast retrieval
* Webhook integration for pushing "Interested" leads in Slack

---

## 🤖 AI Categorization

The backend uses **Gemini AI** to classify emails into categories like:

* `Interested`
* `Meeting Booked`
* `Not Interested`
* `Out of Office`
* `Promotion`
* `Social`
* `Spam`

You can use the exported `categorizeEmailAI(text)` function from `src/ai/classifier.ts` to run classification manually or on new emails.

---

## 🔍 Search with Elasticsearch

Email metadata and bodies are indexed in Elasticsearch under the `emails` index. Search is optimized for:

* Full-text body and subject search
* Filtering by sender, recipient, timestamp
* Category based filters
* Account based filters

---

## 📬 Email Sync (IMAP)

Email sync is handled via `emailService.ts`, using:

* IMAP fetch (last 30 days)
* Real-time sync with IDLE support
* Auto-reconnect on failure

---

## 📌 Notes

* Written in **TypeScript**
* Uses **Node.js**, **IMAP**, **Gemini AI**, and **Elasticsearch**
* Clean modular design for easy testing and future API expansion

---


## 🗺️ Roadmap

Here are some planned features, improvements, and completed milestones for the backend:

### ✅ Completed

- **IMAP Sync for Last 30 Days**  
  Reliable email synchronization with IDLE mode for real-time updates.

- **AI-based Categorization using Gemini**  
  Automatic email classification with Gemini AI.

- **Elasticsearch Indexing**  
  Fast email search and retrieval via Elasticsearch.

- **Webhook Integration for "Interested" Leads**  
  Pushes qualified leads to Slack in real time.

- **REST API Integration for Email Retrieval**  
  API endpoints for retrieving emails.

### 🧪 Coming Soon

* RAG-powered reply generation

### 🚧 Planned

- [ ] **Admin Dashboard**  
  Web interface for monitoring sync status, errors, and analytics.

- [ ] **Pluggable AI Models**  
  Option to swap out Gemini for other LLMs (OpenAI, local models, etc).

- [ ] **Automated Lead Follow-up**  
  Trigger follow-up emails or actions based on AI categorization.

- [ ] **Unit & Integration Tests**  
  Expand test coverage for all modules.

---

## 📌 Notes

* This backend was built specifically for the ReachInbox OneSync assignment.
* Focused on performance, scalability, and speed.
* Easily extendable for authentication, email previews, or replies.

---

## 🧠 Author

**SK Imtiaj Uddin**
Built as part of the ReachInbox backend engineering assignment ☑️

