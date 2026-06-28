import { motion, useTransform } from 'framer-motion';
import { RP_STAGES } from '../../hooks/useRoyalPalaceScroll.js';
import { RP } from '../assets/royalPalaceAssets.js';

function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// SCENE 5 — Wedding Ceremony (the climax). "Wedding / CEREMONY" title, divider,
// date + time, venue block, then the couple rises to anchor the bottom.
// All text deep red (#922724); couple sits at the very bottom, details above it.
export default function WeddingSection({ progress, data }) {
  const [s, e] = RP_STAGES.wedding;
  const span = e - s;
  const at = (f) => s + span * f;
  const w = data.wedding || {};

  const sectionOpacity = useTransform(progress, [s, at(0.1), at(0.9), e], [0, 1, 1, 0], { clamp: true });

  // staggered reveals
  const weddingO = useTransform(progress, [at(0.0), at(0.12)], [0, 1], { clamp: true });
  const weddingY = useTransform(progress, [at(0.0), at(0.12)], [20, 0], { clamp: true });
  const ceremonyO = useTransform(progress, [at(0.1), at(0.2)], [0, 1], { clamp: true });
  const divScaleX = useTransform(progress, [at(0.18), at(0.3)], [0, 1], { clamp: true });
  const divO = useTransform(progress, [at(0.18), at(0.24)], [0, 1], { clamp: true });
  const dateO = useTransform(progress, [at(0.28), at(0.38)], [0, 1], { clamp: true });
  const dateY = useTransform(progress, [at(0.28), at(0.38)], [14, 0], { clamp: true });
  const timeO = useTransform(progress, [at(0.36), at(0.46)], [0, 1], { clamp: true });
  const timeY = useTransform(progress, [at(0.36), at(0.46)], [14, 0], { clamp: true });
  const venHeadO = useTransform(progress, [at(0.46), at(0.54)], [0, 1], { clamp: true });
  const venNameO = useTransform(progress, [at(0.52), at(0.62)], [0, 1], { clamp: true });
  const venNameY = useTransform(progress, [at(0.52), at(0.62)], [14, 0], { clamp: true });
  const venAddrO = useTransform(progress, [at(0.6), at(0.7)], [0, 1], { clamp: true });
  const venAddrY = useTransform(progress, [at(0.6), at(0.7)], [12, 0], { clamp: true });
  // couple — rises last, anchors the bottom
  const coupleO = useTransform(progress, [at(0.68), at(0.82)], [0, 1], { clamp: true });
  const coupleY = useTransform(progress, [at(0.68), at(0.86)], [80, 0], { clamp: true });
  const coupleScale = useTransform(progress, [at(0.68), at(0.86)], [0.95, 1], { clamp: true });

  return (
    <motion.div
      style={{ opacity: sectionOpacity, color: '#922724' }}
      className="rp-wedding absolute inset-0 z-30 flex flex-col items-center pointer-events-none"
    >
      {/* DETAILS — top portion, centered */}
      <div className="flex flex-col items-center text-center px-10 pt-[12vh]">
        {/* Wedding / CEREMONY */}
        <motion.h2 style={{ opacity: weddingO, y: weddingY }} className="royal-name text-6xl sm:text-7xl leading-none">
          Wedding
        </motion.h2>
        <motion.p style={{ opacity: ceremonyO }} className="rp-serif mt-1 text-base sm:text-lg tracking-[0.45em] uppercase">
          Ceremony
        </motion.p>

        {/* decorative divider (draws itself) */}
        <motion.div style={{ opacity: divO }} className="mt-4 flex items-center justify-center gap-2">
          <motion.span style={{ scaleX: divScaleX }} className="block h-px w-14 bg-amber-700/50 origin-center" />
          <span className="text-amber-700/80 text-sm">&#10070;</span>
          <motion.span style={{ scaleX: divScaleX }} className="block h-px w-14 bg-amber-700/50 origin-center" />
        </motion.div>

        {/* date + time */}
        {w.date && (
          <motion.p style={{ opacity: dateO, y: dateY }} className="rp-serif font-bold mt-5 text-base sm:text-lg">
            {fmtDate(w.date)}
          </motion.p>
        )}
        {w.time && (
          <motion.p style={{ opacity: timeO, y: timeY }} className="rp-serif font-bold mt-1 text-sm sm:text-base">
            {w.time} Onwards
          </motion.p>
        )}

        {/* venue */}
        <motion.p style={{ opacity: venHeadO }} className="rp-serif mt-6 text-xs tracking-[0.4em] uppercase opacity-80">
          Venue
        </motion.p>
        {w.venue && (
          <motion.p style={{ opacity: venNameO, y: venNameY }} className="royal-name text-3xl sm:text-4xl mt-1 leading-tight">
            {w.venue}
          </motion.p>
        )}
        {w.city && (
          <motion.p style={{ opacity: venAddrO, y: venAddrY }} className="rp-serif text-sm mt-1 opacity-85">
            {w.city}
          </motion.p>
        )}
      </div>

      {/* COUPLE — anchored at the very bottom */}
      <motion.img
        src={RP.couple}
        alt=""
        style={{ opacity: coupleO, y: coupleY, scale: coupleScale }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[42vh] w-auto select-none"
        draggable={false}
      />
    </motion.div>
  );
}
