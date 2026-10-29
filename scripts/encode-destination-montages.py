"""Encode eight five-second source scenes and concatenate to exact 40s montages."""
import argparse
import concurrent.futures
import hashlib
import json
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--source-dir', type=Path, required=True)
parser.add_argument('--only', nargs='*')
parser.add_argument('--resume', action='store_true', help='Reuse intermediate shots with matching recorded source/edit settings')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
plans = json.loads((root / 'src/data/destination-videos.json').read_text(encoding='utf8'))
if args.only: plans = [plan for plan in plans if plan['id'] in args.only]
output = root / 'public/assets/videos'
work = args.source_dir / 'montage-work'
output.mkdir(parents=True, exist_ok=True)
previous_path = root / 'artifacts/destination-video-encoding.json'
previous = json.loads(previous_path.read_text()) if previous_path.exists() else []

def run(command):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *command], check=True)

def probe(path):
    return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-count_frames', '-show_format', '-show_streams', '-of', 'json', str(path)]))

def encode(plan):
    assert len(plan['shots']) == 8
    records = []
    prior = next((row for row in previous if row['id'] == plan['id'] and row.get('assetBase') == plan['assetBase']), {})
    for profile, width, height in [('mobile', 960, 540), ('desktop', 1920, 1080)]:
        parts = work / plan['assetBase'] / profile
        parts.mkdir(parents=True, exist_ok=True)
        for number, shot in enumerate(plan['shots'], 1):
            target = parts / f'shot-{number:02}.mp4'
            source = args.source_dir / shot['sourceFile']
            # Uniform frames and timebase make concatenation exact and keep
            # portrait originals proportional; focusY controls the crop.
            filters = f"scale={width}:{height}:force_original_aspect_ratio=increase:flags=lanczos,crop={width}:{height}:(iw-ow)/2:(ih-oh)*{shot['focusY']},fps=30,setsar=1,setpts=PTS-STARTPTS"
            old_shot = prior.get('shots', [])[number - 1] if len(prior.get('shots', [])) == 8 else {}
            reusable = args.resume and target.exists() and all(old_shot.get(key) == shot[key] for key in ['sourceSha256', 'start', 'duration']) and old_shot.get('focusY', .5) == shot['focusY']
            if reusable:
                cached_info = probe(target)
                stream = cached_info['streams'][0]
                reusable = stream['width'] == width and stream['height'] == height and int(stream['nb_read_frames']) == 150
            if not reusable:
                run(['-threads', '2', '-ss', str(shot['start']), '-i', str(source), '-map', '0:v:0', '-an', '-sn', '-frames:v', '150', '-vf', filters,
                     '-c:v', 'libx264', '-preset', 'medium', '-crf', '27' if profile == 'mobile' else '25', '-pix_fmt', 'yuv420p', '-g', '150', '-keyint_min', '150', '-sc_threshold', '0', '-video_track_timescale', '90000', '-threads', '2', '-map_metadata', '-1', str(target)])
            if profile == 'mobile':
                run(['-ss', '2.5', '-i', str(target), '-frames:v', '1', '-vf', 'scale=480:270', str(parts / f'review-{number:02}.jpg')])
            print(plan['id'], profile, f'{number}/8', flush=True)
        listing = parts / 'concat.txt'
        listing.write_text(''.join(f"file '{(parts / f'shot-{n:02}.mp4').as_posix()}'\n" for n in range(1, 9)), encoding='utf8')
        mp4 = output / f"{plan['assetBase']}-{profile}.mp4"
        run(['-f', 'concat', '-safe', '0', '-i', str(listing), '-c', 'copy', '-an', '-movflags', '+faststart', str(mp4)])
        webm = output / f"{plan['assetBase']}-{profile}.webm"
        run(['-i', str(mp4), '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '37' if profile == 'mobile' else '35', '-deadline', 'good', '-cpu-used', '5', '-row-mt', '1', '-threads', '2', '-pix_fmt', 'yuv420p', '-map_metadata', '-1', str(webm)])
        for target in [mp4, webm]:
            info = probe(target)
            stream = next(s for s in info['streams'] if s['codec_type'] == 'video')
            assert int(stream['nb_read_frames']) == 1200, target
            assert abs(float(info['format']['duration']) - 40) < .1, target
            assert not any(s['codec_type'] == 'audio' for s in info['streams'])
            records.append({'file': target.relative_to(root).as_posix(), 'profile': profile, 'bytes': target.stat().st_size, 'sha256': hashlib.sha256(target.read_bytes()).hexdigest(), 'width': stream['width'], 'height': stream['height'], 'frames': int(stream['nb_read_frames']), 'duration': float(info['format']['duration']), 'codec': stream['codec_name'], 'audioStreams': 0})
        if profile == 'mobile':
            run(['-framerate', '1', '-start_number', '1', '-i', str(parts / 'review-%02d.jpg'), '-vf', 'tile=4x2', '-frames:v', '1', str(root / f"artifacts/montage-review-{plan['id']}.jpg")])
        print(plan['id'], profile, '40-second montage complete', flush=True)
    run(['-ss', '1', '-i', str(output / f"{plan['assetBase']}-desktop.mp4"), '-frames:v', '1', '-vf', 'scale=1400:-2', '-quality', '85', str(output / f"{plan['assetBase']}-poster.webp")])
    return {'id': plan['id'], 'assetBase': plan['assetBase'], 'shotCount': 8, 'secondsPerShot': 5, 'uniqueSourceCount': len({s['sourceSha256'] for s in plan['shots']}), 'shots': [{key: shot[key] for key in ['id', 'sourceFile', 'sourceSha256', 'start', 'duration', 'focusY', 'timelineStart', 'timelineEnd', 'author', 'license']} for shot in plan['shots']], 'variants': records}

with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
    results = list(executor.map(encode, plans))
report_path = root / 'artifacts/destination-video-encoding.json'
if args.only:
    old = json.loads(report_path.read_text())
    results = [row for row in old if row['id'] not in args.only] + results
report_path.write_text(json.dumps(results, indent=2) + '\n', encoding='utf8')
print('Complete: eight five-second source clips in every 40-second delivery.')
