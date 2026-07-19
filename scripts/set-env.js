const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const envConfig = {};

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    envConfig[key] = value;
  }
}

const get = (key, fallback) => envConfig[key] || fallback;

const devContent = `export const environment = {
  baseUrl: '${get('BASE_URL', 'http://localhost:80/')}',
  wsBaseUrl: '${get('WS_BASE_URL', 'ws://localhost:80/ws')}',
};
`;

const prodContent = `export const environment = {
  baseUrl: '${get('BASE_URL', 'http://localhost:80/')}',
  wsBaseUrl: '${get('WS_BASE_URL', 'ws://localhost:80/ws')}',
};
`;

const envDir = path.resolve(__dirname, '..', 'src', 'environments');
fs.mkdirSync(envDir, { recursive: true });
fs.writeFileSync(path.join(envDir, 'environment.ts'), devContent);
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), prodContent);

console.log('Ô£ô environment.ts and environment.prod.ts generated from .env');
