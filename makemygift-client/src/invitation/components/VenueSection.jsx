import { motion, useTransform } from 'framer-motion';
import { STAGES } from '../hooks/useInvitationScroll.js';
import Calendar from './Calendar.jsx';

// SCENE 3 (same main bg + same florals): code-built calendar with venue BELOW it.
// Fades in, then out as Scene 4 (thank you) begins.
export default function VenueSection({ progress, data }) {
  const [s, e] = STAGES.scene3;
  const opacity = useTransform(progress, [s, s + 0.05, e - 0.04, e], [0, 1, 1, 0]);
  const scale = useTransform(progress, [s, s + 0.08], [0.9, 1]);
  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-10 pointer-events-none">
      <div className="royal-body text-xs tracking-[0.4em] uppercase mb-5">Save the date</div>
      <Calendar dateString={data.weddingDate} />

      {/* venue block below the calendar */}
      <div className="mt-7 flex flex-col items-center">
        <div className="royal-body text-[11px] tracking-[0.35em] uppercase opacity-60 mb-2">Venue Details:</div>
        <div className="royal-name text-3xl leading-tight flex items-center gap-2">
          <span aria-hidden className="text-2xl">📍</span>{data.venue}
        </div>
        <div className="mt-1.5 royal-body text-sm opacity-80">{data.city}</div>
        <div className="mx-auto mt-4 h-px w-16 bg-amber-700/30" />
      </div>
    </motion.div>
  );
}
