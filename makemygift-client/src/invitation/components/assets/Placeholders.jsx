// Simple coded placeholder assets for the invitation engine.
// These stand in for real artwork (PNGs/SVGs) and will be swapped later WITHOUT
// touching the animation engine — each is just a positioned visual block.

export function FlowerPlaceholder({ className = '', label = 'flowers' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex gap-1 text-3xl sm:text-4xl select-none" aria-hidden>
        <span>&#127802;</span><span>&#127804;</span><span>&#127800;</span><span>&#127804;</span><span>&#127802;</span>
      </div>
    </div>
  );
}

export function LampPlaceholder({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`} aria-hidden>
      <div className="w-px h-10 bg-amber-300/50" />
      <div className="w-8 h-10 rounded-b-full rounded-t-md bg-gradient-to-b from-amber-300 to-amber-600 shadow-[0_0_24px_6px_rgba(251,191,36,0.45)]" />
    </div>
  );
}

export function CouplePlaceholder({ className = '' }) {
  return (
    <div className={`flex items-end justify-center gap-2 ${className}`} aria-hidden>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-amber-200/90" />
        <div className="w-16 h-24 rounded-t-3xl bg-amber-100/80 -mt-1" />
      </div>
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-rose-200/90" />
        <div className="w-16 h-24 rounded-t-3xl bg-rose-100/80 -mt-1" />
      </div>
    </div>
  );
}

export function OrnamentPlaceholder({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-amber-300/70 ${className}`} aria-hidden>
      <span className="h-px w-10 bg-amber-300/40" />
      <span className="text-lg">&#10070;</span>
      <span className="h-px w-10 bg-amber-300/40" />
    </div>
  );
}
