from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import json
import os
import hashlib
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
EMBEDDINGS_PATH = os.path.join(DATA_DIR, "verses.npy")
META_PATH = os.path.join(DATA_DIR, "meta.json")
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

app = FastAPI(title="Quran Verse Finder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists(EMBEDDINGS_PATH):
    raise RuntimeError("Missing backend/data/verses.npy. Run prepare_quran.py first.")

if not os.path.exists(META_PATH):
    raise RuntimeError("Missing backend/data/meta.json. Run prepare_quran.py first.")

embeddings = np.load(EMBEDDINGS_PATH).astype(np.float32)

with open(META_PATH, "r", encoding="utf-8") as f:
    meta = json.load(f)

def normalize_rows(x: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(x, axis=1, keepdims=True) + 1e-12
    return x / norms

embeddings = normalize_rows(embeddings)
model = SentenceTransformer(MODEL_NAME)

class RecommendRequest(BaseModel):
    text: str = ""
    k: int = 5
    candidates: int = 40

@app.get("/")
def root():
    return {"message": "Quran Verse Finder API"}

@app.get("/health")
def health():
    return {"ok": True, "verses": len(meta)}

def clean_text(value: str) -> str:
    return str(value or "").strip()

def fallback_index(text: str, total: int) -> int:
    if total == 0:
        return 0
    base = text if text else "quran-guidance"
    digest = hashlib.sha256(base.encode("utf-8")).hexdigest()
    return int(digest, 16) % total

@app.post("/recommend")
def recommend(req: RecommendRequest):
    text = clean_text(req.text)
    k = max(1, min(int(req.k or 5), 10))
    candidates = max(k, min(int(req.candidates or 40), len(meta)))

    if len(meta) == 0:
        return {"query": text, "results": []}

    query_text = text if text else "guidance hope mercy patience peace forgiveness"

    try:
        q_vec = model.encode([query_text], normalize_embeddings=True).astype(np.float32)[0]
        scores = embeddings @ q_vec

        n = min(candidates, len(scores))
        if n <= 0:
            raise ValueError("No candidates available")

        top_idx = np.argpartition(-scores, n - 1)[:n]
        top_idx = top_idx[np.argsort(-scores[top_idx])]
        selected = top_idx[:k]

        results = []
        for i in selected:
            verse = meta[int(i)]
            results.append({
                "verse_key": verse.get("verse_key", ""),
                "arabic": verse.get("arabic", ""),
                "english": verse.get("english", ""),
                "score": round(float(scores[int(i)]), 4),
                "why": "semantic match to your text"
            })

        if results:
            return {"query": text, "results": results}

    except Exception:
        pass

    i = fallback_index(text, len(meta))
    verse = meta[i]
    return {
        "query": text,
        "results": [{
            "verse_key": verse.get("verse_key", ""),
            "arabic": verse.get("arabic", ""),
            "english": verse.get("english", ""),
            "score": 0.0,
            "why": "fallback verse"
        }]
    }
