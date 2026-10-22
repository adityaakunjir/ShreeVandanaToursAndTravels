# Local rendering baseline — 22 October 2026

The current production build was served with `next start` on localhost:3003. Run `node scripts/check-local-concurrency.mjs` against that preview, or set LOCAL_CHECK_ORIGIN to another loopback preview. The script rejects remote hosts so it cannot accidentally stress the production site.

Observed on this Windows development machine: 120 requests, six concurrent workers, zero failed responses, 1,050 ms overall measured execution, p50 49 ms and p95 146 ms. Ten representative routes cover home, catalogue and filtered catalogue, destinations, a tour, collection, gallery, contact, comparison and sitemap. The check consumes response bodies and checks expected HTML headings or sitemap markup, rather than accepting status alone. Raw results and cache headers are in artifacts/local-concurrency.json.

This is a small warm-server regression baseline. It does not establish production requests per second, supported daily visitors, cold-start latency, image/CDN costs, third-party media performance, browser responsiveness or resilience under sustained traffic. Do not use its local timings in customer-facing performance claims. Static pages expose shared-cache headers; dynamic discovery/compare pages expose private/no-store headers as expected for query-driven responses.

Before advertising capacity or running a campaign, obtain the expected peak simultaneous visitors and traffic mix; review the actual Vercel account plan and limits; agree a controlled production/preview load window; measure error rate, latency, resource usage and image delivery; and verify monitoring and rollback. Current authenticated Search Console access is still unavailable, so this baseline does not replace indexing or search-outcome verification.
