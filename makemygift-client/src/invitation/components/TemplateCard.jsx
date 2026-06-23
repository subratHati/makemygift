// A single template tile in the gallery.
export default function TemplateCard({ template }) {
  const { id, name, description, accent, bg, emoji, hasPhoto } = template;
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* preview image placeholder */}
      <div className={`relative h-56 w-full bg-gradient-to-b ${bg} flex items-center justify-center`}>
        <span className="text-5xl opacity-90">{emoji}</span>
        <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/60">preview</span>
        {hasPhoto && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/15 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur">
            &#128247; photo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-semibold text-stone-900">{name}</h3>
        <p className="mt-1.5 text-sm text-stone-500 leading-relaxed flex-1">{description}</p>
        <a href={`/invitations/template/${id}`}
           className={`mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r ${accent} px-5 py-2.5 text-sm font-medium text-white shadow transition-all group-hover:gap-3`}>
          Use Template <span aria-hidden>&rarr;</span>
        </a>
      </div>
    </div>
  );
}
