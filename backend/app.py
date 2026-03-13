from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import json
from sentence_transformers import SentenceTransformer, CrossEncoder
import torch

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
RERANKER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"

embeddings = np.load(EMBEDDINGS_PATH)

with open(META_PATH, "r", encoding="utf-8") as f:
    meta = json.load(f)

model = SentenceTransformer(MODEL_NAME)

# Try to load reranker, fallback to None
try:
    reranker = CrossEncoder(RERANKER_MODEL)
    reranker_available = True
except Exception:
    reranker = None
    reranker_available = False


class RecommendRequest(BaseModel):
    text: str
    k: int = 3
    candidates: int = 40


@app.get("/")
def root():
    return {"message": "Quran Verse Finder API"}


@app.get("/health")
def health():
    return {
        "ok": True,
        "verses": len(meta),
        "reranker": reranker_available
    }


@app.post("/recommend")
def recommend(req: RecommendRequest):
    text = req.text.strip()

    if len(text.split()) < 10:
        raise HTTPException(
            status_code=400,
            detail="Please enter at least 10 words to provide enough context for meaningful recommendations."
        )

    k = max(1, min(req.k, 10))
    candidates = max(req.candidates, k)

    # Get embeddings similarity
    q_vec = model.encode([text])
    scores = np.dot(embeddings, q_vec.T).flatten()

    # Get top candidates
    top_indices = np.argsort(scores)[::-1][:candidates]
    candidates_data = [(i, scores[i]) for i in top_indices]

    if reranker_available and len(candidates_data) > k:
        # Rerank with cross-encoder
        candidate_texts = [meta[i]["english"] for i, _ in candidates_data]
        pairs = [[text, candidate] for candidate in candidate_texts]
        rerank_scores = reranker.predict(pairs)

        # Combine scores
        combined = [(i, score + rerank_scores[j]) for j, (i, score) in enumerate(candidates_data)]
        combined.sort(key=lambda x: x[1], reverse=True)
        top_indices = [i for i, _ in combined[:k]]
    else:
        top_indices = [i for i, _ in candidates_data[:k]]

    results = []
    for i in top_indices:
        verse = meta[i]
        score = float(scores[i])

        # Generate simple explanation
        why = f"Matches query with semantic similarity score {score:.3f}"
        if reranker_available:
            why += " (reranked for relevance)"

        results.append({
            "verse_key": verse["verse_key"],
            "arabic": verse["arabic"],
            "english": verse["english"],
            "score": round(score, 4),
            "why": why
        })

    return {"query": text, "results": results}