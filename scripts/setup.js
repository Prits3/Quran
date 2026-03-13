const { execSync } = require('child_process');
const path = require('path');

console.log('Setting up Quran App...');

// Install backend dependencies
console.log('Installing backend dependencies...');
execSync('pip install -r backend/requirements.txt', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

// Install frontend dependencies
console.log('Installing frontend dependencies...');
execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, '..', 'frontend') });

console.log('Setup complete!');