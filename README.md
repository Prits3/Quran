# 🤖 Quran Verse Finder

AI-powered semantic search for Quran verses. Find relevant verses from the Holy Quran using natural language queries.

## 🌟 Live Demo

🚀 **[Try the App](https://quran-verse-finder.vercel.app)** (Coming soon - currently in beta)

## 📖 About

This app uses machine learning embeddings to understand your queries and find the most relevant Quran verses. Enter questions like:
- "How can I stay patient during hardship?"
- "What does the Quran say about forgiveness?"
- "Verses about trust in Allah"

Get back verses with Arabic text, English translation, and relevance scores.

## 🏗️ Architecture

- **Frontend**: React + Vite
- **Backend**: FastAPI + Sentence Transformers
- **AI Model**: all-MiniLM-L6-v2 for embeddings
- **Deployment**: Vercel (frontend) + Railway (backend)

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prits3/Quran.git
   cd Quran
   ```

2. **Setup backend**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -r backend/requirements.txt
   python backend/prepare_quran.py
   ```

3. **Setup frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Run the app**
   ```bash
   # Terminal 1: Backend
   cd ..
   npm run start-backend

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

5. **Open** http://localhost:5173

## 📊 API Endpoints

- `GET /health` - Check server status
- `POST /recommend` - Get verse recommendations
  ```json
  {
    "text": "patience during hardship",
    "k": 5
  }
  ```

## 🗂️ Project Structure

```
quran/
├── backend/
│   ├── app.py              # FastAPI server
│   ├── prepare_quran.py    # Generate embeddings
│   ├── requirements.txt    # Python dependencies
│   └── data/
│       ├── quran_full.csv  # Quran dataset
│       ├── verses.npy      # Embeddings
│       └── meta.json       # Verse metadata
├── frontend/
│   ├── src/App.jsx         # React app
│   └── package.json        # Node dependencies
├── scripts/
│   ├── setup.js            # Setup script
│   └── start-backend.js    # Backend launcher
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is open source. Please respect Islamic content guidelines.

## 🙏 Acknowledgments

- Quran text from [Quran.com API](https://quran.com/)
- Sentence Transformers by UKPLab
- Built with love for the Muslim community

---

**Made with ❤️ for seekers of knowledge**