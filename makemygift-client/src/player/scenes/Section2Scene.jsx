import { useEffect, useRef, useState } from 'react';

// Section 2 — cloud fly-through into the grand welcome gate. The six characters
// greet the player; the photo chakra sits above the gate; the fingerprint
// scanner lets the player enter -> doors open -> onNext() advances the engine.

const CHARS = [
  // robot (blue)
  `<div class="wk2-bob"><svg width="56" height="98" viewBox="0 0 96 168">
    <path class="wk2-limb" d="M38 96 q-4 34 -2 56"/><ellipse cx="35" cy="156" rx="9" ry="5.5" fill="#ff9a3c"/>
    <path class="wk2-limb" d="M58 96 q4 34 2 56"/><ellipse cx="61" cy="156" rx="9" ry="5.5" fill="#ff9a3c"/>
    <path class="wk2-limb" d="M22 64 q-16 -4 -18 -26"/><circle cx="4" cy="38" r="4.5" fill="#002D2D"/>
    <path class="wk2-limb" d="M74 64 q16 -4 18 14"/><circle cx="92" cy="78" r="4.5" fill="#002D2D"/>
    <line x1="48" y1="30" x2="48" y2="14" stroke="#002D2D" stroke-width="3.5"/><circle cx="48" cy="11" r="4.5" fill="#ff6a6a"/>
    <rect x="18" y="30" width="60" height="66" rx="16" fill="url(#rob0)" stroke="#2f5aa0" stroke-width="2.5"/>
    <circle cx="37" cy="58" r="10" fill="#0e2a4a"/><circle cx="37" cy="58" r="6" fill="#5fe0f5"/><circle cx="37" cy="58" r="2.6" fill="#0e2a4a"/>
    <circle cx="59" cy="58" r="10" fill="#0e2a4a"/><circle cx="59" cy="58" r="6" fill="#5fe0f5"/><circle cx="59" cy="58" r="2.6" fill="#0e2a4a"/>
    <rect x="36" y="76" width="24" height="9" rx="4" fill="#0e2a4a"/>
    <rect x="40" y="78.5" width="2.5" height="4" fill="#5fe0f5"/><rect x="46" y="78.5" width="2.5" height="4" fill="#5fe0f5"/><rect x="52" y="78.5" width="2.5" height="4" fill="#5fe0f5"/>
    <defs><linearGradient id="rob0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb0ea"/><stop offset="1" stop-color="#4f86d0"/></linearGradient></defs></svg></div>`,
  // green squircle
  `<div class="wk2-bob"><svg width="60" height="94" viewBox="0 0 100 156">
    <path class="wk2-limb" d="M40 100 q-4 28 -2 46"/><circle cx="38" cy="148" r="6" fill="#002D2D"/>
    <path class="wk2-limb" d="M62 100 q4 28 2 46"/><circle cx="64" cy="148" r="6" fill="#002D2D"/>
    <path class="wk2-limb" d="M22 76 q-16 4 -16 -12"/><circle cx="6" cy="62" r="4.5" fill="#002D2D"/>
    <path class="wk2-limb" d="M80 76 q16 4 16 -12"/><circle cx="94" cy="62" r="4.5" fill="#002D2D"/>
    <rect x="20" y="34" width="62" height="72" rx="26" fill="url(#grn0)"/>
    <path d="M34 62 q6 7 12 0" stroke="#15463a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M56 62 q6 7 12 0" stroke="#15463a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="74" r="4.5" fill="#ff9aa2" opacity=".5"/><circle cx="72" cy="74" r="4.5" fill="#ff9aa2" opacity=".5"/>
    <path d="M40 74 q11 12 22 0" stroke="#15463a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <defs><linearGradient id="grn0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fe6c0"/><stop offset="1" stop-color="#1bb894"/></linearGradient></defs></svg></div>`,
  // star (same as Scene 1)
  `<div class="wk2-bob"><svg width="60" height="108" viewBox="0 0 100 180">
    <path class="wk2-limb" d="M42 70 q-4 42 -2 72"/><circle cx="40" cy="166" r="6" fill="#002D2D"/>
    <path class="wk2-limb" d="M58 70 q4 42 2 72"/><circle cx="60" cy="166" r="6" fill="#002D2D"/>
    <g class="wk2-wave" style="transform-origin:24px 44px"><path class="wk2-limb" d="M26 44 q-18 -4 -20 -26"/><circle cx="6" cy="16" r="5" fill="#002D2D"/></g>
    <path class="wk2-limb" d="M74 44 q18 -2 20 16"/><circle cx="94" cy="62" r="5" fill="#002D2D"/>
    <path d="M50 8 L61 33 L88 35 L67 53 L74 80 L50 64 L26 80 L33 53 L12 35 L39 33 Z" fill="url(#star0)" stroke="url(#star0)" stroke-width="9" stroke-linejoin="round"/>
    <ellipse cx="40" cy="30" rx="11" ry="6" fill="#fff" opacity=".25"/>
    <g class="wk2-blink" style="transform-origin:43px 46px"><ellipse cx="43" cy="46" rx="4" ry="6" fill="#3a2a18"/><circle cx="44.5" cy="43.5" r="1.4" fill="#fff"/></g>
    <g class="wk2-blink" style="transform-origin:57px 46px"><ellipse cx="57" cy="46" rx="4" ry="6" fill="#3a2a18"/><circle cx="58.5" cy="43.5" r="1.4" fill="#fff"/></g>
    <circle cx="35" cy="54" r="4" fill="#ff8aa0" opacity=".6"/><circle cx="65" cy="54" r="4" fill="#ff8aa0" opacity=".6"/>
    <path d="M44 54 q6 7 12 0 q-6 4 -12 0Z" fill="#7a2a18"/>
    <defs><linearGradient id="star0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe14d"/><stop offset="1" stop-color="#ff9a1f"/></linearGradient></defs></svg></div>`,
  // pink with headphones
  `<div class="wk2-bob"><svg width="56" height="102" viewBox="0 0 94 168">
    <path class="wk2-limb" d="M36 104 q-3 28 -1 46"/><ellipse cx="34" cy="158" rx="8" ry="5" fill="#ffd23b"/>
    <path class="wk2-limb" d="M58 104 q3 28 1 46"/><ellipse cx="60" cy="158" rx="8" ry="5" fill="#ffd23b"/>
    <g class="wk2-wave" style="transform-origin:16px 80px"><path class="wk2-limb" d="M18 80 q-15 2 -15 -16"/><circle cx="3" cy="62" r="4.5" fill="#002D2D"/></g>
    <path class="wk2-limb" d="M76 80 q15 2 15 -14"/><circle cx="91" cy="64" r="4.5" fill="#002D2D"/>
    <path d="M40 34 q-6 -16 6 -22 q-2 10 2 22z" fill="#1f6a5e"/><path d="M52 34 q8 -14 4 -24 q6 10 4 24z" fill="#1f6a5e"/>
    <rect x="20" y="34" width="54" height="70" rx="20" fill="url(#pnk0)"/>
    <path d="M20 60 a27 27 0 0 1 54 0" fill="none" stroke="#1f8a7a" stroke-width="5"/>
    <rect x="10" y="56" width="13" height="20" rx="5" fill="#1f8a7a"/><rect x="71" y="56" width="13" height="20" rx="5" fill="#1f8a7a"/>
    <g class="wk2-blink" style="transform-origin:38px 66px"><ellipse cx="38" cy="66" rx="4" ry="6" fill="#5a2a44"/></g>
    <g class="wk2-blink" style="transform-origin:56px 66px"><ellipse cx="56" cy="66" rx="4" ry="6" fill="#5a2a44"/></g>
    <circle cx="30" cy="74" r="4" fill="#ff7aa0" opacity=".6"/><circle cx="64" cy="74" r="4" fill="#ff7aa0" opacity=".6"/>
    <path d="M40 74 q7 7 14 0" stroke="#5a2a44" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <defs><linearGradient id="pnk0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9ec4"/><stop offset="1" stop-color="#f06aa0"/></linearGradient></defs></svg></div>`,
  // orange/fruit
  `<div class="wk2-bob"><svg width="52" height="96" viewBox="0 0 88 160">
    <path class="wk2-limb" d="M34 92 q-3 30 -1 50"/><circle cx="33" cy="148" r="6" fill="#002D2D"/>
    <path class="wk2-limb" d="M54 92 q3 30 1 50"/><circle cx="55" cy="148" r="6" fill="#002D2D"/>
    <g class="wk2-wave" style="transform-origin:14px 62px"><path class="wk2-limb" d="M16 62 q-14 2 -14 -16"/><circle cx="2" cy="44" r="4.5" fill="#002D2D"/></g>
    <path class="wk2-limb" d="M72 62 q14 2 14 -14"/><circle cx="86" cy="46" r="4.5" fill="#002D2D"/>
    <path d="M44 24 q-3 -12 5 -16 q3 9 -1 16" fill="#4f8a4d"/>
    <circle cx="44" cy="60" r="32" fill="url(#or0)"/>
    <g class="wk2-blink" style="transform-origin:35px 54px"><ellipse cx="35" cy="54" rx="4.5" ry="6.5" fill="#5a2810"/><circle cx="36.5" cy="51.5" r="1.4" fill="#fff"/></g>
    <g class="wk2-blink" style="transform-origin:53px 54px"><ellipse cx="53" cy="54" rx="4.5" ry="6.5" fill="#5a2810"/><circle cx="54.5" cy="51.5" r="1.4" fill="#fff"/></g>
    <g fill="#c24e16" opacity=".45"><circle cx="28" cy="64" r="1.5"/><circle cx="60" cy="64" r="1.5"/><circle cx="32" cy="70" r="1.3"/><circle cx="56" cy="70" r="1.3"/></g>
    <path d="M35 66 q9 10 18 0" stroke="#5a2810" stroke-width="3" fill="none" stroke-linecap="round"/>
    <defs><radialGradient id="or0" cx=".4" cy=".35"><stop offset="0" stop-color="#ffac52"/><stop offset="1" stop-color="#ef6a14"/></radialGradient></defs></svg></div>`,
  // purple triangle
  `<div class="wk2-bob"><svg width="54" height="100" viewBox="0 0 92 158">
    <path class="wk2-limb" d="M36 112 q-3 26 -1 42"/><circle cx="35" cy="150" r="6" fill="#002D2D"/>
    <path class="wk2-limb" d="M56 112 q3 26 1 42"/><circle cx="57" cy="150" r="6" fill="#002D2D"/>
    <g class="wk2-wave" style="transform-origin:18px 84px"><path class="wk2-limb" d="M20 84 q-16 2 -16 -16"/><circle cx="4" cy="66" r="4.5" fill="#002D2D"/></g>
    <path class="wk2-limb" d="M72 84 q16 2 16 -14"/><circle cx="88" cy="68" r="4.5" fill="#002D2D"/>
    <path d="M46 14 L82 104 Q85 112 76 112 L16 112 Q7 112 10 104 Z" fill="url(#tri0)" stroke="#6a32ad" stroke-width="2.5"/>
    <path d="M30 72 q5 6 10 0" stroke="#2b1a40" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M52 72 q5 6 10 0" stroke="#2b1a40" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="29" cy="80" r="4" fill="#ff9aa2" opacity=".55"/><circle cx="63" cy="80" r="4" fill="#ff9aa2" opacity=".55"/>
    <path d="M37 82 q9 9 18 0" stroke="#2b1a40" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <defs><linearGradient id="tri0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b07fe6"/><stop offset="1" stop-color="#7a3fbf"/></linearGradient></defs></svg></div>`,
];

export default function Section2Scene({ onNext, gift }) {
  const name = gift?.recipientName || 'friend';
  const worldName = (name || 'your').toUpperCase();

  const [revealed, setRevealed] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [entered, setEntered] = useState(false);
  const introRef = useRef(null);
  const timers = useRef([]);
  const T = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); return id; };

  useEffect(() => {
    const clouds = introRef.current ? introRef.current.querySelectorAll('.wk2-fcloud') : [];
    clouds.forEach((c, i) => {
      const ang = Math.random() * 6.28, dist = 200 + Math.random() * 260;
      const s = 20 + Math.random() * 60;
      c.style.width = s + 'px'; c.style.height = s * 0.7 + 'px';
      c.animate([
        { transform: 'translate(-50%,-50%) scale(.2)', opacity: 0 },
        { opacity: .95, offset: .3 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) scale(2.6)`, opacity: 0 },
      ], { duration: 2200, delay: i * 60, easing: 'cubic-bezier(.4,0,.7,1)', fill: 'forwards' });
    });
    if (introRef.current) introRef.current.classList.add('wk2-go');
    T(() => setRevealed(true), 2300);
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const holdTimer = useRef(null);
  const startScan = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (scanning || entered) return;
    setScanning(true);
    if (navigator.vibrate) navigator.vibrate(15);
    holdTimer.current = T(() => {
      setScanning(false);
      setEntered(true);
      if (navigator.vibrate) navigator.vibrate([20, 40, 30]);
      T(() => onNext(), 1700);
    }, 1500);
  };
  const cancelScan = () => {
    if (entered) return;
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    setScanning(false);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="wk2-stage">
        <div className="wk2-cloud" style={{ top: '14%', left: '6%', width: 70, height: 24 }} />
        <div className="wk2-cloud" style={{ top: '24%', right: '8%', width: 56, height: 20 }} />
        <div className="wk2-cloud" style={{ top: '40%', left: '10%', width: 48, height: 18 }} />
        <div className="wk2-ground" />
        <div className="wk2-path" />

        <div className={`wk2-greeting ${revealed ? 'wk2-in' : ''}`}>
          <h1>Welcome, {name}! 🎉</h1>
          <p>The whole world came out to meet you.</p>
        </div>

        <div className={`wk2-gatewrap ${revealed ? 'wk2-in' : ''}`}>
          <div className="wk2-gate">
            <div className="wk2-chakra">
              <div className="wk2-glow" />
              <div className="wk2-ring" />
              <svg className="wk2-spokes" viewBox="0 0 108 108"><g stroke="#fff" strokeWidth="2" opacity=".7">
                <line x1="54" y1="4" x2="54" y2="104" /><line x1="4" y1="54" x2="104" y2="54" />
                <line x1="18" y1="18" x2="90" y2="90" /><line x1="90" y1="18" x2="18" y2="90" /></g></svg>
              {gift?.chakraPhotoUrl ? (
                <div className="wk2-photo" style={{ backgroundImage: `url("${gift.chakraPhotoUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              ) : (
                <div className="wk2-photo"><div className="wk2-ph">
                  <svg viewBox="0 0 60 44"><circle cx="22" cy="16" r="9" fill="#fff" opacity=".9" /><circle cx="40" cy="16" r="9" fill="#fff" opacity=".9" /><path d="M8 44 q14 -16 28 0z" fill="#fff" opacity=".85" /><path d="M26 44 q14 -16 28 0z" fill="#fff" opacity=".85" /></svg>
                  <span>your photo</span>
                </div></div>
              )}
            </div>
            <div className="wk2-cap l" /><div className="wk2-cap r" />
            <div className="wk2-pillar l" /><div className="wk2-pillar r" />
            <div className="wk2-header"><div className="wk2-nameplate">{worldName}'S WORLD</div><div className="wk2-strip" /></div>
            <div className={`wk2-doors ${entered ? 'wk2-open' : ''}`}>
              <div className="wk2-doorglow" />
              <div className="wk2-door l"><div className="wk2-ln" /></div>
              <div className="wk2-door r"><div className="wk2-ln" /></div>
            </div>
          </div>
        </div>

        <div className="wk2-crowd">
          {CHARS.map((html, i) => (
            <div key={i} className={`wk2-ch ${revealed ? 'wk2-in' : ''}`} style={{ animationDelay: `${i * 0.12}s` }} dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </div>

        <div
          className={`wk2-scanner ${scanning ? 'wk2-scanning' : ''}`}
          onPointerDown={startScan}
          onPointerUp={cancelScan}
          onPointerLeave={cancelScan}
          onPointerCancel={cancelScan}
          onContextMenu={(e) => e.preventDefault()}
          style={{ opacity: revealed && !entered ? 1 : 0, pointerEvents: revealed && !entered ? 'auto' : 'none', transition: 'opacity .4s' }}
        >
          <div className="wk2-pad">
            <div className="wk2-fill" />
            <svg className="wk2-fp" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M14 20a11 11 0 0 1 20 0" />
              <path d="M17 24a7.5 7.5 0 0 1 14.5 2" />
              <path d="M20.5 24.5a4 4 0 0 1 7 3.5v3" />
              <path d="M24 25v9" />
              <path d="M16.5 27v4a8 8 0 0 0 .6 3" />
              <path d="M31.5 28v4" />
              <path d="M20.5 33v2.5" />
              <path d="M27.5 34v1.5" />
            </svg>
            <div className="wk2-sweep" />
            <svg className="wk2-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" /></svg>
          </div>
          <div className="wk2-lbl">{scanning ? 'scanning…' : 'hold your finger to enter'}</div>
        </div>

        <div className="wk2-intro" ref={introRef}>
          <div className="wk2-flash" />
          {[...Array(10)].map((_, i) => <div key={i} className="wk2-fcloud" />)}
        </div>

        <div className={`wk2-enterwash ${entered ? 'wk2-go' : ''}`} />
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap');
.wk2-stage{position:fixed;inset:0;max-width:520px;margin:0 auto;overflow:hidden;font-family:'Nunito',sans-serif;background:linear-gradient(180deg,#9fd8ff 0%,#c9ecff 42%,#eafaff 72%,#dff3d6 100%)}
.wk2-cloud{position:absolute;background:#fff;border-radius:50px;opacity:.9;z-index:2;filter:drop-shadow(0 6px 10px rgba(120,160,200,.18))}
.wk2-cloud::before,.wk2-cloud::after{content:"";position:absolute;background:#fff;border-radius:50%}
.wk2-cloud::before{width:60%;height:160%;top:-50%;left:12%}
.wk2-cloud::after{width:45%;height:130%;top:-30%;right:12%}
.wk2-ground{position:absolute;left:0;right:0;bottom:0;height:20%;z-index:3;background:linear-gradient(180deg,#bfe6a8,#9fd187)}
.wk2-path{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:46%;height:22%;z-index:4;background:linear-gradient(180deg,#e8d8b0,#d8c294);clip-path:polygon(38% 0,62% 0,100% 100%,0 100%)}

.wk2-gatewrap{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);width:min(86vw,360px);z-index:6;opacity:0}
.wk2-gatewrap.wk2-in{animation:wk2rise 1s ease forwards}
@keyframes wk2rise{from{opacity:0;transform:translate(-50%,calc(-48% + 30px))}to{opacity:1;transform:translate(-50%,-48%)}}
.wk2-gate{position:relative;height:330px}
.wk2-pillar{position:absolute;bottom:0;width:46px;height:300px;border-radius:10px 10px 4px 4px;background:linear-gradient(90deg,#cfd6e2,#f3f6fb 40%,#dfe5ee);box-shadow:0 14px 30px rgba(40,60,90,.25),inset 0 0 0 2px rgba(255,255,255,.6)}
.wk2-pillar.l{left:8px}.wk2-pillar.r{right:8px}
.wk2-pillar::before{content:"";position:absolute;left:8px;right:8px;top:18px;bottom:60px;border-radius:4px;box-shadow:inset 0 0 0 2px rgba(120,140,170,.3)}
.wk2-pillar::after{content:"";position:absolute;left:0;right:0;bottom:0;height:26px;border-radius:0 0 4px 4px;background:linear-gradient(90deg,#c7a24e,#f0d589 45%,#caa757)}
.wk2-cap{position:absolute;top:0;width:60px;height:18px;border-radius:6px;background:linear-gradient(90deg,#c7a24e,#f0d589 45%,#caa757)}
.wk2-cap.l{left:1px}.wk2-cap.r{right:1px}
.wk2-header{position:absolute;left:0;right:0;top:36px;height:54px;border-radius:10px;background:linear-gradient(180deg,#eef2f8,#cdd5e3);box-shadow:0 10px 22px rgba(40,60,90,.22),inset 0 0 0 2px rgba(255,255,255,.6)}
.wk2-header .wk2-strip{position:absolute;left:14px;right:14px;bottom:9px;height:5px;border-radius:3px;background:linear-gradient(90deg,#7ad0e0,#9be7c8,#7ad0e0)}
.wk2-header .wk2-nameplate{position:absolute;left:50%;top:11px;transform:translateX(-50%);font-family:'Fredoka';font-weight:600;font-size:13px;letter-spacing:.08em;color:#3a4a66;white-space:nowrap}
.wk2-doors{position:absolute;left:54px;right:54px;bottom:0;top:96px;border-radius:6px 6px 0 0;overflow:hidden;box-shadow:inset 0 0 0 3px #cdd5e3}
.wk2-door{position:absolute;top:0;bottom:0;width:50%;background:linear-gradient(180deg,rgba(180,225,245,.7),rgba(150,205,235,.55));transition:transform 1.6s cubic-bezier(.5,0,.2,1)}
.wk2-door.l{left:0;border-right:1px solid rgba(255,255,255,.6)}
.wk2-door.r{right:0}
.wk2-door .wk2-ln{position:absolute;left:18%;right:18%;top:14%;height:64%;border-radius:4px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.5)}
.wk2-open .wk2-door.l{transform:translateX(-102%)}
.wk2-open .wk2-door.r{transform:translateX(102%)}
.wk2-doorglow{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(255,245,200,.95),transparent 60%);opacity:0;z-index:2}
.wk2-open .wk2-doorglow{animation:wk2dg 1.6s ease forwards}
@keyframes wk2dg{0%{opacity:0}60%{opacity:1}100%{opacity:0}}
.wk2-chakra{position:absolute;left:50%;top:-78px;transform:translateX(-50%);width:108px;height:108px;z-index:3}
.wk2-chakra .wk2-ring{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,#f0d589,#caa757,#f0d589,#caa757,#f0d589,#caa757,#f0d589);box-shadow:0 8px 20px rgba(40,60,90,.3)}
.wk2-chakra .wk2-spokes{position:absolute;inset:0;border-radius:50%}
.wk2-chakra .wk2-photo{position:absolute;inset:11px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#ffe0c4,#f3b89a 60%,#d98f72);box-shadow:inset 0 0 0 3px #fff}
.wk2-chakra .wk2-photo .wk2-ph{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.wk2-chakra .wk2-photo .wk2-ph svg{width:48px}
.wk2-chakra .wk2-photo .wk2-ph span{font-family:'Fredoka';font-size:9px;color:#7a4a3a;margin-top:1px}
.wk2-chakra .wk2-glow{position:absolute;inset:-8px;border-radius:50%;background:radial-gradient(circle,rgba(255,235,170,.5),transparent 65%);animation:wk2cg 3s ease-in-out infinite;z-index:-1}
@keyframes wk2cg{0%,100%{opacity:.5;transform:scale(.95)}50%{opacity:1;transform:scale(1.06)}}

.wk2-greeting{position:absolute;inset:0;z-index:12;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 28px;opacity:0;pointer-events:none}
.wk2-greeting.wk2-in{animation:wk2gin 2.8s cubic-bezier(.3,.7,.3,1) forwards}
@keyframes wk2gin{0%{opacity:0;transform:scale(.85)}12%{opacity:1;transform:scale(1)}68%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.06);visibility:hidden}}
.wk2-greeting h1{font-family:'Fredoka';font-weight:600;font-size:32px;line-height:1.15;color:#234a5a;text-shadow:0 2px 16px rgba(255,255,255,.7)}
.wk2-greeting p{font-size:17px;color:#3a6373;margin-top:8px;text-shadow:0 1px 10px rgba(255,255,255,.7)}

.wk2-crowd{position:absolute;left:4px;bottom:15.5%;z-index:8;display:flex;align-items:flex-end;transform-origin:bottom left;transform:scale(.82)}
.wk2-ch{position:relative;margin-left:-8px;opacity:0;transform:translateY(16px)}
.wk2-ch:first-child{margin-left:0}
.wk2-ch.wk2-in{animation:wk2pop .5s cubic-bezier(.34,1.5,.5,1) forwards}
@keyframes wk2pop{to{opacity:1;transform:translateY(0)}}
.wk2-ch svg{display:block}
.wk2-bob{animation:wk2bob 3s ease-in-out infinite}
@keyframes wk2bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.wk2-blink{animation:wk2blink 4.4s infinite}
@keyframes wk2blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.wk2-wave{animation:wk2wv 1.8s ease-in-out infinite}
@keyframes wk2wv{0%,100%{transform:rotate(6deg)}50%{transform:rotate(-16deg)}}
.wk2-limb{stroke:#002D2D;stroke-width:6;stroke-linecap:round;fill:none}

.wk2-scanner{position:absolute;left:50%;bottom:3.5%;transform:translateX(-50%);z-index:10;text-align:center;cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:none}
.wk2-scanner .wk2-pad{width:86px;height:86px;margin:0 auto;border-radius:50%;background:radial-gradient(circle at 50% 36%,#1b3b44,#0c2127 70%);box-shadow:0 12px 28px rgba(15,35,45,.45),inset 0 1px 0 rgba(255,255,255,.12),inset 0 -6px 16px rgba(0,0,0,.45);position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;color:#4fd9bf}
.wk2-scanner .wk2-pad::before{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(79,217,191,.5);animation:wk2pulse 1.9s ease-out infinite}
@keyframes wk2pulse{0%{box-shadow:0 0 0 0 rgba(79,217,191,.45)}70%,100%{box-shadow:0 0 0 14px rgba(79,217,191,0)}}
.wk2-scanning .wk2-pad::before{animation:none}
.wk2-scanner .wk2-fp{width:46px;height:46px;position:relative;z-index:3;filter:drop-shadow(0 0 5px rgba(79,217,191,.55));transition:color .3s}
.wk2-scanning .wk2-fp{color:#8affe6}
.wk2-scanner .wk2-fill{position:absolute;left:0;right:0;bottom:0;height:100%;z-index:2;background:linear-gradient(180deg,rgba(95,230,200,.15),rgba(60,210,180,.55));clip-path:inset(100% 0 0 0);transition:clip-path 1.45s linear}
.wk2-scanning .wk2-fill{clip-path:inset(0 0 0 0)}
.wk2-scanner .wk2-sweep{position:absolute;left:8%;right:8%;height:2px;top:0;z-index:4;border-radius:2px;background:linear-gradient(90deg,transparent,#9bffe9,transparent);box-shadow:0 0 8px #5fe3c0;opacity:0}
.wk2-scanning .wk2-sweep{animation:wk2sweep 1.45s ease-in-out infinite}
@keyframes wk2sweep{0%{top:14%;opacity:0}15%{opacity:1}85%{opacity:1}100%{top:84%;opacity:0}}
.wk2-scanner .wk2-ring{position:absolute;inset:0;z-index:1;transform:rotate(-90deg)}
.wk2-scanner .wk2-ring circle{fill:none;stroke:rgba(79,217,191,.25);stroke-width:3}
.wk2-scanning .wk2-ring circle{stroke:#4fd9bf;stroke-dasharray:289;stroke-dashoffset:289;animation:wk2ring 1.45s linear forwards}
@keyframes wk2ring{to{stroke-dashoffset:0}}
.wk2-scanner .wk2-lbl{font-family:'Fredoka';font-weight:500;font-size:13.5px;color:#2b4a5a;margin-top:11px;background:rgba(255,255,255,.82);padding:7px 15px;border-radius:18px;display:inline-block;box-shadow:0 4px 12px rgba(40,60,90,.12)}

.wk2-intro{position:absolute;inset:0;z-index:40;background:linear-gradient(180deg,#bfe8ff,#eafaff)}
.wk2-intro .wk2-fcloud{position:absolute;background:#fff;border-radius:50%;left:50%;top:50%}
.wk2-intro.wk2-go{animation:wk2introfade .6s ease 2.2s forwards}
@keyframes wk2introfade{to{opacity:0;visibility:hidden}}
.wk2-intro .wk2-flash{position:absolute;inset:0;background:#fff;opacity:0}
.wk2-enterwash{position:fixed;inset:0;z-index:50;pointer-events:none;opacity:0;transform:scale(.25);transform-origin:50% 46%;background:radial-gradient(circle at 50% 46%,#fff 0%,#fff6dc 30%,#ffe39a 55%,transparent 78%)}
.wk2-enterwash.wk2-go{animation:wk2enter 1.7s ease forwards}
@keyframes wk2enter{0%{opacity:0;transform:scale(.25)}35%{opacity:.9;transform:scale(1)}70%{opacity:1;transform:scale(1.6)}100%{opacity:1;transform:scale(2.3);background:radial-gradient(circle,#fff,#fff 70%,#fff)}}
.wk2-intro.wk2-go .wk2-flash{animation:wk2iflash 1s ease forwards}
@keyframes wk2iflash{0%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion: reduce){*{animation-duration:.001s!important}}
`;
