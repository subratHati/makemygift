import { motion, useTransform } from 'framer-motion';
import { STAGES } from '../hooks/useInvitationScroll.js';

// SCENE 1: Bride & Groom names appear together with the lamps + couple.
// Fade/rise in during the first part of scene 1, hold, then fade out at transition.
export default function NamesSection({ progress, data }) {
  const [s, e] = STAGES.scene1;
  const [t0, t1] = STAGES.transition;
  const appearStart = s + (e - s) * 0.18; // hold back so only the couple shows first
  const appearEnd = s + (e - s) * 0.5;
  const opacity = useTransform(progress, [appearStart, appearStart + 0.04, t0, t1], [0, 1, 1, 0]);
  const y = useTransform(progress, [appearStart, appearEnd], [40, 0]);

  const groomX = useTransform(progress, [appearStart, appearEnd], [-120, 0]); // top name slides from left
  const brideX = useTransform(progress, [appearStart, appearEnd], [120, 0]);  // bottom name slides from right

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 z-30 flex flex-col items-center justify-start pt-[24vh] text-center px-8 pointer-events-none">
      <div className="royal-body text-xs tracking-[0.4em] uppercase mb-2">The wedding of</div>
      <motion.div style={{ x: groomX }} className="royal-name text-5xl sm:text-6xl">{data.groomName}</motion.div>
      <div className="my-0.5 royal-name text-2xl" style={{ color: '#b8860b' }}>&amp;</div>
      <motion.div style={{ x: brideX }} className="royal-name text-5xl sm:text-6xl">{data.brideName}</motion.div>
    </motion.div>
  );
}
