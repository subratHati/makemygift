// API + payment helpers for invitations. Mirrors the gift app's Razorpay flow.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function createInvitation(data) {
  const res = await fetch(`${API_BASE}/api/invitations`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Could not save invitation');
  const json = await res.json();
  return json.invitation; // has publicId, status, ...
}

export async function fetchInvitation(publicId) {
  const res = await fetch(`${API_BASE}/api/invitations/${publicId}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Could not load invitation');
  const json = await res.json();
  return json.invitation;
}

// load the Razorpay checkout script once
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// Full pay flow: create order -> open checkout -> verify -> resolve(paid invitation).
// Returns the paid invitation on success; throws on failure/cancel.
export async function payForInvitation(publicId, { name } = {}) {
  // 1) create order
  const orderRes = await fetch(`${API_BASE}/api/invitations/${publicId}/order`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  const order = await orderRes.json();
  if (!orderRes.ok || !order.orderId) throw new Error(order.error || 'Could not start payment');

  // 2) load checkout
  const ok = await loadRazorpay();
  if (!ok) throw new Error('Could not load payment window');

  // 3) open checkout + verify in the handler
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: 'MakeMyGift',
      description: 'Wedding Invitation — shareable link',
      theme: { color: '#e11d48' },
      prefill: name ? { name } : undefined,
      handler: async (resp) => {
        try {
          const vRes = await fetch(`${API_BASE}/api/invitations/${publicId}/verify`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(resp),
          });
          const vJson = await vRes.json();
          if (!vRes.ok) return reject(new Error(vJson.error || 'Verification failed'));
          resolve(vJson.invitation);
        } catch (e) {
          reject(e);
        }
      },
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    });
    rzp.open();
  });
}

export { API_BASE };

export async function saveCardImage(publicId, imageUrl) {
  const res = await fetch(`${API_BASE}/api/invitations/${publicId}/card`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ imageUrl }),
  });
  return res.ok;
}

// The shareable link goes through the backend /i/:id so WhatsApp gets the OG preview.
export function shareLinkFor(publicId) {
  return `${API_BASE}/i/${publicId}`;
}
