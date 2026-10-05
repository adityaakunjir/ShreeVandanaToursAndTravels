# Current owner decision

Direct WhatsApp enquiries replace website intake. Enquiry forms, stored leads and their backend are outside the current scope. The older platform roadmap below describes optional future integrations, not an instruction to implement lead intake. Real tour inventory remains deferred.

# Shree Vandana travel platform — product and delivery plan

Prepared 5 October 2026. This is the specification for the next product stages, not a claim that these features already exist. Priorities: P0 = launch requirement; P1 = growth; P2 = advanced differentiation.

## 1. The commercial direction

Build a mobile-first tour and package platform with the discovery clarity of a major OTA and the personal accountability of a specialist travel team. Start with the tours that the company can actually deliver. Compete on itinerary quality, transparent total cost, useful comparison, dependable support and authentic traveller evidence. The broad ambition is to outperform MakeMyTrip, Goibibo and Booking.com for our target customers; that outcome must be measured, not asserted in marketing copy.

The first-visit experience must answer: Is this trip right for me? What is included? What will I pay? Can I trust this company? What happens if plans change? How do I book or get a confirmed quote?

Google ranking and first-visit conversion are outcomes influenced by competition, inventory, price, service, content and customer behaviour. No design or SEO implementation guarantees a number-one ranking or a booking from every visitor.

## 2. What exists and what is missing

Current project: Next.js, responsive homepage, destination inspiration, three destination detail pages, about, services, gallery, contact, FAQs and enquiry. WhatsApp and email prepare drafts; visitors send them themselves. Main number: +91 96652 38966. The website has no persistent lead storage, published package inventory, payment integration, confirmed booking service, CRM, account area or admin catalogue.

Discovery implementation added: server-rendered destination/country/content search, travel-style filter, shareable query URLs, result counts, clear filters and no-result custom-enquiry handoff with destination prefill. Filtered pages carry `noindex, follow` and the collection canonical. This currently searches three inspiration destinations, not commercial package inventory. Verified through country search, combined filters, no-result handoff, 320/390/768/1440px overflow checks, four new search tests and a production build. Package search remains a separate outstanding requirement.

Existing destination pages explicitly describe inspiration, not fixed departures. They must not be relabelled as purchasable inventory without approved itineraries and operational data. Existing imagery is supplied/template inspiration; it is not evidence of actual customer tours. The 30+ years/three generations statement needs business substantiation before a commercial launch.

The newer Maps link resolves the Dhankawadi business. Verified rating/count, selected review excerpts, exact directions and coordinates are integrated. User-supplied screenshot overrides listing hours and project email. Two verified Instagram reels are embedded on demand. See BUSINESS_CONTENT_REGISTER.md for evidence and remaining media limitations.

## 3. Inventory and booking models

The user subsequently confirmed that real tour information will be supplied later and authorised continued development using clearly labelled demo data. A local package catalogue, three sample detail pages and three planner pages now demonstrate discovery and fixed/custom customer flows. Search/type filtering, sample price sorting, itineraries, inclusions/exclusions, adult party totals and review/edit/finish are implemented. No booking, payment, quote or message is submitted. Production hides demo records by default unless TRAVEL_DEMO_MODE is explicitly true; preview pages are noindex/nofollow and absent from the sitemap. The local preview now supports device-local saved trips, two/three-tour comparison, departure-month, duration, theme and adult-budget filters, and sample-date sorting. Twenty-eight tests pass; responsive/interaction checks are recorded in README. Admin operations, live inventory and authoritative payment confirmation remain outstanding; demo completion is not a confirmed booking.

An import contract and read-only content validator now exist in `src/lib/package-catalogue.ts` and `scripts/check-catalogue.mjs`. See PACKAGE_IMPORT.md and package-input-template.json. Fixed-departure and quote-only records are distinguished; incomplete/invalid commercial records are rejected. Eight additional tests cover dates, prices, duplicate identities, partial-import rejection and custom-holiday separation (18 tests total). No commercial records are loaded into the website yet. Authentication, persisted inventory and transactional booking remain outstanding.

The user confirmed on 5 October 2026 that the business needs both fixed departures and customised holidays. Support two clearly distinguished paths:

- Fixed departures: published dates, seat allocations, hotel/room variants, approved prices and a live availability check. Book only while inventory can be reserved.
- Custom holidays: request requirements, receive a versioned quote, review its inclusions and cancellation terms, then accept and pay using a secure quote link. Show “Get a personalised quote” until an offer is confirmed.

Do not present a quote request as a completed booking. Paid-but-awaiting-supplier-confirmation must have its own status and recovery policy. Publish only inventory signed off by operations. A package without approved pricing can remain quote-only, with no invented starting price.

## 4. Site map and purpose

| Area            | Pages and functionality                                                                                                              | Priority            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| Home            | Trip search, useful package collections, current departures, authentic proof, planning help                                          | P0                  |
| Discovery       | All packages; domestic/international hubs; destination/country pages; theme collections; departure-city pages where genuinely served | P0                  |
| Package         | Unique itinerary page; dates, prices, inclusions, hotels, policies, support and enquiry/booking action                               | P0                  |
| Quote           | Custom holiday brief, quote review, expiry, request changes, acceptance and payment                                                  | P0                  |
| Booking         | Traveller details, availability recheck, payment, pending/confirmed/failed status, receipt                                           | P0 for instant book |
| Manage trip     | Secure access to bookings, balances, documents, traveller edits, cancellation request and support                                    | P0 for instant book |
| Trust           | About/team, real travel stories/reviews, contact/office, why travel with us                                                          | P0                  |
| Policies        | Privacy, terms, payments, cancellations/refunds, accessibility and grievance contact                                                 | P0                  |
| Content         | Destination guides, seasons, trip preparation, actual tour stories, practical FAQs                                                   | P1                  |
| Business travel | Group/corporate/school journeys only when these services are approved                                                                | P1                  |
| Retention       | Saved trips, comparison, price alerts, referrals and repeat-customer benefits                                                        | P1/P2               |
| Administration  | Catalogue, availability, quotations, bookings, payments, refund work queue, content and permissions                                  | P0                  |

Suggested routes: `/packages`, `/packages/[slug]`, `/destinations/[slug]`, `/collections/[slug]`, `/departures`, `/custom-holidays`, `/quotes/[secure-token]`, `/book/[package]`, `/booking/[reference]`, `/my-trips`, `/travel-guides/[slug]`, `/traveller-stories`, `/policies/*`. Private quote/account/checkout URLs must not become SEO landing pages.

## 5. Homepage built to sell

Order mobile content around decisions, not decorative effects:

1. Clear promise and compact “Where would you like to go?” search with trip type/date/travellers disclosed progressively.
2. Approved best-fit packages with price basis, duration, departure city and key inclusions visible before a tap.
3. Authentic customer evidence and a link to its source. Hide ratings until verified.
4. Timely fixed departures or seasonal collections backed by actual inventory.
5. Useful category chips: family, honeymoon, culture, relaxed pace, adventure, groups; only list supported products.
6. Short evidence-led explanation of planning and support, office location and a named point of contact where approved.
7. Custom-trip path for people who do not find a suitable package.
8. Practical answers about costs, cancellation and booking. No first-load promotional popup.

Mobile navigation should prioritise Explore, saved trips/compare when available, and help. On a package page, use a contextual bottom bar with total/price basis and one main booking or quote action. Do not stack a general dock, cookie banner, chat bubble and booking bar over each other.

## 6. Discovery and search

P0: searchable destination/package/departure city; Indian spelling synonyms where useful; date/month, travellers, duration, per-person budget, departure city, domestic/international and group/private filters. Filters must match real catalogue fields. Sort by relevant match, total price and departure date; define what “recommended” means. Card information must agree with the detail page.

P1: theme, hotel category, meals, flight inclusion, physical intensity, language, accessibility and cancellation flexibility when these attributes are verified. Mobile filter bottom sheet with result count, Apply/Clear, focus management and keyboard support. Store meaningful filter state in URLs for sharing and back-navigation. Provide pagination or an explicit Load more button, not inaccessible infinite scroll.

No-result state: explain which filters constrain results, offer to remove them and offer a custom trip. Slow/failing search: preserve selections, show a retry and a contact fallback. Package comparison: two or three trips with comparable duration, total cost, hotels, meals, transport, activities and cancellation. Saved trips can work locally without compulsory login; tell customers when data is device-only.

## 7. Required package data and detail page

Each publishable package needs an ID, slug, status, inventory model, name, destinations, origin, duration/nights, tour type, suitability, pace, minimum age if applicable, languages, itinerary days, hotels or equivalent policy, room categories, meals, transport, activities, inclusions, exclusions, optional extras, support arrangements, source media and responsible editor.

Commercial fields: currency, price basis (per person/room/group), occupancy basis, adult/child/infant prices, single supplement, taxes/fees and applicability, payment schedule, deposit/refund rules, validity and blackout dates, cancellation/change policy version, supplier confirmation rules and booking cutoff. Fixed departures additionally need capacity, remaining allocation, reserved seats, hold expiry and departure status. Accessibility promises and emergency support require operational confirmation.

Detail-page order: summary and image; price/date/CTA; who this trip suits; included versus extra costs; day-by-day itinerary; hotels/transport; departure selection; authentic evidence; cancellation/payment terms; preparation FAQs; alternatives. Keep important exclusions beside inclusions. Show the calculated party total before checkout, and explain any estimate that depends on a quote. Optional extras are opt-in.

P1: downloadable lightweight itinerary, shareable package link, saved trip and comparison. Generate PDFs from the same versioned package data so documents cannot silently disagree with the webpage.

## 8. Booking and payment integrity

Flow: select date/party → recheck seats and server price → reserve expiring hold → traveller details → review total and policies → hosted payment → pending result → confirmed booking after authoritative payment and inventory checks. Guest booking should be supported; account creation must not obstruct checkout.

Use integer minor units for money, server-authoritative totals and explicit currency. Do not trust browser-supplied prices. Hosted provider checkout keeps card handling outside the application. Verify provider signatures, deduplicate webhook events, use idempotency keys and reconcile unresolved payments. A browser redirect is not proof of payment. Two visitors purchasing the final seat must not both receive confirmation.

State model: draft → held → payment_pending → paid_pending_confirmation → confirmed. Also expired, payment_failed, cancelled, refund_pending and refunded. Record timestamps, inventory effects and financial events; don't overwrite history. Late payment after hold expiry requires recovery rather than automatic overselling. Refunds and amendments require operator permissions, audit logs and provider reconciliation.

Required edge cases: interrupted network, double tap, page refresh, duplicate/reordered webhook, abandoned payment, payment success with supplier failure, expired quote, changed price, sold-out departure, partial refund and customer retry. Every state needs understandable customer messaging and a next action.

## 9. Enquiries, quotes and human support

P0: persist lead with consent, source package/search context, contact preference, dates, party size and requirements; generate an enquiry reference; deduplicate accidental repeats; provide a truthful success state only after storage. WhatsApp remains +91 96652 38966 with concise package context. Clicking WhatsApp measures intent, not a sent message or confirmed sale.

Team workflow: New → assigned → contacted → quote sent → follow-up due → accepted/lost. Track owner, next action, quote versions, expiry and lost reason. Response-time promises can appear only when staffing supports them. Customer-approved follow-ups, reminder opt-out and transactional notifications must be distinguished.

Quotes need exact party/hotel/date assumptions, inclusions, exclusions, total, deposit, deadlines and policy snapshot. Changes create a new version. Quote links use unguessable expiring tokens and must not leak traveller details to analytics or search indexing. Do not collect passport documents in an open enquiry or WhatsApp URL.

## 10. Trust and genuine proof

P0: consistent business name, primary phone, approved address, email, office map, office/team photos, legal business identity and support contacts. Publish registrations/affiliations only with evidence. Avoid fake urgency, unverified traveller counts, default five-star testimonials, invented savings, or promises of universal lowest prices.

Google content workflow: resolve the exact business profile and Place ID; inspect official data; use an authorised Google integration with visible source and author attributions, source links, ordering disclosure and permitted storage practices. API review subsets are not an export of every review. Owner-supplied photos/videos can be used from original files with a documented rights/consent record. Google publicly visible media is not automatically company-owned media. Videos need verified provenance and an authorised embed or owned original; do not assume Places provides all listing videos.

Traveller stories should connect a real approved story to its trip, date and media permissions. Clearly distinguish independently sourced Google reviews, company-collected testimonials, and reviews tied to a verified booking. Include constructive feedback and moderation/reporting procedures.

## 11. Premium mobile design and modern features

Retain a restrained visual system with meaningful photography, clear hierarchy, a coherent palette, readable text and generous touch targets. Let package information dominate selling pages. Use glass only for small overlays with readable opaque fallbacks. Parallax is progressive enhancement on capable desktops; reduced-motion and static mobile layouts remain first-class. No scroll hijacking or animation that delays a CTA.

P1 features worth building: compare trips, save without login, share a shortlist, intuitive departure calendar, trip-fit questionnaire with explainable recommendations, expandable itinerary, approved route map loaded on demand, customer-selected media viewer and lightweight trip documents.

P2: multilingual English/Marathi/Hindi with human-reviewed translations; accessible narrated trip previews; moderated traveller community; consent-based alerts; loyalty/referral programmes with approved terms; optional PWA saved itinerary access that excludes sensitive payment/identity information. AI assistant only after reliable inventory/content exist: cite package sources, escalate to a person, never invent availability or visa guarantees, and never autonomously take payment or change a booking.

## 12. Search visibility strategy

Prioritise genuine commercial intent in destinations and departure cities actually served. Examples for research, not verified search volume: “family tour packages from Pune”, destination-specific packages from Pune, fixed departures and relevant regional-language queries. Launch useful pages for real products before broad generic travel keywords.

P0 technical foundations: production HTTPS domain, one canonical host, unique titles/descriptions/canonicals, crawlable HTML and links, accurate sitemap, robots rules, redirects, correct 404/410 treatment, breadcrumb markup and source-consistent TravelAgency structured data. Private account/quote/checkout/search states must have appropriate indexing/access rules. Do not canonicalise every route to the homepage. Add real Offers only when accurate commercial data exists. No self-serving LocalBusiness rating markup to promise Google review stars.

Facet strategy: index a curated destination/theme page only if it has distinct value and stable inventory; prevent unlimited combinations from becoming thin landing pages. Decide noindex/canonical rules per template, preserve pagination links and audit crawled URLs. Use truthful last-modified values. Publish useful seasonal advice, first-hand route insights, hotel-selection explanations and tour stories with real authors/editor review; avoid mass-generated city doorway pages.

Local growth: verify Business Profile, align name/address/phone, maintain real hours/categories, add owned recent media, respond professionally to reviews and request reviews from customers without manufacturing them. Add domain to the profile and verify Search Console. Monitor queries, indexation, landing pages and qualified bookings, not vanity ranking alone.

Google says local ranking depends on relevance, distance and prominence. Helpful original content and reliable user experience are the direction; structured data helps interpretation but is not a top-ranking guarantee. See sources below.

## 13. Performance and accessibility budgets

Targets, not current measurements: mobile p75 LCP ≤2.5s, INP ≤200ms and CLS ≤0.1. Start a resource budget of ≤150KB compressed route JavaScript and ≤500KB initial mobile transfer for home/discovery, then measure Next.js runtime and third-party costs before enforcing final budgets. Keep the mobile hero variant small and lazy-load below-fold imagery. These transfer budgets are product choices, not Google's thresholds.

Server-render discovery/detail content, use CDN caching with explicit catalogue revalidation, responsive AVIF/WebP, reserved dimensions and self-hosted subset fonts. Load maps, video, reviews and secondary widgets on demand. Do not cache sensitive user responses publicly. Avoid speculative prefetch of a large catalogue on metered connections. Provide functional text and enquiry paths when media fails. No guarantee is possible on every network speed.

QA: 320/360/390/430/768/1024/1440 widths, small-height screens, 200% zoom, keyboard and screen readers, contrast, focus return, date/calendar accessibility and mobile keyboard obstruction. Target WCAG 2.2 AA. Test representative low-end Android devices, iOS Safari and throttled slow connections. Gather real-user vitals after deployment; lab scores cannot establish daily-user performance.

## 14. Architecture for daily traffic

Recommended starting architecture: existing Next.js frontend and server layer; relational database for packages, availability, leads, quotes, bookings and payment events; managed object storage/CDN for owned media; background queue for notifications and reconciliation; hosted payment provider; authenticated operations console. Select vendors against region, operating budget, supplier integrations and required uptime. A package dependency in package.json is not an active integration.

Use indexed queries, pagination, bounded payloads, connection pooling, transaction-safe seat allocation and background jobs with retries/dead-letter handling. Separate cached catalogue reads from uncached transactional writes. Start with one maintainable service rather than premature microservices. Publish/revalidation events invalidate relevant catalogue cache; changed price must be rechecked at checkout.

Forecast peak sessions and requests from actual marketing/traffic plans. Load-test 3× forecast peak and campaign spikes, including catalogue cache misses and booking writes; verify no overselling or duplicate charges. Proposed availability target 99.9%, recovery point ≤15 minutes and recovery time ≤1 hour must be confirmed against hosting budget and tested restores. Record runbooks for supplier, payment, database and notification failures.

## 15. Operations console and content management

P0: role-based access for catalogue editor, sales, operations, finance and administrator; MFA for privileged users; publish approvals; audit history; media provenance; package/price/policy versioning; inventory/departure controls; lead assignment; quotation builder; booking/refund work queues; notification status; reconciliation and exports with limited fields.

P1: supplier allotment management, itinerary templates, campaign collections, SEO preview, broken-link/content freshness alerts, customer support cases, multilingual editorial workflow and dashboard by departure/destination. Price or policy changes need effective dates and historical snapshots so existing bookings retain their agreed terms.

## 16. Privacy, security and policies

Before transaction launch, obtain business-approved privacy, booking terms, payment, cancellation/refund and grievance information. Have appropriate professional review for the operating jurisdictions; do not publish generated legal promises as approved policy. Minimise traveller information; collect identity documents only when required using controlled private storage, retention and restricted access.

Server validation, rate limiting, spam controls, authenticated admin sessions, secure cookies, CSRF protections where applicable, scoped secrets, encrypted transport/storage, access logs with personal data minimised and dependency remediation. Log payment provider event/reference IDs, never card details. Analytics must not capture names, phone numbers, passport data, WhatsApp message bodies or quote tokens. Restore-test backups and rehearse breach/incident response.

## 17. Measurement and conversion experiments

Event sequence: catalogue search → filter applied → package viewed → departure selected → quote/enquiry started → lead stored → quote accepted → checkout started → payment initiated → authoritative payment success → booking confirmed. Track WhatsApp/call clicks separately. Use consent-aware analytics and backend confirmations for financial outcomes. Exclude duplicate events and internal traffic.

Metrics: mobile qualified leads per session; time to useful package; enquiry completion; quote-to-booking; checkout abandonment by step; confirmed bookings and contribution margin per session; repeat bookings; support response time; refunds/cancellations; real-user vitals and error rate; organic qualified leads by landing page.

Establish a baseline before setting numerical conversion promises. Test one meaningful change at a time: search-led versus editorial hero, inclusion transparency, mobile CTA copy, comparison, proof location and guest checkout. Report confidence and sample size; don't declare a small sample a winner. Conversion must not be increased by hiding exclusions or cancellation costs.

## 18. Delivery stages and acceptance gates

| Stage                      | Deliverable                                                                                                      | Evidence required                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| A: approved content        | Correct listing identity; real initial catalogue; approved owned media and policies; traffic/operations forecast | Source register, operations sign-off and complete publishable package records                                    |
| B: commercial discovery    | Search, filters, package detail, contextual mobile CTA, comparison/shortlist, trustworthy evidence               | Mobile usability review, URL/filter tests, no fabricated prices or reviews, accessibility and performance checks |
| C: reliable sales          | Stored leads, admin assignment, versioned quotes, notifications and secure quote acceptance                      | Lead persists before success; correct drafts; no PII leak; staff can recover failures                            |
| D: transactional booking   | Availability holds, hosted payments, server confirmation, receipts, manage-trip/refund workflow                  | Sandbox tests for every payment/seat edge case, reconciliation, restore test and controlled pilot                |
| E: search and scale launch | Production domain, indexing, local profile, vitals/analytics, monitoring and load tests                          | Search Console inspection, metadata/schema tests, load report, response/runbooks and commercial approval         |
| F: growth                  | Guides, regional languages, recommendations, retention and supplier automation                                   | Measured demand, human-reviewed content and experiment evidence                                                  |

Stages B and C can launch as a quote-driven business while D is being built, but instant booking cannot be labelled live until D's gates pass. This is sequencing, not reducing the intended final scope. No timeline is promised until package count, inventory operations, integrations and staffing are known.

## 19. Inputs required and remaining work

Required next: API Place ID if adopting Places; approved initial package records and departure allocations; pricing/tax rules; supplier confirmation process; cancellation/payment policies; original company media with permission; legal identity and office hours; operational contacts/support hours; production domain; payment and notification provider accounts; hosting budget and peak traffic estimate. Inventory model is confirmed: both fixed departures and customised holidays.

Still unimplemented: commercial catalogue/search, stored leads, quotes/admin, real bookings/payments, live availability, customer account, full listing media ingestion, permissioned customer media, production deployment, field performance and organic-ranking evidence. Completion of this plan does not mean the platform or the ranking objective is complete.

## 20. Research sources and scope

Reviewed 5 October 2026. Features below are observed examples, not a complete competitor usability audit or evidence that one design is universally superior.

- [Booking.com official demand API: filtering and sorting](https://developers.booking.com/demand/docs/accommodations/filter-sorting): price/amenity/cancellation filters demonstrate decision-support capabilities. Adapt the principle to tours with verified attributes.
- [MakeMyTrip holiday feature example](https://www.makemytrip.com/promos/holiday-package-offer-081024.html?detail_image=no): selective deposit/payment and cancellation conditions illustrate commercial flexibility; do not copy ₹1 or free-cancellation claims without our own approved terms.
- [Goibibo holidays](https://www.goibibo.com/go/holidays/): domestic/international discovery. This does not verify its entire current booking journey.
- [Google: helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): original, accurate, people-first content and real expertise.
- [Google: local ranking](https://support.google.com/business/answer/7091): relevance, distance and prominence; no paid/requested better ranking.
- [Google: LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business): accurate business information and validation; appearance isn't guaranteed.
- [Google: self-serving reviews](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful): business-controlled reviews do not qualify for LocalBusiness/Organization review snippets.
- [Google Places policies](https://developers.google.com/maps/documentation/places/web-service/policies): source/author attribution and storage constraints for API content.
- [web.dev: Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds): p75 LCP/INP/CLS targets and field interpretation.

The [verified Maps listing](https://maps.app.goo.gl/7faKRoszRxDXsPMU9?g_st=ic) supersedes the earlier inaccessible share link.
