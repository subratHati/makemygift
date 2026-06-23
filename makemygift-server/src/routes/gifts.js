import crypto from 'crypto';
import { config } from '../config.js';
import { Router } from 'express';
import { giftStore } from '../store/giftStore.js';

const router = Router();

function cleanString(v, max) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

// POST /api/gifts — create a draft gift from the studio
router.post('/', async (req, res) => {
  const recipientName = cleanString(req.body.recipientName, 60);
  if (!recipientName) {
    return res.status(400).json({ error: 'recipientName is required' });
  }

  const allowedReveal = ['photo', 'video', 'portrait', 'note'];
  const revealType = allowedReveal.includes(req.body.revealType) ? req.body.revealType : 'photo';

  const data = {
    recipientName,
    title: cleanString(req.body.title, 30),
    occasion: cleanString(req.body.occasion, 40) || 'Birthday',
    fromName: cleanString(req.body.fromName, 60),
    message: cleanString(req.body.message, 1000),
    closingLine: cleanString(req.body.closingLine, 80),
    mirrorQuestion: cleanString(req.body.mirrorQuestion, 120),
    puzzlePhotoUrl: cleanString(req.body.puzzlePhotoUrl, 500),
    voiceQuestion: cleanString(req.body.voiceQuestion, 160),
    voiceAnswer: cleanString(req.body.voiceAnswer, 160),
    candles: Math.max(1, Math.min(12, parseInt(req.body.candles, 10) || 5)),
    revealType,
    revealPhotoUrl: cleanString(req.body.revealPhotoUrl, 500),
    revealVideoUrl: cleanString(req.body.revealVideoUrl, 500),
    chakraPhotoUrl: cleanString(req.body.chakraPhotoUrl, 500),
    finalMessage: cleanString(req.body.finalMessage, 600),
    theme: cleanString(req.body.theme, 40) || 'window-modern',
  };

  const gift = await giftStore.create(data);
  res.status(201).json({ gift });
});

// GET /api/gifts/:publicId — fetch a gift for the player
router.get('/:publicId', async (req, res) => {
  const gift = await giftStore.getByPublicId(req.params.publicId);
  if (!gift) return res.status(404).json({ error: 'Gift not found' });
  res.json({ gift });
});

// POST /api/gifts/:publicId/order — create a Razorpay order to pay for this gift
router.post('/:publicId/order', async (req, res) => {
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    return res.status(500).json({ error: 'Payments not configured' });
  }
  const gift = await giftStore.getByPublicId(req.params.publicId);
  if (!gift) return res.status(404).json({ error: 'Gift not found' });
  if (gift.status === 'paid') return res.status(400).json({ error: 'Already paid' });

  try {
    const auth = Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64');
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: config.pricePaise, currency: 'INR', receipt: gift.publicId, notes: { publicId: gift.publicId } }),
    });
    const order = await r.json();
    if (!r.ok || !order.id) return res.status(502).json({ error: 'Could not create order' });
    await giftStore.setOrder(gift.publicId, order.id);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: config.razorpayKeyId });
  } catch (e) {
    console.error('[order error]', e);
    res.status(502).json({ error: 'Payment provider error' });
  }
});

// POST /api/gifts/:publicId/verify — verify the signature, then mark the gift paid
router.post('/:publicId/verify', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment fields' });
  }
  const expected = crypto
    .createHmac('sha256', config.razorpayKeySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }
  const gift = await giftStore.markPaid(req.params.publicId, razorpay_payment_id);
  if (!gift) return res.status(404).json({ error: 'Gift not found' });
  res.json({ gift });
});

export default router;