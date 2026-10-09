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

Reconcile the Instagram 25-year bio with the supplied 30+ year company description. Confirm future departures, final quotes, accommodation and cancellation/payment terms directly with customers. Approved family/team/customer originals are still required for a genuine business-photo gallery. Google review count remains a dated 5 October snapshot. Search Console sitemap processing was unresolved at the prior check; historical lab scores are not new redesign measurements.

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
