const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Setting up Quran Verse Finder...');

// Check if .venv exists, create if not
if (!fs.existsSync('.venv')) {
  console.log('Creating Python virtual environment...');
  execSync('python -m venv .venv', { stdio: 'inherit' });
}

// Install Python dependencies
console.log('Installing Python dependencies...');
execSync('source .venv/bin/activate && pip install -r backend/requirements.txt', { stdio: 'inherit' });

// Check if embeddings exist, generate if not
if (!fs.existsSync('backend/data/verses.npy') || !fs.existsSync('backend/data/meta.json')) {
  console.log('Generating embeddings (this may take a few minutes)...');
  execSync('source .venv/bin/activate && python backend/prepare_quran.py', { stdio: 'inherit' });
}

// Install root npm dependencies (concurrently)
console.log('Installing npm dependencies...');
execSync('npm install', { stdio: 'inherit' });

// Install frontend npm dependencies
console.log('Installing frontend dependencies...');
execSync('cd frontend && npm install', { stdio: 'inherit' });

console.log('Setup complete! Run `npm run dev` to start the servers.');