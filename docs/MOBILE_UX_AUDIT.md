# Mobile experience audit and redesign

27 October 2026. Baseline: production build on localhost:3005, Chrome at
390 × 844, reduced motion enabled. Screenshots and measurements cover 15
representative routes: home, catalogue, two tour variants, destinations,
destination detail, collection, about, services, gallery, contact, FAQ,
travel information, saved and compare. These templates serve the full catalogue.
This is browser emulation, not physical-device or field performance evidence.

## Findings before changes

1. **Discovery takes too long.** First tour begins at 1,153px on `/tours` and
   1,429px on home. A large generic introduction followed by seven filters
   pushes the actual choice out of view. Prioritise a destination search and
   reveal advanced filters on demand; preserve selected filters and GET URLs.
2. **Catalogue overload.** The 56-card tours page measures 41,036px high.
   Server-rendered pagination should reduce DOM and image work and make position
   understandable. Preserve all tour URLs and sitemap discovery. Keep filters
   in pagination links; reset the page when submitting a new search.
3. **Every page opens the same way.** Contact, FAQ, tours and destinations all
   repeat a large heading, paragraph and landscape photograph. Help/task pages
   need concise intros; exploration deserves atmospheric imagery; story pages
   need editorial rhythm. Do not present travel photos as office/team photos.
4. **Touch hierarchy is weak.** Baseline detects 69 links/buttons under 40px high
   on tours, including credits and repeated card tools. This is a screening
   metric, not a WCAG failure count. Increase standalone action targets and
   keep secondary metadata quieter. Do not inflate inline prose links.
5. **Tour navigation disappears.** Day plans are long and the section chips are
   not persistent. Add a compact sticky horizontal section navigator, account
   for the header when scrolling to anchors, and keep the contextual WhatsApp
   action. Day numbers should read as a route/timeline, not generic panels.
6. **Card rhythm is repetitive.** White rectangles and equal-weight controls
   dominate. Use edge-to-edge photography inside contained cards, clearer
   durations, and stronger itinerary actions. Collections can use the same
   useful card anatomy without duplicating a generic hero.
7. **Contact starts too late.** The first call card begins around 640px after a
   decorative Varanasi image. Remove that visual from the task-oriented intro
   and put WhatsApp first in the contact choices, matching the owner's workflow.
8. **Mobile shell feels utilitarian.** Refine header spacing, navigation panel,
   safe-area dock, focus states and section rhythm. A restrained translucent
   dock is sufficient; avoid backdrop blur across large scrolling surfaces.
9. **Motion is too uniform.** Existing reveals only translate all blocks upward.
   Use route-style entrances for itinerary highlights, editorial entrances for
   services/story, image depth on photo-led pages and tactile control feedback.
   No scroll hijack, autoplay reels, infinite animations or animation library.
10. **Performance limits must remain explicit.** Keep hero text visible from SSR,
    lazy images below the fold, native scrolling and image sizes. CSS scroll
    timelines provide optional parallax; unsupported browsers get static photos.
    Reduced motion disables optional effects. Save-Data/slow connection users
    should receive static scroll reveals. Third-party Instagram remains an
    independent performance cost and is excluded from first-party layout QA.

## Page-specific implementation plan

| Page family              | Mobile treatment                                                               | Motion                                            |
| ------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------- |
| Home                     | Cinematic opening, compact search, destination chips, swipeable featured tours | Bounded photo depth, one-time section entrances   |
| Tours                    | Compact introduction, expandable filters, 12 results per page                  | Tactile cards; no animated results delay          |
| Destinations / hubs      | Photo-led discovery and clearly separated location choices                     | Photo depth and directional card entrances        |
| Tour details             | Photo cover or honest illustrated cover, sticky section rail, day timeline     | Day-panel expansion and route highlight entrances |
| Collections              | Editorial opening, dense useful cards                                          | Short card entrances                              |
| About                    | Story/photo rhythm and distinct principles                                     | Editorial slide entrances                         |
| Services                 | Numbered service cards and contextual WhatsApp links                           | Short staggered service entrances                 |
| Gallery                  | Photography takes priority, consistent captions                                | Bounded image movement, static embeds             |
| Contact                  | Compact intro, WhatsApp first, easy call/directions                            | Press feedback; no decorative parallax            |
| FAQ / travel information | Compact help intro, scannable groups and anchors                               | Accordion expansion only where useful             |
| Saved / compare          | Compact utility intro and clear empty states                                   | Tactile controls, no decorative photo overhead    |

## Validation requirements

Run lint, typecheck, tests, production build, route smoke checks and all-route
responsive checks at 320px with representative 390/768/1440px layouts. Exercise
search filters, pagination, menu focus, WhatsApp, reduced motion, no-JS content
and sticky anchors. Inspect new screenshots. Record actual results below after
implementation; do not infer PageSpeed scores, conversions or real-device FPS.

## Delivered and measured

- Catalogue: destination search first, native expandable filters, selected
  filters automatically expanded, 12 server-rendered results per page. All 56
  outlines remain reachable in five pages. Filter values persist in page links;
  new form submissions reset pagination. Paginated/filter URLs remain noindex.
- Mobile shell: compact header, larger menu links, safe-area rounded dock,
  revised type/spacing and stronger card actions. Photography reaches the card
  edges; durations and itinerary actions have clearer hierarchy.
- Tour detail: sticky horizontal section rail, corrected image sizing at 320px,
  clearer day-number timeline, open-day state and readable expanded body copy.
- About/services avoid repeated opening photographs. Services have numbered
  cards; gallery has a dark opening and leads into the photo edit. FAQ/contact/
  saved/compare have compact utility openings. WhatsApp appears first in contact.
- Optional photo parallax uses CSS view timelines. Route highlights enter from
  the side; story and service blocks use editorial entrances. Existing tactile
  actions and finite reveals remain. Reduced motion disables visual motion;
  Save-Data/2G disables JavaScript reveals. No animation dependency added.

At 390 × 844, using the same baseline method:

| Measure                                   |   Before |    After |
| ----------------------------------------- | -------: | -------: |
| First tour on catalogue                   |  1,153px |    737px |
| Catalogue document height                 | 41,036px | 10,368px |
| First featured tour on home               |  1,429px |  1,166px |
| Small-target screening count on catalogue |       69 |        9 |
| Small-target screening count on contact   |        1 |        0 |

These are layout measurements, not load-time or conversion improvements. The
catalogue after measurement covers page one; pagination preserves all content.
Remaining small links include secondary credit/inline content; the screening
metric does not by itself establish a touch-target accessibility failure.

## Validation results

- PASS: ESLint, TypeScript, 35 tests, production build and public-route smoke.
- PASS: 154 responsive layouts, including all sitemap routes at 320px and
  representative routes at 390/768/1440px; one H1 and no horizontal overflow.
- PASS: mobile menu focus/inert/Escape, mood discovery, filtered Japan search,
  contextual primary WhatsApp link.
- PASS: all 56 tours across pagination with no duplicates; filter preservation,
  page reset, desktop filters and no-JS disclosure/pagination.
- PASS: itinerary anchors remain below sticky navigation and day panels expand.
- PASS: normal/reduced motion, preference change, no-JS visible content and no
  runtime errors during the tested interactions. Chrome can retain disabled
  timeline handles in offscreen content-visibility subtrees; checks verify that
  their computed animation is disabled and JavaScript animations stop.
- Reviewed screenshots for 15 route examples. Evidence:
  `artifacts/mobile-before-audit.json`, `artifacts/mobile-after-audit.json`,
  `artifacts/mobile-experience-validation.json`, `artifacts/expedition-validation.json`
  and `artifacts/mobile-before-*.png` / `mobile-after-*.png`.

## Remaining opportunities and limits

Home still offers a long discovery journey; real visitor behaviour should guide
which lower sections deserve removal or reordering. More approved business
photography would improve trust and visual variety. Source-outline destinations
without licensed photos retain honest illustrated covers. Third-party Instagram
playback/network cost, physical-device FPS, Safari behaviour, field Core Web
Vitals and conversion impact are not established by these checks. The shared
CSS includes older overrides; a separate consolidation can reduce maintenance
cost without bundling that refactor into a visual delivery.
