"""Generate ultra-crisp, high-definition drone videos for destinations and home showreel."""
import json
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
media_dir = root.parent / 'media-sources'
output_dir = root / 'public/assets/videos'
output_dir.mkdir(parents=True, exist_ok=True)

# Sources with timestamps:
# 1. Kerala: Munnar hills (aerial drone)
# 2. Kashmir: Dal Lake & snow mountains (4K drone)
# 3. Dubai: Dubai Marina & skyline (4K drone)
# 4. Nepal: Annapurna Himalayas / Pokhara lake
# 5. Sikkim: Himalayan peaks and valleys

CLIPS = [
    {
        'id': 'kerala',
        'name': 'Kerala',
        'subtitle': 'Lush tea hills & tranquil backwaters',
        'file': 'kerala.mp4',
        'start': 1.0,
        'duration': 8.0,
        'crop': 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080'
    },
    {
        'id': 'kashmir',
        'name': 'Kashmir',
        'subtitle': 'Dal Lake, alpine valleys & snow peaks',
        'file': 'kashmir.mp4',
        'start': 0.5,
        'duration': 8.0,
        'crop': 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080'
    },
    {
        'id': 'dubai',
        'name': 'Dubai',
        'subtitle': 'Futuristic skyline & golden desert dunes',
        'file': 'dubai.mp4',
        'start': 1.0,
        'duration': 8.0,
        'crop': 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080'
    },
    {
        'id': 'nepal',
        'name': 'Nepal',
        'subtitle': 'Phewa Lake & Annapurna mountain ranges',
        'file': 'nepal.mp4',
        'start': 0.5,
        'duration': 8.0,
        'crop': 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080'
    },
    {
        'id': 'sikkim',
        'name': 'Sikkim–Darjeeling',
        'subtitle': 'Himalayan ridges & serene mountain plateaus',
        'file': 'montage-sikkim-samthar-plateau.webm',
        'start': 0.0,
        'duration': 8.0,
        'crop': 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080'
    }
]

def run(cmd):
    print("Running:", " ".join(str(c) for c in cmd[:6]))
    subprocess.run(['ffmpeg', '-y', '-v', 'error', *cmd], check=True)

print("Encoding destination drone clips and master home showreel...")

work_dir = root / 'artifacts/drone-work'
work_dir.mkdir(parents=True, exist_ok=True)

# 1. Encode each destination's standalone drone clip with high visual clarity (CRF 19)
for clip in CLIPS:
    cid = clip['id']
    src = media_dir / clip['file']
    print(f"Encoding {cid} drone clip...")
    
    # Desktop 1920x1080 high-bitrate (crisp, not blurry!)
    out_mp4 = output_dir / f"{cid}-montage-v1-desktop.mp4"
    vf = f"{clip['crop']},fps=30"
    run([
        '-ss', str(clip['start']),
        '-i', str(src),
        '-t', str(clip['duration']),
        '-vf', vf,
        '-c:v', 'libx264',
        '-crf', '19',
        '-preset', 'slow',
        '-tune', 'film',
        '-pix_fmt', 'yuv420p',
        '-an',
        '-movflags', '+faststart',
        str(out_mp4)
    ])
    
    # Desktop WebM
    out_webm = output_dir / f"{cid}-montage-v1-desktop.webm"
    run([
        '-i', str(out_mp4),
        '-c:v', 'libvpx-vp9',
        '-b:v', '0',
        '-crf', '26',
        '-cpu-used', '4',
        '-an',
        str(out_webm)
    ])
    
    # Mobile 1280x720 (crisp high-def for mobile, 720p instead of 540p!)
    out_mobile_mp4 = output_dir / f"{cid}-montage-v1-mobile.mp4"
    run([
        '-i', str(out_mp4),
        '-vf', 'scale=1280:720:flags=lanczos',
        '-c:v', 'libx264',
        '-crf', '21',
        '-preset', 'medium',
        '-pix_fmt', 'yuv420p',
        '-an',
        '-movflags', '+faststart',
        str(out_mobile_mp4)
    ])
    
    out_mobile_webm = output_dir / f"{cid}-montage-v1-mobile.webm"
    run([
        '-i', str(out_mobile_mp4),
        '-c:v', 'libvpx-vp9',
        '-b:v', '0',
        '-crf', '28',
        '-cpu-used', '4',
        '-an',
        str(out_mobile_webm)
    ])
    
    # Poster
    out_poster = output_dir / f"{cid}-montage-v1-poster.webp"
    run([
        '-ss', '1',
        '-i', str(out_mp4),
        '-frames:v', '1',
        '-vf', 'scale=1920:1080',
        '-quality', '90',
        str(out_poster)
    ])

# 2. Build the master Home Screen Drone Showreel:
# Concatenates Kerala -> Kashmir -> Dubai -> Nepal -> Sikkim (each 6s, total 30s)
print("Building master Home Screen Drone Showreel...")
showreel_segments = []
for i, clip in enumerate(CLIPS):
    seg_mp4 = work_dir / f"showreel-seg-{i}.mp4"
    src = media_dir / clip['file']
    vf = f"{clip['crop']},fps=30"
    run([
        '-ss', str(clip['start']),
        '-i', str(src),
        '-t', '6',
        '-vf', vf,
        '-c:v', 'libx264',
        '-crf', '19',
        '-preset', 'fast',
        '-pix_fmt', 'yuv420p',
        '-an',
        str(seg_mp4)
    ])
    showreel_segments.append(seg_mp4)

concat_file = work_dir / 'concat.txt'
concat_file.write_text('\n'.join(f"file '{p.as_posix()}'" for p in showreel_segments) + '\n', encoding='utf8')

home_mp4 = output_dir / 'home-destinations-drone-desktop.mp4'
run([
    '-f', 'concat',
    '-safe', '0',
    '-i', str(concat_file),
    '-c', 'copy',
    '-movflags', '+faststart',
    str(home_mp4)
])

home_webm = output_dir / 'home-destinations-drone-desktop.webm'
run([
    '-i', str(home_mp4),
    '-c:v', 'libvpx-vp9',
    '-b:v', '0',
    '-crf', '26',
    '-cpu-used', '4',
    '-an',
    str(home_webm)
])

home_mobile_mp4 = output_dir / 'home-destinations-drone-mobile.mp4'
run([
    '-i', str(home_mp4),
    '-vf', 'scale=1280:720:flags=lanczos',
    '-c:v', 'libx264',
    '-crf', '21',
    '-preset', 'medium',
    '-pix_fmt', 'yuv420p',
    '-an',
    '-movflags', '+faststart',
    str(home_mobile_mp4)
])

home_mobile_webm = output_dir / 'home-destinations-drone-mobile.webm'
run([
    '-i', str(home_mobile_mp4),
    '-c:v', 'libvpx-vp9',
    '-b:v', '0',
    '-crf', '28',
    '-cpu-used', '4',
    '-an',
    str(home_mobile_webm)
])

home_poster = output_dir / 'home-destinations-drone-poster.webp'
run([
    '-ss', '1',
    '-i', str(home_mp4),
    '-frames:v', '1',
    '-vf', 'scale=1920:1080',
    '-quality', '90',
    str(home_poster)
])

print("All destination clips and home showreel encoded successfully at crisp 1080p/CRF 19!")

