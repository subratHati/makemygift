import { customAlphabet } from 'nanoid';
import { Gift } from '../models/Gift.js';
import { isConnected } from '../db.js';

// short, URL-safe, unambiguous ids (no look-alike characters)
const newId = customAlphabet('abcdefghijkmnpqrstuvwxyz23456789', 10);

// in-memory fallback so the API runs without a database
const memory = new Map();

function sanitize(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  delete o._id;
  delete o.__v;
  return o;
}

export const giftStore = {
  async create(data) {
    const publicId = newId();
    if (isConnected()) {
      const doc = await Gift.create({ ...data, publicId });
      return sanitize(doc);
    }
    const now = new Date();
    const record = {
      publicId,
      status: 'draft',
      openCount: 0,
      lastOpenedAt: null,
      revealType: 'photo',
      theme: 'window-modern',
      occasion: 'Birthday',
      title: '',
      fromName: '',
      message: '',
      closingLine: '',
      mirrorQuestion: '',
      mediaUrl: '',
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    memory.set(publicId, record);
    return { ...record };
  },

  async getByPublicId(publicId) {
    if (isConnected()) {
      const doc = await Gift.findOne({ publicId });
      return sanitize(doc);
    }
    const rec = memory.get(publicId);
    return rec ? { ...rec } : null;
  },

  // records an open without ever blocking playback (gifts are replayable)
  async recordOpen(publicId) {
    if (isConnected()) {
      const doc = await Gift.findOneAndUpdate(
        { publicId },
        { $inc: { openCount: 1 }, $set: { lastOpenedAt: new Date() } },
        { new: true }
      );
      return sanitize(doc);
    }
    const rec = memory.get(publicId);
    if (!rec) return null;
    rec.openCount = (rec.openCount || 0) + 1;
    rec.lastOpenedAt = new Date();
    memory.set(publicId, rec);
    return { ...rec };
  },
};
