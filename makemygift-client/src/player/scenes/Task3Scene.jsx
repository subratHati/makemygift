import { useEffect, useRef, useState } from 'react';

// Task 3 — "say it back". The buyer sets a question + answer; the player speaks
// the answer (Web Speech API), matched forgivingly. After two misses the answer
// is revealed as a hint. Typed fallback for blocked mic / unsupported browsers.
export default function Task3Scene({ onNext, gift }) {
  const QUESTION = gift?.voiceQuestion || 'How much do you love me?';
  const ANSWER = gift?.voiceAnswer || 'I love you to the moon and back';
  const asker = gift?.fromName || null;

  const [sub, setSub] = useState('tap the mic and say your answer out loud 🎤');
  const [heard, setHeard] = useState('');
  const [miclbl, setMiclbl] = useState('tap to speak');
  const [listening, setListening] = useState(false);
  const [hintOn, setHintOn] = useState(false);
  const [typeOn, setTypeOn] = useState(false);
  const [typeVal, setTypeVal] = useState('');
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const recRef = useRef(null);
  const supportedRef = useRef(false);
  const triesRef = useRef(0);
  const passedRef = useRef(false);
  const listeningRef = useRef(false);
  const checkRef = useRef(() => {});
  const burstRef = useRef(null);

  const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
  const similar = (a, b) => {
    a = norm(a); b = norm(b); if (!a) return 0;
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) return 0.96;
    const wa = a.split(' '), wb = new Set(b.split(' '));
    let hit = 0; wa.forEach((w) => { if (wb.has(w)) hit++; });
    return hit / Math.max(wa.length, b.split(' ').length);
  };

  const sparkle = () => {
    const layer = burstRef.current; if (!layer) return;
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('div'); s.className = 'wk5-spark'; s.textContent = ['✨', '💖', '🌟', '💫'][i % 4];
      s.style.left = (window.innerWidth / 2) + 'px'; s.style.top = (window.innerHeight * 0.4) + 'px';
      const a = Math.random() * 6.28, d = 70 + Math.random() * 120;
      s.style.setProperty('--tx', `calc(-50% + ${Math.cos(a) * d}px)`); s.style.setProperty('--ty', `calc(-50% + ${Math.sin(a) * d}px)`);
      layer.appendChild(s); setTimeout(() => s.remove(), 900);
    }
  };

  const pass = () => {
    if (passedRef.current) return; passedRef.current = true;
    listeningRef.current = false; setListening(false);
    sparkle(); if (navigator.vibrate) navigator.vibrate([20, 40, 30]);
    setTimeout(() => setDone(true), 700);
  };

  const check = (said) => {
    setHeard(`you said: “${said}”`);
    if (similar(said, ANSWER) >= 0.7) { pass(); return; }
    triesRef.current += 1;
    if (triesRef.current >= 2) { setHintOn(true); setSub("read it out loud, just like that 💕"); }
    else setSub("aww… say it like you mean it 💕 try again");
    setListening(false); listeningRef.current = false;
  };
  checkRef.current = check;

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    supportedRef.current = !!SR;
    if (!SR) return;
    const rec = new SR(); rec.lang = 'en-US'; rec.interimResults = true; rec.maxAlternatives = 3;
    rec.onresult = (e) => {
      let interim = '', finalTxt = '';
      for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) finalTxt += r[0].transcript; else interim += r[0].transcript; }
      if (interim) setHeard(`listening… “${interim}”`);
      if (finalTxt) checkRef.current(finalTxt);
    };
    rec.onend = () => { listeningRef.current = false; setListening(false); if (!passedRef.current) setMiclbl('tap to try again'); };
    rec.onerror = (e) => {
      listeningRef.current = false; setListening(false);
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { setSub('mic blocked — you can type it instead below'); setTypeOn(true); }
      else setMiclbl('tap to try again');
    };
    recRef.current = rec;
    return () => { try { rec.abort(); } catch {} };
  }, []);

  const startListen = () => {
    if (passedRef.current) return;
    if (!supportedRef.current) { setSub("your browser can't hear — type it instead below 💕"); setTypeOn(true); return; }
    if (listeningRef.current) { try { recRef.current.stop(); } catch {} return; }
    try { recRef.current.start(); listeningRef.current = true; setListening(true); setMiclbl('listening… speak now'); setHeard(''); }
    catch {}
  };

  const submitTyped = () => { if (typeVal.trim()) check(typeVal.trim()); };
  const finish = () => { setLeaving(true); setTimeout(() => onNext(), 650); };

  return (
    <>
      <style>{CSS}</style>
      <div className="wk5-stage">
        <div className="wk5-enterfade" />

        <svg className={`wk5-star ${listening ? 'wk5-listening' : ''}`} viewBox="0 0 120 120">
          <path d="M60 12 L73 44 L108 47 L81 69 L90 104 L60 84 L30 104 L39 69 L12 47 L47 44 Z" fill="url(#wk5sg)" stroke="url(#wk5sg)" strokeWidth="9" strokeLinejoin="round" />
          <g style={{ transformOrigin: '51px 58px' }}><ellipse cx="51" cy="58" rx="4.5" ry="6.5" fill="#3a2a18" /><circle cx="52.5" cy="55.5" r="1.6" fill="#fff" /></g>
          <g style={{ transformOrigin: '69px 58px' }}><ellipse cx="69" cy="58" rx="4.5" ry="6.5" fill="#3a2a18" /><circle cx="70.5" cy="55.5" r="1.6" fill="#fff" /></g>
          <circle cx="42" cy="66" r="4.5" fill="#ff8aa0" opacity=".7" /><circle cx="78" cy="66" r="4.5" fill="#ff8aa0" opacity=".7" />
          <path d="M52 66 q8 8 16 0 q-8 5 -16 0Z" fill="#7a2a18" />
          <defs><linearGradient id="wk5sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe14d" /><stop offset="1" stopColor="#ff9a1f" /></linearGradient></defs>
        </svg>

        <div className="wk5-q"><span className="wk5-by">{asker ? `${asker} asks…` : 'They ask…'}</span>{QUESTION}</div>
        <div className="wk5-sub">{sub}</div>
        <div className="wk5-heard" dangerouslySetInnerHTML={{ __html: heard ? heard.replace('“', '<b>“').replace('”', '”</b>') : '' }} />

        <button className={`wk5-mic ${listening ? 'wk5-live' : ''}`} aria-label="speak" onClick={startListen}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
        </button>
        <div className="wk5-miclbl">{miclbl}</div>

        {hintOn && (
          <div className="wk5-hint">
            <div className="wk5-h">psst… the words they're waiting for are 💕</div>
            <div className="wk5-a">{ANSWER}</div>
          </div>
        )}

        <button className="wk5-typelink" onClick={() => setTypeOn((v) => !v)}>can't speak right now? type it instead</button>
        {typeOn && (
          <div className="wk5-typebox">
            <input value={typeVal} onChange={(e) => setTypeVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submitTyped(); }} placeholder="type your answer…" />
            <button onClick={submitTyped}>send 💌</button>
          </div>
        )}

        {done && (
          <div className="wk5-done">
            <div className="wk5-hh">
  <svg viewBox="0 0 24 24">
    <defs><linearGradient id="wk5hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff7ab0" /><stop offset="1" stopColor="#e23b78" /></linearGradient></defs>
    <path fill="url(#wk5hg)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
</div>
            <h2>That's exactly it.</h2>
            <p>{asker ? `${asker}'s heart just melted a little.` : 'Their heart just melted a little.'}</p>
            <button className="wk5-next" onClick={finish}>continue →</button>
          </div>
        )}

        <div className="wk5-burstlayer" ref={burstRef} />
        {leaving && <div className="wk5-leavewash" />}
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap');
.wk5-stage{position:fixed;inset:0;max-width:520px;margin:0 auto;overflow:hidden;font-family:'Nunito',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:26px;background:radial-gradient(120% 90% at 50% 14%,#fff0e6 0%,#ffe0d0 38%,#ffc9b8 70%,#ffb0a0 100%);animation:wk5stagein .9s ease}
@keyframes wk5stagein{0%{transform:scale(1.04)}100%{transform:scale(1)}}
.wk5-enterfade{position:fixed;inset:0;z-index:100;background:#fff;pointer-events:none;animation:wk5fade 1s ease forwards}
@keyframes wk5fade{0%{opacity:1}100%{opacity:0;visibility:hidden}}
.wk5-label{position:absolute;top:12px;left:0;right:0;text-align:center;font-family:'Fredoka';font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#a85a44;opacity:.6;z-index:60}
.wk5-star{width:96px;margin:0 auto 6px;display:block;animation:wk5bob 3s ease-in-out infinite}
@keyframes wk5bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.wk5-star.wk5-listening{animation:wk5lis .8s ease-in-out infinite}
@keyframes wk5lis{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.wk5-q{font-family:'Fredoka';font-weight:600;font-size:25px;line-height:1.3;color:#7a2f1f;max-width:420px;z-index:5}
.wk5-by{display:block;font-size:13px;font-weight:500;color:#b06a52;letter-spacing:.04em;margin-bottom:4px}
.wk5-sub{font-size:15.5px;color:#a05a44;margin-top:8px;min-height:22px;z-index:5}
.wk5-heard{margin-top:14px;min-height:30px;font-size:17px;color:#7a2f1f;font-style:italic;opacity:.9;z-index:5;max-width:420px}
.wk5-heard b{font-style:normal}
.wk5-mic{position:relative;z-index:6;margin-top:18px;width:96px;height:96px;border-radius:50%;border:none;cursor:pointer;background:radial-gradient(circle at 50% 38%,#ff8a6a,#ec4f2e);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 26px rgba(236,79,46,.4);transition:transform .2s}
.wk5-mic:active{transform:scale(.95)}
.wk5-mic svg{width:40px;height:40px}
.wk5-mic.wk5-live{animation:wk5ring 1.4s ease-in-out infinite}
@keyframes wk5ring{0%,100%{box-shadow:0 12px 26px rgba(236,79,46,.4),0 0 0 0 rgba(236,79,46,.45)}50%{box-shadow:0 12px 26px rgba(236,79,46,.4),0 0 0 18px rgba(236,79,46,0)}}
.wk5-miclbl{font-family:'Fredoka';font-weight:500;font-size:14px;color:#a05a44;margin-top:10px;z-index:6}
.wk5-hint{margin-top:16px;max-width:420px;background:rgba(255,255,255,.78);border-radius:16px;padding:14px 18px;z-index:6;animation:wk5hp .5s ease}
@keyframes wk5hp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.wk5-h{font-family:'Fredoka';font-weight:500;font-size:13px;color:#b06a52}
.wk5-a{font-family:'Fredoka';font-weight:600;font-size:19px;color:#e2452a;margin-top:4px;line-height:1.3}
.wk5-typelink{margin-top:16px;font-size:14px;color:#c25a3a;text-decoration:underline;cursor:pointer;z-index:6;background:none;border:none;font-family:'Nunito';font-weight:600}
.wk5-typebox{margin-top:14px;z-index:6;width:min(86vw,380px)}
.wk5-typebox input{width:100%;font-family:'Nunito';font-size:16px;padding:13px 16px;border-radius:24px;border:2px solid #f0b8a4;outline:none;text-align:center}
.wk5-typebox button{margin-top:10px;font-family:'Fredoka';font-weight:600;font-size:15px;color:#fff;background:#ec4f2e;border:none;border-radius:24px;padding:11px 26px;cursor:pointer}
.wk5-done{position:fixed;inset:0;z-index:90;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:30px;background:radial-gradient(circle at 50% 40%,#fff3ec,#ffd9c9);color:#7a2f1f}
.wk5-hh{width:66px;height:66px;animation:wk5beat 1s ease-in-out infinite}
.wk5-hh svg{width:100%;height:100%;display:block;filter:drop-shadow(0 8px 18px rgba(236,59,126,.35))}
@keyframes wk5beat{0%,100%{transform:scale(1)}50%{transform:scale(1.16)}}
.wk5-done h2{font-family:'Fredoka';font-weight:700;font-size:26px;margin-top:8px}
.wk5-done p{font-size:17px;color:#a05a44;margin-top:6px;max-width:340px}
.wk5-next{margin-top:22px;font-family:'Fredoka';font-weight:600;font-size:15px;color:#fff;background:#ec4f2e;border:none;border-radius:26px;padding:13px 28px;cursor:pointer}
.wk5-burstlayer{position:fixed;inset:0;z-index:85;pointer-events:none}
.wk5-spark{position:fixed;font-size:22px;pointer-events:none;animation:wk5sp .9s ease-out forwards}
@keyframes wk5sp{0%{opacity:1;transform:translate(-50%,-50%) scale(.4)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1.1)}}
.wk5-leavewash{position:fixed;inset:0;z-index:120;background:#fff;pointer-events:none;opacity:0;animation:wk5leave .7s ease forwards}
@keyframes wk5leave{0%{opacity:0}100%{opacity:1}}
@media (prefers-reduced-motion: reduce){*{animation-duration:.001s!important}}
`;
