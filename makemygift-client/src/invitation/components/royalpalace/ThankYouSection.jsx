import { motion, useTransform } from 'framer-motion';
import { RP_STAGES } from '../../hooks/useRoyalPalaceScroll.js';
import { RP } from '../assets/royalPalaceAssets.js';

// SCENE 6 — Final Thank You (graceful closing). Every element ramps up and is
// EXPLICITLY pinned to stay at 1 through progress 1.0 (trailing keyframe at 1),
// so nothing fades back out at the end. No section-level fade-out.
export default function ThankYouSection({ progress, data }) {
  const [s, e] = RP_STAGES.thanks;
  const span = e - s;
  const at = (f) => s + span * f;

  const initial = (n) => (n && n.trim() ? n.trim()[0].toUpperCase() : '');
  const initials = `${initial(data.brideName)}${initial(data.groomName)}`;

  const brideFirst = data.side === 'bride';
  const mother = brideFirst ? data.brideMother : data.groomMother;
  const father = brideFirst ? data.brideFather : data.groomFather;
  const parents = [mother ? `Smt. ${mother}` : '', father ? `Sri. ${father}` : '']
    .filter(Boolean).join(' & ').toUpperCase();

  // trailing "1" keyframe at progress 1.0 guarantees each element holds to the end
  const monoO     = useTransform(progress, [at(0.04), at(0.18), 1], [0, 1, 1], { clamp: true });
  const monoScale = useTransform(progress, [at(0.04), at(0.18), 1], [0.9, 1, 1], { clamp: true });
  const initO     = useTransform(progress, [at(0.16), at(0.26), 1], [0, 1, 1], { clamp: true });
  const blessO    = useTransform(progress, [at(0.26), at(0.38), 1], [0, 1, 1], { clamp: true });
  const blessY    = useTransform(progress, [at(0.26), at(0.38), 1], [18, 0, 0], { clamp: true });
  const divScaleX = useTransform(progress, [at(0.38), at(0.5), 1], [0, 1, 1], { clamp: true });
  const divO      = useTransform(progress, [at(0.38), at(0.44), 1], [0, 1, 1], { clamp: true });
  const tyO       = useTransform(progress, [at(0.5), at(0.62), 1], [0, 1, 1], { clamp: true });
  const tyScale   = useTransform(progress, [at(0.5), at(0.62), 1], [0.95, 1, 1], { clamp: true });
  const invO      = useTransform(progress, [at(0.62), at(0.72), 1], [0, 1, 1], { clamp: true });
  const parO      = useTransform(progress, [at(0.7), at(0.82), 1], [0, 1, 1], { clamp: true });
  const parY      = useTransform(progress, [at(0.7), at(0.82), 1], [14, 0, 0], { clamp: true });

  return (
    <motion.div
      style={{ opacity: 1 }}
      className="rp-thanks absolute inset-0 z-30 flex flex-col items-center justify-start pt-[8vh] text-center px-10 pointer-events-none"
    >
      <motion.div style={{ opacity: monoO, scale: monoScale }} className="relative flex items-center justify-center">
        <img src={RP.monogram} alt="" className="h-[15vh] w-auto select-none" draggable={false} />
        <motion.span style={{ opacity: initO }} className="royal-name absolute inset-0 flex items-center justify-center text-4xl">
          {initials}
        </motion.span>
      </motion.div>

      <motion.p style={{ opacity: blessO, y: blessY }} className="rp-serif mt-6 text-base sm:text-lg leading-relaxed max-w-[260px]">
        Awaiting your gracious presence<br />to bless our beginning
      </motion.p>

      <motion.div style={{ opacity: divO }} className="mt-5 flex items-center justify-center gap-2">
        <motion.span style={{ scaleX: divScaleX }} className="block h-px w-14 bg-amber-700/50 origin-center" />
        <span className="text-amber-700/80 text-sm">&#10070;</span>
        <motion.span style={{ scaleX: divScaleX }} className="block h-px w-14 bg-amber-700/50 origin-center" />
      </motion.div>

      <motion.h2 style={{ opacity: tyO, scale: tyScale }} className="royal-name mt-5 text-6xl sm:text-7xl leading-none">
        Thank you
      </motion.h2>

      <motion.p style={{ opacity: invO }} className="rp-serif mt-6 text-xs tracking-[0.4em] uppercase opacity-85">
        Invited By
      </motion.p>

      {parents && (
        <motion.p style={{ opacity: parO, y: parY }} className="rp-serif font-bold mt-2 text-sm sm:text-base tracking-wide max-w-xs">
          {parents}
        </motion.p>
      )}
    </motion.div>
  );
}
