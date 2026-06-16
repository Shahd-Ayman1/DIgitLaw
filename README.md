# DigitLaw — المساعد القانوني المصري الذكي

Production-ready Egyptian Legal AI platform with two products:
- **Legal Assistant** — RAG-powered Arabic chat grounded in Egyptian law
- **Contract Analysis** — LLM clause extraction, risk detection, and structured reports

---

## Architecture

```
frontend (Next.js 14)
│
│  POST /chat          POST /contract-analysis
│  GET  /health        GET  /metrics
│
backend (FastAPI + LangGraph)
│
├── Legal Assistant Graph
│   detect_domain → retrieve → generate_answer → verify
│
└── Contract Analysis Graph
    extract → chunk → analyze_clauses → detect_risks → summarize
│
├── Qdrant          (vector store — Egyptian legal articles)
├── BAAI/bge-m3     (dense embeddings, 1024-dim)
├── Groq / llama-3.3-70b  (generation)
└── Redis           (optional: chat history / caching)
```

---

## Quick Start (Docker Compose)

```bash
cp .env.example .env
# Fill in: GROQ_API_KEY, QDRANT_URL (or leave localhost for local Qdrant)

docker compose up --build
```

Services:
- Frontend → http://localhost:3000
- Backend API → http://localhost:8000
- Qdrant UI → http://localhost:6333/dashboard

---

## Corpus Ingestion

After Qdrant is running, ingest your legal corpus:

```bash
cd backend
pip install -r requirements.txt

python ../scripts/ingest.py \
  --input /path/to/legal_corpus.jsonl \
  --qdrant-url http://localhost:6333 \
  --collection egyptian_legal_articles \
  --batch-size 32 \
  --recreate
```

### JSONL format (one record per line)

```json
{
  "chunk_id": "labor_12_2003_art10",
  "doc_id": "labor_12_2003",
  "law_name": "قانون العمل",
  "law_number": "12",
  "law_year": "2003",
  "law_type": "labor_law",
  "category": "labor_law",
  "article_number": "10",
  "text": "نص المادة العاشرة...",
  "context_text": "نص السياق...",
  "cross_references": ["labor_12_2003_art9"]
}
```

**category values that trigger metadata filtering:**
`labor_law`, `tenancy_law`, `personal_status_law`, `criminal_law`, `commercial_law`, `administrative_law`, `civil_law`

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API key |
| `QDRANT_URL` | ✅ | Qdrant server URL |
| `QDRANT_API_KEY` | only for Qdrant Cloud | Qdrant API key |
| `QDRANT_COLLECTION` | default: `egyptian_legal_articles` | Collection name |
| `SECRET_KEY` | ✅ production | JWT signing secret |
| `CORS_ORIGINS` | ✅ production | Allowed frontend origins (JSON array) |
| `REDIS_URL` | optional | Redis for caching |

---

## Backend Development

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

### Run tests

```bash
pytest tests/ -v
```

---

## Frontend Development

```bash
cd frontend
npm install --legacy-peer-deps

NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

---

## Deployment (Render)

1. Push to GitHub.
2. In the Render dashboard, click **New → Blueprint** and point to this repo.
3. Render reads `render.yaml` and creates three services automatically:
   - `digitlaw-backend` (Docker, standard plan)
   - `digitlaw-frontend` (Docker, starter plan)
   - `digitlaw-redis` (managed Redis)
4. Set the following secrets in the Render dashboard for `digitlaw-backend`:
   - `GROQ_API_KEY`
   - `QDRANT_URL` (use [Qdrant Cloud](https://cloud.qdrant.io) free tier)
   - `QDRANT_API_KEY`
5. Add GitHub Actions secrets for CD:
   - `RENDER_BACKEND_DEPLOY_HOOK` — from Render → backend service → Settings → Deploy Hook
   - `RENDER_FRONTEND_DEPLOY_HOOK` — from Render → frontend service → Settings → Deploy Hook

---

## API Reference

### `POST /chat`

```json
{
  "question": "هل يجوز فصل العامل بدون سبب؟",
  "conversation_id": "optional-uuid",
  "stream": false
}
```

Response:
```json
{
  "conversation_id": "uuid",
  "answer": "...",
  "citations": [
    {
      "chunk_id": "...",
      "law_name": "قانون العمل",
      "law_number": "12",
      "law_year": "2003",
      "article_number": "10",
      "text": "...",
      "score": 0.87
    }
  ],
  "domain": "labor_law",
  "faithfulness_score": 0.71,
  "is_fallback": false,
  "warnings": []
}
```

### `POST /chat/stream`

Same body as `/chat`. Returns `text/event-stream` SSE:
- `data: {"type":"token","content":"..."}` — streaming tokens
- `data: {"type":"done","final_answer":"...","citations":[...],"is_fallback":false}` — completion event
- `data: {"type":"error","message":"..."}` — guardrail or server error

### `POST /contract-analysis`

`multipart/form-data` with `file` field (PDF or DOCX, max 15MB).

Returns full `ContractAnalysisResponse` with summary, clause analyses, risks, missing clauses, recommendations, and overall risk level.

### `GET /health`

```json
{"status": "ok", "uptime_seconds": 142.3, "environment": "production", "dependencies": {"qdrant": "ok"}}
```

### `GET /metrics`

Prometheus text format metrics including:
- `digitlaw_requests_total` — request count by endpoint/status
- `digitlaw_chat_latency_seconds` — chat endpoint latency histogram
- `digitlaw_faithfulness_score` — faithfulness score distribution
- `digitlaw_fallback_responses_total` — fallback counter

---

## Guardrails

| Guardrail | Trigger | Action |
|---|---|---|
| Empty retrieval | No relevant articles found | Fallback response, advise contacting lawyer |
| Low faithfulness | Token overlap < 30% | Fallback response, log warning |
| Citation mismatch | Article numbers in answer not in retrieved set | Warning flag in response |
| Unsafe request | Regex match on harmful intent patterns | Block and return safe refusal |

---

## Project Structure

```
digitlaw/
├── backend/
│   ├── app/
│   │   ├── main.py               FastAPI app + middleware wiring
│   │   ├── core/
│   │   │   ├── config.py         Pydantic settings (all env vars)
│   │   │   └── logging.py        JSON structured logging
│   │   ├── middleware/
│   │   │   └── request_context.py  Request ID injection + timing
│   │   ├── schemas/
│   │   │   ├── chat.py           ChatRequest / ChatResponse / Citation
│   │   │   └── contract.py       ContractAnalysisResponse + sub-models
│   │   ├── services/
│   │   │   ├── embedding_service.py  BAAI/bge-m3 wrapper (singleton)
│   │   │   ├── retrieval_service.py  Qdrant search + dedup
│   │   │   ├── llm_service.py        Groq async client (generate + stream)
│   │   │   ├── extraction_service.py PDF/DOCX text extraction
│   │   │   └── contract_chunker.py   Arabic contract clause splitter
│   │   ├── graphs/
│   │   │   ├── legal_assistant/
│   │   │   │   ├── graph.py          LangGraph compiled graph
│   │   │   │   ├── state.py          TypedDict state
│   │   │   │   ├── nodes_domain.py   Domain detection (keyword + score)
│   │   │   │   ├── nodes_retrieval.py  Qdrant retrieval node
│   │   │   │   ├── nodes_generation.py  Prompt build + Groq generation
│   │   │   │   └── nodes_verification.py  All guardrails
│   │   │   └── contract_analysis/
│   │   │       ├── graph.py          LangGraph compiled graph
│   │   │       ├── state.py
│   │   │       ├── nodes_extraction.py
│   │   │       ├── nodes_chunking.py
│   │   │       ├── nodes_clause_analysis.py
│   │   │       ├── nodes_risk_detection.py
│   │   │       └── nodes_summary.py
│   │   └── api/
│   │       ├── chat.py           POST /chat, POST /chat/stream
│   │       ├── contract.py       POST /contract-analysis
│   │       └── system.py         GET /health, GET /metrics
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_domain_detection.py
│   │   ├── test_verification.py
│   │   ├── test_contract_chunker.py
│   │   └── test_integration.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        Root layout (RTL, Cairo font, theme)
│   │   │   ├── page.tsx          Redirect → /chat
│   │   │   ├── chat/page.tsx
│   │   │   ├── contract-analysis/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── components/
│   │   │   ├── app-shell.tsx     Sidebar + mobile nav
│   │   │   ├── theme-provider.tsx
│   │   │   ├── chat-interface.tsx  Streaming chat with citations
│   │   │   ├── citation-card.tsx   Legal article "seal" card
│   │   │   ├── contract-report.tsx Full contract analysis renderer
│   │   │   ├── upload-component.tsx  Drag-and-drop file upload
│   │   │   └── ui/               button, card, badge, textarea
│   │   ├── lib/
│   │   │   ├── api.ts            Typed fetch wrappers + SSE streaming
│   │   │   ├── utils.ts          cn()
│   │   │   ├── domain-labels.ts  Arabic domain name mapping
│   │   │   └── use-chat-history.ts  localStorage history hook
│   │   └── types/api.ts          Full TypeScript type definitions
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── Dockerfile
├── scripts/
│   └── ingest.py                 Corpus ingestion CLI
├── docker-compose.yml
├── render.yaml
├── .env.example
├── .gitignore
└── .github/
    └── workflows/
        ├── ci.yml                Test + build on every push/PR
        └── deploy.yml            Trigger Render deploy hooks on main
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| LLM | Groq `llama-3.3-70b-versatile` |
| Embeddings | `BAAI/bge-m3` (1024-dim dense) |
| Vector DB | Qdrant |
| Graph Orchestration | LangGraph 0.2 |
| Backend | FastAPI + Uvicorn/Gunicorn |
| Frontend | Next.js 14, TypeScript, Tailwind, Radix UI |
| Observability | Prometheus metrics + JSON structured logs |
| Container | Docker + Docker Compose |
| Deployment | Render (Blueprint deployment) |
| CI/CD | GitHub Actions |
