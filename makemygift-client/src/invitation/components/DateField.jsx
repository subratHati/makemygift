import { useState, useRef, useEffect } from 'react';

// Custom, dependency-free date picker.
// - Clean popup with quick month + YEAR navigation (tap the year to pick from a grid)
// - Stores value as ISO "YYYY-MM-DD" (unchanged for everything downstream)
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WK = ['Su','Mo','Tu','We','Th','Fr','Sa'];

export default function DateField({ label, value, onChange, placeholder = 'Pick a date' }) {
  const [open, setOpen] = useState(false);
  const [yearGrid, setYearGrid] = useState(false);
  const wrapRef = useRef(null);

  const selected = value ? new Date(value + 'T00:00:00') : null;
  const today = new Date();
  const [viewY, setViewY] = useState((selected || today).getFullYear());
  const [viewM, setViewM] = useState((selected || today).getMonth());

  useEffect(() => {
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) { setOpen(false); setYearGrid(false); } };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // when opening, jump the view to the selected date (or today)
  useEffect(() => {
    if (open) {
      const base = selected || today;
      setViewY(base.getFullYear());
      setViewM(base.getMonth());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pretty = selected
    ? selected.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
  const firstDow = new Date(viewY, viewM, 1).getDay();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const prevMonth = () => { if (viewM === 0) { setViewM(11); setViewY((y) => y - 1); } else setViewM((m) => m - 1); };
  const nextMonth = () => { if (viewM === 11) { setViewM(0); setViewY((y) => y + 1); } else setViewM((m) => m + 1); };

  const pick = (d) => {
    const iso = `${viewY}-${String(viewM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    onChange(iso);
    setOpen(false);
    setYearGrid(false);
  };

  const isSel = (d) => selected && selected.getFullYear() === viewY && selected.getMonth() === viewM && selected.getDate() === d;
  const isToday = (d) => today.getFullYear() === viewY && today.getMonth() === viewM && today.getDate() === d;

  // year grid: a range around the current view year
  const yearStart = viewY - 6;
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i);

  return (
    <div ref={wrapRef} className="relative">
      {label && <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>}
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-xl border border-stone-300 px-4 py-2.5 text-sm text-left outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 bg-white">
        <span className={pretty ? 'text-stone-800' : 'text-stone-400'}>{pretty || placeholder}</span>
        <span aria-hidden className="text-stone-400">📅</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 rounded-2xl border border-stone-200 bg-white shadow-xl p-4">
          {/* header */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="h-8 w-8 rounded-lg hover:bg-stone-100 text-stone-500 flex items-center justify-center">‹</button>
            <button type="button" onClick={() => setYearGrid((v) => !v)}
              className="px-3 py-1.5 rounded-lg hover:bg-rose-50 text-stone-800 font-medium text-sm">
              {MONTHS[viewM]} {viewY} ▾
            </button>
            <button type="button" onClick={nextMonth} className="h-8 w-8 rounded-lg hover:bg-stone-100 text-stone-500 flex items-center justify-center">›</button>
          </div>

          {yearGrid ? (
            <div className="grid grid-cols-3 gap-2">
              {years.map((y) => (
                <button key={y} type="button"
                  onClick={() => { setViewY(y); setYearGrid(false); }}
                  className={`py-2 rounded-lg text-sm ${y === viewY ? 'bg-rose-500 text-white' : 'hover:bg-rose-50 text-stone-700'}`}>
                  {y}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 mb-1">
                {WK.map((w) => <div key={w} className="text-[11px] text-stone-400 text-center font-medium py-1">{w}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {cells.map((d, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {d === null ? <span className="h-9 w-9" /> : (
                      <button type="button" onClick={() => pick(d)}
                        className={`h-9 w-9 rounded-full text-sm flex items-center justify-center transition-colors
                          ${isSel(d) ? 'bg-rose-500 text-white font-semibold'
                            : isToday(d) ? 'border border-rose-300 text-stone-700 hover:bg-rose-50'
                            : 'text-stone-700 hover:bg-rose-50'}`}>
                        {d}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
