import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { connectDB, isConnected } from './db.js';
import giftsRouter from './routes/gifts.js';

export const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'makemygift-server', db: isConnected() ? 'mongodb' : 'in-memory', env: config.nodeEnv });
});

app.use('/api/gifts', giftsRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

export async function start() {
  await connectDB();
  return app.listen(config.port, () => {
    console.log(`[makemygift-server] listening on http://localhost:${config.port}`);
  });
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) start();
