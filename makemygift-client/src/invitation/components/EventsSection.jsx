import { motion, useTransform } from 'framer-motion';
import { STAGES } from '../hooks/useInvitationScroll.js';

// EVENTS SCENE (between invitation message and calendar): all events stacked as a
// list, scrollable within if there are many. Same main bg + top/bottom florals.
export default function EventsSection({ progress, data }) {
  const [s, e] = STAGES.events;
  const opacity = useTransform(progress, [s, s + 0.04, e - 0.04, e], [0, 1, 1, 0]);
  const y = useTransform(progress, [s, e], [20, -8]);

  const events = Array.isArray(data.events) ? data.events.filter((ev) => ev && ev.name) : [];

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8 pointer-events-none">
      <div className="royal-body text-xs tracking-[0.4em] uppercase mb-5">Wedding Events</div>

      {/* the list itself can scroll if there are many events (pointer-events on) */}
      <div className={`w-full max-w-sm px-1 ${events.length > 3 ? 'space-y-1.5' : 'space-y-3'}`}>
        {events.length === 0 ? (
          <p className="royal-body text-sm text-center opacity-60">Add events in the form to see them here.</p>
        ) : (
          events.map((ev, i) => (
            <div key={i} className={`rounded-2xl border border-amber-700/20 bg-white/55 shadow-sm text-center ${events.length > 3 ? 'px-4 py-2' : 'px-5 py-4'}`}>
              <div className={`royal-name leading-tight ${events.length > 3 ? 'text-2xl' : 'text-3xl'}`}>{ev.name}</div>
              <div className="mx-auto my-2 h-px w-12 bg-amber-700/30" />
              {(ev.date || ev.time) && (
                <div className="royal-body text-sm flex items-center justify-center gap-1.5">
                  <span aria-hidden>📅</span>
                  {[formatDate(ev.date), ev.time ? formatTime(ev.time) : ''].filter(Boolean).join(' · ')}
                </div>
              )}
              {ev.venue && (
                <div className="mt-1 royal-body text-sm flex items-center justify-center gap-1.5">
                  <span aria-hidden>📍</span>{ev.venue}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}
function formatTime(t) {
  // t is "HH:MM" from a time input
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  if (isNaN(h)) return t;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}
