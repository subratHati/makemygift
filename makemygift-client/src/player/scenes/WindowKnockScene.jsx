import { useEffect, useRef, useState } from 'react';

// Section 1 — POV inside a room facing the window. The star hangs OUTSIDE,
// seen framed within the window opening. Tap targets glow; one instruction line
// at the top guides each step. Flow: knock -> tap window -> tap glowing letter
// -> read (bottom sheet) -> Close -> tap the star's glowing hand -> onNext.
const LIMB = '#002D2D';

export default function WindowKnockScene({ onNext, gift }) {
  const name = gift?.recipientName || 'friend';
  const sender = gift?.fromName || 'someone who loves you';

  const [opened, setOpened] = useState(false);
  const [knocked, setKnocked] = useState(false);
  const [letterInHand, setLetterInHand] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [handReady, setHandReady] = useState(false);

  const windowRef = useRef(null);
  const knockTimer = useRef(null);
  const audio = useRef({ ctx: null });

  const ensureAudio = () => { if (audio.current.ctx) { if (audio.current.ctx.state === 'suspended') audio.current.ctx.resume(); return; } try { audio.current.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { } };
  const knockSound = () => { const ctx = audio.current.ctx; if (!ctx) return;[0, 0.14].forEach((t) => { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = 96; const g = ctx.createGain(); g.gain.value = 0; o.connect(g); g.connect(ctx.destination); const s = ctx.currentTime + t; g.gain.linearRampToValueAtTime(0.45, s + 0.005); g.gain.exponentialRampToValueAtTime(0.001, s + 0.13); o.start(s); o.stop(s + 0.15); }); };
  const chime = (seq) => { const ctx = audio.current.ctx; if (!ctx) return; seq.forEach(([f, t]) => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; const g = ctx.createGain(); g.gain.value = 0; o.connect(g); g.connect(ctx.destination); const s = ctx.currentTime + t; g.gain.linearRampToValueAtTime(0.2, s + 0.02); g.gain.exponentialRampToValueAtTime(0.001, s + 1.1); o.start(s); o.stop(s + 1.2); }); };

  useEffect(() => {
    const doKnock = () => { const el = windowRef.current; if (!el) return; el.classList.remove('wk-shake'); void el.offsetWidth; el.classList.add('wk-shake'); knockSound(); setKnocked(true); };
    const first = setTimeout(doKnock, 1000);
    knockTimer.current = setInterval(doKnock, 3000);
    return () => { clearTimeout(first); clearInterval(knockTimer.current); };
  }, []);

  const openWindow = () => { if (opened) return; ensureAudio(); clearInterval(knockTimer.current); setOpened(true); chime([[392, 0], [523, 0.12]]); setTimeout(() => setLetterInHand(true), 1300); };
  const openLetter = (e) => { e?.stopPropagation(); if (!letterInHand) return; ensureAudio(); chime([[660, 0], [880, 0.12]]); setShowInvite(true); setTimeout(() => chime([[523, 0], [659, 0.12], [784, 0.24]]), 200); };
  const closeLetter = (e) => { e?.stopPropagation(); ensureAudio(); chime([[523, 0], [659, 0.14], [784, 0.28], [1046, 0.42]]); if (navigator.vibrate) navigator.vibrate(30); setShowInvite(false); setTimeout(() => onNext(), 500); };
  const goWithStar = (e) => { e?.stopPropagation(); if (!handReady) return; ensureAudio(); chime([[523, 0], [659, 0.14], [784, 0.28], [1046, 0.42]]); if (navigator.vibrate) navigator.vibrate(30); setTimeout(() => onNext(), 500); };

  let banner = '';
  if (!opened) banner = 'Someone is knocking — tap the window to open it';
  else if (showInvite) banner = '';
  else if (handReady) banner = "Tap the star's glowing hand ✋ to go";
  else if (letterInHand) banner = "Tap the glowing letter 💌 in the star's hand";

  return (
    <>
      <style>{CSS}</style>
      <div className="wk-stage" onPointerDown={ensureAudio}>
        {banner && <div className="wk-banner">{banner}</div>}

        {/* room dressing */}
        <div className="wk-floor" />
        <div className="wk-baseboard" />
        <div className="wk-wainscot" />
        <div className="wk-picture"><svg viewBox="0 0 60 46"><rect x="2" y="2" width="56" height="42" rx="2" fill="#fff" stroke="#caa37e" strokeWidth="3" /><path d="M5 38 L22 22 L33 32 L44 18 L55 30 L55 41 L5 41 Z" fill="#bfe3c0" /><circle cx="46" cy="14" r="4" fill="#ffd34d" /></svg></div>
        <div className="wk-plant"><svg viewBox="0 0 70 90"><path d="M35 90 V44" stroke="#3c5a3a" strokeWidth="3" fill="none" /><path d="M35 56 q-26 -8 -28 -32 q24 2 28 32" fill="#4f8a4d" /><path d="M35 50 q26 -8 28 -32 q-24 2 -28 32" fill="#5fa15c" /><path d="M35 46 q-5 -26 7 -40 q9 22 -7 40" fill="#4f8a4d" /><path d="M16 90 h38 l-5 -28 h-28 z" fill="#c8744f" /></svg></div>
        <div className="wk-rod" />
        <div className="wk-curtain left" /><div className="wk-curtain right" />

        {/* the window (star lives INSIDE it -> looks outside) */}
        <div className={`wk-window ${opened ? 'open' : ''}`} ref={windowRef} onClick={openWindow}>
          <div className="wk-frame">
            <div className="wk-exterior">
              <div className="wk-sun" />
              <div className="wk-cloud" style={{ top: '14%', left: '8%', width: 58, height: 18 }} />
              <div className="wk-cloud" style={{ top: '30%', right: '12%', width: 44, height: 15 }} />

              {/* hanging star, framed by the window */}
              <div className={`wk-starwrap ${opened ? 'show' : ''} ${handReady ? 'flirt' : ''}`}>
                <div className="wk-dropper">
                  <div className="wk-sway">
                    <svg viewBox="0 0 200 300" width="150" style={{ overflow: 'visible' }}>
                      <g className="wk-limb" stroke={LIMB} strokeWidth="10"><path d="M86 150 q-14 56 -8 110" /><circle cx="80" cy="262" r="9" fill={LIMB} stroke="none" /></g>
                      <g className="wk-limb" stroke={LIMB} strokeWidth="10"><path d="M114 150 q14 56 8 110" /><circle cx="120" cy="262" r="9" fill={LIMB} stroke="none" /></g>
                      {/* left arm gripping the top of the window (no rope) */}
                      <g className="wk-limb" stroke={LIMB} strokeWidth="10"><path d="M62 90 q-28 -34 -18 -80" /><circle cx="44" cy="10" r="9" fill={LIMB} stroke="none" /></g>
                      {/* right arm: holds letter / offers hand */}
                      <g className="wk-rightarm">
                        <g className="wk-limb" stroke={LIMB} strokeWidth="10"><path d="M138 92 q42 12 46 50" /></g>
                        <circle cx="184" cy="142" r="12" fill={LIMB} stroke="none" />
                        {/* glowing letter in the hand */}
                        {letterInHand && (
                          <g onClick={openLetter} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
                            <circle className="wk-hl" cx="182" cy="128" r="26" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
                            <g transform="translate(165 116) rotate(8)">
                              <rect x="0" y="0" width="36" height="26" rx="3" fill="#fff" stroke="#e2d6c2" strokeWidth="1.5" />
                              <path d="M0 2 L18 15 L36 2" fill="none" stroke="#e2d6c2" strokeWidth="1.5" />
                              <circle cx="18" cy="14" r="5" fill="#ff5fa2" />
                            </g>
                          </g>
                        )}
                        {/* glowing offered hand */}
                        {handReady && (
                          <g onClick={goWithStar} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
                            <circle className="wk-hl" cx="184" cy="142" r="26" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
                            <circle cx="184" cy="142" r="30" fill="transparent" />
                          </g>
                        )}
                      </g>
                      {/* body */}
                      <path d="M100 18 L120 64 L170 68 L132 100 L145 150 L100 122 L55 150 L68 100 L30 68 L80 64 Z" fill="url(#wkStar)" stroke="url(#wkStar)" strokeWidth="13" strokeLinejoin="round" />
                      <ellipse cx="80" cy="58" rx="20" ry="12" fill="#fff" opacity=".25" />
                      <g className={handReady ? 'wk-wink' : 'wk-blink'} style={{ transformOrigin: '84px 86px' }}><ellipse cx="84" cy="86" rx="7" ry="10" fill="#3a2a18" /><circle cx="86" cy="82" r="2.5" fill="#fff" /></g>
                      <g className="wk-blink" style={{ transformOrigin: '116px 86px' }}><ellipse cx="116" cy="86" rx="7" ry="10" fill="#3a2a18" /><circle cx="118" cy="82" r="2.5" fill="#fff" /></g>
                      <circle cx="70" cy="98" r="7" fill="#ff8aa0" opacity=".6" /><circle cx="130" cy="98" r="7" fill="#ff8aa0" opacity=".6" />
                      <path d="M88 100 q12 14 24 0 q-12 6 -24 0Z" fill="#7a2a18" />
                      <defs><linearGradient id="wkStar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffe14d" /><stop offset="1" stopColor="#ff9a1f" /></linearGradient></defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="wk-sash left" /><div className="wk-sash right" />
            <div className="wk-mullion" />
          </div>
          {!opened && <div className={`wk-latch ${knocked ? 'glow' : ''}`} />}
        </div>

        {/* message as a bottom sheet (letter stays in the star's hand) */}
        <div className={`wk-sheet ${showInvite ? 'on' : ''}`}>
          <div className="wk-ic">🎁</div>
          <h1>Hi <span className="nm">{name}</span>, a surprise awaits you!</h1>
          <p>You're invited to visit <b>our world</b>, by <span className="snd">{sender}</span> ✨</p>
          <button className="wk-close" onClick={closeLetter}>Let's go ✨</button>
        </div>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&family=Nunito:wght@400;600;700&display=swap');
.wk-stage{position:fixed;inset:0;max-width:520px;margin:0 auto;overflow:hidden;font-family:'Nunito',system-ui,sans-serif;background:linear-gradient(180deg,#fbeede 0%,#f4ddc2 58%,#ecd0b0 100%)}
.wk-banner{position:absolute;left:50%;top:6%;transform:translateX(-50%);z-index:30;font-family:'Fredoka';font-weight:500;font-size:14px;color:#5a4630;background:rgba(255,255,255,.92);padding:10px 18px;border-radius:24px;text-align:center;max-width:90vw;box-shadow:0 6px 18px rgba(0,0,0,.12);animation:wk-fade .4s ease}
@keyframes wk-fade{from{opacity:0;transform:translateX(-50%) translateY(-6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.wk-wainscot{position:absolute;left:0;right:0;bottom:24%;height:3px;background:rgba(150,110,70,.22);z-index:0}
.wk-floor{position:absolute;left:0;right:0;bottom:0;height:20%;background:repeating-linear-gradient(90deg,#dcb98c,#dcb98c 38px,#d3ad7e 38px,#d3ad7e 40px);z-index:0}
.wk-baseboard{position:absolute;left:0;right:0;bottom:20%;height:12px;background:#e9d4b4;border-top:2px solid #cba980;z-index:1}
.wk-picture{position:absolute;left:6%;top:15%;width:60px;z-index:1;filter:drop-shadow(0 6px 10px rgba(0,0,0,.12))}
.wk-plant{position:absolute;right:5%;bottom:20%;width:62px;z-index:2}
.wk-rod{position:absolute;left:50%;top:10%;transform:translateX(-50%);width:min(96vw,400px);height:7px;border-radius:4px;background:linear-gradient(180deg,#b58c66,#8a6843);z-index:6;box-shadow:0 2px 5px rgba(0,0,0,.2)}
.wk-rod::before,.wk-rod::after{content:"";position:absolute;top:-3px;width:13px;height:13px;border-radius:50%;background:#8a6843}
.wk-rod::before{left:-8px}.wk-rod::after{right:-8px}
.wk-curtain{position:absolute;top:11%;height:56%;width:18%;z-index:6;pointer-events:none;border-radius:0 0 40px 40px / 0 0 30px 30px;box-shadow:inset -8px 0 16px rgba(0,0,0,.12)}
.wk-curtain.left{left:1%;background:repeating-linear-gradient(90deg,#e98b86,#e98b86 10px,#f2a39b 10px,#f2a39b 22px)}
.wk-curtain.right{right:1%;background:repeating-linear-gradient(90deg,#e07d77,#e07d77 10px,#f2a39b 10px,#f2a39b 22px)}

.wk-window{position:absolute;left:50%;top:42%;transform:translate(-50%,-50%);width:min(80vw,320px);height:min(46vh,280px);z-index:5;perspective:1200px;cursor:pointer}
.wk-frame{position:absolute;inset:0;border-radius:8px;background:#fbf3e6;box-shadow:0 18px 44px rgba(0,0,0,.18),inset 0 0 0 7px #fff,0 0 0 3px rgba(0,0,0,.05);overflow:hidden}
.wk-window::after{content:"";position:absolute;left:-10px;right:-10px;bottom:-14px;height:14px;background:#fff;border-radius:3px;box-shadow:0 8px 16px rgba(0,0,0,.16);z-index:-1}
.wk-exterior{position:absolute;inset:14px;border-radius:3px;overflow:hidden;z-index:1;background:linear-gradient(180deg,#bfe8ff,#e9f6ff 60%,#fff6e0)}
.wk-sun{position:absolute;top:10%;right:12%;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle,#fff3b0,#ffd34d);box-shadow:0 0 26px 8px rgba(255,211,77,.5)}
.wk-cloud{position:absolute;background:#fff;border-radius:30px;opacity:.85}
.wk-sash{position:absolute;top:14px;bottom:14px;width:calc(50% - 14px);z-index:3;background:linear-gradient(135deg,rgba(255,255,255,.4),rgba(190,225,255,.2) 40%,rgba(150,200,240,.3));box-shadow:inset 0 0 0 4px #fff;transition:transform 1.4s cubic-bezier(.5,0,.2,1);backface-visibility:hidden}
.wk-sash::after{content:"";position:absolute;left:0;right:0;top:50%;height:4px;background:#fff;transform:translateY(-50%)}
.wk-sash.left{left:14px;transform-origin:left center;border-radius:3px 0 0 3px}
.wk-sash.right{right:14px;transform-origin:right center;border-radius:0 3px 3px 0}
.wk-window.open .wk-sash.left{transform:rotateY(-118deg)}
.wk-window.open .wk-sash.right{transform:rotateY(118deg)}
.wk-mullion{position:absolute;left:50%;top:14px;bottom:14px;width:5px;transform:translateX(-50%);background:#fff;z-index:4}
.wk-window.open .wk-mullion{opacity:0;transition:opacity .4s}
.wk-latch{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:7;width:13px;height:38px;border-radius:7px;background:linear-gradient(180deg,#eceadb,#b6ad92);box-shadow:0 2px 6px rgba(0,0,0,.35)}
.wk-latch.glow{animation:wk-latchglow 1.5s ease-in-out infinite}
@keyframes wk-latchglow{0%,100%{box-shadow:0 2px 6px rgba(0,0,0,.35),0 0 0 0 rgba(255,180,60,.5)}50%{box-shadow:0 2px 6px rgba(0,0,0,.35),0 0 0 9px rgba(255,180,60,0)}}
.wk-shake{animation:wk-shake .42s cubic-bezier(.36,.07,.19,.97)}
@keyframes wk-shake{0%,100%{transform:translate(-50%,-50%)}20%{transform:translate(calc(-50% - 5px),-50%) rotate(-.5deg)}40%{transform:translate(calc(-50% + 5px),-50%) rotate(.5deg)}60%{transform:translate(calc(-50% - 3px),-50%)}80%{transform:translate(calc(-50% + 3px),-50%)}}

/* star INSIDE the window opening (clipped by exterior = framed = outside) */
.wk-starwrap{position:absolute;left:50%;top:0;transform:translateX(-50%);width:150px;z-index:2;opacity:0;transition:opacity .35s}
.wk-starwrap.show{opacity:1}
.wk-starwrap.show .wk-dropper{animation:wk-drop 1.2s cubic-bezier(.34,1.3,.5,1) forwards}
@keyframes wk-drop{0%{transform:translateY(-240px)}100%{transform:translateY(0)}}
.wk-sway{position:relative;transform-origin:33px 8px;animation:wk-sway 3.6s ease-in-out infinite}
@keyframes wk-sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
.wk-starwrap.flirt .wk-sway{animation:wk-pose 2.6s ease-in-out infinite}
@keyframes wk-pose{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(1deg)}}
.wk-limb{stroke-linecap:round;fill:none}
.wk-blink{animation:wk-blink 4.4s infinite}
@keyframes wk-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.12)}}
.wk-wink{animation:wk-wink 1.8s ease-in-out infinite}
@keyframes wk-wink{0%,40%,100%{transform:scaleY(1)}55%,75%{transform:scaleY(.1)}}
.wk-rightarm{transition:transform .6s cubic-bezier(.34,1.4,.5,1)}
.wk-starwrap.flirt .wk-rightarm{transform:translate(-6px,18px) rotate(10deg)}
.wk-hl{fill:none;stroke:#ff8a5c;stroke-width:3;animation:wk-hl 1.3s ease-in-out infinite}
@keyframes wk-hl{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:.95;transform:scale(1.12)}}

/* bottom-sheet message */
.wk-sheet{position:absolute;left:0;right:0;bottom:0;z-index:20;background:#fff;border-radius:22px 22px 0 0;padding:24px 24px 30px;text-align:center;box-shadow:0 -16px 40px rgba(0,0,0,.2);transform:translateY(115%);transition:transform .5s cubic-bezier(.34,1.3,.5,1)}
.wk-sheet.on{transform:translateY(0)}
.wk-ic{font-size:32px}
.wk-sheet h1{font-family:'Fredoka';font-weight:600;font-size:21px;color:#2b2540;margin-top:4px;line-height:1.3}
.wk-sheet h1 .nm{color:#e7693c}
.wk-sheet p{font-size:17px;color:#6b6a85;margin-top:8px;line-height:1.45}
.wk-sheet p .snd{font-weight:700;color:#2b2540}
.wk-close{font-family:'Fredoka';font-weight:600;font-size:15px;color:#fff;background:#ff8a5c;border:none;border-radius:26px;padding:13px 30px;cursor:pointer;margin-top:18px;box-shadow:0 8px 20px rgba(255,138,92,.35);transition:transform .2s}
.wk-close:hover{transform:translateY(-2px)}
@media (prefers-reduced-motion: reduce){*{animation-duration:.001s!important}}
`;
