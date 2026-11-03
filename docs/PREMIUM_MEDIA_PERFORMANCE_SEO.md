# Premium media, performance and SEO — 3 November 2026

## Audit findings

- Several existing images were hazy, crowded, incorrectly framed for cards or
  overcropped from portrait photographs. Attribution often said only “Wikimedia
  Commons contributor” instead of identifying the photographer.
- The later `build-scenic-drone-reels.py` script had overwritten destination
  montage URLs with single eight-second clips. The source manifest still
  described forty-second montages, so it no longer matched delivery.
- The home showreel was about 14 MB on mobile and began loading immediately.
  Landscape mobile exports were cropped again into full-height portrait heroes.
- Destination hero `sizes` still described a 550px panel after the layout had
  become full-screen. The pause button also sat behind the fixed navigation.
- Large blur surfaces and parallax were not conditioned on device capacity.
- Search titles and descriptions exposed internal catalogue language. Social
  previews, destination/trip schema and image sitemap coverage were incomplete.

## Delivered changes

- All 48 catalogue images have refreshed high-resolution masters and verified
  source/creator/licence records. Selected replacements favour aerial coastal
  views, clear mountain light, recognisable landmarks and evening cityscapes.
  The Dubai still is explicitly credited as an extraction from licensed footage.
- All six films, including the homepage, contain eight distinct five-second
  scenes: forty seconds, 1,200 frames at 30fps, with no music or audio tracks.
  MP4 exports have fast-start metadata and byte-range delivery.
- Mobile exports are composed directly from originals in portrait orientation.
  Four automatic delivery profiles cover 480×854 lite, 720×1280 mobile,
  960×540 balanced desktop and 1920×1080 full-HD desktop.
- Muted video starts automatically without a hero play button. Modest memory,
  CPU and connections receive smaller files. Explicit Save-Data and reduced-motion
  browser preferences retain the photograph. Playback starts after critical
  content loads and pauses offscreen. A quiet footer motion preference can pause
  the films site-wide. A failed or browser-blocked video leaves the photograph.
- Responsive photographs are prebuilt at six widths, served directly from the
  CDN with immutable content hashes. This avoids image-optimizer cold starts and
  repeated transformations on Vercel. Modest connections start with smaller
  real photographs; capable connections upgrade pixel density after hydration.
- CSS parallax is desktop-only and capacity-aware. Lite devices avoid live
  backdrop blur. Reels embed automatically near the viewport without a click
  gate, rather than requesting Instagram during the opening view.
- The first-view stylesheet is inlined using the installed Next.js version's
  experimental `inlineCss` option. This removes the render-blocking CSS round
  trip. It improved the severe local slow-network sample, at the cost of larger
  HTML and less independent stylesheet caching on full reloads. Production builds,
  client navigation and no-JavaScript rendering require regression checks.
- Contextual WhatsApp planning is visible in tour heroes. Consumer copy removes
  prominent catalogue bookkeeping while preserving original itinerary facts,
  route variants and confirmation-led pricing. There are no invented discounts,
  scarcity claims, departures, ratings or conversion figures.
- Business identity appears site-wide in structured data. Tour pages describe
  their real itinerary as TouristTrip; destination pages expose destination and
  collection data. Canonicals, social previews, larger-image crawler settings
  and tour-image sitemap entries support discovery without promising rankings.

## Rights and reproducibility

Originals and research candidates stay outside Git in
`D:/Vandana Travels/media-sources`. Photography credits and all eight source
clips per film are public on `/photo-credits`. Creative Commons excerpts in the
Sikkim collection retain their individual licences and are downloadable
separately; Pexels scenes are not relicensed under Creative Commons.

```powershell
python scripts/publish-premium-photos.py
python scripts/build-premium-films.py
python scripts/finish-premium-films.py
python scripts/credit-sikkim-collection.py
node scripts/build-responsive-images.mjs
python scripts/audit-premium-films.py
npm run validate
```

The versioned film source plan is `src/data/premium-film-sources.json`; older
single-shot encoding scripts are historical and must not be used for delivery.
Every replacement must retain accurate source rights and bump immutable asset
versions when published content changes.

## Verification limits

The audit independently decodes samples from every scene in all 24 exports and
checks duration, frames, dimensions, silence, hashes and fast-start. Contact
sheets support visual review; frame hashes alone do not prove visual quality.
Browser checks cover actual playback, the eighth scene, capability tiers,
small-screen layouts, WhatsApp links, no-JavaScript and failure fallbacks.
The throttled test uses 128kbps, 250ms latency and 6× CPU slowdown. Lighthouse is
a repeatable lab sample, not field Core Web Vitals, a ranking guarantee or proof
of smooth playback on every physical phone. No conversion percentage is claimed.

## Final mobile and desktop review

All 222 page/view combinations (111 routes at 390px and 1440px, including utility pages and intentional 404) were captured. All 56 top/middle/footer review boards were visually inspected. Header contrast on light pages, nav clipping at 901/1024px and mobile gallery tiles were fixed; affected pages were recaptured. Forty-two breakpoint layouts pass at 360, 414, 900, 901, 1024, 1280 and 1920px. Every gallery image decodes.

The plane loading animation follows real Next Link pending state, without a forced minimum delay or a server-content loading boundary. Delayed navigation tests verified mobile/desktop appearance, reduced-motion handling and removal after response. Destination shuffle synchronises Explore and WhatsApp links. Long destination lists initially show six routes with an explicit reveal control.

Lint, TypeScript, 38 tests and production build pass. Production smoke verifies public metadata, demo isolation, filters, not-found rendering and direct WhatsApp redirection. Streaming redirects/not-found are checked against explicit framework markers and noindex metadata. Final local mobile homepage Lighthouse scores: performance 100, accessibility 100, best practices 100, SEO 100. Raw lab reports are retained; these are not field measurements.

The global loading boundary was removed after the no-JavaScript check caught streamed content remaining hidden. Navigation feedback is now a small nonblocking portal from `useLinkStatus`; complete server-rendered page content and normal redirect status codes are preserved.

## Cinema v3 correction

A subsequent 4K script replaced the original eight-shot films with 16-second (home) and 13.5-second (destination) loops, heavily recompressed the footage and derived phone crops from a landscape intermediate. The v3 encoder reads only the canonical eight-shot manifest. All versions contain 8 x 5 seconds. Mobile 1080 x 1920 is encoded directly from originals; 720p balanced and approximately 250kbps economy versions are separate deliveries. The lightweight files are about 1.2MB for the complete forty seconds, with lower detail as expected from the reduced bitrate.

The homepage's eight shots all have native landscape 4K sources. Only this film advertises the optional 4K tier. Destination films contain mixed HD originals and are not presented as native 4K. Optional HEVC reduces the 4K download on compatible browsers, with H.264 fallback. 4K requires a wide high-resolution view, 8GB/8 CPU cores and a reported connection of at least 15Mbps; unknown/weak capabilities do not trigger it. No claim is made that a tiny file preserves lossless quality or that 4K can play continuously over a 128kbps connection. Posters remain immediately available.

V3 verification passed: 39 automated tests, lint, TypeScript and production build; all 32 encodes audited for forty seconds, 1200 frames, eight distinct scenes, expected dimensions, silence, file hashes and fast-start. Native 4K source dimensions were verified for all eight homepage scenes. Browser checks pass for mobile portrait Full HD, desktop 4K including the eighth scene, connection-triggered downgrade to economy, all five destination eighth scenes, reduced-motion/SaveData, no-JavaScript, failed media, contextual WhatsApp and 28 layouts. The 128kbps/250ms/6x CPU sample retained readable content and no overflow; it does not imply 4K playback at that bandwidth.
