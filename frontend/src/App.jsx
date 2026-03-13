import { useState } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  const handleSearch = async () => {
    setError('')
    try {
      const response = await fetch('/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: query, k: 5, candidates: 40 })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Search failed')
      }

      const data = await response.json()
      setResults(data.results)
    } catch (err) {
      setError(err.message)
    }
  }

  const wordCount = query.trim().split(/\s+/).filter(word => word.length > 0).length
  const canSearch = wordCount >= 10

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#2e7d32', textAlign: 'center' }}>Quran Verse Finder</h1>
      <p style={{ textAlign: 'center', color: '#555' }}>Find relevant Quran verses using AI-powered semantic search</p>

      <div style={{ marginBottom: '10px', fontSize: '14px', color: wordCount < 10 ? '#d32f2f' : '#2e7d32' }}>
        Word count: {wordCount} (minimum 10 words required)
      </div>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a detailed description (at least 10 words) of what you're looking for in the Quran. For example: 'I am struggling with patience during difficult times and want to find verses that help me trust in Allah's plan and remain steadfast in my faith.'"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '10px',
          border: `2px solid ${wordCount < 10 ? '#d32f2f' : '#2e7d32'}`,
          borderRadius: '5px',
          fontSize: '16px',
          minHeight: '100px',
          resize: 'vertical'
        }}
      />

      <button
        onClick={handleSearch}
        disabled={!canSearch}
        style={{
          padding: '12px 24px',
          backgroundColor: canSearch ? '#2e7d32' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: canSearch ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          width: '100%'
        }}
      >
        Suggest Verses
      </button>

      {error && (
        <div style={{
          color: '#d32f2f',
          marginTop: '10px',
          padding: '10px',
          border: '1px solid #d32f2f',
          borderRadius: '5px',
          backgroundColor: '#ffebee'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {results.map((result, index) => (
          <div key={index} style={{
            border: '1px solid #ddd',
            padding: '15px',
            marginBottom: '10px',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <strong style={{ color: '#2e7d32' }}>{result.verse_key}</strong><br />
            <em style={{
              fontFamily: 'serif',
              fontSize: '18px',
              direction: 'rtl',
              display: 'block',
              margin: '10px 0',
              color: '#333'
            }}>{result.arabic}</em><br />
            <span style={{ color: '#555' }}>{result.english}</span><br />
            <small style={{ color: '#777' }}>
              Score: {result.score} | {result.why}
            </small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App