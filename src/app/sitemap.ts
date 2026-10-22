import { siteUrl } from '@/lib/site-url';
import tours from '@/data/catalogue';
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
  ].map((path) => ({
    url: new URL(path, base).href,
    priority: path === '/' ? 1 : 0.7,
  }));
}
