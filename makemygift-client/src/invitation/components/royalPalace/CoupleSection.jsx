import { motion, useTransform } from 'framer-motion';
import { RP_STAGES } from '../../hooks/useRoyalPalaceScroll.js';
import { RP } from '../assets/royalPalaceAssets.js';

// SCENE 2 — Bride & Groom Introduction (luxury wedding announcement).
// Order: monogram (with dynamic initials) -> names -> ornamental divider ->
// "Are Getting Married" -> couple rises. All fade out together toward Scene 3.
export default function CoupleSection({ progress, data }) {
  const [s, e] = RP_STAGES.couple;
  const span = e - s;
  const at = (f) => s + span * f;

  const initial = (n) => (n && n.trim() ? n.trim()[0].toUpperCase() : '');
  const initials = `${initial(data.brideName)}${initial(data.groomName)}`; // bride first

  // whole-scene fade: in early, hold, fade out together near the end
  const sectionOpacity = useTransform(progress, [s, at(0.12), at(0.9), e], [0, 1, 1, 0], { clamp: true });

  // 1) Monogram — scale 0.8->1, opacity 0->1
  const monoOpacity = useTransform(progress, [at(0.04), at(0.2)], [0, 1], { clamp: true });
  const monoScale = useTransform(progress, [at(0.04), at(0.2)], [0.8, 1], { clamp: true });

  // 2) Initials inside — fade in slightly after the circle
  const initOpacity = useTransform(progress, [at(0.18), at(0.28)], [0, 1], { clamp: true });

  // 3) Names — fade up
  const namesOpacity = useTransform(progress, [at(0.28), at(0.4)], [0, 1], { clamp: true });
  const namesY = useTransform(progress, [at(0.28), at(0.4)], [24, 0], { clamp: true });

  // 4) Divider — draws itself (scaleX 0->1)
  const divScaleX = useTransform(progress, [at(0.4), at(0.52)], [0, 1], { clamp: true });
  const divOpacity = useTransform(progress, [at(0.4), at(0.46)], [0, 1], { clamp: true });

  // 5) "Are Getting Married" — fade in
  const marriedOpacity = useTransform(progress, [at(0.52), at(0.62)], [0, 1], { clamp: true });

  // 6) Couple — rises from bottom (80px -> 0), after the announcement is set
  const coupleOpacity = useTransform(progress, [at(0.6), at(0.74)], [0, 1], { clamp: true });
  const coupleY = useTransform(progress, [at(0.6), at(0.78)], [80, 0], { clamp: true });

  return (
    <motion.div
      style={{ opacity: sectionOpacity }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-start pt-[5vh] text-center px-8 pointer-events-none"
    >
      {/* 1+2) Monogram circle with dynamic initials overlaid */}
      <motion.div style={{ opacity: monoOpacity, scale: monoScale }} className="relative flex items-center justify-center">
        <img src={RP.monogram} alt="" className="h-[16vh] w-auto select-none" draggable={false} />
        <motion.span
          style={{ opacity: initOpacity }}
          className="royal-name absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl"
        >
          {initials}
        </motion.span>
      </motion.div>

      {/* 3) Names */}
      <motion.div style={{ opacity: namesOpacity, y: namesY }} className="mt-3 flex flex-col items-center">
        <p className="royal-name text-4xl sm:text-5xl leading-tight">{data.brideName || 'Bride'}</p>
        <p className="my-0.5 royal-name text-2xl" style={{ color: '#b8860b' }}>&amp;</p>
        <p className="royal-name text-4xl sm:text-5xl leading-tight">{data.groomName || 'Groom'}</p>
      </motion.div>

      {/* 4) Ornamental divider (draws itself) */}
      <motion.div style={{ opacity: divOpacity }} className="mt-3 flex items-center justify-center gap-2">
        <motion.span style={{ scaleX: divScaleX }} className="block h-px w-16 bg-amber-700/50 origin-center" />
        <span className="text-amber-700/70 text-lg">&#10070;</span>
        <motion.span style={{ scaleX: divScaleX }} className="block h-px w-16 bg-amber-700/50 origin-center" />
      </motion.div>

      {/* 5) Announcement text */}
      <motion.p style={{ opacity: marriedOpacity }} className="royal-body mt-2 text-sm tracking-[0.35em] uppercase">
        Are Getting Married
      </motion.p>

      {/* 6) Couple illustration rises from bottom — visual focus, lower half */}
      <motion.img
        src={RP.couple}
        alt=""
        style={{ opacity: coupleOpacity, y: coupleY }}
        className="mt-2 h-[46vh] w-auto select-none"
        draggable={false}
      />
    </motion.div>
  );
}
