# 🤖 Quran Verse Finder

AI-powered semantic search for Quran verses. Given a 10+ word description, this app suggests 3–5 relevant Quran passages using local Sentence-Transformers embeddings and an optional Cross-Encoder reranker. No paid APIs.

## Quickstart

```bash
npm install
npm run dev
```

That's it. On first run the setup script will:

- Create a Python virtual environment (.venv)
- Install pip dependencies (backend/requirements.txt)
- Build verse embeddings (downloads models — may take a few minutes the first time)
- Install frontend npm packages

Once ready, both servers start concurrently:

- API → http://localhost:8001
- UI → http://localhost:5173

Open http://localhost:5173, enter 10+ words, click Suggest Verses.

## Manual setup (optional)

### Backend
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
python backend/prepare_quran.py
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8001
```

### Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

## Prerequisites

- Python 3.10+ (3.11/3.12/3.13 OK)
- Node 18+

## Project structure

```
quran-verse-finder/
├─ package.json               # Root: npm run dev starts everything
├─ scripts/
│  ├─ setup.js               # Auto-creates venv, installs deps, builds embeds
│  └─ start-backend.js       # Launches uvicorn from the venv
├─ backend/
│  ├─ app.py                 # FastAPI app (GET /, /health, POST /recommend)
│  ├─ prepare_quran.py       # Build embeddings from CSV (runs once)
│  ├─ requirements.txt
│  ├─ smoke_test.py          # Quick local test for recommend()
│  ├─ test_api.py            # Tiny HTTP test for running server
│  └─ data/
│     ├─ quran_full.csv      # Quran CSV (verse_key,arabic_text,english_text)
│     ├─ verses.npy          # auto-generated embeddings
│     └─ meta.json           # verse metadata
└─ frontend/
   ├─ index.html
   ├─ vite.config.js          # Proxies /recommend, /health to backend
   ├─ package.json
   └─ src/
      ├─ main.jsx
      └─ App.jsx
```

## API reference

- `GET /` → basic info
- `GET /health` → `{ ok, verses, reranker }`
- `POST /recommend`
  - Request: `{ text: string, k?: number (default 3), candidates?: number (default 40) }`
  - Response: `{ query, results: [{ verse_key, arabic, english, score, why }] }`

## Swap in the full Quran

Replace `backend/data/quran_full.csv` with a full CSV (columns: verse_key,arabic_text,english_text).  
Delete `backend/data/verses.npy` and `backend/data/meta.json`.  
Run `npm run dev` again — embeddings rebuild automatically.

## Troubleshooting

- **"Failed to fetch" in the UI** — Ensure backend is running; the Vite proxy forwards /recommend to port 8001.
- **400 "Please enter at least 10 words"** — Provide more context in your description.
- **Slow first run** — Models download on first use; embeddings build can take a few minutes.
- **Reranker not available** — Cross-encoder loads automatically if available.

## Notes

- Works offline after first model download and embedding build.
- Optional reranker (Cross-Encoder) loads automatically if available.
- To index paragraphs instead of verses, preprocess the CSV to paragraph rows and re-run prepare_quran.py.