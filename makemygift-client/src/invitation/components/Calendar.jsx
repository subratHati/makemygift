// Code-built calendar (no image). Parses the wedding date string and highlights
// the day. Falls back to a simple card if the date can't be parsed.
export default function Calendar({ dateString }) {
  const d = new Date(dateString);
  const valid = !isNaN(d.getTime());

  if (!valid) {
    return (
      <div className="w-44 rounded-2xl overflow-hidden border border-amber-300/40">
        <div className="bg-amber-500/90 text-stone-900 text-[11px] font-semibold py-1.5 tracking-widest text-center">WEDDING DAY</div>
        <div className="bg-black/30 py-5 text-center font-serif text-amber-50">{dateString || 'The Wedding Day'}</div>
      </div>
    );
  }

  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const monthName = d.toLocaleString('en-US', { month: 'long' });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let n = 1; n <= daysInMonth; n++) cells.push(n);

  return (
    <div className="w-56">
      <div className="royal-body text-sm font-semibold py-2 tracking-widest text-center">
        {monthName} {year}
      </div>
      <div className="grid grid-cols-7 gap-y-1 px-3 py-3 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => (
          <div key={`w${i}`} className="text-[9px] royal-body font-semibold opacity-60">{w}</div>
        ))}
        {cells.map((n, i) => (
          <div key={i} className="flex items-center justify-center">
            {n === null ? (
              <span />
            ) : n === day ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8b1a1a] text-amber-50 text-[11px] font-bold">{n}</span>
            ) : (
              <span className="text-[11px] royal-body opacity-80">{n}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
