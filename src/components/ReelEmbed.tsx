'use client';
import { useEffect, useRef, useState } from 'react';

/** Automatic near-viewport embeds: no click gate, no third-party requests above the fold. */
export default function ReelEmbed({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [load, setLoad] = useState(false);
  const src = `https://www.instagram.com/reel/${id}/embed/`;
  useEffect(() => {
    if (!frame.current) return;
    if (!('IntersectionObserver' in window)) {
      frame.current.src = src;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, [src]);
  return (
    <>
      <iframe
        ref={frame}
        src={load ? src : undefined}
        title={`Instagram reel: ${title}`}
        loading="lazy"
        allow="encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <noscript>
        <iframe
          src={src}
          title={`Instagram reel: ${title}`}
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture"
        />
      </noscript>
    </>
  );
}
