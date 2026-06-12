import mongoose from 'mongoose';
import { config } from './config.js';

let connected = false;

export async function connectDB() {
  if (!config.mongoUri) {
    console.log('[db] No MONGODB_URI — using in-memory store (data resets on restart).');
    return false;
  }
  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 5000 });
    connected = true;
    console.log('[db] Connected to MongoDB.');
    return true;
  } catch (err) {
    console.error('[db] MongoDB connection failed, falling back to in-memory store:', err.message);
    return false;
  }
}

export function isConnected() {
  return connected && mongoose.connection.readyState === 1;
}
