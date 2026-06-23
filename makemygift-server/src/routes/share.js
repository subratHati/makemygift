import { Router } from 'express';
import { invitationStore } from '../store/invitationStore.js';
import { config } from '../config.js';

const router = Router();

const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// GET /i/:publicId — served to WhatsApp/crawlers with OG tags; humans get redirected to the app.
router.get('/:publicId', async (req, res) => {
  const inv = await invitationStore.getByPublicId(req.params.publicId);
  const appUrl = `${config.frontendUrl}/invitation/${req.params.publicId}`;

  if (!inv) {
    return res.redirect(302, config.frontendUrl);
  }

  const brideFirst = inv.side === 'bride';
  const first = brideFirst ? inv.brideName : inv.groomName;
  const second = brideFirst ? inv.groomName : inv.brideName;
  const title = `${first || 'Our'} & ${second || 'Wedding'} — Wedding Invitation`;
  const desc = inv.weddingDate
    ? `Join us in celebration. ${esc(inv.venue || '')}`.trim()
    : 'You are invited to our wedding celebration.';
  const image = inv.cardImageUrl || `${config.frontendUrl}/og-default.png`;

  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="${esc(image)}" />
<meta property="og:image:width" content="1080" />
<meta property="og:image:height" content="1350" />
<meta property="og:url" content="${esc(appUrl)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:image" content="${esc(image)}" />
<meta http-equiv="refresh" content="0; url=${esc(appUrl)}" />
<script>window.location.replace(${JSON.stringify(appUrl)});</script>
</head>
<body style="font-family:Georgia,serif;text-align:center;padding:40px;color:#2a1810;background:#fbf3e6">
<p>Opening your invitation…</p>
<p><a href="${esc(appUrl)}">Tap here if it doesn't open automatically</a></p>
</body>
</html>`);
});

export default router;
