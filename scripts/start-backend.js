const { spawn } = require('child_process');
const path = require('path');

console.log('Starting backend...');

const backendProcess = spawn(path.join(__dirname, '..', '.venv', 'bin', 'uvicorn'), ['backend.app:app', '--reload'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..')
});

backendProcess.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});