import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Smooth, weighted scrolling for the invitation story.
// lerp = how gently it catches up (lower = smoother/heavier glide).
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,          // smoothness (0.06-0.12 is a nice royal glide)
      smoothWheel: true,
      wheelMultiplier: 0.9, // slightly slower per wheel notch
      touchMultiplier: 1.1,
    });
    let id;
    const raf = (time) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);
}
