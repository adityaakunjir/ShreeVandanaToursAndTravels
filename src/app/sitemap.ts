import { siteUrl } from '@/lib/site-url';
import tours from '@/data/tours.json';
import type { MetadataRoute } from 'next';
import { destinations } from '@/data/site';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  return [
    '/',
    '/tours',
    ...tours.map(({ slug }) => `/tours/${slug}`),
    '/destinations',
    ...destinations.map(({ slug }) => `/destinations/${slug}`),
    '/about',
    '/services',
    '/gallery',
    '/contact',
    '/faq',
  ].map((path) => ({
    url: new URL(path, base).href,
    priority: path === '/' ? 1 : 0.7,
  }));
}
