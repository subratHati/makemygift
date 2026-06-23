// Floral Wedding template — FOUNDATION ONLY (static preview).
// Future: watercolor floral layers, soft motion, dynamic text injection. No animations yet.
export default function FloralWedding({ data = {}, template }) {
  const { brideName, groomName, weddingDate, venue, familyDetails } = data;
  return (
    <div className="mx-auto w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden relative bg-gradient-to-b from-[#fff6f3] to-[#ffe9e4] text-stone-700 shadow-2xl">
      {/* future: artwork layers (florals, garlands) mount here */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <div className="text-rose-400 text-xs tracking-[0.35em] uppercase mb-6">Together Forever</div>
        <div className="font-serif text-4xl font-semibold text-stone-800">{groomName || 'Groom'}</div>
        <div className="my-3 text-rose-400 text-2xl font-serif italic">&amp;</div>
        <div className="font-serif text-4xl font-semibold text-stone-800">{brideName || 'Bride'}</div>
        <div className="mt-8 h-px w-24 bg-rose-300/60" />
        <div className="mt-6 text-sm text-stone-600">{weddingDate || 'The Wedding Day'}</div>
        <div className="mt-1 text-sm text-stone-500">{venue || 'Venue'}</div>
        {familyDetails && <div className="mt-6 text-xs text-stone-500 leading-relaxed">{familyDetails}</div>}
      </div>
      <div className="absolute bottom-3 left-0 right-0 text-center text-[10px] tracking-widest text-rose-300 uppercase">
        {template?.name} &middot; preview
      </div>
    </div>
  );
}
