'use client';
import { useEffect } from 'react';
import { mediaPolicy, type MediaConnection } from '@/lib/media-policy';

export default function ExperienceCapabilities() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: MediaConnection & EventTarget;
    };
    const sync = () => {
      document.documentElement.dataset.experience = mediaPolicy({
        wide: innerWidth > 900,
        reduced: reduced.matches,
        cores: device.hardwareConcurrency,
        memory: device.deviceMemory,
        connection: device.connection,
      }).richMotion
        ? 'rich'
        : 'lite';
    };
    sync();
    reduced.addEventListener('change', sync);
    device.connection?.addEventListener('change', sync);
    return () => {
      reduced.removeEventListener('change', sync);
      device.connection?.removeEventListener('change', sync);
    };
  }, []);
  return null;
}
