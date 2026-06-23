import { useState } from 'react';
import { sceneList } from './sceneList';

// The engine. It keeps track of which scene is showing, renders that scene,
// and gives each scene an onNext() function to move forward. When we move past
// the last scene, it shows a simple "end" screen with a replay button
// (gifts are replayable).
export default function Player({ gift = null, preview = false }) {
  const [index, setIndex] = useState(0);
  const finished = index >= sceneList.length;

  const next = () => setIndex((i) => i + 1);
  const restart = () => setIndex(0);

  if (finished) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 px-6 text-center">
        <p className="text-sm text-neutral-400">The experience has ended.</p>
        <button
          onClick={restart}
          className="mt-6 rounded-full bg-amber-300 px-6 py-3 font-medium text-neutral-900 transition hover:-translate-y-0.5"
        >
          ↺ Replay
        </button>
      </div>
    );
  }

  const Scene = sceneList[index].component;
  return (
    <>
      <Scene
        onNext={next}
        gift={gift}
        preview={preview}
        index={index}
        total={sceneList.length}
      />
      {preview && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', transform: 'rotate(-30deg) scale(1.4)' }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ whiteSpace: 'nowrap', textAlign: 'center', fontWeight: 900, fontSize: '11vw', letterSpacing: '.08em', color: 'rgba(255,255,255,.45)', WebkitTextStroke: '1px rgba(0,0,0,.25)', textShadow: '0 2px 10px rgba(0,0,0,.3)' }}>
                PREVIEW · PREVIEW · PREVIEW
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.7)' }}>
            unactivated preview — pay to make this gift live
          </div>
        </div>
      )}
    </>
  );
}
