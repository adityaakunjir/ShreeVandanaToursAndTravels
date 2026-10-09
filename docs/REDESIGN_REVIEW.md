# The World, Personally Curated — implementation review

Review date: 9 October 2026. This report describes the current redesign, separate from historical launch evidence.

## Source and design decisions

Preserve Next.js App Router, the eleven owner-supplied tour records, five destination pages, direct WhatsApp enquiries and isolated demo routes. WEBSITE REQ.docx supplies the 30+ years / three generations narrative; TOURS.doc supplies the routes and itineraries. The business content register explains the later phone, email and office-hour corrections. No prices, inventory or approved departure dates were supplied.

Keep the official red logo accent, warm ivory and dark ink. The owner previously asked for logo-matching colours; the older blue client JSON is a historical reference, not the active public design system. Use existing locally bundled, attributed destination photographs. Do not present inspiration photographs as the family, team or customers.

## Problems to resolve

- Homepage prioritises destination inspiration over the actual eleven-tour collection; discovery lacks a useful starting point.
- Real tour search supports only text and India/international. Theme, country and duration are available in source data but not exposed.
- Save, comparison and share controls exist for isolated sample packages, but are missing from the real collection.
- Most secondary pages repeat the same introductory layout. Services need photography; destinations need source-derived experiences; the itinerary needs clearer visual progression and related journeys.
- Gallery currently mixes legacy template inspiration with verified company reels. Use attributed catalogue photographs for the main gallery and retain a separately identified Instagram section.
- FAQs cover only four topics. Explain flights, visa assistance, missing itineraries, inclusions and final booking conditions without inventing legal terms.
- README and the previous source index describe multiple historical snapshots. Generate a reproducible current index with scripts/index-project.mjs.

## Owner inputs still needed

Reconcile the Instagram 25-year bio with the supplied 30+ year company description. Confirm future departures, final quotes, accommodation and cancellation/payment terms directly with customers. Approved family/team/customer originals are still required for a genuine business-photo gallery. Google review count remains a dated 5 October snapshot. Historical lab scores are not new redesign measurements.

## Verification

Baseline: lint, TypeScript, unit tests, production build and route smoke checks are run before the first UI batch. Subsequent verified batches record results here. Browser widths: 320, 390, 768, 1024 and 1440. No physical-device or universal-network guarantee is implied.

### Stage 1 — homepage and real-tour discovery

Baseline passed lint/types, 25 tests, build and production smoke. New implementation passes lint/types, 28 tests and build. Homepage now follows the requested editorial sequence: cinematic hero and real discovery, trust, featured source tours, styles, India/world collections, family story, planning steps, established strengths, licensed gallery, official reels, sourced reviews, FAQs and final WhatsApp CTA. Shared page introductions use licensed photographs and serif typography.

Real-tour filters intersect text, India/international, country, supported styles and stated duration in GET URLs. The new /tours/saved and /tours/compare work with actual records. Real saves use a separate local-storage key from demo packages; comparison has no prices or fabricated inventory. Browser verification at 390px: homepage search returned Nepal for Pokhara + international + eight days; Nepal and Dubai saves survived reload; two-tour comparison showed source details and copied its share URL. Homepage has no horizontal overflow at 320/390/768/1024/1440px. All new routes preserve metadata, breadcrumbs and noindex where appropriate.

### Stage 2 — the complete page experience

- Eleven tour pages: source-derived highlights, day-by-day visual timeline, save/share controls, source-related journeys and one mobile WhatsApp bar. Kashmir retains the missing-daily-plan explanation rather than invented days.
- Five destination pages: experiences from the linked tour, actual stops, important source notes and the related tour card. Destination collection cards now show stated duration and route context.
- About: credited destination inspiration, family legacy presentation, source-grounded values and office directions. No fabricated family portraits, dates or leadership profiles.
- Services: all established arrangements retained, with licensed editorial imagery and contextual WhatsApp actions.
- Gallery: eleven attributed destination photographs, accessible lightbox and separately identified company/collaboration reels. Legacy template photographs are no longer the gallery source.
- Contact: existing two phone numbers, email, office address and hours retained. Optional destination/group choices create a WhatsApp draft in memory; there is no intake submission or stored lead.
- FAQ: twelve source-grounded questions grouped by planning, arrangements and confirmation.
- Booking & website information: factual explanation of outlines, final quotations, local saved tours and external services. No invented cancellation/refund terms or claim of an owner-approved legal policy.
- Navigation/footer: real discovery, saved/compare, contact, gallery and information links. Canonicals, sitemap, breadcrumbs and demo isolation preserved.

Validation: lint, TypeScript, 28 tests, build and expanded production smoke pass. Browser checks covered 28 routes at 320/390/768/1024/1440px (140 layouts): one main heading, image alternative text and no page-level horizontal overflow. Interaction checks covered mobile menu open/Escape, itinerary collapse, one fixed enquiry bar, primary WhatsApp links, gallery ArrowRight/Escape and focus return, contextual Kerala/family WhatsApp draft, and booking FAQ expansion. Actual message sending, Instagram playback, physical phones and new slow-network lab scores are not established by these checks.

### Live search and deployment recheck — 9 October

The public homepage returns HTTP 200 and contains the new curated hero. Search Console under website.svttpune@gmail.com reports sitemap **Success**, last read 6 October, 24 discovered pages. This resolves the earlier processing error; it does not prove all new pages are indexed. The Page indexing report is dated 4 October and includes legacy WordPress/theme/example URLs, including /to_book/hotel-example/844-1755-44411 and /wp-content/themes/triply/*. Such unrelated missing URLs should not be blindly redirected to the new tour catalogue.

At 640px, local image-optimisation probes without a modern-image Accept header returned Nepal 22,026 bytes, Kerala 42,358 bytes and Dubai 4,554 bytes as JPEG. These are request samples, not page performance scores. Responsive images retain reserved dimensions, eager/preloaded hero only and native lazy loading below. No animation library or video download was introduced; parallax remains desktop-only with reduced-motion fallback.

Fresh live mobile Lighthouse run at 5:47 pm IST on 9 October: performance 94, accessibility 97, best practices 100, SEO 100; FCP 1.0s, LCP 2.9s, TBT 20ms, CLS 0, Speed Index 3.7s. Emulated Moto G Power, Lighthouse 13.5.0, slow 4G, one initial-load run; no field data. Report: https://pagespeed.web.dev/analysis/https-shreevandanatoursandtravels-com/7zkl2if1nd?form_factor=mobile. The reported contrast failure concerns paragraph text on the why-section sand surface. The text was darkened from the inherited muted colour to #5d544c. These scores precede that correction and are not an all-page guarantee.

The corrected rendered colours were confirmed locally: #5d544c text on #eae6dc, calculated contrast 5.94:1. Final code checks and expanded production smoke pass after the correction. Hero Open Graph imagery now matches Nepal; the shared final CTA offers WhatsApp and the primary telephone number. GitHub quality checks passed for the initial review, homepage/discovery and secondary-page stages.

Evidence: artifacts/redesign-responsive-audit.json, artifacts/redesign-mobile-performance.json and artifacts/redesign-mobile-home.png. The updated source index includes the final working files and public assets, and excludes credentials/builds/dependencies.

The final live host check found a 307 redirect from the bare domain to www, but the old metadata still declared the bare domain. Canonical origin normalization now aligns the existing business-domain environment value with https://www.shreevandanatoursandtravels.com. Metadata, sitemap, robots and structured data share that origin; other CI/local/project origins are preserved. Two regression tests cover the redirect-host mismatch. The domain-wide Search Console property covers both hosts.

Post-contrast live mobile retest at 5:53 pm IST: **98 performance / 100 accessibility / 100 best practices / 100 SEO**; FCP 1.0s, LCP 2.3s, TBT 60ms, CLS 0, Speed Index 2.2s. Same Moto G Power / slow-4G lab conditions; no field data. Report: https://pagespeed.web.dev/analysis/https-shreevandanatoursandtravels-com/yozw56xlum?form_factor=mobile. The contrast audit now passes. This is one homepage measurement before canonical-host deployment; performance varies and the full score increase should not be attributed to the colour change. Final lint/types, **30 tests**, production build and expanded smoke checks pass after the canonical correction.

## Main files changed

- src/app/page.tsx, curated.css, page-polish.css, globals.css and layout.tsx: homepage, visual system and social metadata.
- src/lib/real-tours.ts, components/TourDiscovery.tsx, RealShortlist.tsx, TourCard.tsx and tests/real-tours.test.mjs: real filters, device saves and source-aware discovery.
- src/app/tours/page.tsx, tours/[slug]/page.tsx, tours/saved/page.tsx and tours/compare/page.tsx: all real-tour journeys.
- src/app/destinations/[slug]/page.tsx and components/DestinationGrid.tsx: source-linked destination content.
- src/app/about, services, contact, faq, gallery and travel-information page.tsx files: secondary-page experience.
- src/components/PageIntro.tsx, Navbar.tsx, MobileDock.tsx, Footer.tsx, GalleryViewer.tsx, TripConversation.tsx and src/data/site.ts: navigation, contact choices, gallery and shared business information.
- src/app/sitemap.ts, scripts/smoke-production.mjs, scripts/index-project.mjs, PROJECT_INDEX.json and README.md: technical delivery and reproducible review.
