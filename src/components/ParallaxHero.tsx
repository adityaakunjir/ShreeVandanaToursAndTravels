'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { mediaPolicy, type MediaConnection } from '@/lib/media-policy';

export default function ParallaxHero({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 901px)');
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: MediaConnection & EventTarget;
    };
    const sync = () => {
      const eligible =
        desktop.matches &&
        mediaPolicy({
          wide: true,
          reduced: reduced.matches,
          cores: device.hardwareConcurrency,
          memory: device.deviceMemory,
          connection: device.connection,
        }).richMotion;
      if (container.current)
        container.current.dataset.motion = eligible ? 'rich' : 'still';
    };
    sync();
    reduced.addEventListener('change', sync);
    desktop.addEventListener('change', sync);
    device.connection?.addEventListener('change', sync);
    return () => {
      reduced.removeEventListener('change', sync);
      desktop.removeEventListener('change', sync);
      device.connection?.removeEventListener('change', sync);
    };
  }, []);
  return (
    <div ref={container} className={'parallax-hero-wrapper ' + className}>
      <div className="parallax-hero-track">{children}</div>
    </div>
  );
}
