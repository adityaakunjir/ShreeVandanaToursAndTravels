# Public search checks — 22 October 2026

The authenticated Chrome session currently lacks access to the domain Search Console property. The intended account is website.svttpune@gmail.com; signing in remains necessary before reading indexing or sitemap-processing reports. No ownership records were changed or indexing requests submitted.

A read-only public HTTP crawl of all 107 sitemap URLs returned HTTP 200 throughout, with descriptions, headings and canonical links present. Robots exposes the sitemap and does not contain a blanket root disallow. This is crawlability evidence, not proof of Google's indexing, ranking or full robots-rule interpretation.

The crawl identified three duplicated tour-title pairs: Nepal, Sri Lanka and Egypt with Hurghada. Tour metadata now includes duration; same-name/same-duration options also distinguish newer itineraries from earlier outlines. Open Graph titles use the same distinction. Production smoke checks now require unique titles across public routes to prevent this regression.

Run `node scripts/audit-live-search.mjs` for a fresh bounded-concurrency public crawl. The script writes artifacts/live-search-audit.json and exits unsuccessfully if it finds unavailable/noindex pages, unexpected redirects, canonical mismatches, duplicate titles/descriptions or missing headings/metadata. It does not mutate Google or test physical devices, JavaScript interactions, rankings or field performance.

After Vercel reported the metadata deployment complete, the live crawl passed all 107 URLs with zero failing pages, unique titles/descriptions, matching canonicals and an accessible robots/sitemap pair. The committed artifact records that post-deployment observation. Local validation also passed lint, types, all 35 tests, production build and the expanded unique-title smoke checks. Search Console report access remains pending.
