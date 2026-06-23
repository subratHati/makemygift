import { useRef } from 'react';
import { useScroll } from 'framer-motion';

// Reusable scroll engine. Attach scrollRef to a tall track; progress is 0..1.
export function useInvitationScroll() {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });
  return { scrollRef, progress: scrollYProgress };
}

// 5-SCENE STORY (progress 0..1):
//   Scene 1  0.00-0.26  hero bg | couple + lamps swing in + names (together)
//   (trans)  0.26-0.34  hero bg -> main bg crossfade; scene-1 elements fade out
//   Scene 2  0.34-0.50  main bg + top/bottom florals | invitation message
//   Events   0.50-0.66  main bg + same florals | event list (Mehendi/Sangeet/...)
//   Scene 3  0.66-0.82  main bg + same florals | calendar + venue below
//   Scene 4  0.82-1.00  main bg | side florals | thank you + family
export const STAGES = {
  scene1:     [0.00, 0.26],
  transition: [0.26, 0.34],
  scene2:     [0.34, 0.50],
  events:     [0.50, 0.66],
  scene3:     [0.66, 0.82],
  scene4:     [0.82, 1.00],
};
