// Temple Wedding template — FOUNDATION ONLY (static preview).
// Future: gopuram/kolam artwork layers, diya glow, dynamic text injection. No animations yet.
export default function TempleWedding({ data = {}, template }) {
  const { brideName, groomName, weddingDate, venue, familyDetails } = data;
  return (
    <div className="mx-auto w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden relative bg-gradient-to-b from-[#3a0d0d] to-[#1a0505] text-amber-50 shadow-2xl">
      {/* future: artwork layers (gopuram, kolam, marigold) mount here */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <div className="text-amber-300 text-xs tracking-[0.35em] uppercase mb-6">&#x1FA94; Shubh Vivah &#x1FA94;</div>
        <div className="font-serif text-4xl font-semibold">{groomName || 'Groom'}</div>
        <div className="my-3 text-amber-400 text-2xl font-serif">&amp;</div>
        <div className="font-serif text-4xl font-semibold">{brideName || 'Bride'}</div>
        <div className="mt-8 h-px w-24 bg-amber-400/40" />
        <div className="mt-6 text-sm text-amber-100/90">{weddingDate || 'The Wedding Day'}</div>
        <div className="mt-1 text-sm text-amber-100/70">{venue || 'Venue'}</div>
        {familyDetails && <div className="mt-6 text-xs text-amber-100/60 leading-relaxed">{familyDetails}</div>}
      </div>
      <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] tracking-widest text-amber-200/40 uppercase">
        {template?.name} &middot; preview
      </div>
    </div>
  );
}
