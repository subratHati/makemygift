import { motion, useTransform } from 'framer-motion';
import { STAGES } from '../hooks/useInvitationScroll.js';

// SECTION 1 (hero): "Wedding Invitation" over the hero background. Fades in, then out.
export default function HeroSection({ progress, data }) {
  const [s, e] = STAGES.hero;
  const opacity = useTransform(progress, [s, s + 0.03, e, e + 0.03], [0, 1, 1, 0]);
  const y = useTransform(progress, [s, e], [16, -8]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-8 pointer-events-none">
      <div className="text-amber-200/80 text-xs tracking-[0.4em] uppercase mb-4">You are invited to</div>
      <h1 className="font-serif text-5xl sm:text-6xl font-semibold text-amber-50 drop-shadow-lg">Wedding Invitation</h1>
      <p className="mt-4 text-amber-100/70 text-sm tracking-widest">{data.city ? `· ${data.city} ·` : '· · ·'}</p>
    </motion.div>
  );
}
