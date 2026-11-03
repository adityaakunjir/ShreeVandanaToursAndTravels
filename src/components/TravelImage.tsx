'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import { mediaPolicy, type MediaConnection } from '@/lib/media-policy';
import focus from '@/data/image-focus.json';

/** Start with a small real photograph; upgrade pixel density only on capable connections. */
export default function TravelImage(props: ImageProps) {
  const [tier, setTier] = useState<'lite' | 'balanced' | 'rich'>('lite');
  useEffect(() => {
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: MediaConnection & EventTarget;
    };
    const sync = () => {
      const connection = device.connection;
      const constrained =
        connection?.saveData ||
        /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || '') ||
        (connection?.downlink !== undefined && connection.downlink < 2.5) ||
        (connection?.rtt !== undefined && connection.rtt > 500);
      const rich = mediaPolicy({
        wide: innerWidth > 900,
        cores: device.hardwareConcurrency,
        memory: device.deviceMemory,
        connection: device.connection,
      }).richMotion;
      setTier(constrained ? 'lite' : rich ? 'rich' : 'balanced');
    };
    sync();
    device.connection?.addEventListener('change', sync);
    return () => device.connection?.removeEventListener('change', sync);
  }, []);
  // A 180px source-size caps the initial request around 640px even on 3x phones.
  const sizes =
    !props.fill || tier === 'rich'
      ? props.sizes
      : tier === 'balanced'
        ? '(max-width:900px) 280px, 960px'
        : '(max-width:900px) 180px, 640px';
  const position = (focus as Record<string, string>)[String(props.src)];
  return (
    <Image
      {...props}
      alt={props.alt}
      sizes={sizes}
      style={{ objectPosition: position, ...props.style }}
    />
  );
}
