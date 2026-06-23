import { motion, useTransform } from 'framer-motion';
import { STAGES } from '../hooks/useInvitationScroll.js';

// SCENE 2 (main bg + top/bottom florals): invitation message. Fades in, then out
// as Scene 3 (calendar) begins.
export default function InvitationSection({ progress, data, order }) {
  const [s, e] = STAGES.scene2;
  const opacity = useTransform(progress, [s, s + 0.05, e - 0.04, e], [0, 1, 1, 0]);
  const y = useTransform(progress, [s, e], [20, -8]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-10 pt-[4vh] pointer-events-none">
      <p className="royal-body text-sm leading-snug max-w-xs">
        On the moving wheel of life, <br /> the auspicious time has come when
      </p>
      <p className="my-4 font-semibold royal-body text-sm">{order.firstParents}</p>
      <p className="mt-2 royal-body text-sm leading-snug max-w-xs">
        solicit your benign presence on the auspicious occasion of the Wedding ceremony of their beloved {data.side === 'bride' ? 'Daughter' : 'Son'}
      </p>
      <p className="mt-2 royal-name text-4xl">{order.firstName}</p>
      <p className="mt-1 royal-body text-sm">with</p>
      <p className="mt-1 royal-name text-4xl">{order.secondName}</p>
      <p className="mt-2 royal-body text-sm leading-relaxed max-w-xs">
        {data.side === 'bride' ? 'Son' : 'Daughter'} of {order.secondParents}
      </p>
    </motion.div>
  );
}
