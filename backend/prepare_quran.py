import os
import json
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
CSV_PATH = os.path.join(DATA_DIR, "quran_full.csv")
EMBEDDINGS_PATH = os.path.join(DATA_DIR, "verses.npy")
META_PATH = os.path.join(DATA_DIR, "meta.json")

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

if not os.path.exists(CSV_PATH):
    raise FileNotFoundError(f"Missing {CSV_PATH}")

df = pd.read_csv(CSV_PATH)

required_cols = {"verse_key", "arabic_text", "english_text"}
missing = required_cols - set(df.columns)
if missing:
    raise ValueError(f"Missing required columns: {missing}")

df = df.fillna("")

texts = df["english_text"].astype(str).tolist()
model = SentenceTransformer(MODEL_NAME)

embeddings = model.encode(
    texts,
    batch_size=64,
    show_progress_bar=True,
    normalize_embeddings=True
).astype(np.float32)

meta = []
for _, row in df.iterrows():
    meta.append({
        "verse_key": str(row["verse_key"]),
        "arabic": str(row["arabic_text"]),
        "english": str(row["english_text"]),
    })

np.save(EMBEDDINGS_PATH, embeddings)

with open(META_PATH, "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=2)

print(f"Saved embeddings to {EMBEDDINGS_PATH}")
print(f"Saved metadata to {META_PATH}")
print(f"Prepared {len(meta)} verses")
