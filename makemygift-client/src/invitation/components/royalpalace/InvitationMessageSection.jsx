import { motion, useTransform } from 'framer-motion';
import { RP_STAGES } from '../../hooks/useRoyalPalaceScroll.js';
import { RP } from '../assets/royalPalaceAssets.js';

// SCENE 3 — Formal Invitation Message (premium traditional invitation).
// Hierarchy: wedding symbol -> Shri Ganeshaya Namah -> invitation message ->
// FIRST family (name + parents) -> "With" + handshake -> SECOND family.
// Family order follows the side selector. Fades out together toward Scene 4.
export default function InvitationMessageSection({ progress, data }) {
  const [s, e] = RP_STAGES.message;
  const span = e - s;
  const at = (f) => s + span * f;

  const brideFirst = data.side === 'bride';
  const first = {
    name: brideFirst ? data.brideName : data.groomName,
    rel: brideFirst ? 'D/o' : 'S/o',
    mother: brideFirst ? data.brideMother : data.groomMother,
    father: brideFirst ? data.brideFather : data.groomFather,
  };
  const second = {
    name: brideFirst ? data.groomName : data.brideName,
    rel: brideFirst ? 'S/o' : 'D/o',
    mother: brideFirst ? data.groomMother : data.brideMother,
    father: brideFirst ? data.groomFather : data.brideFather,
  };
  const parentLine = (m, f) =>
    [m ? `Smt. ${m}` : '', f ? `Sri. ${f}` : ''].filter(Boolean).join(' & ');

  const message =
    data.invitationMessage ||
    'YOU ARE CORDIALLY INVITED TO JOIN US IN THE CELEBRATION AND BLESS THE NEW COUPLE';

  // whole-scene fade
  const sectionOpacity = useTransform(progress, [s, at(0.1), at(0.9), e], [0, 1, 1, 0], { clamp: true });

  // staggered reveals (each hook called unconditionally, top level)
  const symbolO = useTransform(progress, [at(0.0), at(0.08)], [0, 1], { clamp: true });
  const hindiO = useTransform(progress, [at(0.08), at(0.16)], [0, 1], { clamp: true });
  const hindiY = useTransform(progress, [at(0.08), at(0.16)], [12, 0], { clamp: true });
  const msgO = useTransform(progress, [at(0.16), at(0.26)], [0, 1], { clamp: true });
  const f1NameO = useTransform(progress, [at(0.26), at(0.36)], [0, 1], { clamp: true });
  const f1NameY = useTransform(progress, [at(0.26), at(0.36)], [18, 0], { clamp: true });
  const f1ParO = useTransform(progress, [at(0.34), at(0.42)], [0, 1], { clamp: true });
  const withO = useTransform(progress, [at(0.42), at(0.5)], [0, 1], { clamp: true });
  const handO = useTransform(progress, [at(0.48), at(0.58)], [0, 1], { clamp: true });
  const handScale = useTransform(progress, [at(0.48), at(0.58)], [0.9, 1], { clamp: true });
  const f2NameO = useTransform(progress, [at(0.56), at(0.66)], [0, 1], { clamp: true });
  const f2NameY = useTransform(progress, [at(0.56), at(0.66)], [18, 0], { clamp: true });
  const f2ParO = useTransform(progress, [at(0.64), at(0.72)], [0, 1], { clamp: true });

  return (
    <motion.div
      style={{ opacity: sectionOpacity }}
      className="rp-scene3 absolute inset-0 z-30 flex flex-col items-center justify-start pt-[5vh] text-center px-10 pointer-events-none"
    >

      {/* 1) Ganesh symbol image */}
      <motion.img src={RP.ganeshSymbol} alt="" style={{ opacity: symbolO }} className="h-[10vh] w-auto select-none" draggable={false} />

      {/* 2) Shri Ganeshaya Namah */}
      <motion.p style={{ opacity: hindiO, y: hindiY }} className="royal-body mt-3 text-sm font-bold tracking-tight opacity-90">
        || Shri Ganeshaya Namah ||
      </motion.p>

      {/* 3) Invitation message */}
      <motion.p style={{ opacity: msgO, color: '#922724', fontFamily: "'Bodoni Moda', serif" }} className="mt-4 text-[10px] sm:text-[11px] tracking-[0.12em] uppercase leading-relaxed max-w-[200px]">
        {message}
      </motion.p>

      {/* 4-5) FIRST family */}
      <motion.p style={{ opacity: f1NameO, y: f1NameY }} className="royal-name mt-6 text-4xl sm:text-5xl leading-tight">
        {first.name || 'Bride'}
      </motion.p>
      <motion.p style={{ opacity: f1ParO }} className="royal-body mt-1 text-xs sm:text-sm opacity-85">
        {first.rel} {parentLine(first.mother, first.father)}
      </motion.p>

      {/* 6) With */}
      <motion.p style={{ opacity: withO }} className="royal-body mt-4 text-sm italic opacity-80">with</motion.p>

      {/* 7) Handshake illustration */}
      <motion.img src={RP.handshake} alt="" style={{ opacity: handO, scale: handScale }}
        className="mt-2 h-[10vh] w-auto select-none" draggable={false} />

      {/* 8-9) SECOND family */}
      <motion.p style={{ opacity: f2NameO, y: f2NameY }} className="royal-name mt-3 text-4xl sm:text-5xl leading-tight">
        {second.name || 'Groom'}
      </motion.p>
      <motion.p style={{ opacity: f2ParO }} className="royal-body mt-1 text-xs sm:text-sm opacity-85">
        {second.rel} {parentLine(second.mother, second.father)}
      </motion.p>
    </motion.div>
  );
}
