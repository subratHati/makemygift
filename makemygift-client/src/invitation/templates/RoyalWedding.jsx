import { useEffect } from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';
import { useInvitationScroll, STAGES } from '../hooks/useInvitationScroll.js';
import { useLenis } from '../hooks/useLenis.js';
import { ROYAL } from '../components/assets/royalAssets.js';
import NamesSection from '../components/NamesSection.jsx';
import LampsLayer from '../components/LampsLayer.jsx';
import CoupleSection from '../components/CoupleSection.jsx';
import InvitationSection from '../components/InvitationSection.jsx';
import EventsSection from '../components/EventsSection.jsx';
import VenueSection from '../components/VenueSection.jsx';
import ThankYouSection from '../components/ThankYouSection.jsx';

// Royal Wedding — 4-scene scroll story.
//   Scene 1: hero bg | couple slides toward centre + lamps swing in + names (together)
//   ->trans: hero bg crossfades to MAIN bg; lamps/names/couple fade out
//   Scene 2: main bg + top/bottom florals | invitation message
//   Scene 3: main bg + same florals | calendar + venue below
//   Scene 4: main bg | florals swap to SIDE florals | thank you
export default function RoyalWedding({ data = {} }) {
  useLenis();
  const invitationData = {
    side: data.side || 'bride',
    brideName: data.brideName || 'Priya',
    groomName: data.groomName || 'Rahul',
    groomFather: data.groomFather || 'Suresh Verma',
    groomMother: data.groomMother || 'Sunita Verma',
    brideFather: data.brideFather || 'Rajesh Sharma',
    brideMother: data.brideMother || 'Meena Sharma',
    weddingDate: data.weddingDate || '24 November 2026',
    venue: data.venue || 'Royal Palace',
    city: data.city || 'Jaipur',
    familyMembers: data.familyMembers || 'Aman, Riya, Mohan, Geeta',
    events: data.events || [],
  };

  // format one side's parents as "Mr. X & Mrs. Y" (skips blanks)
  const fmtParents = (f, m) => [f ? `Mr. ${f}` : '', m ? `Mrs. ${m}` : ''].filter(Boolean).join(' & ');
  const groomParents = fmtParents(invitationData.groomFather, invitationData.groomMother);
  const brideParents = fmtParents(invitationData.brideFather, invitationData.brideMother);
  const brideFirst = invitationData.side === 'bride';
  const order = {
    firstName: brideFirst ? invitationData.brideName : invitationData.groomName,
    secondName: brideFirst ? invitationData.groomName : invitationData.brideName,
    firstParents: brideFirst ? brideParents : groomParents,
    secondParents: brideFirst ? groomParents : brideParents,
  };

  // preload all assets up front so nothing pops in mid-scroll
  useEffect(() => {
    window.scrollTo(0, 0);
    Object.values(ROYAL).forEach((src) => { const img = new Image(); img.src = src; });
  }, []);

  const { scrollRef, progress: rawProgress } = useInvitationScroll();

  // smooth the scroll-driven progress so all motion eases instead of snapping
  const progress = useSpring(rawProgress, { stiffness: 80, damping: 20, mass: 0.4 });

  const [tr0, tr1] = STAGES.transition;
  const [s2] = STAGES.scene2;
  const [s4a, s4b] = STAGES.scene4;

  // BACKGROUND: hero -> main crossfade at the transition; main stays to the end.
  const heroBgOpacity = useTransform(progress, [tr0, tr1], [1, 0], { clamp: true });  // soft bottom haze — visible in Scene 1 only, fades out at the transition
  const hazeOpacity = useTransform(progress, [0, 0.03, tr0, tr1, 1], [1, 1, 1, 0, 0], { clamp: true });
  const mainBgOpacity = useTransform(progress, [tr0, tr1, 1], [0, 1, 1]);
  // TOP/BOTTOM florals: appear at Scene 2, stay through Scene 3, fade out at Scene 4.
  const tbOpacity = useTransform(progress, [s2, s2 + 0.04, s4a, s4a + 0.05], [0, 1, 1, 0]);
  const topY = useTransform(progress, [s2, s2 + 0.08], [-80, 0]);
  const bottomY = useTransform(progress, [s2, s2 + 0.08], [80, 0]);

  // SIDE florals: appear at Scene 4, then stay.
  const sideOpacity = useTransform(progress, [s4a, s4a + 0.03, 1], [0, 1, 1], { clamp: true });
  const leftX = useTransform(progress, [s4a, s4b], [-120, 0]);
  const rightX = useTransform(progress, [s4a, s4b], [120, 0]);

  return (
    // TALL SCROLL TRACK (1000vh across the 4 scenes)
    <div ref={scrollRef} className="relative w-full" style={{ height: '1000vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* LAYER 1 — BACKGROUNDS */}
        <motion.img src={ROYAL.heroBg} alt="" style={{ opacity: heroBgOpacity }} className="absolute inset-0 z-0 h-full w-full object-cover" draggable={false} />
        {/* solid fill so the hero can't show through a transparent main background */}
        <motion.div style={{ opacity: mainBgOpacity }} className="absolute inset-0 z-[1] bg-[#1a0820]" />
        <motion.img src={ROYAL.mainBg} alt="" style={{ opacity: mainBgOpacity }} className="absolute inset-0 z-[2] h-full w-full object-cover" draggable={false} />

        {/* LAYER 2 — DECORATIVE: top/bottom florals (Scenes 2-3) */}
        <motion.img src={ROYAL.topFloral} alt="" style={{ opacity: tbOpacity, y: topY }} className="absolute top-[-6vh] inset-x-0 z-10 w-full select-none" draggable={false} />
        <motion.img src={ROYAL.bottomFloral} alt="" style={{ opacity: tbOpacity, y: bottomY }} className="absolute bottom-[-6vh] inset-x-0 z-10 w-full select-none" draggable={false} />
        {/* DECORATIVE: side florals (Scene 4) */}
        <motion.div style={{ opacity: sideOpacity, x: leftX }} className="absolute left-[-5vw] top-0 z-10 h-full">
          <img src={ROYAL.leftFloral} alt="" className="h-full w-auto select-none" draggable={false} />
        </motion.div>
        <motion.div style={{ opacity: sideOpacity, x: rightX }} className="absolute right-[-5vw] top-0 z-10 h-full">
          <img src={ROYAL.rightFloral} alt="" className="h-full w-auto select-none" draggable={false} />
        </motion.div>

        {/* SCENE 1 — soft heaven-like haze at the bottom (behind the couple) */}
        <motion.div
          style={{ opacity: hazeOpacity }}
          className="absolute inset-x-0 bottom-0 z-[15] h-[45vh] pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/25 to-transparent blur-md" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-amber-100/40 to-transparent" />
        </motion.div>

        {/* LAYER 3 — CHARACTER (Scene 1): lamps + couple */}
        <LampsLayer progress={progress} />
        <CoupleSection progress={progress} />


        {/* LAYER 4 — CONTENT */}
        <NamesSection progress={progress} data={invitationData} order={order} />
        <InvitationSection progress={progress} data={invitationData} order={order} />
        <EventsSection progress={progress} data={invitationData} />
        <VenueSection progress={progress} data={invitationData} />
        <ThankYouSection progress={progress} data={invitationData} />

        <ScrollHint progress={progress} />
      </div>
    </div>
  );
}

function ScrollHint({ progress }) {
  const opacity = useTransform(progress, [0, 0.04], [1, 0]);
  return (
    <motion.div style={{ opacity }} className="absolute bottom-6 inset-x-0 z-40 flex flex-col items-center text-amber-100/70 text-xs tracking-widest pointer-events-none">
      <span>scroll</span>
      <span className="mt-1 animate-bounce">&#8595;</span>
    </motion.div>
  );
}
