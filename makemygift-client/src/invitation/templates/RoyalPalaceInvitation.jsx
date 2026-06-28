import { useEffect } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useRoyalPalaceScroll, RP_STAGES } from '../hooks/useRoyalPalaceScroll.js';
import { useLenis } from '../hooks/useLenis.js';
import { RP } from '../components/assets/royalPalaceAssets.js';
import GaneshSection from '../components/royalpalace/GaneshSection.jsx';
import CoupleSection from '../components/royalpalace/CoupleSection.jsx';
import InvitationMessageSection from '../components/royalpalace/InvitationMessageSection.jsx';
import EventsTimelineSection from '../components/royalpalace/EventsTimelineSection.jsx';
import WeddingSection from '../components/royalpalace/WeddingSection.jsx';
import ThankYouSection from '../components/royalpalace/ThankYouSection.jsx';

// Royal Palace Scroll Invitation.
// ONE permanent frame (royal-gate-background) stays mounted the whole scroll;
// only the centre content crossfades through 7 sections.
export default function RoyalPalaceInvitation({ data = {} }) {
  useLenis();
  // map incoming invitation data -> the shape the sections expect (with safe defaults)
  const d = {
    brideName: data.brideName || 'Priya',
    groomName: data.groomName || 'Rahul',
    familyName: data.familyName || data.familyMembers || 'The Sharma Family',
    invitationMessage: data.invitationMessage || '',
    parents: data.parents || '',
    familyDetails: data.familyDetails || '',
    side: data.side || 'bride',
    brideFather: data.brideFather || '',
    brideMother: data.brideMother || '',
    groomFather: data.groomFather || '',
    groomMother: data.groomMother || '',
    wedding: {
      date: data.wedding?.date || data.weddingDate || '',
      time: data.wedding?.time || data.weddingTime || '',
      venue: data.wedding?.venue || data.venue || '',
    },
    events: Array.isArray(data.events)
      ? data.events.map((ev) => ({
        title: ev.title || ev.name || '',
        date: ev.date || '',
        time: ev.time || '',
        venue: ev.venue || '',
        city: data.wedding?.city || data.city || '',
      }))
      : [],
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    Object.values(RP).forEach((src) => { const img = new Image(); img.src = src; });
  }, []);

  const { scrollRef, progress } = useRoyalPalaceScroll();

  // subtle, continuous frame scale for life (Section 1 "anticipation" + gentle motion throughout)
  const frameScale = useTransform(progress, [0, 1], [1, 1.05]);
  const introHintOpacity = useTransform(progress, [0, RP_STAGES.intro[1]], [1, 0]);

  return (
    // TALL TRACK — generous height for slow, cinematic scrolling
    <div ref={scrollRef} className="relative w-full" style={{ height: '1200vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#f3e3cf]">

        {/* PERMANENT FRAME — never unmounts, never switches */}
        <motion.img
          src={RP.gateBackground}
          alt=""
          style={{ scale: frameScale }}
          className="absolute inset-0 z-0 h-full w-full object-cover select-none"
          draggable={false}
        />

        {/* CONTENT LAYER — only this crossfades */}
        <GaneshSection progress={progress} data={d} />
        <CoupleSection progress={progress} data={d} />
        <InvitationMessageSection progress={progress} data={d} />
        <EventsTimelineSection progress={progress} data={d} />
        <WeddingSection progress={progress} data={d} />
        <ThankYouSection progress={progress} data={d} />

        {/* Section 1 — frame only; a gentle scroll hint that fades as you begin */}
        <motion.div style={{ opacity: introHintOpacity }}
          className="absolute bottom-6 inset-x-0 z-40 flex flex-col items-center royal-body text-xs tracking-[0.3em] uppercase pointer-events-none">
          <span>Scroll</span>
          <span className="mt-1 text-lg animate-bounce">&#8595;</span>
        </motion.div>
      </div>
    </div>
  );
}
