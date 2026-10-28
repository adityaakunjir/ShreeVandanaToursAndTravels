# Shorter mobile journey — 28 October 2026

The prior redesign improved individual components, but the homepage still
measured 13,394px at 390 × 844. It repeated the same discovery task through
styles, regional cards, atlas, collections, a random trip finder and gallery
previews. Footer navigation and stacked third-party embeds added more scrolling.

## Changes

- Homepage now follows one sequence: hero/search, five owner-priority destination
  links, five matching tour cards, a short business introduction, reviews and
  reels. FAQ is linked from the introduction; WhatsApp is available in the hero,
  introduction and persistent mobile dock. Removed duplicated discovery/editorial
  sections and the repeated closing CTA.
- Homepage featured tours now reflect Dubai, Nepal, Kerala, Kashmir and
  Sikkim–Darjeeling rather than unrelated sample selections.
- Discovery playground moved to an expandable trip finder on `/tours`.
- Catalogue pages show six tours, with filter-preserving server pagination;
  collections show six then offer a native disclosure for remaining outlines.
- Destination cards are compact on mobile; the full atlas is expandable.
- Reviews, reels and related-tour cards use native horizontal scrolling on mobile.
  Reels retain automatic iframe loading near the viewport; no watch-to-load gate.
- Gallery uses a compact two-column thumbnail grid; full-size viewer remains.
- Footer directory is a native expandable section, with contact details visible.
- Removed decorative text star/heart marks and Unicode link arrows from JSX;
  reused the existing Lucide SVG icon family. Copyright text remains ordinary text.
- All tour URLs, itinerary content, photo credits, WhatsApp links and dedicated
  story/services/gallery pages remain available. Native disclosures work without JS.

## Verification

Final measurements and results are recorded in
`artifacts/focused-mobile-validation.json` and
`artifacts/mobile-experience-validation.json`. The earlier 27 October audit is
a historical baseline, not the current homepage structure or pagination size.
Instagram network/playback and physical-device performance require separate checks.

At 390 × 844 the final homepage measures **4,146px**, versus the previous
13,394px baseline: approximately **69% shorter**. At 320px it measures 4,315px;
at 768px, 4,954px. These are document-height measurements from browser emulation,
not load-time or conversion claims. The homepage no longer reserves generic
700px offscreen placeholders for its small set of remaining sections.

Validation: lint, TypeScript, 35 tests and final production build passed. Browser
checks verify all 56 tours across ten pages, preserved filters, no-JS disclosure
and pagination, normal/reduced motion, five priority destinations, both embedded
reels, expandable collections and footer, and responsive layouts. Instagram is
blocked in first-party browser QA, so the iframe shell is visible in screenshots.
