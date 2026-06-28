import { motion, useTransform } from 'framer-motion';
import { RP_STAGES } from '../../hooks/useRoyalPalaceScroll.js';

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}
function fmtTime(t) {
  if (!t) return '';
  const [h, m] = String(t).split(':').map(Number);
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m || 0).padStart(2, '0')} ${ampm}`;
}

/* ---------- shared bits ---------- */
function Flourish({ cls }) {
  return (
    <div className={`${cls} flex items-center justify-center gap-2 opacity-90`}>
      <span className="block h-px w-10 bg-amber-700/50" />
      <span className="text-amber-700/80 text-sm">&#10070;</span>
      <span className="block h-px w-10 bg-amber-700/50" />
    </div>
  );
}

/* ---------- CENTERED style (1–4 events) ---------- */
function sizingCentered(n) {
  if (n <= 3) return { name: 'text-3xl sm:text-4xl', meta: 'text-xs sm:text-sm', gap: 'mt-2', flourish: 'my-4', under: 'w-12', head: 'text-3xl sm:text-4xl', headMb: 'mb-5' };
  return        { name: 'text-2xl sm:text-3xl', meta: 'text-[11px] sm:text-xs', gap: 'mt-1.5', flourish: 'my-2.5', under: 'w-10', head: 'text-2xl sm:text-3xl', headMb: 'mb-3' };
}

function CenteredRow({ progress, s, e, index, total, ev, showDivider, sz }) {
  const span = e - s;
  const start = s + span * (0.1 + (index / Math.max(total, 1)) * 0.6);
  const o = useTransform(progress, [start, start + span * 0.12], [0, 1], { clamp: true });
  const y = useTransform(progress, [start, start + span * 0.12], [22, 0], { clamp: true });
  return (
    <motion.div style={{ opacity: o, y }} className="flex flex-col items-center">
      {showDivider && <Flourish cls={sz.flourish} />}
      <div className={`royal-name ${sz.name} leading-tight`}>{ev.title}</div>
      <span className={`mt-1 block h-px ${sz.under} bg-amber-700/40`} />
      {(ev.date || ev.time) && (
        <div className={`rp-serif ${sz.gap} ${sz.meta} tracking-wide`}>
          {[fmtDate(ev.date), fmtTime(ev.time)].filter(Boolean).join('  ·  ')}
        </div>
      )}
      {ev.venue && <div className={`rp-serif ${sz.meta} tracking-wide opacity-90`}>{ev.venue}</div>}
    </motion.div>
  );
}

/* ---------- ZIG-ZAG style (5+ events) ---------- */
function ZigRow({ progress, s, e, index, total, ev }) {
  const span = e - s;
  const start = s + span * (0.1 + (index / Math.max(total, 1)) * 0.6);
  const o = useTransform(progress, [start, start + span * 0.12], [0, 1], { clamp: true });
  const x = useTransform(progress, [start, start + span * 0.12], [index % 2 ? 28 : -28, 0], { clamp: true });

  const nameLeft = index % 2 === 0; // even -> name left, details right; odd -> reversed
  const Name = (
    <div className="flex-1 royal-name text-2xl sm:text-3xl leading-tight">{ev.title}</div>
  );
  const Details = (
    <div className="flex-1 rp-serif text-[11px] sm:text-xs leading-snug">
      {(ev.date || ev.time) && <div>{[fmtDate(ev.date), fmtTime(ev.time)].filter(Boolean).join(' · ')}</div>}
      {ev.venue && <div className="opacity-90">{ev.venue}</div>}
    </div>
  );

  return (
    <motion.div style={{ opacity: o, x }} className="w-full flex items-center gap-3 py-2 text-left">
      {nameLeft ? (
        <>
          <div className="flex-1 text-left">{Name}</div>
          <span className="text-amber-700/70 text-sm">&#10070;</span>
          <div className="flex-1 text-right">{Details}</div>
        </>
      ) : (
        <>
          <div className="flex-1 text-left">{Details}</div>
          <span className="text-amber-700/70 text-sm">&#10070;</span>
          <div className="flex-1 text-right">{Name}</div>
        </>
      )}
    </motion.div>
  );
}

export default function EventsTimelineSection({ progress, data }) {
  const [s, e] = RP_STAGES.events;
  const span = e - s;
  const at = (f) => s + span * f;

  const sectionOpacity = useTransform(progress, [s, at(0.08), at(0.88), e], [0, 1, 1, 0], { clamp: true });
  const headO = useTransform(progress, [s, at(0.1)], [0, 1], { clamp: true });
  const headY = useTransform(progress, [s, at(0.1)], [16, 0], { clamp: true });

  const events = Array.isArray(data.events) ? data.events.filter((ev) => ev && ev.title) : [];
  const zig = events.length >= 5; // 5+ -> zig-zag two-column layout
  const sz = sizingCentered(events.length);

  return (
    <motion.div
      style={{ opacity: sectionOpacity }}
      className="rp-events absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-8 pointer-events-none"
    >
      <motion.div style={{ opacity: headO, y: headY }} className={`flex flex-col items-center ${zig ? 'mb-3' : sz.headMb}`}>
        <span className="text-amber-700/80 text-base">&#10070;</span>
        <p className={`royal-name ${zig ? 'text-2xl sm:text-3xl' : sz.head} mt-1`}>The Celebrations</p>
      </motion.div>

      {events.length === 0 ? (
        <p className="rp-serif text-sm opacity-70">Your events will appear here.</p>
      ) : zig ? (
        <div className="w-full max-w-md flex flex-col divide-y divide-amber-700/15">
          {events.map((ev, i) => (
            <ZigRow key={i} progress={progress} s={s} e={e} index={i} total={events.length} ev={ev} />
          ))}
        </div>
      ) : (
        <div className="w-full max-w-xs flex flex-col items-center">
          {events.map((ev, i) => (
            <CenteredRow key={i} progress={progress} s={s} e={e} index={i} total={events.length} ev={ev} showDivider={i > 0} sz={sz} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
