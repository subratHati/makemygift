import { useEffect, useRef, useState } from 'react';

// Task 2 — drag-and-drop swap photo puzzle (3x3). Pick up any piece, drop it on
// another to swap; solve to celebrate, then continue calls onNext(). Arrives with
// an entrance animation handed off from Task 1.
const N = 3, GAP = 4;
// placeholder photo until the buyer's real photo is wired in
const PHOTO = 'linear-gradient(135deg,#ff9ec4 0%,#ffd27f 35%,#7fe3d0 70%,#8ac0ff 100%)';

// Make any image fit the square puzzle perfectly: ask Cloudinary for a
// center-cropped 1:1 version (no stretching, any aspect ratio works).
const squareUrl = (url) => {
  if (!url) return null;
  const m = '/upload/';
  const i = url.indexOf(m);
  if (i === -1) return url; // not a Cloudinary URL — use as-is
  return url.slice(0, i + m.length) + 'c_fill,ar_1:1,g_auto,w_900,q_auto,f_auto/' + url.slice(i + m.length);
};

export default function Task2Scene({ onNext, gift }) {

  const memeUrl = gift?.task2MemeUrl || 'https://res.cloudinary.com/dc7zdk6is/image/upload/v1781800855/makemygift/download_5_kyxmje.jpg';
  const isVid = (u) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u) || /\/video\//.test(u);
  const srcUrl = gift?.puzzlePhotoUrl ? squareUrl(gift.puzzlePhotoUrl) : null;
  const photo = srcUrl ? `url("${srcUrl}")` : PHOTO;

  const boardRef = useRef(null);
  const pieceRefs = useRef([]);
  const slot = useRef([]);          // slot[g] = piece id sitting in grid cell g
  const geom = useRef({ size: 0, cell: 0 });
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [shakeArmed, setShakeArmed] = useState(false);
  const [shakeMsg, setShakeMsg] = useState('');
  const motionRef = useRef(null);
  const burstRef = useRef(null);
  const finish = () => { setLeaving(true); setTimeout(() => onNext(), 650); };

  const xy = (g) => { const { cell } = geom.current; const r = Math.floor(g / N), c = g % N; return { x: GAP + c * (cell + GAP), y: GAP + r * (cell + GAP) }; };
  const measure = () => { const b = boardRef.current; if (!b) return; const size = b.clientWidth; geom.current = { size, cell: (size - GAP * (N + 1)) / N }; };
  const gridOfPiece = (id) => slot.current.indexOf(id);

  const layout = () => {
    measure();
    const { cell } = geom.current;
    pieceRefs.current.forEach((p, id) => {
      if (!p) return;
      p.style.width = cell + 'px'; p.style.height = cell + 'px';
      const g = gridOfPiece(id); const { x, y } = xy(g);
      if (!p.classList.contains('wk4-drag')) { p.style.left = x + 'px'; p.style.top = y + 'px'; }
      p.classList.toggle('wk4-home', id === g);
    });
    boardRef.current?.querySelectorAll('.wk4-cell').forEach((cl, g) => {
      const { x, y } = xy(g); cl.style.left = x + 'px'; cl.style.top = y + 'px'; cl.style.width = cell + 'px'; cl.style.height = cell + 'px';
    });
  };

  const refreshHome = () => { slot.current.forEach((id, g) => pieceRefs.current[id]?.classList.toggle('wk4-home', id === g)); };

  const shuffle = () => {
    const s = [...Array(N * N).keys()];
    for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[s[i], s[j]] = [s[j], s[i]]; }
    if (s.every((id, g) => id === g)) { [s[0], s[1]] = [s[1], s[0]]; }
    slot.current = s; setMoves(0); setSolved(false); setDone(false); layout();
  };

  useEffect(() => { shuffle(); const onR = () => layout(); window.addEventListener('resize', onR); return () => window.removeEventListener('resize', onR); }, []);

  const cellAtPoint = (px, py) => {
    const b = boardRef.current; if (!b) return -1; const rect = b.getBoundingClientRect();
    const { size, cell } = geom.current; const x = px - rect.left, y = py - rect.top;
    if (x < 0 || y < 0 || x > size || y > size) return -1;
    const c = Math.min(N - 1, Math.max(0, Math.floor(x / (cell + GAP)))), r = Math.min(N - 1, Math.max(0, Math.floor(y / (cell + GAP))));
    return r * N + c;
  };

  const sparkle = () => {
    const b = boardRef.current, layer = burstRef.current; if (!b || !layer) return;
    const rect = b.getBoundingClientRect();
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('div'); s.className = 'wk4-spark'; s.textContent = ['✨', '💖', '🌟', '💫'][i % 4];
      s.style.left = (rect.left + rect.width / 2) + 'px'; s.style.top = (rect.top + rect.height / 2) + 'px';
      const a = Math.random() * 6.28, d = 70 + Math.random() * 120;
      s.style.setProperty('--tx', `calc(-50% + ${Math.cos(a) * d}px)`); s.style.setProperty('--ty', `calc(-50% + ${Math.sin(a) * d}px)`);
      layer.appendChild(s); setTimeout(() => s.remove(), 900);
    }
  };

  const checkSolved = () => {
    if (!slot.current.every((id, g) => id === g)) return;
    setSolved(true); boardRef.current?.classList.add('wk4-solved');
    if (navigator.vibrate) navigator.vibrate([20, 40, 30]);
    sparkle(); setTimeout(() => setDone(true), 900);
  };

  const makeDragHandler = (id) => (e) => {
    if (solved) return; e.preventDefault();
    const p = pieceRefs.current[id]; if (!p) return;
    const fromG = gridOfPiece(id); const { x: origX, y: origY } = xy(fromG);
    const startX = e.clientX, startY = e.clientY; let curOver = -1;
    p.classList.add('wk4-drag');
    const onMove = (ev) => {
      p.style.left = (origX + ev.clientX - startX) + 'px'; p.style.top = (origY + ev.clientY - startY) + 'px';
      const g = cellAtPoint(ev.clientX, ev.clientY);
      if (g !== curOver) {
        if (curOver >= 0) pieceRefs.current[slot.current[curOver]]?.classList.remove('wk4-over');
        curOver = g;
        if (g >= 0 && g !== fromG) pieceRefs.current[slot.current[g]]?.classList.add('wk4-over');
      }
    };
    const onUp = (ev) => {
      p.classList.remove('wk4-drag');
      if (curOver >= 0) pieceRefs.current[slot.current[curOver]]?.classList.remove('wk4-over');
      const g = cellAtPoint(ev.clientX, ev.clientY);
      if (g >= 0 && g !== fromG) { const a = slot.current[fromG]; slot.current[fromG] = slot.current[g]; slot.current[g] = a; setMoves((m) => m + 1); }
      layout(); refreshHome(); checkSolved();
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp);
  };

  // Snap every piece into place (used by shake-to-solve).
  const solvePuzzle = () => {
    if (solved) return;
    slot.current = [...Array(N * N).keys()];
    layout(); refreshHome(); checkSolved();
  };

  // Shake the device to auto-solve. iOS needs motion permission (granted via a
  // tap), so this is armed by a button. If motion isn't supported, the button
  // just solves directly.
  const armShake = async () => {
    if (solved || shakeArmed) return;
    if (typeof DeviceMotionEvent === 'undefined') { solvePuzzle(); return; }
    try {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        const res = await DeviceMotionEvent.requestPermission();
        if (res !== 'granted') { setShakeMsg('motion blocked — tap shuffle pieces instead'); return; }
      }
    } catch { /* older browsers: no permission needed */ }
    let hits = 0, lastHit = 0;
    const handler = (e) => {
      const ac = e.accelerationIncludingGravity || e.acceleration; if (!ac) return;
      const mag = Math.sqrt((ac.x || 0) ** 2 + (ac.y || 0) ** 2 + (ac.z || 0) ** 2);
      const now = Date.now();
      if (mag > 20 && now - lastHit > 120) {
        hits++; lastHit = now;
        if (hits >= 3) { window.removeEventListener('devicemotion', handler); motionRef.current = null; solvePuzzle(); }
      }
    };
    motionRef.current = handler;
    window.addEventListener('devicemotion', handler);
    setShakeArmed(true); setShakeMsg('now shake your phone! 📳');
  };
  useEffect(() => () => { if (motionRef.current) window.removeEventListener('devicemotion', motionRef.current); }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="wk4-stage">
        <div className="wk4-enterfade" />

        <div className="wk4-head">
          <h1>Put us back together 🧩</h1>
          <p>drag any piece anywhere — drop it on another to swap</p>
        </div>

        <div className="wk4-board" ref={boardRef}>
          {[...Array(N * N)].map((_, g) => <div key={'c' + g} className="wk4-cell" />)}
          {[...Array(N * N)].map((_, id) => {
            const r = Math.floor(id / N), c = id % N;
            return (
              <div key={'p' + id} className="wk4-piece" ref={(el) => (pieceRefs.current[id] = el)}
                style={{ backgroundImage: photo, backgroundPosition: `${(c / (N - 1)) * 100}% ${(r / (N - 1)) * 100}%`, backgroundSize: '300% 300%' }}
                onPointerDown={makeDragHandler(id)}>
                <span className="wk4-num">{id + 1}</span>
              </div>
            );
          })}
        </div>

        <div className="wk4-meta">
          <div className="wk4-moves">moves: {moves}</div>
          <div className="wk4-goal"><div className="wk4-gimg" style={{ background: photo, backgroundSize: 'cover' }} /><div className="wk4-gl">goal</div></div>
          <button className="wk4-shuffle" onClick={shuffle}>shuffle</button>
        </div>

        {!solved && !done && (
          <button className="wk4-shakebtn" onClick={armShake}>{shakeArmed ? (shakeMsg || 'shake your phone 📳') : '📱 shake to solve'}</button>
        )}

        {done && (
          <div className="wk4-done">
            <div className="wk4-card">
              <div className="wk4-ph">💞</div>
              <h2>You did it!</h2>
              <p>Every piece back where it belongs — just like us.</p>
              {memeUrl && (isVid(memeUrl)
                ? <video className="wk4-meme" src={memeUrl} autoPlay loop muted playsInline />
                : <img className="wk4-meme" src={memeUrl} alt="" />)}
              <button className="wk4-next" onClick={finish}>continue →</button>
            </div>
          </div>
        )}

        <div className="wk4-burstlayer" ref={burstRef} />
        {leaving && <div className="wk4-leavewash" />}
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap');
.wk4-stage{position:fixed;inset:0;max-width:520px;margin:0 auto;overflow:hidden;font-family:'Nunito',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;touch-action:none;background:radial-gradient(120% 90% at 50% 12%,#eaf3ff 0%,#d7e8ff 42%,#c3dcff 72%,#aecdfb 100%);animation:wk4stagein .8s ease}
@keyframes wk4stagein{0%{transform:scale(1.05)}100%{transform:scale(1)}}
.wk4-enterfade{position:fixed;inset:0;z-index:100;background:#fff;pointer-events:none;animation:wk4fade 1s ease forwards}
@keyframes wk4fade{0%{opacity:1}100%{opacity:0;visibility:hidden}}
.wk4-label{position:absolute;top:12px;left:0;right:0;text-align:center;font-family:'Fredoka';font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#4a6aa0;opacity:.6;z-index:60}
.wk4-head{position:relative;z-index:5;margin-bottom:14px;animation:wk4up .7s ease .15s both}
@keyframes wk4up{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
.wk4-head h1{font-family:'Fredoka';font-weight:600;font-size:23px;color:#1f3a6a}
.wk4-head p{font-size:15px;color:#4a6aa0;margin-top:3px}
.wk4-board{position:relative;width:min(86vw,330px);aspect-ratio:1/1;border-radius:16px;z-index:5;background:rgba(31,58,106,.10);box-shadow:inset 0 0 0 2px rgba(31,58,106,.12);animation:wk4board .8s cubic-bezier(.34,1.3,.5,1) .25s both}
@keyframes wk4board{0%{opacity:0;transform:translateY(26px) scale(.92)}100%{opacity:1;transform:translateY(0) scale(1)}}
.wk4-cell{position:absolute;border-radius:9px;box-shadow:inset 0 0 0 1.5px rgba(31,58,106,.12)}
.wk4-piece{position:absolute;border-radius:9px;background-size:300% 300%;cursor:grab;touch-action:none;box-shadow:0 4px 10px rgba(31,58,106,.25),inset 0 0 0 2px rgba(255,255,255,.22);transition:left .2s cubic-bezier(.4,1.3,.5,1),top .2s cubic-bezier(.4,1.3,.5,1),box-shadow .25s,transform .15s;will-change:left,top}
.wk4-num{position:absolute;left:6px;top:4px;font-family:'Fredoka';font-weight:600;font-size:14px;color:rgba(255,255,255,.9);text-shadow:0 1px 3px rgba(0,0,0,.45)}
.wk4-piece.wk4-home{box-shadow:0 0 0 2px #4ad08a,0 6px 14px rgba(40,120,80,.3),inset 0 0 0 2px rgba(255,255,255,.25)}
.wk4-piece.wk4-drag{cursor:grabbing;z-index:50;transition:box-shadow .2s,transform .15s;transform:scale(1.07);box-shadow:0 14px 28px rgba(31,58,106,.45),inset 0 0 0 2px rgba(255,255,255,.3)}
.wk4-piece.wk4-over{outline:3px dashed rgba(58,106,192,.7);outline-offset:-4px}
.wk4-solved .wk4-piece{box-shadow:none!important;transform:none!important}
.wk4-solved .wk4-num{opacity:0;transition:opacity .4s}
.wk4-board.wk4-solved{box-shadow:none}
.wk4-meta{position:relative;z-index:5;margin-top:14px;display:flex;align-items:center;gap:14px;animation:wk4up .7s ease .35s both}
.wk4-moves{font-family:'Fredoka';font-weight:500;font-size:14px;color:#3a5a90;background:rgba(255,255,255,.7);padding:7px 14px;border-radius:18px}
.wk4-goal{width:54px;height:54px;border-radius:10px;overflow:hidden;box-shadow:0 6px 14px rgba(40,70,120,.3),inset 0 0 0 2px #fff;position:relative}
.wk4-gimg{position:absolute;inset:0}
.wk4-gl{position:absolute;left:6px;bottom:3px;font-family:'Fredoka';font-size:8px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5)}
.wk4-shuffle{font-family:'Fredoka';font-weight:600;font-size:13px;color:#3a6ac0;background:none;border:1.5px solid #9fc0f0;border-radius:18px;padding:7px 14px;cursor:pointer}
.wk4-shakebtn{position:relative;z-index:5;margin-top:12px;font-family:'Fredoka';font-weight:600;font-size:13.5px;color:#3a6ac0;background:rgba(255,255,255,.75);border:1.5px solid #bcd4f5;border-radius:20px;padding:9px 18px;cursor:pointer;animation:wk4up .7s ease .45s both}
.wk4-done{position:fixed;inset:0;z-index:90;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:30px;background:rgba(20,40,80,.55);backdrop-filter:blur(3px);animation:wk4d .5s ease}
.wk4-meme{width:min(72vw,300px);max-height:38vh;object-fit:contain;border-radius:14px;margin:14px 0;box-shadow:0 10px 26px rgba(0,0,0,.35);background:#fff}
@keyframes wk4d{from{opacity:0}to{opacity:1}}
.wk4-card{background:#fff;border-radius:20px;padding:26px 28px;box-shadow:0 24px 60px rgba(20,40,80,.4);max-width:330px}
.wk4-ph{font-size:46px;animation:wk4beat 1s ease-in-out infinite}
@keyframes wk4beat{0%,100%{transform:scale(1)}50%{transform:scale(1.16)}}
.wk4-card h2{font-family:'Fredoka';font-weight:700;font-size:24px;color:#1f3a6a;margin-top:6px}
.wk4-card p{font-size:16px;color:#4a6aa0;margin-top:6px}
.wk4-next{margin-top:20px;font-family:'Fredoka';font-weight:600;font-size:15px;color:#fff;background:#3a6ac0;border:none;border-radius:24px;padding:13px 28px;cursor:pointer}
.wk4-burstlayer{position:fixed;inset:0;z-index:85;pointer-events:none}
.wk4-leavewash{position:fixed;inset:0;z-index:120;background:#fff;pointer-events:none;opacity:0;animation:wk4leave .7s ease forwards}
@keyframes wk4leave{0%{opacity:0}100%{opacity:1}}
.wk4-spark{position:fixed;font-size:22px;pointer-events:none;animation:wk4sp .9s ease-out forwards}
@keyframes wk4sp{0%{opacity:1;transform:translate(-50%,-50%) scale(.4)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1.1)}}
@media (prefers-reduced-motion: reduce){*{animation-duration:.001s!important}}
`;
