'use client';
import { useState, useSyncExternalStore } from 'react';

/** A quiet site-wide pause mechanism keeps decorative autoplay controllable. */
export default function MotionPreference() {
  const [paused, setPaused] = useState(false);
  const enhanced = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return (
    <button
      type="button"
      hidden={!enhanced}
      className="motion-preference"
      aria-pressed={paused}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        document.documentElement.dataset.motionPaused = String(next);
        window.dispatchEvent(new Event('travel-motion-change'));
      }}
    >
      Motion {paused ? 'off' : 'on'}
    </button>
  );
}
