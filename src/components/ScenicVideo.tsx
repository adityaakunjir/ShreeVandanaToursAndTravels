'use client';

import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  id: string;
  assetBase?: string;
  label: string;
  fallback: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Progressive enhancement: no video URL or download until visible and eligible. */
export default function ScenicVideo({
  id,
  assetBase = id,
  label,
  fallback,
  alt,
  sizes,
  priority = false,
  className = '',
}: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const stopped = useRef(false);
  const manual = useRef(false);
  const visible = useRef(false);
  const loaded = useRef(false);
  const fallbackTried = useRef(false);
  const currentAssetBase = useRef(assetBase);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  function loadAndPlay() {
    const element = video.current;
    if (!element) return;
    if (!loaded.current || currentAssetBase.current !== assetBase) {
      const variant = window.matchMedia('(max-width: 900px)').matches
        ? 'mobile'
        : 'desktop';
      const format = element.canPlayType('video/mp4; codecs="avc1.640028"')
        ? 'mp4'
        : 'webm';
      element.dataset.variant = variant;
      element.src = `/assets/videos/${assetBase}-${variant}.${format}`;
      element.muted = true;
      loaded.current = true;
      currentAssetBase.current = assetBase;
      fallbackTried.current = false;
      element.load();
    }
    void element.play().catch(() => setPlaying(false));
  }

  useEffect(() => {
    const element = video.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const control =
      element.parentElement?.querySelector<HTMLButtonElement>(
        '.scenic-control',
      );
    if (control) control.hidden = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          effectiveType?: string;
          addEventListener?: (type: string, callback: () => void) => void;
          removeEventListener?: (type: string, callback: () => void) => void;
        };
      }
    ).connection;
    let pageReady = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const allowed = () =>
      !reduced.matches &&
      !connection?.saveData &&
      !/^(slow-2g|2g|3g)$/.test(connection?.effectiveType || '');
    const sync = () => {
      if (
        pageReady &&
        visible.current &&
        !document.hidden &&
        !stopped.current &&
        (manual.current || allowed())
      ) {
        loadAndPlay();
      } else element.pause();
    };
    const settle = () => {
      timer = setTimeout(() => {
        pageReady = true;
        sync();
      }, 1200);
    };
    if (document.readyState === 'complete') settle();
    else window.addEventListener('load', settle, { once: true });
    const observer = new IntersectionObserver(
      (entries) => {
        visible.current = entries[0]?.isIntersecting ?? false;
        sync();
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    const preferenceChanged = () => {
      manual.current = false;
      if (!allowed()) {
        element.pause();
        element.removeAttribute('src');
        loaded.current = false;
        element.load();
        setReady(false);
      }
      sync();
    };
    reduced.addEventListener('change', preferenceChanged);
    connection?.addEventListener?.('change', preferenceChanged);
    document.addEventListener('visibilitychange', sync);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('load', settle);
      reduced.removeEventListener('change', preferenceChanged);
      connection?.removeEventListener?.('change', preferenceChanged);
      document.removeEventListener('visibilitychange', sync);
      element.pause();
      element.removeAttribute('src');
      loaded.current = false;
      element.load();
    };
    // id identifies an immutable clip; props do not change without remounting.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, assetBase]);

  return (
    <div className={`scenic-media ${ready ? 'is-playing-frame' : ''} ${className}`}>
      <Image
        src={fallback}
        alt={alt}
        fill
        sizes={sizes}
        quality={88}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
      <video
        ref={video}
        muted
        playsInline
        loop
        preload="none"
        aria-label={`Scenic footage: ${label}`}
        onPlaying={() => {
          setReady(true);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onError={() => {
          const element = video.current;
          if (element && loaded.current && !fallbackTried.current) {
            fallbackTried.current = true;
            const format = element.src.endsWith('.mp4') ? 'webm' : 'mp4';
            element.src = `/assets/videos/${assetBase}-${element.dataset.variant || 'mobile'}.${format}`;
            if (!stopped.current)
              void element.play().catch(() => setPlaying(false));
          } else {
            setReady(false);
            setPlaying(false);
          }
        }}
      />
      <button
        hidden
        type="button"
        className="scenic-control"
        aria-label={`${playing ? 'Pause' : 'Play'} scenery video: ${label}`}
        onClick={() => {
          if (playing) {
            stopped.current = true;
            video.current?.pause();
          } else {
            stopped.current = false;
            manual.current = true;
            loadAndPlay();
          }
        }}
      >
        {playing ? (
          <Pause size={15} aria-hidden="true" />
        ) : (
          <Play size={15} aria-hidden="true" />
        )}
        <span>{playing ? 'Pause' : 'Play scenery'}</span>
      </button>
    </div>
  );
}
