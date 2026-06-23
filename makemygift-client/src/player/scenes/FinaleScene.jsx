import { useEffect, useRef, useState } from 'react';

// Finale — blow out the candles (mic, with tap fallback) -> celebration
// (confetti, balloons, crackers, chime) -> full-page reveal of the buyer's
// photo/video with their message, a share button, and a create-your-own link.
// This is the last scene; it stays on the reveal (no onNext).

// Crop any image to fill the screen nicely via Cloudinary (no stretching).
const fillUrl = (url) => {
  if (!url) return null;
  const m = '/upload/';
  const i = url.indexOf(m);
  if (i === -1) return url;
  return url.slice(0, i + m.length) + 'c_fill,g_auto,w_1080,h_1920,q_auto,f_auto/' + url.slice(i + m.length);
};

export default function FinaleScene({ gift, preview = false }) {
  const NUM = Math.max(1, Math.min(8, gift?.candles || 5));
  const MESSAGE = gift?.finalMessage || 'Happy birthday, my whole world.<br>Thank you for being mine. 💛';
  const FROM = gift?.fromName || null;
  const PHOTO = gift?.revealPhotoUrl ? `url("${fillUrl(gift.revealPhotoUrl)}")` : 'linear-gradient(135deg,#ff9ec4 0%,#ffd27f 40%,#7fe3d0 75%,#8ac0ff 100%)';
  const CREATE_URL = gift?.createUrl || '#';
  const ACTIVATE_URL = gift?.publicId ? `/studio?activate=${gift.publicId}` : '/studio';

  const [out, setOut] = useState(() => Array(NUM).fill(false));
  const [csub, setCsub] = useState('blow to put out the candles');
  const [revealed, setRevealed] = useState(false);

  const outRef = useRef(Array(NUM).fill(false));
  const fillRef = useRef(null);
  const fxRef = useRef(null);
  const micOnRef = useRef(false);
  const streamRef = useRef(null);
  const actxRef = useRef(null);
  const analyserRef = useRef(null);
  const dataRef = useRef(null);
  const rafRef = useRef(null);
  const blowHoldRef = useRef(0);
  const celebratedRef = useRef(false);

  useEffect(() => () => {
    micOnRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch { }
    try { actxRef.current?.close(); } catch { }
  }, []);

  const candleLeft = (i) => (NUM <= 1 ? 111 : (115 - 60) + (120 / (NUM - 1)) * i);

  const blowOne = () => {
    const lit = outRef.current.map((o, i) => (o ? -1 : i)).filter((i) => i >= 0);
    if (!lit.length) return;
    const pick = lit[Math.floor(Math.random() * lit.length)];
    outRef.current[pick] = true; setOut([...outRef.current]);
    if (navigator.vibrate) navigator.vibrate(15);
    if (outRef.current.every(Boolean) && !celebratedRef.current) { celebratedRef.current = true; setTimeout(celebrate, 500); }
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const actx = new (window.AudioContext || window.webkitAudioContext)(); actxRef.current = actx;
      const src = actx.createMediaStreamSource(stream);
      const analyser = actx.createAnalyser(); analyser.fftSize = 512;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser); analyserRef.current = analyser;
      micOnRef.current = true; setCsub('now blow! 🌬️'); loopMic();
    } catch { setCsub('mic blocked — use the tap option below'); }
  };
  const loopMic = () => {
    if (!micOnRef.current) return;
    const analyser = analyserRef.current, data = dataRef.current;
    analyser.getByteFrequencyData(data);
    let low = 0; for (let i = 2; i < 24; i++) low += data[i]; low /= 22;
    const level = Math.min(100, low * 1.4);
    if (fillRef.current) fillRef.current.style.width = level + '%';
    if (level > 52) { blowHoldRef.current++; if (blowHoldRef.current > 3) { blowHoldRef.current = 0; blowOne(); } }
    else blowHoldRef.current = Math.max(0, blowHoldRef.current - 1);
    rafRef.current = requestAnimationFrame(loopMic);
  };

  const celebrate = () => {
    micOnRef.current = false; setCsub('🎉 yaaay! 🎉');
    confettiBurst(); balloons(); crackers();
    try { const a = new (window.AudioContext || window.webkitAudioContext)();[523, 659, 784, 1046].forEach((f, i) => { const o = a.createOscillator(); o.type = 'triangle'; o.frequency.value = f; const g = a.createGain(); g.gain.value = 0; o.connect(g); g.connect(a.destination); const s = a.currentTime + i * 0.12; g.gain.linearRampToValueAtTime(0.18, s + 0.02); g.gain.exponentialRampToValueAtTime(0.001, s + 0.6); o.start(s); o.stop(s + 0.65); }); } catch { }
    if (navigator.vibrate) navigator.vibrate([30, 50, 30, 50, 60]);
    setTimeout(() => setRevealed(true), 1900);
  };

  const confettiBurst = () => {
    const fx = fxRef.current; if (!fx) return; const cols = ['#ff7ab0', '#ffd27f', '#7fe3d0', '#8ac0ff', '#c89bff', '#ff9a1f'];
    for (let i = 0; i < 90; i++) { const d = document.createElement('div'); d.className = 'wk6-confetti'; d.style.left = Math.random() * 100 + '%'; d.style.background = cols[i % cols.length]; d.style.animationDuration = (2.4 + Math.random() * 2.2) + 's'; d.style.animationDelay = (Math.random() * 0.8) + 's'; if (Math.random() > 0.5) d.style.borderRadius = '50%'; fx.appendChild(d); setTimeout(() => d.remove(), 5000); }
  };
  const balloons = () => {
    const fx = fxRef.current; if (!fx) return; const cols = ['#ff7ab0', '#ffd27f', '#7fe3d0', '#8ac0ff', '#c89bff'];
    for (let i = 0; i < 10; i++) { const b = document.createElement('div'); b.className = 'wk6-balloon'; const col = cols[i % cols.length]; b.style.background = col; b.style.color = col; b.style.left = (5 + Math.random() * 86) + '%'; b.style.animationDuration = (5 + Math.random() * 4) + 's'; b.style.animationDelay = (Math.random() * 1.2) + 's'; fx.appendChild(b); setTimeout(() => b.remove(), 10000); }
  };
  const crackers = () => {
    const fx = fxRef.current; if (!fx) return;
    for (let burst = 0; burst < 5; burst++) {
      setTimeout(() => {
        const cx = 10 + Math.random() * 80, cy = 15 + Math.random() * 45;
        for (let i = 0; i < 14; i++) { const s = document.createElement('div'); s.className = 'wk6-crack'; s.textContent = ['✨', '🎉', '⭐', '💥', '🎊'][i % 5]; s.style.left = cx + '%'; s.style.top = cy + '%'; const a = Math.random() * 6.28, dd = 50 + Math.random() * 90; s.style.setProperty('--tx', `calc(-50% + ${Math.cos(a) * dd}px)`); s.style.setProperty('--ty', `calc(-50% + ${Math.sin(a) * dd}px)`); fx.appendChild(s); setTimeout(() => s.remove(), 820); }
      }, burst * 350);
    }
  };

  const share = async () => {
    const data = { title: 'A gift for you 💛', text: 'Look what I received!', url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch { } }
    else alert('On phones this opens the share sheet (WhatsApp, Instagram, etc.). On desktop, we’d offer a download to post.');
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="wk6-stage">
        <div className="wk6-enterfade" />

        <div className={`wk6-cakescene ${revealed ? 'wk6-gone' : ''}`}>
          <div className="wk6-ctitle">Make a wish… 🎂</div>
          <div className="wk6-csub">{csub}</div>

          <div className="wk6-cake">
            <div className="wk6-icing wk6-ic2" /><div className="wk6-tier wk6-t2" />
            <div className="wk6-icing wk6-ic1" /><div className="wk6-tier wk6-t1" />
            <div className="wk6-plate" />
            {[...Array(NUM)].map((_, i) => (
              <div key={i} className={`wk6-candle ${out[i] ? 'wk6-out' : ''}`} style={{ left: candleLeft(i) }}>
                <div className="wk6-wick" /><div className="wk6-flame" /><div className="wk6-smoke" />
              </div>
            ))}
          </div>

          <div className="wk6-blowmeter"><div className="wk6-fill" ref={fillRef} /></div>
          <button className="wk6-micbtn" onClick={startMic}>🎤 tap, then blow</button>
          <button className="wk6-tapfall" onClick={blowOne}>can't blow? tap to blow them out</button>
        </div>

        <div className="wk6-fx" ref={fxRef} />

        <div className={`wk6-reveal ${revealed ? 'wk6-on' : ''}`}>
          {preview
            ? (
              <>
                <div className="wk6-media" style={{ background: PHOTO, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(26px) brightness(.5)' }} />
                <div className="wk6-lock">
                  <div className="wk6-lockicon">🔒</div>
                  <div className="wk6-locktitle">Activate to unlock the ending 💛</div>
                  <div className="wk6-locksub">This is just a preview. Pay ₹159 to reveal the surprise and make the gift live.</div>
                  <a className="wk6-paybtn" href={ACTIVATE_URL}>Pay ₹159 to activate</a>
                </div>
              </>
            )
            : (gift?.revealVideoUrl
              ? <video className="wk6-media wk6-mediavid" src={gift.revealVideoUrl} autoPlay loop playsInline />
              : <div className="wk6-media" style={{ background: PHOTO, backgroundSize: 'cover', backgroundPosition: 'center' }} />)}
          <div className="wk6-vignette" />
          <div className="wk6-musicnote">♪ music playing</div>
          <div className="wk6-revinner">
            {!preview && <div className="wk6-msg" dangerouslySetInnerHTML={{ __html: MESSAGE }} />}
            <div className="wk6-from">— with all my love{FROM ? `, ${FROM}` : ''}</div>
            <div className="wk6-revbtns">
              {!preview && <button className="wk6-share" onClick={share}>📤 Share this to your story</button>}
              {preview && <a className="wk6-createbtn" href={CREATE_URL}>✨ Create your own</a>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=Caveat:wght@600&display=swap');
.wk6-stage{position:fixed;inset:0;max-width:520px;margin:0 auto;overflow:hidden;font-family:'Nunito',sans-serif}
.wk6-enterfade{position:fixed;inset:0;z-index:200;background:#fff;pointer-events:none;animation:wk6fade 1s ease forwards}
@keyframes wk6fade{0%{opacity:1}100%{opacity:0;visibility:hidden}}
.wk6-cakescene{position:absolute;inset:0;z-index:10;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:26px;background:radial-gradient(120% 90% at 50% 16%,#3a2150 0%,#2a1740 45%,#1d1030 100%);transition:opacity .7s,transform .7s}
.wk6-cakescene.wk6-gone{opacity:0;transform:scale(1.1);pointer-events:none}
.wk6-ctitle{font-family:'Fredoka';font-weight:600;font-size:23px;color:#ffe6f2;z-index:5}
.wk6-csub{font-size:15px;color:#d6b8e6;margin-top:6px;min-height:22px;z-index:5}
.wk6-cake{position:relative;width:230px;height:200px;margin:24px auto 0}
.wk6-plate{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:230px;height:24px;border-radius:50%;background:radial-gradient(circle,#fff,#e8d6f0);box-shadow:0 14px 30px rgba(0,0,0,.4)}
.wk6-tier{position:absolute;left:50%;transform:translateX(-50%);border-radius:14px}
.wk6-t1{bottom:16px;width:180px;height:74px;background:linear-gradient(180deg,#ff9ec4,#ec5a96);box-shadow:inset 0 -10px 0 rgba(0,0,0,.08)}
.wk6-t2{bottom:84px;width:128px;height:58px;background:linear-gradient(180deg,#ffd27f,#ffb05a)}
.wk6-icing{position:absolute;left:50%;transform:translateX(-50%);height:16px}
.wk6-ic1{bottom:84px;width:180px;background:radial-gradient(circle at 10px 0,#fff 0 9px,transparent 10px) repeat-x;background-size:20px 16px}
.wk6-ic2{bottom:142px;width:128px;background:radial-gradient(circle at 10px 0,#fff 0 9px,transparent 10px) repeat-x;background-size:20px 16px}
.wk6-candle{position:absolute;bottom:142px;width:8px;height:34px;border-radius:3px;background:repeating-linear-gradient(45deg,#ffd27f,#ffd27f 5px,#ff9ec4 5px,#ff9ec4 10px)}
.wk6-wick{position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:2px;height:5px;background:#3a2a18}
.wk6-flame{position:absolute;top:-20px;left:50%;transform:translateX(-50%);width:14px;height:20px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:radial-gradient(circle at 50% 70%,#fff 0 2px,#ffe07a 3px,#ff9a1f 8px,#ff5a1f 12px);transform-origin:bottom center;animation:wk6flick .25s ease-in-out infinite alternate;box-shadow:0 0 18px 6px rgba(255,160,40,.55)}
@keyframes wk6flick{0%{transform:translateX(-50%) rotate(-4deg) scaleY(1)}100%{transform:translateX(-50%) rotate(4deg) scaleY(1.12)}}
.wk6-candle.wk6-out .wk6-flame{display:none}
.wk6-smoke{position:absolute;top:-22px;left:50%;width:6px;height:6px;border-radius:50%;background:rgba(220,220,230,.6);opacity:0}
.wk6-candle.wk6-out .wk6-smoke{animation:wk6smoke 1.1s ease-out forwards}
@keyframes wk6smoke{0%{opacity:.7;transform:translate(-50%,0) scale(.6)}100%{opacity:0;transform:translate(-50%,-40px) scale(1.6)}}
.wk6-blowmeter{width:min(78vw,300px);height:10px;border-radius:6px;background:rgba(255,255,255,.18);margin:22px auto 0;overflow:hidden;z-index:5}
.wk6-fill{height:100%;width:0;background:linear-gradient(90deg,#7fe3d0,#ffd27f,#ff7ab0);transition:width .12s}
.wk6-micbtn{margin-top:18px;font-family:'Fredoka';font-weight:600;font-size:15px;color:#3a2150;background:#ffe6f2;border:none;border-radius:26px;padding:13px 26px;cursor:pointer;z-index:5;box-shadow:0 8px 20px rgba(0,0,0,.3)}
.wk6-tapfall{margin-top:14px;font-size:13.5px;color:#d6b8e6;text-decoration:underline;cursor:pointer;background:none;border:none;z-index:5;font-family:'Nunito'}
.wk6-fx{position:absolute;inset:0;z-index:20;pointer-events:none;overflow:hidden}
.wk6-confetti{position:absolute;top:-20px;width:9px;height:14px;border-radius:2px;animation:wk6fall linear forwards}
@keyframes wk6fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(120vh) rotate(720deg);opacity:.9}}
.wk6-balloon{position:absolute;bottom:-120px;width:46px;height:58px;border-radius:50%;animation:wk6floatUp linear forwards}
.wk6-balloon::after{content:"";position:absolute;left:50%;bottom:-40px;width:1px;height:40px;background:rgba(255,255,255,.5)}
.wk6-balloon::before{content:"";position:absolute;left:48%;bottom:-3px;border:5px solid transparent;border-top-color:inherit}
@keyframes wk6floatUp{0%{transform:translateY(0) translateX(0)}100%{transform:translateY(-130vh) translateX(20px);opacity:.95}}
.wk6-crack{position:absolute;font-size:26px;animation:wk6crk .8s ease-out forwards}
@keyframes wk6crk{0%{opacity:1;transform:translate(-50%,-50%) scale(.3)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1.2)}}
.wk6-reveal{position:absolute;inset:0;z-index:40;display:none;flex-direction:column;align-items:center;justify-content:flex-end;text-align:center;overflow:hidden;background:#120a1e}
.wk6-lock{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 32px;color:#fff}
.wk6-lockicon{font-size:54px;margin-bottom:14px}
.wk6-locktitle{font-family:'Fredoka';font-weight:600;font-size:22px;margin-bottom:8px}
.wk6-locksub{font-family:'Nunito';font-size:14px;line-height:1.5;color:rgba(255,255,255,.8);max-width:300px}
.wk6-paybtn{margin-top:18px;display:inline-block;font-family:'Fredoka';font-weight:600;font-size:16px;color:#3a1030;background:linear-gradient(180deg,#ffd27f,#ff9ec4);border-radius:30px;padding:14px 32px;text-decoration:none;box-shadow:0 10px 26px rgba(255,140,180,.45)}
.wk6-reveal.wk6-on{display:flex;animation:wk6revfade 1.2s ease}
@keyframes wk6revfade{from{opacity:0}to{opacity:1}}
.wk6-media{position:absolute;inset:0;animation:wk6kenburns 14s ease-out forwards}
video.wk6-media,.wk6-mediavid{width:100%;height:100%;object-fit:cover}
@keyframes wk6kenburns{0%{transform:scale(1.12)}100%{transform:scale(1)}}
.wk6-vignette{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,5,20,.15) 0%,transparent 30%,transparent 45%,rgba(10,5,20,.85) 100%)}
.wk6-revinner{position:relative;z-index:2;padding:30px 26px;width:100%}
.wk6-msg{font-family:'Caveat',cursive;font-weight:600;font-size:30px;line-height:1.25;color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.6);max-width:420px;margin:0 auto;animation:wk6msgUp 1s ease .5s both}
@keyframes wk6msgUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.wk6-from{font-family:'Nunito';font-weight:700;font-size:15px;color:#ffd6ea;margin-top:12px;opacity:.95;animation:wk6msgUp 1s ease .8s both}
.wk6-revbtns{margin-top:22px;display:flex;flex-direction:column;gap:11px;align-items:center;animation:wk6msgUp 1s ease 1.1s both}
.wk6-share{font-family:'Fredoka';font-weight:600;font-size:16px;color:#3a1030;background:linear-gradient(180deg,#ffd27f,#ff9ec4);border:none;border-radius:30px;padding:15px 34px;cursor:pointer;box-shadow:0 10px 26px rgba(255,140,180,.45)}
.wk6-createbtn{font-family:'Nunito';font-weight:700;font-size:14px;color:#fff;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3);border-radius:26px;padding:12px 28px;cursor:pointer;text-decoration:none}
.wk6-musicnote{position:absolute;top:12px;left:12px;z-index:3;font-size:11px;color:rgba(255,255,255,.6)}
@media (prefers-reduced-motion: reduce){*{animation-duration:.001s!important}}
`;
