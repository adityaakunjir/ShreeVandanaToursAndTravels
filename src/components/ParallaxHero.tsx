'use client';

import { useEffect, useRef, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

export default function ParallaxHero({
  children,
  className = '',
  speed = 0.3,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // If native CSS view timeline is supported, let the GPU CSS animation run
    const supportsCssTimeline =
      typeof CSS !== 'undefined' &&
      CSS.supports &&
      (CSS.supports('animation-timeline: view()') ||
        CSS.supports('animation-timeline: scroll()'));

    if (supportsCssTimeline) {
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!container || !track) return;
          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          if (rect.bottom > 0 && rect.top < windowHeight) {
            const distance = -rect.top;
            const offset = distance * speed;
            track.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div ref={containerRef} className={`parallax-hero-wrapper ${className}`}>
      <div ref={trackRef} className="parallax-hero-track">
        {children}
      </div>
    </div>
  );
}

