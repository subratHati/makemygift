// Reusable header used at the top of invitation pages.
export default function InvitationHero({ title, subtitle, back }) {
  return (
    <header className="text-center mb-10 sm:mb-14">
      {back && (
        <a href={back.href} className="inline-block mb-6 text-sm text-stone-500 hover:text-stone-800 transition-colors">
          &larr; {back.label}
        </a>
      )}
      <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-stone-900 leading-tight">{title}</h1>
      {subtitle && <p className="mt-3 sm:mt-4 text-base sm:text-lg text-stone-600 max-w-xl mx-auto">{subtitle}</p>}
    </header>
  );
}
