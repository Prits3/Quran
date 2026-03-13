import pandas as pd
import numpy as np
import json
from sentence_transformers import SentenceTransformer

CSV_PATH = "backend/data/quran_full.csv"
EMBED_PATH = "backend/data/verses.npy"
META_PATH = "backend/data/meta.json"
MODEL_NAME = "all-MiniLM-L6-v2"

print("Loading Quran dataset...")

df = pd.read_csv(CSV_PATH)

# Ensure required columns exist
required_columns = ["verse_key", "arabic_text", "english_text"]
for col in required_columns:
    if col not in df.columns:
        raise ValueError(f"Missing required column: {col}")

texts = df["english_text"].fillna("").tolist()

print("Loading embedding model...")
model = SentenceTransformer(MODEL_NAME)

print("Generating embeddings...")
embeddings = model.encode(texts, show_progress_bar=True)

np.save(EMBED_PATH, embeddings)

print("Building metadata...")

meta = []

for _, row in df.iterrows():
    meta.append({
        "verse_key": str(row["verse_key"]),
        "arabic": str(row["arabic_text"]),
        "english": str(row["english_text"])
    })

with open(META_PATH, "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False)

print(f"Prepared {len(meta)} verses")