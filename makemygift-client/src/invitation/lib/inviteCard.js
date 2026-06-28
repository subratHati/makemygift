// Draws a shareable wedding card image on a canvas (no background image needed yet).
// Returns a Blob (PNG). Swap the drawing in drawBackground() later for a real image.
const W = 1200, H = 630;

function drawBackground(ctx) {
  // soft cream gradient
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#fbf3e6');
  g.addColorStop(1, '#f3e3cf');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // double gold border
  ctx.strokeStyle = '#b8860b';
  ctx.lineWidth = 6;
  ctx.strokeRect(60, 60, W - 120, H - 120);
  ctx.lineWidth = 2;
  ctx.strokeRect(80, 80, W - 160, H - 160);

  // small ornaments (corners)
  ctx.fillStyle = '#b8860b';
  [[110, 110], [W - 110, 110], [110, H - 110], [W - 110, H - 110]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
  });
}

function centerText(ctx, text, y, font, color) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, y);
}

// returns a Promise<Blob>
export async function makeInviteCard({ firstName, secondName }) {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  drawBackground(ctx);

  // ensure the script font is ready (falls back to cursive if not)
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch { /* ignore */ }

  centerText(ctx, 'THE WEDDING OF', 130, '600 28px Georgia, serif', '#7a5c1e');

  // names
  centerText(ctx, firstName || 'Bride', 290, "700 90px 'Dancing Script', cursive", '#8b1a1a');
  centerText(ctx, '&', 360, "700 54px 'Dancing Script', cursive", '#b8860b');
  centerText(ctx, secondName || 'Groom', 460, "700 90px 'Dancing Script', cursive", '#8b1a1a');

  // divider
  ctx.strokeStyle = '#b8860b'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W / 2 - 90, 510); ctx.lineTo(W / 2 + 90, 510); ctx.stroke();

  centerText(ctx, 'With love', 565, "400 34px 'Dancing Script', cursive", '#2a1810');

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png', 0.95));
}

// Share flow: native share with image+link on phones; download + WhatsApp link on desktop.
export async function shareInvite({ blob, link, firstName, secondName }) {
  const fileName = `${(firstName || 'wedding')}-${(secondName || 'invite')}.png`.replace(/\s+/g, '-');
  const text = `You're invited to ${firstName || ''} & ${secondName || ''}'s wedding 💛\n${link}`;

  // Try native share with the image file (mobile)
  if (blob && navigator.canShare) {
    const file = new File([blob], fileName, { type: 'image/png' });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text });
        return 'shared';
      } catch (e) {
        if (e && e.name === 'AbortError') return 'cancelled';
        // fall through to desktop fallback
      }
    }
  }

  // Desktop / unsupported: download the image, then open WhatsApp with the link+text
  if (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  return 'fallback';
}

// Upload the card blob to Cloudinary (unsigned). Returns the secure_url.
const CLOUD_NAME = 'dc7zdk6is';
const UPLOAD_PRESET = 'makemygift_unsigned';
export async function uploadCardToCloudinary(blob) {
  const form = new FormData();
  form.append('file', blob);
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', 'makemygift/invitations');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Card upload failed');
  const json = await res.json();
  return json.secure_url;
}

// Share just the LINK on WhatsApp — WhatsApp fetches it and shows the card as a rich preview
// (image + clickable link) thanks to the OG tags on the backend /i/:id page.
export function shareLinkOnWhatsApp(shareLink, { firstName, secondName } = {}) {
  const msg = `You're invited to ${firstName || ''} & ${secondName || ''}'s wedding 💛\n${shareLink}`;
  // native share (text) on mobile if available, else wa.me
  if (navigator.share) {
    navigator.share({ text: msg }).catch(() => {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    });
    return;
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}
