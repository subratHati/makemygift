# makemygift-server

Backend API for **makemygift** — the interactive gift platform.

## Run locally
```bash
npm install
cp .env.example .env   # optional; defaults use an in-memory store
npm start              # http://localhost:4000
npm test               # smoke test (11 checks)
```

Without `MONGODB_URI`, the API uses an in-memory store (resets on restart) so
you can develop without a database. Set `MONGODB_URI` in `.env` for real MongoDB.

## Endpoints
- `GET  /health` — status + which store is active
- `POST /api/gifts` — create a draft gift (body: `recipientName` required; plus
  `title`, `occasion`, `fromName`, `message`, `closingLine`, `mirrorQuestion`,
  `revealType`)
- `GET  /api/gifts/:publicId` — fetch a gift for the player

Gifts are **replayable**: opening a link never disables it. `openCount` and
`lastOpenedAt` are tracked for analytics only and never gate playback.

## Build plan
- Phase 0 — setup ✓
- **Phase 1 — gift model + create/fetch endpoints** ✓ (you are here)
- Phase 4 — media upload (Cloudflare R2)
- Phase 5 — Razorpay payments
- Phase 6 — deploy (Railway)
