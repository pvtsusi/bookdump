import '@babel/polyfill';
import fs from 'fs';
import socketIo from 'socket.io';
import { Auth } from './auth';
import db from './db.js';
import ImageStorage from './imageStorage';
import * as library from './library';
import createServer from './server';

const PORT = process.env.PORT || 5000;

const envOverride = '.env';
if (fs.existsSync(envOverride)) {
  const rows = fs.readFileSync(envOverride).toString().split('\n');
  rows.forEach(row => {
    const [key, val] = row.split('=', 2);
    if (key && val && key.trim() && val.trim()) {
      process.env[key] = val;
    }
  });
}

const requiredEnvVars = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'BUCKET',
  'BUCKET_REGION',
  'ADMIN_NAME',
  'ADMIN_PASS',
  'APP_SECRET',
  'NAME_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`${envVar} environment variable is not set`);
    process.exit(1);
  }
}
const { BUCKET, BUCKET_REGION, ADMIN_NAME, ADMIN_PASS, APP_SECRET, NAME_SECRET } = process.env;

const imageStorage = new ImageStorage(BUCKET, BUCKET_REGION);
const auth = new Auth(APP_SECRET, NAME_SECRET, ADMIN_NAME, ADMIN_PASS);
let io = null;
const getIo = () => io;
const server = createServer(auth, db, getIo, imageStorage, library);
io = socketIo(server);

function socketService(socket) {
  socket.on('validate_session', async data => {
    try {
      await auth.verifyToken(data.token);
      socket.emit('session_validated', { valid: true });
    } catch (err) {
      socket.emit('session_validated', { valid: false });
    }
  });
}

io.on('connection', socketService);

server.listen(PORT);
server.on('listening', () => console.log(`Listening on port ${PORT}`));
