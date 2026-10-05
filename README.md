# Shree Vandana Tours & Travels

A responsive Next.js website for the Pune travel business. It includes destination inspiration, company history, travel services, gallery, FAQs and direct WhatsApp enquiries.

## Current implementation

Updated 5 October 2026. The public site has eleven owner-supplied tour outlines, five priority destination pages, ten additional destination WhatsApp links, red/ivory/charcoal branding and direct enquiries to +91 96652 38966. No public intake form, lead storage or checkout is implemented. Two Instagram reels load automatically with native lazy loading. Public tour details include itinerary jump links and one mobile enquiry bar. Layout and interaction checks are recorded in docs/TRAVEL_PLATFORM_PLAN.md; historical notes below are superseded where they differ.

Canonical production URLs use https://shreevandanatoursandtravels.com. Authenticated Vercel browser access confirms the live deployment and source commit; see the production verification section below. Physical-device and throttled-network performance remains unmeasured. After runtime dependency cleanup, `npm audit --omit=dev` reports zero known findings. The full audit still reports 39 development/build-tool findings (three low, fourteen moderate, twenty-two high) requiring separate remediation. This does not establish that the application is free of security defects.

## Local setup

Use Node.js 24 and npm 11 (the project includes `.nvmrc`). From the `vandana-travels` directory:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. No API keys or environment variables are required for the current website. The existing `postinstall` synchronises package-provided Prisma agent skills; you can also run `npm run skills:sync` explicitly.

## Commands

| Command                    | Purpose                                      |
| -------------------------- | -------------------------------------------- |
| `npm run dev`              | Start the development server with webpack    |
| `npm run lint`             | Check code style and React/Next.js rules     |
| `npm run typecheck`        | Check TypeScript throughout the app          |
| `npm test`                 | Test discovery, catalogue and WhatsApp URLs  |
| `npm run check`            | Run lint and TypeScript checks               |
| `npm run validate`         | Run checks, tests and production build       |
| `npm run build`            | Create the production build                  |
| `npm run smoke:production` | Verify an existing build with demos disabled |
| `npm start`                | Serve an existing production build           |
| `npm run format`           | Format source, tests and configuration       |

Stop the dev server before production build/start to avoid competing use of `.next` output. A Node.js deployment is required for the dynamic enquiry page and image optimisation. Build with `npm ci` and `npm run validate`; run with `npm start`. Configure the deployment platform's port normally. This setup does not deploy or publish anything automatically.

## Content and architecture

### Automated GitHub checks

`.github/workflows/quality.yml` runs on pushes to main and pull requests. It uses Node 24, locked dependency installation, lint/types, all unit tests, the production build and `smoke:production`. Official checkout/setup-node actions are pinned to reviewed commit hashes; the job has read-only repository permission and no deployment/payment secrets. The example.com build origin is a CI fixture, not the production domain.

The smoke command starts and terminates its own temporary local server, leaving the port-3000 preview untouched. It checks all 10 public pages and the WhatsApp redirect, unique descriptions, canonicals and applicable breadcrumb data; 404 handling; filtered destination noindex; and demo-off fallback/detail/planner isolation. It does not simulate actual bookings, external message delivery, payment providers or Google ranking. Run it after `npm run build`.

### Local tour and booking preview

The user authorised clearly labelled sample data while real tours are prepared. `/packages` now provides three sample journeys, destination/type filtering and sample price sorting. Each detail page includes a day-by-day itinerary, inclusions/exclusions and a preview planner. Fixed-tour planners calculate adult totals/deposits; custom-holiday planners remain quote-only. Review/edit/finish runs only in local component state: no lead, reservation, payment or message is submitted, and no personal details are collected. The preview supports 1–8 adults; children, room selection, real policies and live availability are future integrations.

`TRAVEL_DEMO_MODE=true` explicitly enables the demo catalogue for a local production preview. Without this flag, production returns an enquiry fallback on `/packages` and 404 for sample details/planners. Development enables it unless the flag is explicitly false. Keep `TRAVEL_DEMO_MODE=false` on the public production deployment. Demo routes are noindex/nofollow, omitted from the sitemap, and carry visible sample notices. They do not emit Offer or rating structured data.

For a local production preview in PowerShell, set `$env:TRAVEL_DEMO_MODE='true'` before `npm start`. The current local server was started this way. Sample content is isolated in `src/data/demo-packages.ts`; it is never passed off as approved business inventory. Build/lint/typecheck and 20 tests passed. Browser checks covered all seven new catalogue/detail/planner pages at 320/390/768/1440px, fixed-tour totals/review/finish, the custom quote-only path and catalogue filtering/sorting. Production demo-off behaviour was verified separately (hidden sample prices and detail 404). This is a user-flow prototype, not a live booking engine or a completed admin platform.

The destination collection supports server-rendered search by destination/country/content and a travel-style filter. Its GET URLs can be shared; filtered pages are noindex with a collection canonical. An empty result offers a custom enquiry with the destination prefilled. This searches inspiration content; it does not imply bookable package inventory. The current suite includes 18 enquiry, discovery and commercial-content tests. See `docs/TRAVEL_PLATFORM_PLAN.md` for the full commercial-platform specification and outstanding integrations.

- `client_details/client_info.json`: business name, address, email, social links and brand reference.
- `src/data/site.ts`: public phone/WhatsApp links, destination inspiration and FAQs. Keep structured phone numbers aligned with the client source when updating contacts.
- `src/app/page.tsx`: server-rendered homepage.
- `src/app/enquire/page.tsx`: legacy redirect to WhatsApp; preserves selected destination context.
- `src/lib/whatsapp.ts`: safely encoded direct chat URLs.
- `src/components/Navbar.tsx`: responsive navigation, focus management, Escape and scroll locking.
- `src/components/Footer.tsx`: shared contacts and navigation.
- `src/app/globals.css`: active responsive design styles.
- `public/assets/images`: existing client and template imagery, served through Next.js Image.
- `tests/whatsapp.test.mjs`: direct-chat URL and context checks.

Unused earlier React components, starter page CSS, the obsolete Ionicons declaration and duplicate jsconfig were removed. Public template CSS/JS and starter SVGs remain as reference assets and are not loaded by the current site. Previously installed Prisma, Maps, Cloudinary and Razorpay packages do not represent live integrations. The existing agent skills and Next.js rules remain in `AGENTS.md`.

## Enquiry behaviour

Real package content can be checked with `npm run catalogue:check -- path/to/approved-packages.json`. The read-only checker rejects incomplete or empty catalogues, invalid dates/prices and duplicate identities. Start from `docs/package-input-template.json` and follow `docs/PACKAGE_IMPORT.md`; its null fields intentionally fail validation until the business supplies approved information. The test suite now contains 18 tests. This content validator does not publish packages or activate booking/payment services.

Visitors tap a planning or enquiry button to open WhatsApp at +91 96652 38966. Destination and service buttons include a short contextual message. Visitors can edit and send it themselves; no website form, lead intake or lead database is used. Existing /enquire links redirect to WhatsApp. A chat does not confirm a booking or payment.

## Before publishing

Review destination availability, travel copy, the primary phone and WhatsApp number, and rights to the supplied/template imagery with the client. There are no invented package prices or review scores. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS domain before the production build (see `.env.example`). Metadata, sitemap and robots URLs use that value. Validate WhatsApp and email on target devices using a deliberate test message; opening a draft alone does not prove delivery.

An audit during setup reported 39 vulnerabilities in the existing dependency graph (3 low, 14 moderate, 22 high), including development tools and transitive packages. Major-version downgrade/upgrade suggestions from `npm audit` were not applied blindly. Run `npm audit` and resolve the dependency changes deliberately before deployment. No secrets are required or committed by this setup.

`PROJECT_ANALYSIS.md` and `PROJECT_INDEX.json` are snapshots from the initial review, before this redesign; they are historical, not a description of the current implementation.

## Mobile design and performance

The visual system uses warm ivory, charcoal, cobalt and muted sage/lavender. Editorial type, an arched hero photograph, staggered destination imagery, restrained service rows and spacious page introductions carry the same direction across all routes. The October revamp passed lint, TypeScript and a production build, with all 11 routes checked again at 320, 390, 768 and 1440px.

The site has dedicated pages for destinations, three destination details, company story, services, gallery, contact, FAQs and enquiries. Mobile quick actions keep Explore, Plan my trip and WhatsApp within reach; the dock is omitted on the enquiry page so it cannot obstruct form interaction. Inputs use 16px text, appropriate mobile keyboards and at least 52px height. Phone layouts have a simplified header and direct WhatsApp actions.

Glass effects are restricted to small navigation surfaces with opaque fallbacks. CSS-only parallax is enabled on supported desktop browsers, with a static mobile hero and reduced-motion support. There is no animation framework, autoplay video, embedded map, or third-party icon runtime. Main pages are server-rendered, images reserve space, below-fold images load lazily, and the gallery’s large photograph is mounted only when opened. The gallery supports previous/next buttons, arrow keys, Escape, and horizontal touch gestures.

The new logo source is 4,904 bytes versus the old 911,983-byte file. In a local request, the 384px hero response at quality 60 was 15,508 bytes (original JPEG: 341,002 bytes); devices with higher pixel density receive larger variants. Performance measurements on real low-end devices and throttled networks remain to be done. No universal network-speed guarantee is implied.

Browser checks covered all 11 pages at widths 320, 390, 768 and 1440, with no horizontal overflow detected. Interactive checks covered mobile menu navigation, photo viewer opening/next/Escape/focus return and destination-specific WhatsApp links. WhatsApp/email draft URLs were validated without sending messages. Physical touch gestures, actual message delivery and every external social/map destination were not exercised.

## October content and discovery additions

Device-local shortlist and shareable two/three-tour comparison are implemented for labelled demo tours. Google listing directions, coordinates, a dated 5.0/11 review snapshot and three attributed short excerpts are integrated. The user screenshot supplies the new email, 09:00–19:00 hours and additional ticket/hotel/visa services. Home and gallery include two verified Instagram reels; frames load only after tapping, with source links and no requested autoplay. npm run validate passes lint, types, 24 tests and production build. See docs/BUSINESS_CONTENT_REGISTER.md for provenance and discrepancies.

Browser verification: both Instagram embeds rendered, zero Instagram iframes before activation, close/unload worked. Home, gallery, contact, services, saved tours and comparison had no horizontal overflow at 320/390/768/1440px. Two saved tours survived reload, removal updated the collection, and the comparison copy-link action reported success. Physical devices and slow-network playback remain unmeasured.

Reel display update: the user requested directly visible Instagram embeds. Home/gallery now render both iframes automatically with native lazy loading and reserved dimensions; no Watch reel or Close reel gate remains. This supersedes the previous click-to-load behaviour. Expanded catalogue search includes month/duration/theme/adult budget and departure-date sorting; budget/month filters explicitly exclude quote-only holidays. 28 tests pass.

Latest verification: both automatic embeds rendered without an activation button on desktop, and mobile contains two frames with no activation controls or overflow. Combined month/duration/budget submission returned Dubai only; conflicting duration returned zero with a custom-holiday handoff. Expanded filters had no horizontal overflow at 320/390/768/1440px. Screenshot: artifacts/instagram-auto-desktop.png. Lint/types/build pass after the reel update.

SEO verification: nine public collection/detail pages expose nonempty page-specific descriptions and one BreadcrumbList matching visible navigation. Demo packages remain noindex/nofollow and excluded from sitemap. Lint/types/production build pass. GitHub workflow preference is recorded in AGENTS.md: commit and normal push after each completed verified change.

Tour-detail conversion update: direct save/share/shortlist controls and a mobile price/quote planning bar replace the generic dock on sample detail routes. All three detail pages pass overflow checks at 320/390/768/1440px; the contextual bar is visible only at mobile/tablet widths, no duplicate generic dock is mounted, copy-link reports success and the CTA opens the corresponding planner. Lint/types/production build pass. Real inventory remains deferred.

## Company tours

The owner-supplied TOURS.doc now powers eleven public tour outlines at /tours, each with a route, itinerary where supplied, inclusions/exclusions and direct WhatsApp enquiries. Prices, dates and availability are confirmed by the team; no online checkout or invented prices are shown. India/international and text search use shareable GET URLs. The original /packages area remains a separate labelled demo; navigation points to the real tour collection.

## Production domain and Vercel

The canonical production URL is `https://shreevandanatoursandtravels.com`. It is the shared default for metadata, structured data, robots and sitemap URLs. Set `NEXT_PUBLIC_SITE_URL` to this value in the intended Vercel project and keep `TRAVEL_DEMO_MODE=false`. Use Next.js framework detection, Node.js 24.x, `npm ci` and `npm run build`; no additional paid services are required by the application.

The signed-in local Vercel account (`itvadsoft-1836`) does not have access to this domain or an existing Vandana project. Browser access now verifies the domain association and live deployment; CLI authentication is separate. Do not create a duplicate project in that account. Vercel Hobby is restricted to personal, non-commercial use; a commercial travel business requires an appropriate hosting plan: https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage.

## Destination photography

Eleven destination photographs are bundled locally as compressed WebP files and rendered with responsive Next Image sizing. The collection is lazy-loaded; tour hero images are preloaded. Desktop parallax uses CSS view timelines only when supported and motion is permitted; mobile and reduced-motion users receive static images. Attribution, original sources, licence links and transformation details are recorded in `src/data/tour-photos.json` and shown at `/photo-credits`. The image licences apply to the photographs, independently of site source code. `node scripts/import-tour-photos.mjs` refreshes these explicitly selected assets; it is never a build dependency.

## Public production verification

On 5 October 2026 the public HTTPS domain responded successfully from this machine. Twenty-four public content routes plus robots.txt, sitemap.xml and /packages returned HTTP 200. All eleven tour pages contain the photo-led heading and primary WhatsApp links. Five destination pages expose their own destination social image. No localhost URL was found in those responses; the sitemap includes all eleven tours, and /packages remains noindex/nofollow without demo prices. Evidence: artifacts/production-route-audit.json. This supersedes earlier statements that public availability was unverified.

Authenticated browser access to https://vercel.com/exynxs-projects/shree-vandana-tours-and-travels was verified on 5 October 2026. The production overview identifies deployment 5f5jKRedvN7DHgkmQMhbJepMi4t4 as Ready, associates shreevandanatoursandtravels.com, and identifies main commit 1402adcc62d1df18e85bf00a5871a9a85b105fc4. The dashboard confirms pushes to main update production, Node.js 24.x, Fluid Compute enabled and standard deployment protection. The local CLI account remains separate from browser authentication. Environment values, hosting-plan eligibility, Search Console indexing/ranking, performance under load and booking conversion remain unverified. Evidence: artifacts/production-deployment-verification.json.

## Mobile lab baseline

Google PageSpeed Insights measured the live homepage on 5 October 2026 at 23:28 IST: performance 91, accessibility 100, best practices 100 and SEO 100. This is one emulated Moto G Power/slow-4G Lighthouse 13.5.0 initial-load run: FCP 1.6 s, LCP 3.1 s, TBT 0 ms, CLS 0 and Speed Index 4.3 s. No real-user field data was available. These scores do not establish all-page performance, full accessibility or search rankings. Report URL and evidence are recorded in artifacts/production-mobile-performance.json and production-pagespeed-mobile.png.

The report identified destination-photo compression opportunities. Destination cards and details now request quality 60 rather than the default 75. Measured 750px WebP responses for Darjeeling and Kerala are approximately 14% smaller (combined 30,756 bytes saved). The 91 performance score predates that change; no improved score is claimed. Physical-device and multi-page measurements remain outstanding.

## Search Console setup — 5 October 2026

Domain ownership for shreevandanatoursandtravels.com is verified under website.svttpune@gmail.com via a Hostinger TXT record. The authoritative nameserver returns the matching record; keep it installed to retain verification. Google accepted https://shreevandanatoursandtravels.com/sitemap.xml, but the initial processing result is "Could not fetch / Sitemap could not be read", with zero discovered pages. Public sitemap and robots.txt checks return HTTP 200. Fetch diagnosis and indexing verification remain outstanding; submission does not establish indexing or rankings. This supersedes earlier statements that Search Console account access was unavailable. Evidence: artifacts/search-console-setup.json.

Google URL Inspection subsequently confirmed that the homepage is on Google and indexed. Its live test on 5 October 2026 at 23:50 IST reports "URL is available to Google" and "Page can be indexed". This establishes homepage indexing and live crawlability only; it does not resolve the sitemap fetch error, establish indexing of all tour pages or prove rankings.
