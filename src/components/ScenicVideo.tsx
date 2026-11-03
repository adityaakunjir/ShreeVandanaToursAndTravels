'use client';

import Image from '@/components/TravelImage';
import { useEffect, useRef, useState } from 'react';
import { mediaPolicy, type MediaConnection } from '@/lib/media-policy';

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
  const visible = useRef(false);
  const loaded = useRef(false);
  const failed = useRef(false);
  const [ready, setReady] = useState(false);
  function policy() {
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: MediaConnection;
    };
    return mediaPolicy({
      wide: matchMedia('(min-width: 901px)').matches,
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      cores: device.hardwareConcurrency,
      memory: device.deviceMemory,
      connection: device.connection,
    });
  }
  function loadAndPlay() {
    const element = video.current;
    if (!element || failed.current) return;
    if (!loaded.current) {
      const profile = policy().profile;
      element.dataset.variant = profile;
      element.src = '/assets/videos/' + assetBase + '-' + profile + '.mp4';
      element.muted = true;
      loaded.current = true;
      element.load();
    }
    void element.play().catch(() => setReady(false));
  }
  useEffect(() => {
    const element = video.current;
    if (!element || !('IntersectionObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (
      navigator as Navigator & { connection?: MediaConnection & EventTarget }
    ).connection;
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const sync = () => {
      if (
        settled &&
        visible.current &&
        !document.hidden &&
        document.documentElement.dataset.motionPaused !== 'true' &&
        policy().autoplay
      )
        loadAndPlay();
      else element.pause();
    };
    // Let the critical photograph, heading and navigation finish before video competes.
    const settle = () => {
      timer = setTimeout(
        () => {
          settled = true;
          sync();
        },
        priority ? 250 : 800,
      );
    };
    if (document.readyState === 'complete') settle();
    else window.addEventListener('load', settle, { once: true });
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    const preferenceChanged = () => {
      if (!policy().autoplay) {
        element.pause();
        element.removeAttribute('src');
        element.load();
        loaded.current = false;
        setReady(false);
      }
      sync();
    };
    reduced.addEventListener('change', preferenceChanged);
    connection?.addEventListener('change', preferenceChanged);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('travel-motion-change', sync);
    window.addEventListener('pointerdown', sync, { once: true });
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('load', settle);
      reduced.removeEventListener('change', preferenceChanged);
      connection?.removeEventListener('change', preferenceChanged);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('travel-motion-change', sync);
      window.removeEventListener('pointerdown', sync);
      element.pause();
      element.removeAttribute('src');
      element.load();
      loaded.current = false;
    };
    // Asset URLs are immutable and the player is keyed by destination.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, assetBase]);
  return (
    <div
      className={
        'scenic-media ' + (ready ? 'is-playing-frame ' : '') + className
      }
    >
      <Image
        src={fallback}
        alt={alt}
        fill
        sizes={sizes}
        quality={75}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
      <video
        ref={video}
        autoPlay
        muted
        playsInline
        loop
        preload="none"
        aria-label={'Scenic footage: ' + label}
        onPlaying={() => {
          setReady(true);
        }}
        onError={() => {
          failed.current = true;
          setReady(false);
          video.current?.removeAttribute('src');
        }}
      />
    </div>
  );
}
