# Expedition visual redesign — 22 October 2026

Replaces the soft journal art direction with a sharper travel identity: charcoal/white surfaces, logo-red actions, bold Geist headings, upright accents, tighter corner radii and cleaner borders. Existing licensed photography, content provenance, routes and direct WhatsApp flow remain intact.

The homepage now uses a full-width landscape hero, direct travel copy, prominent exploration/WhatsApp actions, integrated desktop search and five priority-destination shortcuts. Shared styling carries through destination hubs, collections, tour cards/details, no-photo itinerary covers, services, contact, about, gallery, reviews, FAQ, saved/comparison and information pages. Paper grids, tilted postcards, blush active states and serif/italic heading treatments are replaced. Neutral panels and a dark closing CTA/footer establish a consistent hierarchy.

Mobile keeps native controls and scroll-snap cards, 16px form text, visible focus, accessible navigation and a fixed enquiry action. The update adds no client-side animation library, web font or media dependency. Hover movement is limited to capable pointing devices and respects reduced motion. The prior rendering optimisations remain; historic performance scores are not fresh measurements of this design.

Validation: lint, TypeScript, all 35 tests, production build and production smoke passed. Headless Chrome checks covered all 107 sitemap routes plus saved/compare at 320px, then 15 representative routes at 390/768/1440px: 154 layouts with HTTP 200, one h1, no page-level horizontal overflow and no Georgia heading fallback. Interaction checks passed for the mobile menu/background inert/Escape behavior, matching Mauritius discovery, Japan/eight-day search and primary tour WhatsApp target. Third-party Instagram requests were blocked during this first-party layout run; reel playback was not retested.

Actual screenshots were inspected for mobile home, desktop home and mobile tours. Evidence: artifacts/expedition-validation.json, expedition-mobile.png, expedition-desktop.png and expedition-tours-mobile.png. Local QA script: scripts/check-expedition-ui.mjs (requires an installed Playwright module via PLAYWRIGHT_MODULE and the production preview on port 3005).

Physical-device testing, field performance, search rankings and booking conversion are separate evidence and are not implied by these layout checks.
