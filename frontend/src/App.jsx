import { useState } from "react";

const API = import.meta.env.VITE_API_BASE || "";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch(`${API}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: query,
          k: 5,
          candidates: 40,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Search failed");
      }

      if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
        throw new Error("No verses returned");
      }

      setResults(data.results);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "Inter, Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#2e7d32",
          fontSize: "64px",
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        Quran Verse Finder
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "24px",
          color: "#555",
          marginBottom: "36px",
        }}
      >
        Find relevant Quran verses using AI-powered semantic search
      </p>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write anything. This app will always return Quran verses in Arabic and English."
        style={{
          width: "100%",
          minHeight: "180px",
          padding: "18px",
          fontSize: "18px",
          border: "3px solid #2e7d32",
          borderRadius: "10px",
          resize: "vertical",
          boxSizing: "border-box",
          outline: "none",
          background: "#fff",
        }}
      />

      <button
        onClick={handleSearch}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: "18px",
          padding: "18px 24px",
          fontSize: "22px",
          fontWeight: 600,
          border: "none",
          borderRadius: "10px",
          backgroundColor: loading ? "#7cb342" : "#2e7d32",
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Searching..." : "Suggest Verses"}
      </button>

      {error && (
        <div
          style={{
            color: "#d32f2f",
            marginTop: "14px",
            padding: "14px 16px",
            border: "1px solid #d32f2f",
            borderRadius: "10px",
            backgroundColor: "#ffebee",
            fontSize: "18px",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginTop: "28px" }}>
        {results.map((result, index) => (
          <div
            key={`${result.verse_key}-${index}`}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "16px",
              borderRadius: "14px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                color: "#2e7d32",
                fontWeight: 700,
                fontSize: "20px",
                marginBottom: "12px",
              }}
            >
              {result.verse_key}
            </div>

            <div
              style={{
                fontFamily: "serif",
                fontSize: "30px",
                direction: "rtl",
                lineHeight: 1.9,
                color: "#222",
                marginBottom: "16px",
              }}
            >
              {result.arabic}
            </div>

            <div
              style={{
                color: "#444",
                fontSize: "18px",
                lineHeight: 1.7,
                marginBottom: "10px",
              }}
            >
              {result.english}
            </div>

            <div
              style={{
                color: "#777",
                fontSize: "14px",
              }}
            >
              Score: {result.score} · {result.why}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
