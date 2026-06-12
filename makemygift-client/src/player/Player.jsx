import { useState } from 'react';
import { sceneList } from './sceneList';

// The engine. It keeps track of which scene is showing, renders that scene,
// and gives each scene an onNext() function to move forward. When we move past
// the last scene, it shows a simple "end" screen with a replay button
// (gifts are replayable).
export default function Player({ gift = null }) {
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
    <Scene
      onNext={next}
      gift={gift}
      index={index}
      total={sceneList.length}
    />
  );
}
