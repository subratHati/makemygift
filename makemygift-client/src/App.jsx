import { useEffect, useState } from 'react';
import Player from './player/Player.jsx';
import Studio from './studio/Studio.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// A sample gift used by /demo so the experience can be previewed without a link.
const DEMO_GIFT = {
  publicId: 'demo',
  recipientName: 'Priya',
  fromName: 'Aarav',
  occasion: 'Birthday',
  puzzlePhotoUrl: '',
  voiceQuestion: 'How much do you love me?',
  voiceAnswer: 'I love you to the moon and back',
  candles: 5,
  finalMessage: 'Happy birthday, my whole world.<br>Thank you for being mine. 💛',
  revealPhotoUrl: '',
};

function publicIdFromUrl() {
  const m = window.location.pathname.match(/\/g\/([A-Za-z0-9_-]+)/);
  return m ? m[1] : null;
}

export default function App() {
  const path = window.location.pathname;
  const giftId = publicIdFromUrl();
  const isDemo = path === '/demo';

  // The buyer's studio is the default page; the experience lives at /g/:id (or /demo).
  if (!giftId && !isDemo) return <Studio />;
  if (isDemo) return <Player gift={DEMO_GIFT} />;
  return <GiftLoader id={giftId} />;
}

function GiftLoader({ id }) {
  const [state, setState] = useState({ status: 'loading', gift: null });
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/gifts/${id}`);
        if (!res.ok) throw new Error('not found');
        const data = await res.json();
        if (!cancelled) setState({ status: 'ready', gift: data.gift });
      } catch {
        if (!cancelled) setState({ status: 'error', gift: null });
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (state.status === 'loading') return <Splash title="opening your gift…" />;
  if (state.status === 'error') return <Splash title="We couldn't find this gift" sub="The link may be incorrect or expired." />;
  return <Player gift={state.gift} />;
}

function Splash({ title, sub }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 28,
      fontFamily: "'Nunito',system-ui,sans-serif", color: '#5a4630',
      background: 'linear-gradient(180deg,#fbeede,#f4ddc2 60%,#ecd0b0)',
    }}>
      <div style={{ fontSize: 40 }}>🎁</div>
      <div style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 600, fontSize: 20, marginTop: 10 }}>{title}</div>
      {sub && <div style={{ fontSize: 15, opacity: 0.7, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
