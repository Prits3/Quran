import { useState } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async () => {
    const response = await fetch('http://localhost:8001/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: query, k: 5 })
    })
    const data = await response.json()
    setResults(data.results)
  }

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
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query (e.g., patience during hardship)"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '10px',
          border: '2px solid #2e7d32',
          borderRadius: '5px',
          fontSize: '16px'
        }}
      />
      <button onClick={handleSearch} style={{
        padding: '12px 24px',
        backgroundColor: '#2e7d32',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '100%'
      }}>Suggest Verses</button>
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
            <small style={{ color: '#777' }}>Score: {result.score}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App