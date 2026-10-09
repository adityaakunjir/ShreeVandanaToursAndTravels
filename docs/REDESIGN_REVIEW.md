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
