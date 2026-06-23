import { customAlphabet } from 'nanoid';
import { Invitation } from '../models/Invitation.js';
import { isConnected } from '../db.js';

const newId = customAlphabet('abcdefghijkmnpqrstuvwxyz23456789', 10);
const memory = new Map();

function sanitize(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  delete o._id;
  delete o.__v;
  return o;
}

export const invitationStore = {
  async create(data) {
    const publicId = newId();
    if (isConnected()) {
      const doc = await Invitation.create({ ...data, publicId });
      return sanitize(doc);
    }
    const now = new Date();
    const record = {
      publicId,
      status: 'draft',
      openCount: 0,
      lastOpenedAt: null,
      template: 'royal-wedding',
      side: 'bride',
      events: [],
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    memory.set(publicId, record);
    return { ...record };
  },

  async getByPublicId(publicId) {
    if (isConnected()) {
      const doc = await Invitation.findOne({ publicId });
      return sanitize(doc);
    }
    const rec = memory.get(publicId);
    return rec ? { ...rec } : null;
  },

  async recordOpen(publicId) {
    if (isConnected()) {
      const doc = await Invitation.findOneAndUpdate(
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

  async setOrder(publicId, orderId) {
    if (isConnected()) {
      const doc = await Invitation.findOneAndUpdate(
        { publicId }, { $set: { razorpayOrderId: orderId } }, { new: true }
      );
      return sanitize(doc);
    }
    const rec = memory.get(publicId);
    if (!rec) return null;
    rec.razorpayOrderId = orderId; rec.updatedAt = new Date();
    memory.set(publicId, rec);
    return { ...rec };
  },

  async markPaid(publicId, paymentId) {
    if (isConnected()) {
      const doc = await Invitation.findOneAndUpdate(
        { publicId }, { $set: { status: 'paid', razorpayPaymentId: paymentId } }, { new: true }
      );
      return sanitize(doc);
    }
    const rec = memory.get(publicId);
    if (!rec) return null;
    rec.status = 'paid'; rec.razorpayPaymentId = paymentId; rec.updatedAt = new Date();
    memory.set(publicId, rec);
    return { ...rec };
  },
};
