import { useRef } from 'react';
import { useScroll } from 'framer-motion';

// Scroll engine for the Royal Palace template. Attach scrollRef to the tall track.
export function useRoyalPalaceScroll() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });
  return { scrollRef, progress: scrollYProgress };
}

// 7 sections sharing ONE permanent frame; only the centre content crossfades.
// Windows are evenly spaced with small crossfade overlaps handled per-section.
export const RP_STAGES = {
  intro:    [0.00, 0.02], // Section 1 — frame only, subtle bg scale
  ganesh:   [0.02, 0.26], // Section 2
  couple:   [0.26, 0.40], // Section 3
  message:  [0.40, 0.55], // Section 4
  events:   [0.55, 0.68], // Section 5
  wedding:  [0.68, 0.82], // Section 6
  thanks:   [0.82, 1.00], // Section 7 — last, widest, holds to the end
};
