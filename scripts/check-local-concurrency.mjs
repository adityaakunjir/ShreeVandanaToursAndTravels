// Bounded HTTP rendering check. Intentionally refuses non-loopback targets.
import { writeFile } from 'node:fs/promises';
const origin = new URL(
  process.env.LOCAL_CHECK_ORIGIN || 'http://localhost:3003',
);
if (!['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname)) {
  throw new Error('This check only targets a local preview, never production.');
}
const paths = [
  '/',
  '/tours',
  '/tours?country=Japan&duration=8',
  '/destinations',
  '/tours/japan-8-days',
  '/collections/honeymoon-romance',
  '/gallery',
  '/contact',
  '/tours/compare?tour=sri-lanka&tour=sri-lanka-7-days',
  '/sitemap.xml',
];
const concurrency = 6;
const requests = 120;
const samples = [];
// Establish server readiness independently; a missing server is not a load failure.
const ready = await fetch(new URL('/', origin), {
  signal: AbortSignal.timeout(10000),
});
if (!ready.ok) throw new Error(`Local preview not ready: ${ready.status}`);
await ready.arrayBuffer();
let cursor = 0;
const start = performance.now();
await Promise.all(
  Array.from({ length: concurrency }, async () => {
    while (cursor < requests) {
      const index = cursor++;
      const path = paths[index % paths.length];
      const began = performance.now();
      try {
        const response = await fetch(new URL(path, origin), {
          signal: AbortSignal.timeout(15000),
        });
        const body = await response.text();
        const validBody =
          path === '/sitemap.xml'
            ? body.includes('<urlset')
            : /<h1[\s>]/.test(body);
        samples.push({
          path,
          status: response.status,
          milliseconds: Math.round(performance.now() - began),
          passed: response.status === 200 && validBody,
          cacheControl: response.headers.get('cache-control'),
        });
      } catch (error) {
        samples.push({
          path,
          passed: false,
          error: error.message,
          milliseconds: Math.round(performance.now() - began),
        });
      }
    }
  }),
);
const elapsed = Math.round(performance.now() - start);
const timings = samples.map((s) => s.milliseconds).sort((a, b) => a - b);
const report = {
  checkedAt: new Date().toISOString(),
  origin: origin.origin,
  scope:
    'Warm local production-build HTTP rendering only; not browser UX, cold starts, CDN/image traffic, sustained load, Vercel limits or real visitor capacity.',
  concurrency,
  requests,
  elapsedMilliseconds: elapsed,
  p50Milliseconds: timings[Math.ceil(timings.length * 0.5) - 1],
  p95Milliseconds: timings[Math.ceil(timings.length * 0.95) - 1],
  failures: samples.filter((s) => !s.passed).length,
  samples,
};
await writeFile(
  new URL('../artifacts/local-concurrency.json', import.meta.url),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(
  JSON.stringify({
    requests,
    concurrency,
    failures: report.failures,
    p95Milliseconds: report.p95Milliseconds,
  }),
);
if (report.failures) process.exitCode = 1;
