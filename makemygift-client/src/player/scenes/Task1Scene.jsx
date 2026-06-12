import { useEffect, useMemo, useRef, useState } from 'react';

// Task 1 — "do you love them?" The No button shrinks (and the star gets sadder)
// while Yes grows, until No vanishes and Yes fills the screen. Saying yes makes
// the star light up with heart-eyes; the confirmation's continue calls onNext().

const NO_LINES = ['No', 'Are you sure?', 'Really?', 'Think again 🙈', 'Last chance…', 'No? 🥺'];
const NO_THOUGHTS = ['aww… no? 🥺', 'please? 💔', "don't break my point 😣", "you don't mean it…", 'say yes? please 🙏'];

// a clean, smooth heart silhouette (premium look, no chunky borders)
const HEART_D = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

export default function Task1Scene({ onNext, gift }) {
  const partner = gift?.fromName || 'them';

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('ask'); // ask | takeover | done
  const [expression, setExpression] = useState('neutral'); // neutral | sad | happy
  const [hopeful, setHopeful] = useState(false);
  const [tearOn, setTearOn] = useState(false);
  const [thought, setThought] = useState({ text: '', on: false });
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [leaving, setLeaving] = useState(false);

  const finish = () => { setLeaving(true); T(() => onNext(), 650); };

  const starRef = useRef(null);
  const burstRef = useRef(null);
  const timers = useRef([]);
  const T = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); return id; };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const ambient = useMemo(() => [...Array(12)].map(() => ({
    left: Math.random() * 100, size: 12 + Math.random() * 22, dur: 7 + Math.random() * 7, delay: -Math.random() * 10,
  })), []);

  const noScale = Math.max(0, 1 - step * 0.26);
  const yesW = 130 + step * 44, yesH = 56 + step * 16, yesF = 18 + step * 4;

  const flashStar = (cls, ms) => {
    const el = starRef.current; if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
    T(() => el.classList.remove(cls), ms);
  };

  const hearts = (x, y) => {
    const layer = burstRef.current; if (!layer) return;
    for (let i = 0; i < 10; i++) {
      const b = document.createElement('div');
      b.className = 'wk3-burst'; b.textContent = ['💕', '💖', '💗', '✨', '💘'][i % 5];
      b.style.left = x + 'px'; b.style.top = y + 'px';
      const a = Math.random() * 6.28, d = 60 + Math.random() * 90;
      b.style.setProperty('--tx', `calc(-50% + ${Math.cos(a) * d}px)`);
      b.style.setProperty('--ty', `calc(-50% + ${Math.sin(a) * d}px)`);
      layer.appendChild(b); setTimeout(() => b.remove(), 900);
    }
  };

  const onNo = (e) => {
    e?.preventDefault();
    const ns = step + 1; setStep(ns);
    setExpression('sad'); flashStar('wk3-sad', 520);
    setTearOn(true); T(() => setTearOn(false), 1200);
    setThought({ text: NO_THOUGHTS[Math.min(ns - 1, NO_THOUGHTS.length - 1)], on: true });
    T(() => setThought((t) => ({ ...t, on: false })), 1400);
    if (Math.max(0, 1 - ns * 0.26) <= 0) setPhase('takeover');
  };
  const sayYes = (e) => {
    setExpression('happy'); flashStar('wk3-happy', 600);
    const x = (e && e.clientX) || window.innerWidth / 2, y = (e && e.clientY) || window.innerHeight / 2;
    hearts(x, y); if (navigator.vibrate) navigator.vibrate([20, 40, 30]);
    T(() => setPhase('done'), 560);
  };

  const dodge = () => { if (step < 2) setNoOffset({ x: Math.random() * 40 - 20, y: Math.random() * 20 - 10 }); };

  // star face
  const heartEyes = expression === 'happy';
  const blush = (expression === 'happy' || hopeful) ? 6 : 4.5;
  const mouthD = expression === 'happy' ? 'M50 64 q10 12 20 0 q-10 7 -20 0Z'
    : expression === 'sad' ? 'M52 70 q8 -7 16 0'
      : hopeful ? 'M52 65 q8 9 16 0 q-8 6 -16 0Z'
        : 'M52 66 q8 8 16 0 q-8 5 -16 0Z';

  return (
    <>
      <style>{CSS}</style>
      <div className="wk3-stage">
        <div className="wk3-enterfade" />
        {ambient.map((h, i) => (
          <div key={i} className="wk3-floatheart" style={{ left: `${h.left}%`, width: h.size, animationDuration: `${h.dur}s`, animationDelay: `${h.delay}s` }}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d={HEART_D} /></svg>
          </div>
        ))}

        <div className="wk3-ask">
          <div className={`wk3-thought ${thought.on ? 'wk3-show' : ''}`}>{thought.text}</div>
          <svg ref={starRef} className="wk3-star" viewBox="0 0 120 120" style={{ overflow: 'visible' }}>
            <path d="M60 12 L73 44 L108 47 L81 69 L90 104 L60 84 L30 104 L39 69 L12 47 L47 44 Z" fill="url(#wk3sg)" stroke="url(#wk3sg)" strokeWidth="9" strokeLinejoin="round" />
            {!heartEyes ? (
              <g>
                <g style={{ transformOrigin: '51px 58px' }}><ellipse cx="51" cy="58" rx="4.5" ry="6.5" fill="#3a2a18" /><circle cx="52.5" cy="55.5" r="1.6" fill="#fff" /></g>
                <g style={{ transformOrigin: '69px 58px' }}><ellipse cx="69" cy="58" rx="4.5" ry="6.5" fill="#3a2a18" /><circle cx="70.5" cy="55.5" r="1.6" fill="#fff" /></g>
              </g>
            ) : (
              <g fill="#e23b78">
                <path d="M6 10 C2 6 0 4 0 2.5 A2.5 2.5 0 0 1 6 2.5 A2.5 2.5 0 0 1 12 2.5 C12 4 10 6 6 10 Z" transform="translate(45 51)" />
                <path d="M6 10 C2 6 0 4 0 2.5 A2.5 2.5 0 0 1 6 2.5 A2.5 2.5 0 0 1 12 2.5 C12 4 10 6 6 10 Z" transform="translate(63 51)" />
              </g>
            )}
            <circle cx="42" cy="66" r={blush} fill="#ff8aa0" opacity=".7" /><circle cx="78" cy="66" r={blush} fill="#ff8aa0" opacity=".7" />
            <path d={mouthD} fill="#7a2a18" />
            {tearOn && <ellipse className="wk3-tear wk3-show" cx="46" cy="68" rx="2.6" ry="3.6" fill="#7fd0ff" />}
            <defs><linearGradient id="wk3sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe14d" /><stop offset="1" stopColor="#ff9a1f" /></linearGradient></defs>
          </svg>
          <div className="wk3-q">Be honest with your heart…<br />do you love <span className="wk3-nm">{partner}</span>?</div>
          <div className="wk3-sub">the star is waiting, eyes all sparkly ✨</div>
        </div>

        <div className="wk3-btns">
          <button className="wk3-btn wk3-yes" style={{ width: yesW, height: yesH, fontSize: yesF }}
            onMouseEnter={() => setHopeful(true)} onMouseLeave={() => setHopeful(false)} onClick={sayYes}>Yes 💕</button>
          {phase === 'ask' && (
            <button className="wk3-btn wk3-no" style={{ transform: `translate(${noOffset.x}px,${noOffset.y}px) scale(${noScale})`, opacity: noScale <= 0.15 ? 0 : 1 }}
              onMouseEnter={dodge} onClick={onNo}>{NO_LINES[Math.min(step, NO_LINES.length - 1)]}</button>
          )}
        </div>

        {phase === 'takeover' && (
          <div className="wk3-yesfull" onClick={sayYes}><div className="wk3-big">YES 💖</div><div className="wk3-tap">(there was never another answer)</div></div>
        )}

        {phase === 'done' && (
          <div className="wk3-done">
            <div className="wk3-hh">
              <svg viewBox="0 0 24 24">
                <defs><linearGradient id="wk3hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff7ab0" /><stop offset="1" stopColor="#e23b78" /></linearGradient></defs>
                <path fill="url(#wk3hg)" d={HEART_D} />
              </svg>
            </div>
            <h2>Knew it.</h2>
            <p>Your heart said yes before your finger did.</p>
            <button className="wk3-next" onClick={finish}>continue →</button>
          </div>
        )}

        <div className="wk3-burstlayer" ref={burstRef} />
        {leaving && <div className="wk3-leavewash" />}
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap');
.wk3-stage{position:fixed;inset:0;max-width:520px;margin:0 auto;overflow:hidden;font-family:'Nunito',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:26px;background:radial-gradient(120% 90% at 50% 18%,#ffe3ee 0%,#ffd0e2 38%,#ffbcd6 70%,#ff9ec4 100%);animation:wk3stagein 1.1s ease}
@keyframes wk3stagein{0%{transform:scale(1.04)}100%{transform:scale(1)}}
.wk3-enterfade{position:fixed;inset:0;z-index:100;background:#fff;pointer-events:none;animation:wk3enterfade .9s ease forwards}
@keyframes wk3enterfade{0%{opacity:1}100%{opacity:0;visibility:hidden}}
.wk3-label{position:absolute;top:12px;left:0;right:0;text-align:center;font-family:'Fredoka';font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#b04a78;opacity:.6;z-index:60}
.wk3-floatheart{position:absolute;bottom:-30px;color:#ff7ab0;opacity:.45;animation:wk3fl linear infinite;z-index:1}
.wk3-floatheart svg{display:block;width:100%;height:auto;filter:drop-shadow(0 2px 5px rgba(236,59,126,.25))}
@keyframes wk3fl{0%{transform:translateY(0) rotate(0);opacity:0}12%{opacity:.55}100%{transform:translateY(-115vh) rotate(40deg);opacity:0}}
.wk3-ask{position:relative;z-index:5;max-width:420px}
.wk3-star{width:96px;margin:0 auto 10px;display:block;animation:wk3bob 3s ease-in-out infinite;transition:transform .3s}
@keyframes wk3bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.wk3-star.wk3-sad{animation:wk3shake .5s ease}
@keyframes wk3shake{0%,100%{transform:translateX(0) rotate(0)}20%{transform:translateX(-7px) rotate(-4deg)}40%{transform:translateX(7px) rotate(4deg)}60%{transform:translateX(-5px) rotate(-3deg)}80%{transform:translateX(5px) rotate(3deg)}}
.wk3-star.wk3-happy{animation:wk3hop .6s ease}
@keyframes wk3hop{0%,100%{transform:translateY(0)}30%{transform:translateY(-16px) scale(1.06)}60%{transform:translateY(0)}}
.wk3-tear{opacity:0}
.wk3-tear.wk3-show{opacity:1;animation:wk3teardrop 1.2s ease forwards}
@keyframes wk3teardrop{0%{opacity:0;transform:translateY(0)}30%{opacity:1}100%{opacity:0;transform:translateY(22px)}}
.wk3-thought{position:absolute;left:50%;top:-6px;transform:translateX(-30%) scale(.6);opacity:0;z-index:7;font-family:'Fredoka';font-weight:500;font-size:14px;color:#7a1f4a;background:#fff;padding:6px 12px;border-radius:14px;box-shadow:0 6px 16px rgba(160,74,120,.25);white-space:nowrap;transition:opacity .3s,transform .3s cubic-bezier(.34,1.5,.5,1);pointer-events:none}
.wk3-thought::after{content:"";position:absolute;left:34%;bottom:-7px;border:5px solid transparent;border-top-color:#fff}
.wk3-thought.wk3-show{opacity:1;transform:translateX(-30%) scale(1)}
.wk3-q{font-family:'Fredoka';font-weight:600;font-size:25px;line-height:1.28;color:#7a1f4a}
.wk3-q .wk3-nm{color:#e23b78}
.wk3-sub{font-size:16px;color:#9a4a6e;margin-top:8px}
.wk3-btns{position:relative;z-index:6;margin-top:26px;display:flex;align-items:center;justify-content:center;gap:18px;min-height:120px}
.wk3-btn{font-family:'Fredoka';font-weight:600;border:none;cursor:pointer;border-radius:40px;transition:transform .25s cubic-bezier(.34,1.5,.5,1),width .25s,height .25s,font-size .25s,opacity .3s;will-change:transform}
.wk3-yes{background:linear-gradient(180deg,#ff6aa0,#ec3b7e);color:#fff;box-shadow:0 10px 24px rgba(236,59,126,.4)}
.wk3-yes:active{transform:scale(.96)}
.wk3-no{background:#fff;color:#b04a78;width:120px;height:52px;font-size:17px;box-shadow:0 8px 18px rgba(160,74,120,.25)}
.wk3-yesfull{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;flex-direction:column;cursor:pointer;background:radial-gradient(circle at 50% 42%,#ff7ab0,#ec3b7e 70%,#c92b66);color:#fff;text-align:center;padding:28px;animation:wk3pop .4s ease}
@keyframes wk3pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
.wk3-yesfull .wk3-big{font-family:'Fredoka';font-weight:700;font-size:74px;line-height:1}
.wk3-yesfull .wk3-tap{font-size:16px;margin-top:14px;opacity:.92}
.wk3-done{position:fixed;inset:0;z-index:90;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:30px;background:radial-gradient(circle at 50% 40%,#fff0f6,#ffd6e6);color:#7a1f4a}
.wk3-hh{animation:wk3beat 1s ease-in-out infinite}
.wk3-hh svg{width:66px;height:66px;display:block;filter:drop-shadow(0 8px 18px rgba(236,59,126,.35))}
@keyframes wk3beat{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
.wk3-done h2{font-family:'Fredoka';font-weight:700;font-size:27px;margin-top:8px}
.wk3-done p{font-size:17px;color:#9a4a6e;margin-top:6px}
.wk3-next{margin-top:22px;font-family:'Fredoka';font-weight:600;font-size:15px;color:#fff;background:#ec3b7e;border:none;border-radius:26px;padding:13px 28px;cursor:pointer}
.wk3-burstlayer{position:fixed;inset:0;z-index:85;pointer-events:none}
.wk3-leavewash{position:fixed;inset:0;z-index:120;background:#fff;pointer-events:none;opacity:0;animation:wk3leave .7s ease forwards}
@keyframes wk3leave{0%{opacity:0}100%{opacity:1}}
.wk3-burst{position:fixed;font-size:24px;pointer-events:none;animation:wk3bz .9s ease-out forwards}
@keyframes wk3bz{0%{opacity:1;transform:translate(-50%,-50%) scale(.4)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1.2)}}
@media (prefers-reduced-motion: reduce){*{animation-duration:.001s!important}}
`;
