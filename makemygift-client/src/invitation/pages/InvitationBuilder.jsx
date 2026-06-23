import { useState, useEffect, useRef } from 'react';
import InvitationHero from '../components/InvitationHero.jsx';
import InvitationPreview from '../components/InvitationPreview.jsx';
import DateField from '../components/DateField.jsx';
import { getTemplate } from '../data/invitationTemplates.js';
import { createInvitation, payForInvitation, saveCardImage, shareLinkFor } from '../lib/invitationApi.js';
import { makeInviteCard, uploadCardToCloudinary, shareLinkOnWhatsApp } from '../lib/inviteCard.js';

const EVENT_OPTIONS = ['Haldi', 'Mehendi', 'Sangeet', 'Engagement', 'Reception'];

export default function InvitationBuilder({ templateId }) {
  const template = getTemplate(templateId);
  const [data, setData] = useState({
    side: 'bride',
    groomName: '', brideName: '',
    groomFather: '', groomMother: '',
    brideFather: '', brideMother: '',
    weddingDate: '', venue: '', city: '',
    familyMembers: '',
    events: [{ name: 'Reception', date: '', time: '', venue: '' }],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState('');
  const [done, setDone] = useState(null); // paid invitation { publicId }

  const createAndPay = async () => {
    setPayErr('');
    setPaying(true);
    try {
      const inv = await createInvitation({ ...data, template: template.id });
      const paid = await payForInvitation(inv.publicId, { name: data.groomName || data.brideName });
      setDone(paid);
    } catch (e) {
      setPayErr(e.message || 'Something went wrong. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  // names in the chosen side's order (bride first if it's the bride's side)
  const brideFirst = data.side === 'bride';
  const cardNames = {
    firstName: brideFirst ? data.brideName : data.groomName,
    secondName: brideFirst ? data.groomName : data.brideName,
  };

  const [cardUrl, setCardUrl] = useState('');
  const [cardReady, setCardReady] = useState(false);
  const [shareMsg, setShareMsg] = useState('Preparing your card…');

  // after payment: draw the card -> upload to Cloudinary -> save URL (for WhatsApp preview)
  useEffect(() => {
    if (!done) return;
    let alive = true;
    (async () => {
      try {
        const blob = await makeInviteCard(cardNames);
        if (!alive || !blob) return;
        setCardUrl(URL.createObjectURL(blob));
        const imageUrl = await uploadCardToCloudinary(blob);
        if (!alive) return;
        await saveCardImage(done.publicId, imageUrl);
        if (!alive) return;
        setCardReady(true);
        setShareMsg('');
      } catch {
        if (alive) { setCardReady(true); setShareMsg('Card preview may be limited, but your link works.'); }
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const onShare = () => {
    shareLinkOnWhatsApp(shareLinkFor(done.publicId), cardNames);
  };
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  // event helpers
  const addEvent = () => setData((d) => ({ ...d, events: [...d.events, { name: 'Mehendi', date: '', time: '', venue: '' }] }));
  const removeEvent = (i) => setData((d) => ({ ...d, events: d.events.filter((_, idx) => idx !== i) }));
  const setEvent = (i, key) => (e) =>
    setData((d) => ({ ...d, events: d.events.map((ev, idx) => (idx === i ? { ...ev, [key]: e.target.value } : ev)) }));
  const setEventVal = (i, key, val) =>
    setData((d) => ({ ...d, events: d.events.map((ev, idx) => (idx === i ? { ...ev, [key]: val } : ev)) }));

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-stone-50">
        <p className="text-stone-600">That template doesn&apos;t exist.</p>
        <a href="/invitations" className="mt-4 text-rose-600 underline">Back to templates</a>
      </div>
    );
  }

  if (done) {
    const shareLink = shareLinkFor(done.publicId);
    const appLink = `${window.location.origin}/invitation/${done.publicId}`;
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-stone-50 to-rose-50/40 text-stone-800 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white border border-stone-200 shadow-sm p-7 text-center">
          <div className="text-4xl">🎉</div>
          <h2 className="mt-3 text-xl font-semibold text-stone-800">Your invitation is live!</h2>
          <p className="mt-1 text-sm text-stone-500">Share the card &amp; link with your guests.</p>

          {cardUrl && (
            <img src={cardUrl} alt="Your invitation card"
              className="mt-5 mx-auto w-44 rounded-xl shadow-md border border-stone-200" />
          )}

          <button onClick={onShare} disabled={!cardReady}
            className="mt-5 w-full rounded-full bg-[#25D366] px-6 py-3 text-white font-semibold shadow-lg shadow-green-300/40 flex items-center justify-center gap-2 disabled:opacity-60">
            <span aria-hidden>🟢</span> {cardReady ? 'Share on WhatsApp' : 'Preparing…'}
          </button>
          {shareMsg && <p className="mt-2 text-xs text-stone-500">{shareMsg}</p>}

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-stone-300 bg-stone-50 p-2">
            <input readOnly value={shareLink} className="flex-1 bg-transparent px-2 text-sm text-stone-700 outline-none min-w-0" />
            <button onClick={() => navigator.clipboard?.writeText(shareLink)}
              className="rounded-lg bg-rose-500 text-white text-sm px-3 py-2 whitespace-nowrap">Copy</button>
          </div>

          <a href={appLink} target="_blank" rel="noreferrer"
            className="mt-3 inline-block text-rose-600 underline text-sm">
            Open invitation
          </a>
        </div>
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="relative">
        <button onClick={() => setShowPreview(false)}
          className="fixed top-4 right-4 z-50 rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-stone-800 shadow-lg hover:bg-white transition-colors">
          ✕ Close preview
        </button>
        <InvitationPreview template={template} data={data} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-50 to-rose-50/40 text-stone-800">
      <div className="mx-auto max-w-2xl px-5 py-12">
        <InvitationHero
          title={`Personalize · ${template.name}`}
          subtitle="Fill in your details, then preview your invitation."
          back={{ href: '/invitations', label: 'All templates' }}
        />

        <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* whose side */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">This invitation is from the</label>
            <div className="flex gap-3">
              {['bride', 'groom'].map((sd) => (
                <button key={sd} type="button" onClick={() => setData((d) => ({ ...d, side: sd }))}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium border transition-colors ${
                    data.side === sd ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-stone-600 border-stone-300'
                  }`}>
                  {sd === 'bride' ? "Bride's side" : "Groom's side"}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-400">The chosen side&apos;s name and parents appear first.</p>
          </div>

          <Field label="Groom Name" value={data.groomName} onChange={set('groomName')} placeholder="e.g. Rahul" />
          <Field label="Bride Name" value={data.brideName} onChange={set('brideName')} placeholder="e.g. Priya" />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Groom's Father" value={data.groomFather} onChange={set('groomFather')} placeholder="e.g. Suresh Verma" />
            <Field label="Groom's Mother" value={data.groomMother} onChange={set('groomMother')} placeholder="e.g. Sunita Verma" />
            <Field label="Bride's Father" value={data.brideFather} onChange={set('brideFather')} placeholder="e.g. Rajesh Sharma" />
            <Field label="Bride's Mother" value={data.brideMother} onChange={set('brideMother')} placeholder="e.g. Meena Sharma" />
          </div>

          <DateField label="Main Wedding Date" value={data.weddingDate} onChange={(v) => setData((d) => ({ ...d, weddingDate: v }))} placeholder="Pick the wedding date" />
          <Field label="Main Venue" value={data.venue} onChange={set('venue')} placeholder="e.g. Royal Palace" />
          <Field label="City" value={data.city} onChange={set('city')} placeholder="e.g. Jaipur" />

          {/* EVENTS */}
          <div className="border-t border-stone-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-stone-700">Events</label>
              <button type="button" onClick={addEvent}
                className="rounded-full bg-rose-50 text-rose-600 border border-rose-200 px-3 py-1.5 text-xs font-medium hover:bg-rose-100 transition-colors">
                + Add event
              </button>
            </div>

            <div className="space-y-4">
              {data.events.map((ev, i) => (
                <div key={i} className="rounded-xl border border-stone-200 bg-stone-50/60 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <select value={ev.name} onChange={setEvent(i, 'name')}
                      className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white outline-none focus:border-rose-400">
                      {EVENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {data.events.length > 1 && (
                      <button type="button" onClick={() => removeEvent(i)}
                        className="text-stone-400 hover:text-rose-500 text-sm px-2" title="Remove">✕</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Date</label>
                      <DateField value={ev.date} onChange={(v) => setEventVal(i, 'date', v)} placeholder="Pick date" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Time</label>
                      <input type="time" value={ev.time} onChange={setEvent(i, 'time')}
                        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-rose-400" />
                    </div>
                  </div>
                  <input value={ev.venue} onChange={setEvent(i, 'venue')} placeholder="Venue (e.g. Garden Lawn)"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-rose-400" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Family Members (comma separated)</label>
            <textarea value={data.familyMembers} onChange={set('familyMembers')} rows={2}
              placeholder="e.g. Aman, Riya, Uncle Mohan, Aunt Geeta"
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 resize-none" />
          </div>

          <button onClick={() => setShowPreview(true)}
            className="w-full rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 text-white font-medium shadow-lg shadow-rose-300/40 hover:shadow-xl transition-shadow">
            Preview Invitation
          </button>

          {payErr && <p className="text-sm text-rose-600 text-center">{payErr}</p>}
          <button onClick={createAndPay} disabled={paying}
            className="w-full rounded-full border-2 border-rose-500 px-6 py-3 text-rose-600 font-semibold hover:bg-rose-50 transition-colors disabled:opacity-60">
            {paying ? 'Processing…' : 'Create Shareable Link — ₹599'}
          </button>
          <p className="text-xs text-stone-400 text-center">Preview is free. Pay only to generate a shareable link.</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      <input value={value} onChange={onChange} placeholder={placeholder}
        className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200" />
    </div>
  );
}
