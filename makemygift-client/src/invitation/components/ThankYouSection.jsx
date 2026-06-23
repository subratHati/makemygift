import { motion, useTransform } from 'framer-motion';
import { STAGES } from '../hooks/useInvitationScroll.js';

// SCENE 4 (main bg + side florals): thank you. Fade in + slight scale.
export default function ThankYouSection({ progress, data }) {
  const [s, e] = STAGES.scene4;
  const opacity = useTransform(progress, [s, s + 0.06, 1], [0, 1, 1]);
  const scale = useTransform(progress, [s, e], [0.92, 1]);
  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-10 pointer-events-none">
      <h2 className="font-serif text-4xl sm:text-5xl font-semibold royal-name">Thank You</h2>
      <p className="mt-4 royal-body text-base max-w-xs">We look forward to celebrating with you.</p>
      <p className="mt-6 font-serif royal-name text-lg">{data.groomName} &amp; {data.brideName}</p>
      {data.familyMembers && (
        <p className="mt-6 royal-body text-sm leading-relaxed max-w-xs">
          With warm invitation from<br />{data.familyMembers}
        </p>
      )}
    </motion.div>
  );
}
