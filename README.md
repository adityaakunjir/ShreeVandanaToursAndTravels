# Shree Vandana Tours & Travels

A responsive Next.js website for the Pune travel business. It includes destination inspiration, company history, travel services, gallery, FAQs and a validated enquiry flow with WhatsApp and email drafts.

## Local setup

Use Node.js 24 and npm 11 (the project includes `.nvmrc`). From the `vandana-travels` directory:

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. No API keys or environment variables are required for the current website. The existing `postinstall` synchronises package-provided Prisma agent skills; you can also run `npm run skills:sync` explicitly.

## Commands

| Command             | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the development server with webpack     |
| `npm run lint`      | Check code style and React/Next.js rules      |
| `npm run typecheck` | Check TypeScript throughout the app           |
| `npm test`          | Test enquiry validation, dates and draft URLs |
| `npm run check`     | Run lint and TypeScript checks                |
| `npm run validate`  | Run checks, tests and production build        |
| `npm run build`     | Create the production build                   |
| `npm start`         | Serve an existing production build            |
| `npm run format`    | Format source, tests and configuration        |

Stop the dev server before production build/start to avoid competing use of `.next` output. A Node.js deployment is required for the dynamic enquiry page and image optimisation. Build with `npm ci` and `npm run validate`; run with `npm start`. Configure the deployment platform's port normally. This setup does not deploy or publish anything automatically.

## Content and architecture

### Local tour and booking preview

The user authorised clearly labelled sample data while real tours are prepared. `/packages` now provides three sample journeys, destination/type filtering and sample price sorting. Each detail page includes a day-by-day itinerary, inclusions/exclusions and a preview planner. Fixed-tour planners calculate adult totals/deposits; custom-holiday planners remain quote-only. Review/edit/finish runs only in local component state: no lead, reservation, payment or message is submitted, and no personal details are collected. The preview supports 1–8 adults; children, room selection, real policies and live availability are future integrations.

`TRAVEL_DEMO_MODE=true` explicitly enables the demo catalogue for a local production preview. Without this flag, production returns an enquiry fallback on `/packages` and 404 for sample details/planners. Development enables it unless the flag is explicitly false. Keep `TRAVEL_DEMO_MODE=false` on the public production deployment. Demo routes are noindex/nofollow, omitted from the sitemap, and carry visible sample notices. They do not emit Offer or rating structured data.

For a local production preview in PowerShell, set `$env:TRAVEL_DEMO_MODE='true'` before `npm start`. The current local server was started this way. Sample content is isolated in `src/data/demo-packages.ts`; it is never passed off as approved business inventory. Build/lint/typecheck and 20 tests passed. Browser checks covered all seven new catalogue/detail/planner pages at 320/390/768/1440px, fixed-tour totals/review/finish, the custom quote-only path and catalogue filtering/sorting. Production demo-off behaviour was verified separately (hidden sample prices and detail 404). This is a user-flow prototype, not a live booking engine or a completed admin platform.

The destination collection supports server-rendered search by destination/country/content and a travel-style filter. Its GET URLs can be shared; filtered pages are noindex with a collection canonical. An empty result offers a custom enquiry with the destination prefilled. This searches inspiration content; it does not imply bookable package inventory. The current suite includes 18 enquiry, discovery and commercial-content tests. See `docs/TRAVEL_PLATFORM_PLAN.md` for the full commercial-platform specification and outstanding integrations.

- `client_details/client_info.json`: business name, address, email, social links and brand reference.
- `src/data/site.ts`: public phone/WhatsApp links, destination inspiration and FAQs. Keep structured phone numbers aligned with the client source when updating contacts.
- `src/app/page.tsx`: server-rendered homepage.
- `src/app/enquire/page.tsx`: enquiry route; reads the selected destination from search parameters.
- `src/components/EnquiryForm.tsx`: interactive form and draft preparation.
- `src/lib/enquiry.ts`: validation, Indian calendar date and safely encoded draft URLs.
- `src/components/Navbar.tsx`: responsive navigation, focus management, Escape and scroll locking.
- `src/components/Footer.tsx`: shared contacts and navigation.
- `src/app/globals.css`: active responsive design styles.
- `public/assets/images`: existing client and template imagery, served through Next.js Image.
- `tests/enquiry.test.mjs`: Node.js built-in tests; no external test framework.

Unused earlier React components, starter page CSS, the obsolete Ionicons declaration and duplicate jsconfig were removed. Public template CSS/JS and starter SVGs remain as reference assets and are not loaded by the current site. Previously installed Prisma, Maps, Cloudinary and Razorpay packages do not represent live integrations. The existing agent skills and Next.js rules remain in `AGENTS.md`.

## Enquiry behaviour

Real package content can be checked with `npm run catalogue:check -- path/to/approved-packages.json`. The read-only checker rejects incomplete or empty catalogues, invalid dates/prices and duplicate identities. Start from `docs/package-input-template.json` and follow `docs/PACKAGE_IMPORT.md`; its null fields intentionally fail validation until the business supplies approved information. The test suite now contains 18 tests. This content validator does not publish packages or activate booking/payment services.

Visitors select a destination or enter a custom trip, add their name/contact number, traveller count, optional email/date and preferences, then prepare the enquiry. Past or impossible dates, invalid contact details and traveller counts outside 1–100 are rejected. Dates use Asia/Kolkata.

The resulting WhatsApp link uses the business number and an encoded message. The email link opens the visitor's email client with the same message. The visitor must review and send it in their chosen app. The site has no database, email delivery service, payment processing or automatic booking confirmation. It does not persist form contents. Editing a field invalidates the prepared draft so links always reflect the current details.

## Before publishing

Review destination availability, travel copy, the primary phone and WhatsApp number, and rights to the supplied/template imagery with the client. There are no invented package prices or review scores. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS domain before the production build (see `.env.example`). Metadata, sitemap and robots URLs use that value. Validate WhatsApp and email on target devices using a deliberate test message; opening a draft alone does not prove delivery.

An audit during setup reported 39 vulnerabilities in the existing dependency graph (3 low, 14 moderate, 22 high), including development tools and transitive packages. Major-version downgrade/upgrade suggestions from `npm audit` were not applied blindly. Run `npm audit` and resolve the dependency changes deliberately before deployment. No secrets are required or committed by this setup.

`PROJECT_ANALYSIS.md` and `PROJECT_INDEX.json` are snapshots from the initial review, before this redesign; they are historical, not a description of the current implementation.

## Mobile design and performance

The visual system uses warm ivory, charcoal, cobalt and muted sage/lavender. Editorial type, an arched hero photograph, staggered destination imagery, restrained service rows and spacious page introductions carry the same direction across all routes. The October revamp passed lint, TypeScript and a production build, with all 11 routes checked again at 320, 390, 768 and 1440px.

The site has dedicated pages for destinations, three destination details, company story, services, gallery, contact, FAQs and enquiries. Mobile quick actions keep Explore, Plan my trip and WhatsApp within reach; the dock is omitted on the enquiry page so it cannot obstruct form interaction. Inputs use 16px text, appropriate mobile keyboards and at least 52px height. Phone layouts have a simplified header and a compact enquiry introduction.

Glass effects are restricted to small navigation surfaces with opaque fallbacks. CSS-only parallax is enabled on supported desktop browsers, with a static mobile hero and reduced-motion support. There is no animation framework, autoplay video, embedded map, or third-party icon runtime. Main pages are server-rendered, images reserve space, below-fold images load lazily, and the gallery’s large photograph is mounted only when opened. The gallery supports previous/next buttons, arrow keys, Escape, and horizontal touch gestures.

The new logo source is 4,904 bytes versus the old 911,983-byte file. In a local request, the 384px hero response at quality 60 was 15,508 bytes (original JPEG: 341,002 bytes); devices with higher pixel density receive larger variants. Performance measurements on real low-end devices and throttled networks remain to be done. No universal network-speed guarantee is implied.

Browser checks covered all 11 pages at widths 320, 390, 768 and 1440, with no horizontal overflow detected. Interactive checks covered mobile menu navigation, photo viewer opening/next/Escape/focus return and destination-to-enquiry prefill. WhatsApp/email draft URLs were validated without sending messages. Physical touch gestures, actual message delivery and every external social/map destination were not exercised.

## October content and discovery additions

Device-local shortlist and shareable two/three-tour comparison are implemented for labelled demo tours. Google listing directions, coordinates, a dated 5.0/11 review snapshot and three attributed short excerpts are integrated. The user screenshot supplies the new email, 09:00–19:00 hours and additional ticket/hotel/visa services. Home and gallery include two verified Instagram reels; frames load only after tapping, with source links and no requested autoplay. npm run validate passes lint, types, 24 tests and production build. See docs/BUSINESS_CONTENT_REGISTER.md for provenance and discrepancies.

Browser verification: both Instagram embeds rendered, zero Instagram iframes before activation, close/unload worked. Home, gallery, contact, services, saved tours and comparison had no horizontal overflow at 320/390/768/1440px. Two saved tours survived reload, removal updated the collection, and the comparison copy-link action reported success. Physical devices and slow-network playback remain unmeasured.

Reel display update: the user requested directly visible Instagram embeds. Home/gallery now render both iframes automatically with native lazy loading and reserved dimensions; no Watch reel or Close reel gate remains. This supersedes the previous click-to-load behaviour. Expanded catalogue search includes month/duration/theme/adult budget and departure-date sorting; budget/month filters explicitly exclude quote-only holidays. 28 tests pass.

Latest verification: both automatic embeds rendered without an activation button on desktop, and mobile contains two frames with no activation controls or overflow. Combined month/duration/budget submission returned Dubai only; conflicting duration returned zero with a custom-holiday handoff. Expanded filters had no horizontal overflow at 320/390/768/1440px. Screenshot: artifacts/instagram-auto-desktop.png. Lint/types/build pass after the reel update.

SEO verification: nine public collection/detail pages expose nonempty page-specific descriptions and one BreadcrumbList matching visible navigation. Demo packages remain noindex/nofollow and excluded from sitemap. Lint/types/production build pass. GitHub workflow preference is recorded in AGENTS.md: commit and normal push after each completed verified change.

Tour-detail conversion update: direct save/share/shortlist controls and a mobile price/quote planning bar replace the generic dock on sample detail routes. All three detail pages pass overflow checks at 320/390/768/1440px; the contextual bar is visible only at mobile/tablet widths, no duplicate generic dock is mounted, copy-link reports success and the CTA opens the corresponding planner. Lint/types/production build pass. Real inventory remains deferred.
