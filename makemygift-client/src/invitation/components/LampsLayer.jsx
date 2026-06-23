import { motion, useTransform } from 'framer-motion';
import { STAGES } from '../hooks/useInvitationScroll.js';
import { ROYAL } from './assets/royalAssets.js';

// SCENE 1: ONE lamp asset, 7 instances — 3 left, 1 centre, 3 right.
// Drop in (staggered) and SWING like a pendulum, together with names + couple.
// Fade out completely during the transition (Scene 1 -> Scene 2).
function Lamp({ progress, index, total, dir, shorter }) {
  const [s, e] = STAGES.scene1;
  const [t0, t1] = STAGES.transition;

  // hold lamps back too, so the very first view is JUST the couple
  const offset = (e - s) * 0.18;
  const start = s + offset + (index / total) * (e - s) * 0.32;
  const end = start + 0.05;

  const y = useTransform(progress, [start, end], [-200, 0]);
  const rotate = useTransform(
    progress,
    [start, (start + end) / 2, end, end + 0.03],
    [dir * 24, dir * -8, dir * 3, 0]
  );
  // visible through scene 1, fade out during transition
  const opacity = useTransform(progress, [start, start + 0.02, t0, t1], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ y, rotate, opacity, transformOrigin: 'top center', marginTop: shorter ? '-5vh' : '0vh' }}
      className="flex flex-col items-center"
    >
      {/* TUNE: lamp width */}
      <img src={ROYAL.lamp} alt="" className="w-[18vh] h-auto select-none" draggable={false} />
    </motion.div>
  );
}

export default function LampsLayer({ progress }) {
  const lamps = [0, 1, 2, 3, 4, 5, 6];
  return (
    <div className="absolute top-0 inset-x-0 z-20 flex justify-between px-0 pt-0 pointer-events-none">
      {lamps.map((i) => {
        const dir = i < 3 ? -1 : i > 3 ? 1 : 0;
        const shorter = i % 2 !== 0;
        return <Lamp key={i} progress={progress} index={i} total={7} dir={dir} shorter={shorter} />;
      })}
    </div>
  );
}
