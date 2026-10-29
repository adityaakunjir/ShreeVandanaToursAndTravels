"""Encode licensed, locally downloaded originals. Requires FFmpeg and FFprobe.
Usage: python scripts/encode-destination-videos.py --source-dir PATH
Originals stay outside Git; output variants and technical audit are reproducible.
"""
import argparse
import concurrent.futures
import hashlib
import json
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--source-dir', type=Path, required=True)
parser.add_argument('--only', nargs='*')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
clips = json.loads((root / 'src/data/destination-videos.json').read_text(encoding='utf8'))
if args.only:
    clips = [clip for clip in clips if clip['id'] in args.only]
output = root / 'public/assets/videos'
output.mkdir(parents=True, exist_ok=True)

def probe(path):
    return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(path)]))

def encode(clip):
    source = args.source_dir / clip['sourceFile']
    info = probe(source)
    original = next(s for s in info['streams'] if s['codec_type'] == 'video')
    results = []
    for variant, landscape, portrait in [('mobile', 960, 720), ('desktop', 1920, 1080)]:
        width = min(original['width'], portrait if original['height'] > original['width'] else landscape)
        crop = f"crop={clip['crop']}," if clip.get('crop') else ''
        filters = crop + f'scale={width}:-2:flags=lanczos,fps=30,setsar=1'
        for extension in ['mp4', 'webm']:
            target = output / f"{clip['id']}-{variant}.{extension}"
            common = ['ffmpeg', '-v', 'error', '-y', '-ss', str(clip['start']), '-i', str(source), '-t', str(clip['duration']), '-map', '0:v:0', '-an', '-sn', '-map_metadata', '-1', '-vf', filters, '-pix_fmt', 'yuv420p', '-threads', '2']
            webm_crf = ('34' if variant == 'mobile' else '32') if clip['id'] == 'sikkim' else ('37' if variant == 'mobile' else '35')
            codec = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '26' if variant == 'mobile' else '25', '-movflags', '+faststart'] if extension == 'mp4' else ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', webm_crf, '-deadline', 'good', '-cpu-used', '3', '-row-mt', '1']
            subprocess.run(common + codec + [str(target)], check=True)
            encoded = probe(target)
            stream = encoded['streams'][0]
            results.append({'file': target.relative_to(root).as_posix(), 'bytes': target.stat().st_size, 'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'width': stream['width'], 'height': stream['height'], 'duration': float(encoded['format']['duration']), 'codec': stream['codec_name'], 'audioStreams': sum(s['codec_type'] == 'audio' for s in encoded['streams'])})
        print(clip['id'], variant, 'encoded', flush=True)
    # Poster is an honest still from the same footage; no upscaling.
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(clip['start']), '-i', str(source), '-frames:v', '1', '-vf', crop + f"scale={min(original['width'], 1400)}:-2:flags=lanczos", '-quality', '85', str(output / f"{clip['id']}-poster.webp")], check=True)
    return {'id': clip['id'], 'sourceBytes': source.stat().st_size, 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'sourceWidth': original['width'], 'sourceHeight': original['height'], 'sourceDuration': float(info['format']['duration']), 'variants': results}

with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
    report = list(executor.map(encode, clips))
if args.only:
    previous = json.loads((root / 'artifacts/destination-video-encoding.json').read_text())
    report = [row for row in previous if row['id'] not in args.only] + report
(root / 'artifacts/destination-video-encoding.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf8')
print('Encoded', len(report), 'location clips; no originals added to the repository.')
