import { motion, useTransform } from 'framer-motion';
import { RP_STAGES } from '../../hooks/useRoyalPalaceScroll.js';
import { RP } from '../assets/royalPalaceAssets.js';

// SECTION 1 — Ganesh Introduction (sacred, ceremonial opening).
// Reveal order (scroll-driven): mandala -> Ganesh descends -> Hindi -> dhols ->
// "Wedding Ceremony" -> "INVITATION". The whole block fades out together as you
// scroll toward Section 2. The gate frame behind stays untouched.
export default function GaneshSection({ progress, data }) {
  const [s, e] = RP_STAGES.ganesh;
  const span = e - s;

  // helper: a reveal window starting at fraction f0, finishing at f1 (within the section)
  const at = (f) => s + span * f;

  // whole-section fade: in early, hold, then fade out together near the end
  const sectionOpacity = useTransform(
    progress,
    [s, at(0.12), at(0.92), e],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // 1) Mandala — appears first, very soft, continuous slow rotation (CSS handles spin)
  const mandalaOpacity = useTransform(progress, [s, at(0.1)], [0, 0.22], { clamp: true });
  const mandalaScale = useTransform(progress, [s, at(0.1)], [0.9, 1], { clamp: true });

  // 2) Ganesh — descends from above (-150px -> 0), fade 0->1, scale 0.95->1
  const ganeshY = useTransform(progress, [at(0.06), at(0.34)], [-150, 0], { clamp: true });
  const ganeshOpacity = useTransform(progress, [at(0.06), at(0.30)], [0, 1], { clamp: true });
  const ganeshScale = useTransform(progress, [at(0.06), at(0.34)], [0.95, 1], { clamp: true });

  // 3) श्री गणेशाय नमः — after Ganesh mostly settled; small upward motion
  const hindiOpacity = useTransform(progress, [at(0.34), at(0.46)], [0, 1], { clamp: true });
  const hindiY = useTransform(progress, [at(0.34), at(0.46)], [16, 0], { clamp: true });

  // 4) Dhols — slight delay after Hindi; scale 0.8->1
  const dholOpacity = useTransform(progress, [at(0.46), at(0.58)], [0, 1], { clamp: true });
  const dholScale = useTransform(progress, [at(0.46), at(0.58)], [0.8, 1], { clamp: true });

  // 5) Wedding Ceremony — the scene title; fade + slight rise
  const titleOpacity = useTransform(progress, [at(0.58), at(0.70)], [0, 1], { clamp: true });
  const titleY = useTransform(progress, [at(0.58), at(0.70)], [18, 0], { clamp: true });

  // 6) INVITATION — last, after the title
  const inviteOpacity = useTransform(progress, [at(0.70), at(0.80)], [0, 1], { clamp: true });
  const inviteY = useTransform(progress, [at(0.70), at(0.80)], [12, 0], { clamp: true });

  return (
    <motion.div
      style={{ opacity: sectionOpacity }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-start pt-[0vh] text-center px-8 pointer-events-none"
    >
      {/* TOP — mandala behind Ganesh + Ganesh descending (stacked) */}
      <div className="relative flex items-center justify-center">
        {/* Mandala: centered behind Ganesh, soft, slow infinite rotation */}
        <div className="absolute left-1/2 top-[calc(45%)] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <motion.img
            src={RP.mandala}
            alt=""
            style={{ opacity: mandalaOpacity, scale: mandalaScale }}
            className="rp-mandala-spin h-[40vh] w-[40vh] max-w-none select-none"
            draggable={false}
          />
        </div>
        {/* Ganesh Ji */}
        <motion.img
          src={RP.ganesh}
          alt=""
          style={{ opacity: ganeshOpacity, y: ganeshY, scale: ganeshScale }}
          className="relative h-[45vh] w-auto select-none mt-[2vh]"
          draggable={false}
        />
      </div>

      {/* श्री गणेशाय नमः */}
      <motion.p
        style={{ opacity: hindiOpacity, y: hindiY }}
        className="rp-devanagari -mt-[4vh] text-2xl sm:text-3xl"
      >
        श्री गणेशाय नमः
      </motion.p>

      {/* Pair of dhols */}
      <motion.img
        src={RP.dhol}
        alt=""
        style={{ opacity: dholOpacity, scale: dholScale }}
        className="mt-4 h-[18vh] w-auto select-none"
        draggable={false}
      />

      {/* Wedding Ceremony — large cursive title */}
      <motion.h2
        style={{ opacity: titleOpacity, y: titleY }}
        className="royal-name mt-2 text-4xl sm:text-5xl leading-tight whitespace-nowrap"
      >
        Wedding Ceremony
      </motion.h2>

      {/* INVITATION — smaller serif, spaced */}
      <motion.p
        style={{ opacity: inviteOpacity, y: inviteY }}
        className="royal-body mt-2 text-sm tracking-[0.45em] uppercase"
      >
        Invitation
      </motion.p>

      {/* decorative divider */}
      <motion.div
        style={{ opacity: inviteOpacity }}
        className="mt-5 h-px w-24 bg-amber-700/40"
      />
    </motion.div>
  );
}
