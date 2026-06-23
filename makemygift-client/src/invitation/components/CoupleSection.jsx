import { motion, useTransform } from 'framer-motion';
import { STAGES } from '../hooks/useInvitationScroll.js';
import { ROYAL } from './assets/royalAssets.js';

// SCENE 1: couple appears first, then slides TOWARD centre (not all the way) as the
// names + lamps come in together. Fades out during the transition.
export default function CoupleSection({ progress }) {
  const [s, e] = STAGES.scene1;
  const [t0, t1] = STAGES.transition;
  const moveEnd = s + (e - s) * 0.6;
  const opacity = useTransform(progress, [s, t0, t1, 1], [1, 1, 0, 0], { clamp: true });
  const y = useTransform(progress, [s, moveEnd], ['10vh', '4vh']);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-[4%] z-20 flex justify-center pointer-events-none">
      {/* TUNE: couple height */}
      <img src={ROYAL.couple} alt="" className="h-[52vh] w-auto select-none" draggable={false} />
    </motion.div>
  );
}
