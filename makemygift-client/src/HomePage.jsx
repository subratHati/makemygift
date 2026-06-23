// Landing page — lets visitors choose between the E-Gift flow and the E-Invitation flow.
// Navigation uses plain links because this project uses a lightweight path-based router
// in App.jsx (no react-router). A full reload on navigation is fine here.
export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-amber-50 to-orange-50 text-stone-800">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <header className="text-center mb-12 sm:mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-amber-700/70 mb-4">makemygift</p>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold leading-tight text-stone-900">
            Create Digital Memories
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-stone-600 max-w-xl mx-auto">
            Design beautiful interactive gifts and invitations for your loved ones.
          </p>
        </header>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Card 1 — E-Gift (existing flow) */}
          <a href="/gift"
             className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur border border-white shadow-xl shadow-amber-200/40 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-300/50">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
            <div className="text-5xl mb-5">🎁</div>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">Custom E-Gift</h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Create personalized digital gifts with memories, photos, messages and surprises.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-white font-medium shadow-lg shadow-orange-300/50 group-hover:gap-3 transition-all">
              Create E-Gift <span aria-hidden>&rarr;</span>
            </span>
          </a>

          {/* Card 2 — E-Invitation (new flow) */}
          <a href="/invitations"
             className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur border border-white shadow-xl shadow-rose-200/40 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-300/50">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-rose-300 to-pink-500 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
            <div className="text-5xl mb-5">&#128140;</div>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">Custom E-Invitation</h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Create beautiful digital wedding, engagement and celebration invitations.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-3 text-white font-medium shadow-lg shadow-rose-300/50 group-hover:gap-3 transition-all">
              Create E-Invitation <span aria-hidden>&rarr;</span>
            </span>
          </a>
        </div>

        <p className="text-center text-xs text-stone-400 mt-14">
          Shareable links &middot; Works on every phone
        </p>
      </div>
    </div>
  );
}
