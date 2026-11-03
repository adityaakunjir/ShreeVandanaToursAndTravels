# Destination montages — 29 October 2026 (historical)

Superseded on 3 November 2026 by [the adaptive cinema delivery](PREMIUM_MEDIA_PERFORMANCE_SEO.md).
The v1 files below are no longer shipped. Current encoding and validation evidence
is in `artifacts/premium-film-encoding.json` and `artifacts/premium-film-quality.json`.

## Current delivery: eight scenes, forty seconds

The previous single-shot previews documented below have been replaced. Dubai,
Nepal, Kerala, Kashmir and Sikkim–Darjeeling each now contain eight distinct
source clips, exactly five seconds each, joined into a 40-second silent montage.
Mobile files are 960×540; desktop files are 1920×1080, with H.264 MP4 preferred
and VP9 WebM fallback. Proportional crops avoid stretching. Versioned
`*-montage-v1-*` filenames prevent reuse of cached short previews.

All forty originals, authors, licences, excerpt ranges and timelines are recorded
in `src/data/destination-videos.json` and exposed on `/photo-credits`. The first
four destinations use Pexels License footage. Sikkim–Darjeeling combines CC BY
3.0 and CC BY-SA 4.0 originals; its adapted montage is CC BY-SA 4.0 with individual
source attribution and download links. No music is included.

```powershell
python scripts/prepare-montage-sources.py
python scripts/build-montage-plan.py
python scripts/encode-destination-montages.py --source-dir 'D:/Vandana Travels/media-sources'
python scripts/audit-destination-montages.py
```

The encoder supports `--only dubai --resume` to reuse matching intermediate
shots. Originals and intermediates remain outside Git. Encodes are lossy;
upscaling cannot create missing source detail.

`artifacts/destination-video-encoding.json` records hashes, dimensions and sizes.
`artifacts/destination-video-quality.json` verifies all twenty delivery files:
40 seconds, 1,200 frames, no audio, MP4 fast-start and eight distinct decoded
scene samples. `artifacts/montage-review-*.jpg` supplies manual scene/crop review.
Browser checks additionally seek into the eighth scene at 37.5 seconds.

Deferred visible-only playback, manual pause, reduced-motion/Save-Data/slow-network
photo fallbacks and the compact mobile layout remain in place. Only one device
variant is requested. Browser emulation does not establish physical-device
battery use or performance on every connection.
