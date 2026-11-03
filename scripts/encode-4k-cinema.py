"""
Encode crystal-clear 4K cinematic showcases and responsive multi-tier video ladders
for all destinations and home hero.

Delivers:
- 4K Ultra (3840x2160 WebM & MP4): True 4K resolution, tiny file size (~4-5 MB)
- Desktop (1920x1080 WebM & MP4): Crisp Full HD (~2.5-3 MB)
- Balanced (1280x720 WebM & MP4): Crisp 720p HD (~1.4-1.8 MB, replacing old 540p blur)
- Mobile (720x1280 WebM & MP4): Sharp portrait framing (~1.2-1.6 MB)
- Lite (480x854 WebM & MP4): Ultra-compact for 2G / Save-Data (< 800 KB)
- Poster (3840x2160 WebP): High-res 4K frame for instant zero-blur display
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
media_dir = root.parent / 'media-sources'
out_dir = root / 'public/assets/videos'
work_dir = root / 'artifacts/4k-cinema-work'
out_dir.mkdir(parents=True, exist_ok=True)
work_dir.mkdir(parents=True, exist_ok=True)

CINEMA_PLANS = [
    {
        'id': 'home-destinations-drone',
        'assetBase': 'home-cinema-v2',
        'title': 'All Destinations Drone Showcase 4K',
        'shots': [
            {'src': 'montage-nepal-27817152.mp4', 'start': 1.0, 'dur': 4.0, 'focusY': 0.5},
            {'src': 'montage-kashmir-33333520.mp4', 'start': 1.0, 'dur': 4.0, 'focusY': 0.5},
            {'src': 'dubai.mp4', 'start': 1.0, 'dur': 4.0, 'focusY': 0.5},
            {'src': 'montage-kerala-29041046.mp4', 'start': 1.0, 'dur': 4.0, 'focusY': 0.5},
        ]
    },
    {
        'id': 'dubai',
        'assetBase': 'dubai-cinema-v2',
        'title': 'Dubai Skyline & Dunes 4K',
        'shots': [
            {'src': 'dubai.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'montage-dubai-36432566.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'montage-dubai-30346373.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
        ]
    },
    {
        'id': 'kashmir',
        'assetBase': 'kashmir-cinema-v2',
        'title': 'Kashmir Alpine & Dal Lake 4K',
        'shots': [
            {'src': 'montage-kashmir-33333520.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'kashmir.mp4', 'start': 1.0, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'montage-kashmir-35417044.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
        ]
    },
    {
        'id': 'kerala',
        'assetBase': 'kerala-cinema-v2',
        'title': 'Kerala Coastline & Tea Hills 4K',
        'shots': [
            {'src': 'montage-kerala-29041046.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'montage-kerala-9117189.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'montage-kerala-35637701.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
        ]
    },
    {
        'id': 'nepal',
        'assetBase': 'nepal-cinema-v2',
        'title': 'Nepal Himalayas & Lakes 4K',
        'shots': [
            {'src': 'montage-nepal-32971668.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'montage-nepal-27817152.mp4', 'start': 1.0, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'montage-nepal-17437728.mp4', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
        ]
    },
    {
        'id': 'sikkim',
        'assetBase': 'sikkim-cinema-v2',
        'title': 'Sikkim Himalayan Ridges 4K',
        'shots': [
            {'src': 'montage-sikkim-samthar-plateau.webm', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'montage-sikkim-ghum-station.webm', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
            {'src': 'montage-sikkim-ahaldara.webm', 'start': 0.5, 'dur': 4.5, 'focusY': 0.5},
        ]
    }
]

def run(cmd):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *cmd], check=True)

def encode_plan(plan):
    base = plan['assetBase']
    print(f"\n=======================================================", flush=True)
    print(f"Encoding {plan['title']} ({base})...", flush=True)
    print(f"=======================================================", flush=True)
    plan_work = work_dir / base
    plan_work.mkdir(parents=True, exist_ok=True)
    
    # 1. First, encode the 4K intermediate segments
    seg_files = []
    for idx, s in enumerate(plan['shots']):
        src_path = media_dir / s['src']
        seg_out = plan_work / f"seg-{idx}-4k.mp4"
        seg_files.append(seg_out)
        vf = (
            f"scale=3840:2160:force_original_aspect_ratio=increase:flags=lanczos,"
            f"crop=3840:2160:(iw-ow)/2:(ih-oh)*{s.get('focusY', 0.5)},fps=30"
        )
        run([
            '-ss', str(s['start']),
            '-i', str(src_path),
            '-t', str(s['dur']),
            '-vf', vf,
            '-c:v', 'h264_nvenc',
            '-preset', 'p6',
            '-rc', 'vbr',
            '-cq', '20',
            '-b:v', '6M',
            '-maxrate', '8M',
            '-bufsize', '16M',
            '-pix_fmt', 'yuv420p',
            '-an',
            str(seg_out)
        ])
    
    # Concatenate 4K segments into master
    concat_txt = plan_work / 'concat.txt'
    concat_txt.write_text(''.join(f"file '{f.as_posix()}'\n" for f in seg_files), encoding='utf8')
    master_4k = plan_work / 'master-4k.mp4'
    run(['-f', 'concat', '-safe', '0', '-i', str(concat_txt), '-c', 'copy', '-movflags', '+faststart', str(master_4k)])
    print(f"  Master 4K assembled ({master_4k.stat().st_size / 1024 / 1024:.2f} MB)", flush=True)

    # 2. Generate 4K Ultra WebM (VP9) - fast, crisp, ~4.5 MB
    target_4k_webm = out_dir / f"{base}-4k.webm"
    run([
        '-i', str(master_4k),
        '-c:v', 'libvpx-vp9',
        '-b:v', '2200k',
        '-minrate', '1200k',
        '-maxrate', '3000k',
        '-crf', '34',
        '-deadline', 'realtime',
        '-cpu-used', '6',
        '-row-mt', '1',
        '-threads', '8',
        '-an',
        str(target_4k_webm)
    ])
    print(f"  --> {target_4k_webm.name}: {target_4k_webm.stat().st_size / 1024 / 1024:.2f} MB (4K WebM)", flush=True)

    # 3. Generate 4K Ultra MP4 (H.264) - ~5.0 MB
    target_4k_mp4 = out_dir / f"{base}-4k.mp4"
    run([
        '-i', str(master_4k),
        '-c:v', 'h264_nvenc',
        '-preset', 'p6',
        '-rc', 'vbr',
        '-cq', '26',
        '-b:v', '2500k',
        '-maxrate', '3200k',
        '-bufsize', '6400k',
        '-pix_fmt', 'yuv420p',
        '-an',
        '-movflags', '+faststart',
        str(target_4k_mp4)
    ])
    print(f"  --> {target_4k_mp4.name}: {target_4k_mp4.stat().st_size / 1024 / 1024:.2f} MB (4K MP4)", flush=True)

    # 4. Generate Desktop 1080p WebM & MP4 (Crisp Full HD, ~2.5-3.0 MB)
    target_desktop_webm = out_dir / f"{base}-desktop.webm"
    run([
        '-i', str(master_4k),
        '-vf', 'scale=1920:1080:flags=lanczos',
        '-c:v', 'libvpx-vp9',
        '-b:v', '1400k',
        '-minrate', '800k',
        '-maxrate', '1900k',
        '-crf', '32',
        '-deadline', 'realtime',
        '-cpu-used', '6',
        '-row-mt', '1',
        '-threads', '8',
        '-an',
        str(target_desktop_webm)
    ])
    target_desktop_mp4 = out_dir / f"{base}-desktop.mp4"
    run([
        '-i', str(master_4k),
        '-vf', 'scale=1920:1080:flags=lanczos',
        '-c:v', 'h264_nvenc',
        '-preset', 'p6',
        '-rc', 'vbr',
        '-cq', '24',
        '-b:v', '1600k',
        '-maxrate', '2200k',
        '-bufsize', '4400k',
        '-pix_fmt', 'yuv420p',
        '-an',
        '-movflags', '+faststart',
        str(target_desktop_mp4)
    ])
    print(f"  --> {target_desktop_mp4.name}: {target_desktop_mp4.stat().st_size / 1024 / 1024:.2f} MB (1080p MP4)", flush=True)
    print(f"  --> {target_desktop_webm.name}: {target_desktop_webm.stat().st_size / 1024 / 1024:.2f} MB (1080p WebM)", flush=True)

    # 5. Generate Balanced 720p HD (CRISP 1280x720, ~1.5 MB, replacing old 540p blur!)
    target_balanced_webm = out_dir / f"{base}-balanced.webm"
    run([
        '-i', str(master_4k),
        '-vf', 'scale=1280:720:flags=lanczos',
        '-c:v', 'libvpx-vp9',
        '-b:v', '850k',
        '-minrate', '500k',
        '-maxrate', '1200k',
        '-crf', '32',
        '-deadline', 'realtime',
        '-cpu-used', '6',
        '-row-mt', '1',
        '-threads', '8',
        '-an',
        str(target_balanced_webm)
    ])
    target_balanced_mp4 = out_dir / f"{base}-balanced.mp4"
    run([
        '-i', str(master_4k),
        '-vf', 'scale=1280:720:flags=lanczos',
        '-c:v', 'h264_nvenc',
        '-preset', 'p6',
        '-rc', 'vbr',
        '-cq', '26',
        '-b:v', '950k',
        '-maxrate', '1400k',
        '-bufsize', '2800k',
        '-pix_fmt', 'yuv420p',
        '-an',
        '-movflags', '+faststart',
        str(target_balanced_mp4)
    ])
    print(f"  --> {target_balanced_mp4.name}: {target_balanced_mp4.stat().st_size / 1024 / 1024:.2f} MB (720p HD Balanced MP4)", flush=True)
    print(f"  --> {target_balanced_webm.name}: {target_balanced_webm.stat().st_size / 1024 / 1024:.2f} MB (720p HD Balanced WebM)", flush=True)

    # 6. Generate Mobile Portrait (720x1280) WebM & MP4
    target_mobile_webm = out_dir / f"{base}-mobile.webm"
    run([
        '-i', str(master_4k),
        '-vf', 'scale=720:1280:force_original_aspect_ratio=increase:flags=lanczos,crop=720:1280,fps=30',
        '-c:v', 'libvpx-vp9',
        '-b:v', '850k',
        '-minrate', '500k',
        '-maxrate', '1200k',
        '-crf', '32',
        '-deadline', 'realtime',
        '-cpu-used', '6',
        '-row-mt', '1',
        '-threads', '8',
        '-an',
        str(target_mobile_webm)
    ])
    target_mobile_mp4 = out_dir / f"{base}-mobile.mp4"
    run([
        '-i', str(master_4k),
        '-vf', 'scale=720:1280:force_original_aspect_ratio=increase:flags=lanczos,crop=720:1280,fps=30',
        '-c:v', 'h264_nvenc',
        '-preset', 'p6',
        '-rc', 'vbr',
        '-cq', '25',
        '-b:v', '950k',
        '-maxrate', '1400k',
        '-bufsize', '2800k',
        '-pix_fmt', 'yuv420p',
        '-an',
        '-movflags', '+faststart',
        str(target_mobile_mp4)
    ])
    print(f"  --> {target_mobile_mp4.name}: {target_mobile_mp4.stat().st_size / 1024 / 1024:.2f} MB (Mobile Portrait MP4)", flush=True)

    # 7. Generate Mobile Lite (480x854) WebM & MP4 (< 800 KB for 2G / SaveData)
    target_lite_webm = out_dir / f"{base}-lite.webm"
    run([
        '-i', str(master_4k),
        '-vf', 'scale=480:854:force_original_aspect_ratio=increase:flags=lanczos,crop=480:854,fps=30',
        '-c:v', 'libvpx-vp9',
        '-b:v', '450k',
        '-minrate', '300k',
        '-maxrate', '650k',
        '-crf', '34',
        '-deadline', 'realtime',
        '-cpu-used', '6',
        '-row-mt', '1',
        '-threads', '8',
        '-an',
        str(target_lite_webm)
    ])
    target_lite_mp4 = out_dir / f"{base}-lite.mp4"
    run([
        '-i', str(master_4k),
        '-vf', 'scale=480:854:force_original_aspect_ratio=increase:flags=lanczos,crop=480:854,fps=30',
        '-c:v', 'h264_nvenc',
        '-preset', 'p6',
        '-rc', 'vbr',
        '-cq', '28',
        '-b:v', '500k',
        '-maxrate', '750k',
        '-bufsize', '1500k',
        '-pix_fmt', 'yuv420p',
        '-an',
        '-movflags', '+faststart',
        str(target_lite_mp4)
    ])
    print(f"  --> {target_lite_mp4.name}: {target_lite_mp4.stat().st_size / 1024 / 1024:.2f} MB (Lite MP4)", flush=True)

    # 8. High-Res 4K Poster WebP
    target_poster = out_dir / f"{base}-poster.webp"
    run([
        '-ss', '1.5',
        '-i', str(master_4k),
        '-frames:v', '1',
        '-vf', 'scale=3840:2160:flags=lanczos',
        '-quality', '90',
        str(target_poster)
    ])
    print(f"  --> {target_poster.name}: {target_poster.stat().st_size / 1024:.1f} KB (4K Poster)", flush=True)

if __name__ == '__main__':
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    t0 = time.time()
    for plan in CINEMA_PLANS:
        if only and plan['id'] not in only and plan['assetBase'] not in only:
            continue
        encode_plan(plan)
    print(f"\nAll video tiers successfully encoded in {time.time() - t0:.1f}s!")
