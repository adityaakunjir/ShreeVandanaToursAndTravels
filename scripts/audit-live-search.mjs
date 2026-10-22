// Read-only public crawl; does not submit URLs or imply Google indexing.
import { writeFile } from 'node:fs/promises';

const origin = 'https://www.shreevandanatoursandtravels.com';
async function read(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  return { response, text: await response.text() };
}
const sitemap = await read(`${origin}/sitemap.xml`);
const robots = await read(`${origin}/robots.txt`);
if (!sitemap.response.ok || !robots.response.ok)
  throw new Error('Discovery files unavailable');
const urls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (!urls.length || urls.some((url) => new URL(url).origin !== origin)) {
  throw new Error('Empty sitemap or unexpected origin');
}
const results = [];
// Bounded concurrency avoids bursting the production deployment.
for (let index = 0; index < urls.length; index += 3) {
  results.push(
    ...(await Promise.all(
      urls.slice(index, index + 3).map(async (url) => {
        try {
          const { response, text } = await read(url);
          const canonical = text.match(
            /<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i,
          )?.[1];
          const title = text.match(/<title>(.*?)<\/title>/is)?.[1];
          const description = text.match(
            /<meta\b[^>]*name="description"[^>]*content="([^"]+)"/i,
          )?.[1];
          const noindex =
            /<meta\b[^>]*name="(?:robots|googlebot)"[^>]*content="[^"]*noindex/i.test(
              text,
            ) || /noindex/i.test(response.headers.get('x-robots-tag') || '');
          const issues = [];
          if (response.status !== 200) issues.push(`HTTP ${response.status}`);
          if (response.url !== url) issues.push('Unexpected redirect');
          if (!canonical || new URL(canonical).href !== new URL(url).href)
            issues.push('Canonical mismatch');
          if (!title || !description) issues.push('Missing search metadata');
          if ((text.match(/<h1\b/gi) || []).length !== 1)
            issues.push('Expected one h1');
          if (noindex) issues.push('Sitemap URL is noindex');
          return {
            url,
            status: response.status,
            canonical,
            title,
            description,
            issues,
          };
        } catch (error) {
          return { url, issues: [error.message] };
        }
      }),
    )),
  );
}
for (const field of ['title', 'description']) {
  const groups = Map.groupBy(
    results.filter((r) => r[field]),
    (r) => r[field],
  );
  for (const group of groups.values()) {
    if (group.length > 1)
      for (const item of group) item.issues.push(`Duplicate ${field}`);
  }
}
const robotsAllowsPublic = !/^Disallow:\s*\/\s*$/im.test(robots.text);
const robotsLinksSitemap = robots.text.includes(`${origin}/sitemap.xml`);
const report = {
  checkedAt: new Date().toISOString(),
  origin,
  scope:
    'Public HTTP discovery and rendered HTML only; not Search Console indexing, robots path precedence, JavaScript interaction, field performance or rankings.',
  sitemapStatus: sitemap.response.status,
  robotsStatus: robots.response.status,
  robotsAllowsPublic,
  robotsLinksSitemap,
  sitemapEntries: urls.length,
  uniqueEntries: new Set(urls).size,
  failingPages: results.filter((r) => r.issues.length).length,
  results,
};
await writeFile(
  new URL('../artifacts/live-search-audit.json', import.meta.url),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(
  JSON.stringify({
    pages: urls.length,
    failingPages: report.failingPages,
    robotsAllowsPublic,
    robotsLinksSitemap,
  }),
);
if (
  report.failingPages ||
  !robotsAllowsPublic ||
  !robotsLinksSitemap ||
  report.uniqueEntries !== urls.length
)
  process.exitCode = 1;
