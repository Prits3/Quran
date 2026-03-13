# Quran Backend

This is the Python FastAPI backend for the Quran app, providing semantic search for Quran verses using embeddings.

## Setup

1. Create and activate virtual environment:
   ```
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Prepare the data:
   ```
   python prepare_quran.py
   ```

## Running

Start the server:
```
uvicorn backend.app:app --reload
```

The server will run on http://127.0.0.1:8000.

## API Endpoints

- `GET /`: Root message.
- `GET /health`: Health check with verse count.
- `POST /recommend`: Semantic search for verses.
  - Body: `{"text": "query string", "k": 5}` (k is number of results, default 5)
  - Returns: List of matching verses with scores.

## Data

- `quran_full.csv`: CSV with columns: verse_key, arabic_text, english_text.
- `verses.npy`: NumPy array of sentence embeddings.
- `meta.json`: List of verse metadata.

## Testing

- `smoke_test.py`: Basic connectivity test (needs update).
- `test_api.py`: Unit tests for API endpoints (needs update).

Run tests with:
```
python -m pytest test_api.py
```