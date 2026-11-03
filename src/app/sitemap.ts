import { siteUrl } from '@/lib/site-url';
import tours, { tourPhoto } from '@/data/catalogue';
import type { MetadataRoute } from 'next';
import { destinations } from '@/data/site';
import { destinationHubs } from '@/data/destination-hubs';
import { collections } from '@/data/collections';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  return [
    '/',
    '/tours',
    ...tours.map(({ slug }) => `/tours/${slug}`),
    '/destinations',
    ...[
      ...new Set([...destinations, ...destinationHubs].map((x) => x.slug)),
    ].map((slug) => `/destinations/${slug}`),
    ...collections.map((c) => `/collections/${c.slug}`),
    '/about',
    '/services',
    '/gallery',
    '/contact',
    '/faq',
    '/travel-information',
  ].map((path) => {
    const tour = tours.find((t) => path === `/tours/${t.slug}`);
    const photo = tour ? tourPhoto(tour) : undefined;
    return {
      url: new URL(path, base).href,
      priority: path === '/' ? 1 : 0.7,
      ...(photo
        ? {
            images: [new URL(photo.src, base).href],
            lastModified: new Date('2026-11-03T00:00:00Z'),
          }
        : {}),
    };
  });
}
