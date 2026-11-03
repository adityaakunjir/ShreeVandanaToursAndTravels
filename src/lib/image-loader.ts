'use client';

import manifest from '@/data/responsive-images.json';

/** Static CDN files avoid image-optimizer cold starts and per-request transformations. */
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const image = (
    manifest as Record<string, { hash: string; widths: number[] }>
  )[src];
  if (!image) return src;
  const size = image.widths.find((w) => w >= width) || image.widths.at(-1)!;
  return `/assets/responsive/${image.hash}-${size}.webp`;
}
