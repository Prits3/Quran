from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import json
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="Quran Verse Finder API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EMBEDDINGS_PATH = "backend/data/verses.npy"
META_PATH = "backend/data/meta.json"
MODEL_NAME = "all-MiniLM-L6-v2"

embeddings = np.load(EMBEDDINGS_PATH)

with open(META_PATH, "r", encoding="utf-8") as f:
    meta = json.load(f)

model = SentenceTransformer(MODEL_NAME)


class Query(BaseModel):
    text: str
    k: int = 5


@app.get("/")
def root():
    return {"message": "Quran Verse Finder API"}


@app.get("/health")
def health():
    return {"ok": True, "verses": len(meta)}


@app.post("/recommend")
def recommend(query: Query):
    text = query.text.strip()

    if not text:
        raise HTTPException(status_code=400, detail="Please enter a search query.")

    k = max(1, min(query.k, 10))

    q_vec = model.encode([text])
    scores = cosine_similarity(q_vec, embeddings)[0]
    idx = np.argsort(scores)[::-1][:k]

    results = []
    for i in idx:
        verse = meta[i]
        results.append({
            "verse_key": verse["verse_key"],
            "arabic": verse["arabic"],
            "english": verse["english"],
            "score": round(float(scores[i]), 4),
        })

    return {"query": text, "results": results}