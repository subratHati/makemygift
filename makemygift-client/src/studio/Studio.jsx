import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

// --- Cloudinary (unsigned uploads straight from the browser) ---
const CLOUD_NAME = 'dc7zdk6is';
const UPLOAD_PRESET = 'makemygift_unsigned';
const CLOUDINARY_URL = (type) => `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`;

const OCCASIONS = ['Birthday', 'Anniversary', "Valentine's Day", 'Just because', 'Congratulations', 'I miss you', 'Other'];

const QA_SAMPLES = [
  { q: 'How much do you love me?', a: 'To the moon and back ' },
  { q: "Who's your favorite person?", a: 'You, always you ' },
  { q: 'What am I to you?', a: 'My favorite hello and hardest goodbye' },
  { q: 'How long will you love me?', a: 'Forever and one more day' },
  { q: 'Whose smile is the best in the world?', a: 'Yours, no competition' },
];

const MSG_SAMPLES = [
  "You're my favorite notification, my favorite hello, my favorite everything. 💛",
  'Every day with you is my favorite day. Happy day, my love. 🎉',
  "I'd choose you. Over and over. Without pause, without doubt. 💕",
  'Thank you for being my person. Here\'s to us. 🥂',
  'You + me = my favorite story. And it\'s only getting better. ✨',
];

async function uploadToCloudinary(file, onProgress) {
  const isVideo = file.type.startsWith('video/');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', CLOUDINARY_URL(isVideo ? 'video' : 'image'));
    xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      try { const r = JSON.parse(xhr.responseText); if (r.secure_url) resolve({ url: r.secure_url, isVideo }); else reject(new Error(r.error?.message || 'upload failed')); }
      catch { reject(new Error('upload failed')); }
    };
    xhr.onerror = () => reject(new Error('network error'));
    xhr.send(fd);
  });
}

export default function Studio() {
  const [f, setF] = useState({
    recipientName: '', fromName: '', occasion: 'Birthday',
    voiceQuestion: '', voiceAnswer: '',
    finalMessage: '',
    puzzlePhotoUrl: '', revealPhotoUrl: '', revealVideoUrl: '', chakraPhotoUrl: '',
  });
  const [status, setStatus] = useState('form'); // form | saving | done | error
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState('');

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const setVal = (k, val) => setF((v) => ({ ...v, [k]: val }));

  const submit = async () => {
    if (!f.recipientName.trim()) { setErr('Please add who the gift is for.'); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setErr(''); setStatus('saving');
    try {
      const res = await fetch(`${API_BASE}/api/gifts`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) });
      if (!res.ok) throw new Error('create failed');
      const data = await res.json();
      setLink(`${window.location.origin}/g/${data.gift.publicId}`);
      setStatus('done');
    } catch { setStatus('error'); }
  };

  const copy = async () => { try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {} };
  const reset = () => { setStatus('form'); setLink(''); setF({ recipientName: '', fromName: '', occasion: 'Birthday', voiceQuestion: '', voiceAnswer: '', finalMessage: '', puzzlePhotoUrl: '', revealPhotoUrl: '', revealVideoUrl: '', chakraPhotoUrl: '' }); };

  if (status === 'done') {
    return (
      <><style>{CSS}</style>
        <div className="st-page"><div className="st-donewrap">
          <div className="st-bigemoji">🎉</div>
          <h1 className="st-h1">Your gift is ready!</h1>
          <p className="st-p">Share this link with {f.recipientName || 'them'} — opening it plays the whole experience.</p>
          <div className="st-linkbox"><input readOnly value={link} onFocus={(e) => e.target.select()} /><button onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button></div>
          <div className="st-donebtns"><a className="st-primary" href={link} target="_blank" rel="noreferrer">▶ Preview it</a><button className="st-ghost" onClick={reset}>Create another</button></div>
          <p className="st-note">This gift is saved as a draft. (Payment comes in a later step.)</p>
        </div></div>
      </>
    );
  }

  return (
    <><style>{CSS}</style>
      <div className="st-page"><div className="st-form">
        <div className="st-header">
          <div className="st-bigemoji">🎁</div>
          <h1 className="st-h1">Create your gift</h1>
          <p className="st-p">Fill these in — your person will open a personalized journey ending in your surprise.</p>
        </div>

        <Section title="The basics">
          <Field label="Who's it for?" hint="their name — shown throughout">
            <input value={f.recipientName} onChange={set('recipientName')} placeholder="e.g. Priya" maxLength={60} />
          </Field>
          <Field label="From (your name)"><input value={f.fromName} onChange={set('fromName')} placeholder="e.g. Aarav" maxLength={60} /></Field>
          <Field label="Occasion"><select value={f.occasion} onChange={set('occasion')}>{OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></Field>
        </Section>

        <Section title="Task — the puzzle photo" sub="A photo of you two, cut into a sliding puzzle they rebuild.">
          <PhotoPicker value={f.puzzlePhotoUrl} onUploaded={(url) => setVal('puzzlePhotoUrl', url)} accept="image/*" />
        </Section>

        <Section title="Task — say it back" sub="A question only they'd know, and the words they must say out loud. Tap a sample or write your own.">
          <div className="st-chips">
            {QA_SAMPLES.map((s, i) => (
              <button key={i} className="st-chip" onClick={() => setF((v) => ({ ...v, voiceQuestion: s.q, voiceAnswer: s.a }))}>{s.q}</button>
            ))}
          </div>
          <Field label="Your question"><input value={f.voiceQuestion} onChange={set('voiceQuestion')} placeholder="e.g. How much do you love me?" maxLength={160} /></Field>
          <Field label="The answer they must say"><input value={f.voiceAnswer} onChange={set('voiceAnswer')} placeholder="e.g. I love you to the moon and back" maxLength={160} /></Field>
        </Section>

        <Section title="The finale" sub="They blow out the candles, then your surprise appears.">
          <div className="st-chips">
            {MSG_SAMPLES.map((m, i) => (
              <button key={i} className="st-chip st-chipwide" onClick={() => setVal('finalMessage', m)}>{m.length > 42 ? m.slice(0, 42) + '…' : m}</button>
            ))}
          </div>
          <Field label="Your message" hint="shown over the final reveal">
            <textarea value={f.finalMessage} onChange={set('finalMessage')} rows={3} placeholder="Pick a sample above or write your own…" maxLength={600} />
          </Field>
          <Field label="The reveal — photo or video">
            <PhotoPicker value={f.revealVideoUrl || f.revealPhotoUrl} isVideo={!!f.revealVideoUrl} accept="image/*,video/*"
              onUploaded={(url, isVideo) => { if (isVideo) { setVal('revealVideoUrl', url); setVal('revealPhotoUrl', ''); } else { setVal('revealPhotoUrl', url); setVal('revealVideoUrl', ''); } }} />
          </Field>
        </Section>

        <Section title="The welcome gate photo" sub="Optional — a couple photo shown above the gate.">
          <PhotoPicker value={f.chakraPhotoUrl} onUploaded={(url) => setVal('chakraPhotoUrl', url)} accept="image/*" />
        </Section>

        {err && <div className="st-err">{err}</div>}
        {status === 'error' && <div className="st-err">Something went wrong creating the gift. Please try again.</div>}

        <button className="st-create" onClick={submit} disabled={status === 'saving'}>{status === 'saving' ? 'Creating…' : 'Create gift & get link →'}</button>
        <p className="st-note">Photos & videos upload straight from your device. Nothing is shown until you share the link.</p>
      </div></div>
    </>
  );
}

function Section({ title, sub, children }) {
  return (<div className="st-section"><div className="st-sectitle">{title}</div>{sub && <div className="st-secsub">{sub}</div>}{children}</div>);
}
function Field({ label, hint, children }) {
  return (<label className="st-field"><span className="st-lbl">{label}{hint && <em> · {hint}</em>}</span>{children}</label>);
}

function PhotoPicker({ value, onUploaded, accept = 'image/*', isVideo = false }) {
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState(0);
  const [error, setError] = useState('');
  const inputId = 'pp-' + Math.random().toString(36).slice(2, 8);

  const onPick = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setError(''); setUploading(true); setPct(0);
    try {
      const { url, isVideo: vid } = await uploadToCloudinary(file, setPct);
      onUploaded(url, vid);
    } catch (e2) { setError('Upload failed — please try again.'); }
    finally { setUploading(false); }
  };

  return (
    <div className="st-pp">
      <input id={inputId} type="file" accept={accept} style={{ display: 'none' }} onChange={onPick} />
      {value ? (
        <div className="st-pp-preview">
          {isVideo ? <video src={value} className="st-pp-thumb" muted playsInline /> : <img src={value} className="st-pp-thumb" alt="" />}
          <label htmlFor={inputId} className="st-pp-change">Change</label>
        </div>
      ) : (
        <label htmlFor={inputId} className="st-pp-btn">{uploading ? `Uploading… ${pct}%` : '📷 Choose from your device'}</label>
      )}
      {uploading && <div className="st-pp-bar"><div style={{ width: pct + '%' }} /></div>}
      {error && <div className="st-pp-err">{error}</div>}
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap');
.st-page{min-height:100dvh;width:100%;background:linear-gradient(180deg,#fbeede,#f4ddc2 60%,#ecd0b0);font-family:'Nunito',system-ui,sans-serif;color:#3a2a1a;display:flex;justify-content:center;padding:28px 16px 56px}
.st-form,.st-donewrap{width:100%;max-width:460px}
.st-header{text-align:center;margin-bottom:22px}
.st-bigemoji{font-size:44px}
.st-h1{font-family:'Fredoka';font-weight:600;font-size:27px;color:#5a3a1a;margin-top:6px}
.st-p{font-size:15.5px;color:#8a6a4a;margin-top:6px;line-height:1.45}
.st-section{background:#fff;border-radius:18px;padding:18px 18px 6px;margin-bottom:16px;box-shadow:0 10px 26px rgba(120,90,50,.10)}
.st-sectitle{font-family:'Fredoka';font-weight:600;font-size:16px;color:#7a4a1a}
.st-secsub{font-size:13.5px;color:#9a7a5a;margin-top:3px;margin-bottom:10px;line-height:1.4}
.st-field{display:block;margin:12px 0}
.st-lbl{display:block;font-family:'Fredoka';font-weight:500;font-size:13.5px;color:#6a4a2a;margin-bottom:6px}
.st-lbl em{font-style:normal;color:#a88a6a;font-weight:400}
.st-field input,.st-field textarea,.st-field select{width:100%;font-family:'Nunito';font-size:15.5px;color:#3a2a1a;background:#fbf6ee;border:1.5px solid #e8d6bc;border-radius:12px;padding:12px 14px;outline:none;transition:border-color .2s}
.st-field input:focus,.st-field textarea:focus,.st-field select:focus{border-color:#e0a04a}
.st-field textarea{resize:vertical;line-height:1.5}
.st-chips{display:flex;flex-wrap:wrap;gap:7px;margin:4px 0 8px}
.st-chip{font-family:'Nunito';font-weight:600;font-size:12.5px;color:#8a4a1a;background:#fff3e2;border:1.5px solid #f0cfa0;border-radius:16px;padding:7px 12px;cursor:pointer;text-align:left;transition:background .15s,transform .15s}
.st-chip:hover{background:#ffe6c8;transform:translateY(-1px)}
.st-chipwide{max-width:100%}
.st-err{background:#ffe3e0;color:#b03a2a;font-size:14px;font-weight:600;border-radius:12px;padding:11px 14px;margin-bottom:12px;text-align:center}
.st-create{width:100%;font-family:'Fredoka';font-weight:600;font-size:17px;color:#fff;background:linear-gradient(180deg,#ff9a4a,#ec6a1e);border:none;border-radius:28px;padding:16px;cursor:pointer;box-shadow:0 12px 28px rgba(236,106,30,.35);transition:transform .2s}
.st-create:hover{transform:translateY(-2px)}
.st-create:disabled{opacity:.6;cursor:default;transform:none}
.st-note{text-align:center;font-size:12.5px;color:#a88a6a;margin-top:12px;line-height:1.4}
.st-pp{margin-top:4px}
.st-pp-btn,.st-pp-change{display:inline-block;font-family:'Fredoka';font-weight:600;font-size:14px;color:#8a4a1a;background:#fff3e2;border:1.5px dashed #e0a860;border-radius:14px;padding:14px 18px;cursor:pointer;text-align:center;width:100%}
.st-pp-change{width:auto;padding:8px 16px;font-size:13px;border-style:solid;margin-top:8px}
.st-pp-preview{display:flex;flex-direction:column;align-items:flex-start;gap:4px}
.st-pp-thumb{width:110px;height:110px;object-fit:cover;border-radius:14px;box-shadow:0 8px 18px rgba(120,90,50,.25)}
.st-pp-bar{height:8px;border-radius:5px;background:#f0e2cc;margin-top:10px;overflow:hidden}
.st-pp-bar div{height:100%;background:linear-gradient(90deg,#ff9a4a,#ec6a1e);transition:width .2s}
.st-pp-err{color:#b03a2a;font-size:13px;font-weight:600;margin-top:8px}
.st-donewrap{text-align:center;margin-top:8vh}
.st-linkbox{display:flex;gap:8px;margin:20px 0 16px;background:#fff;border-radius:14px;padding:8px;box-shadow:0 10px 26px rgba(120,90,50,.12)}
.st-linkbox input{flex:1;border:none;background:none;outline:none;font-family:'Nunito';font-size:14px;color:#5a3a1a;padding:8px 10px;min-width:0}
.st-linkbox button{font-family:'Fredoka';font-weight:600;font-size:14px;color:#fff;background:#ec6a1e;border:none;border-radius:10px;padding:10px 16px;cursor:pointer;white-space:nowrap}
.st-donebtns{display:flex;flex-direction:column;gap:10px;align-items:center}
.st-primary{font-family:'Fredoka';font-weight:600;font-size:16px;color:#fff;background:linear-gradient(180deg,#ff9a4a,#ec6a1e);border:none;border-radius:26px;padding:14px 30px;cursor:pointer;text-decoration:none;box-shadow:0 10px 24px rgba(236,106,30,.32)}
.st-ghost{font-family:'Nunito';font-weight:700;font-size:14px;color:#8a5a2a;background:none;border:none;cursor:pointer;text-decoration:underline}
@media (prefers-reduced-motion: reduce){*{transition:none!important}}
`;
