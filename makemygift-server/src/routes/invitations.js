import { Router } from 'express';
import crypto from 'crypto';
import { invitationStore } from '../store/invitationStore.js';
import { config } from '../config.js';

const router = Router();

function cleanString(v, max) {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

// sanitize the events array from the form
function cleanEvents(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, 12).map((ev) => ({
    name: cleanString(ev?.name, 40),
    date: cleanString(ev?.date, 20),
    time: cleanString(ev?.time, 10),
    venue: cleanString(ev?.venue, 120),
  })).filter((ev) => ev.name);
}

// POST /api/invitations — create a draft invitation from the builder
router.post('/', async (req, res) => {
  const side = req.body.side === 'groom' ? 'groom' : 'bride';
  const data = {
    template: cleanString(req.body.template, 40) || 'royal-wedding',
    side,
    groomName: cleanString(req.body.groomName, 60),
    brideName: cleanString(req.body.brideName, 60),
    groomFather: cleanString(req.body.groomFather, 60),
    groomMother: cleanString(req.body.groomMother, 60),
    brideFather: cleanString(req.body.brideFather, 60),
    brideMother: cleanString(req.body.brideMother, 60),
    weddingDate: cleanString(req.body.weddingDate, 20),
    venue: cleanString(req.body.venue, 120),
    city: cleanString(req.body.city, 80),
    events: cleanEvents(req.body.events),
    familyMembers: cleanString(req.body.familyMembers, 600),
  };

  const invitation = await invitationStore.create(data);
  res.status(201).json({ invitation });
});

// GET /api/invitations/:publicId — fetch an invitation for the viewer
router.get('/:publicId', async (req, res) => {
  const invitation = await invitationStore.getByPublicId(req.params.publicId);
  if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
  res.json({ invitation });
});

// POST /api/invitations/:publicId/order — create a Razorpay order (₹599)
router.post('/:publicId/order', async (req, res) => {
  if (!config.razorpayKeyId || !config.razorpayKeySecret) {
    return res.status(500).json({ error: 'Payments not configured' });
  }
  const invitation = await invitationStore.getByPublicId(req.params.publicId);
  if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
  if (invitation.status === 'paid') return res.status(400).json({ error: 'Already paid' });

  try {
    const auth = Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64');
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: config.invitationPricePaise,
        currency: 'INR',
        receipt: invitation.publicId,
        notes: { publicId: invitation.publicId, kind: 'invitation' },
      }),
    });
    const order = await r.json();
    if (!r.ok || !order.id) return res.status(502).json({ error: 'Could not create order' });
    await invitationStore.setOrder(invitation.publicId, order.id);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: config.razorpayKeyId });
  } catch {
    res.status(502).json({ error: 'Payment provider error' });
  }
});

// POST /api/invitations/:publicId/verify — verify signature, then mark paid
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
  const invitation = await invitationStore.markPaid(req.params.publicId, razorpay_payment_id);
  if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
  res.json({ invitation });
});

// POST /api/invitations/:publicId/card — save the Cloudinary card image URL (for WhatsApp preview)
router.post('/:publicId/card', async (req, res) => {
  const imageUrl = cleanString(req.body.imageUrl, 400);
  if (!/^https:\/\/.+/i.test(imageUrl)) return res.status(400).json({ error: 'Invalid image URL' });
  const invitation = await invitationStore.setCard(req.params.publicId, imageUrl);
  if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
  res.json({ ok: true });
});

export default router;
