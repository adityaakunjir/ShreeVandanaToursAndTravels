/** Vercel serves the public site on www; the bare domain redirects there. */
export function canonicalOrigin(configured: string) {
  const url = new URL(configured);
  if (url.hostname === 'shreevandanatoursandtravels.com') {
    url.hostname = 'www.shreevandanatoursandtravels.com';
    url.protocol = 'https:';
    url.port = '';
  }
  return url.origin;
}
export const siteUrl = canonicalOrigin(
  process.env.NEXT_PUBLIC_SITE_URL ||
    'https://www.shreevandanatoursandtravels.com',
);
