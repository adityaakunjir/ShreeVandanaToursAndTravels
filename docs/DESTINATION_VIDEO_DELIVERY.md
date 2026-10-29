# Licensed scenic video — 29 October 2026

Five destination-specific clips replace static hero imagery progressively, without
adding homepage sections or more scrolling. Coverage is deliberately matched to
the footage: home/Pokhara, the five primary destination pages, and matching tour
routes. Other destinations retain photography until suitable footage is verified.

| Place shown          | Creator          | Source / licence                                                                                                                                                                                      |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phewa Lake, Pokhara  | pranish shrestha | [Pexels clip 19351685](https://www.pexels.com/video/lakeside-pokhara-19351685/) / Pexels License                                                                                                      |
| Downtown Dubai       | Nelemson G       | [Pexels clip 31257785](https://www.pexels.com/video/stunning-dubai-skyline-aerial-view-31257785/) / Pexels License                                                                                    |
| Munnar hills, Kerala | Anil Sharma      | [Pexels clip 35440633](https://www.pexels.com/video/breathtaking-aerial-view-of-munnar-hills-35440633/) / Pexels License                                                                              |
| Dal Lake, Kashmir    | Haziq Farooqi    | [Pexels clip 27114739](https://www.pexels.com/video/the-serene-and-majestic-beauty-of-dal-lake-in-kashmir-capturing-its-essence-as-a-tranquil-and-picturesque-destination-27114739/) / Pexels License |
| Tsongmo Lake, Sikkim | Rajani Gairshail | [Wikimedia Commons original](https://commons.wikimedia.org/wiki/File:Tsongmo_Lake,_Sikkim,_2026.webm) / CC BY-SA 4.0                                                                                  |

These are licensed works, not an assertion that copyright does not exist.
[Pexels permits website use and modification](https://www.pexels.com/license/).
The Sikkim adaptation and extracted poster retain
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), with creator,
source, licence and edit disclosures on `/photo-credits#video-sikkim`.
Licence/source records were checked on 29 October 2026. No music is included.

## Delivery and optimisation

- Four eight-second landscape clips and a four-second cropped lake excerpt for
  Sikkim. The short Sikkim excerpt avoids the foreground people/road visible in
  other parts of the source footage. No fabricated scenery or AI-generated footage.
- FFmpeg creates silent H.264 MP4 and VP9 WebM variants: mobile landscape up to
  960px wide, mobile Sikkim 720px square; desktop landscape up to 1920px wide,
  Sikkim 1080px square. The portrait Sikkim source is cropped, never stretched.
- Native 30fps, Lanczos resizing, MP4 fast-start, byte-range serving and one-day
  browser caching. These are visually reviewed lossy encodes, not mathematically
  identical copies. Original footage stays outside the repository in
  `D:/Vandana Travels/media-sources`.
- MP4 is preferred where supported for decoding compatibility and clarity;
  WebM is the alternate format after load/codec failure. Only one selected
  mobile/desktop file is fetched for a player; no simultaneous format downloads.
- Existing photos render immediately. Video downloads start after page load and
  a short delay, when the player intersects the viewport. Clips pause offscreen
  or in hidden tabs. User pause remains respected after returning to the section.
- Reduced-motion, Save-Data and reported 2G/3G connections keep the photo until
  explicit play. No JavaScript means the photo remains with no inert play button.
- Contextual WhatsApp links, source itinerary details, compact homepage length
  and photo credits are preserved. Munnar is not mapped onto the Wayanad-only route.

## Reproduction and evidence

`src/data/destination-videos.json` records source URLs, authors, licence links,
local source filenames, edit ranges, optional crop and explicit route mappings.

```powershell
python scripts/encode-destination-videos.py --source-dir 'D:/Vandana Travels/media-sources'
python scripts/audit-video-encodes.py --source-dir 'D:/Vandana Travels/media-sources'
```

The encoder also supports `--only sikkim` for a bounded revision. Encoding output
is in `artifacts/destination-video-encoding.json` with SHA-256 hashes, dimensions,
duration, audio-stream counts and byte sizes. Quality evidence is in
`artifacts/destination-video-quality.json`: two-second SSIM samples against
originals resized/cropped to delivery resolution. That metric is a useful
diagnostic, not proof of identical appearance or physical-device performance.
Three-frame review strips are in `artifacts/video-frames-*.jpg`.

Final mobile MP4 byte sizes are approximately 0.58 MB (Pokhara), 1.37 MB
(Dubai), 1.09 MB (Munnar), 1.06 MB (Dal Lake) and 0.98 MB (Tsongmo Lake).
Original source files ranged from 11.7 MB to 50.6 MB. This reduction includes
shorter excerpts and smaller delivery resolution as well as codec compression.
The original masters are retained; this is not a claim of lossless compression.

Browser checks in `scripts/check-scenic-videos.mjs` cover deferred source loading,
real advancing playback, mobile/desktop selection, pause persistence, offscreen
pause, preference changes, no downloads for reduced-motion/Save-Data/3G before
explicit play, all mapped routes, all five mobile clips, MP4 byte ranges,
format fallback and no-JS behaviour. Production browser-emulated results do not
establish Safari/iOS battery use, every network condition or field Core Web Vitals.
