"""Technical and sampled visual-fidelity checks against the resized originals."""
import argparse
import json
from pathlib import Path
import re
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--source-dir', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
clips = json.loads((root / 'src/data/destination-videos.json').read_text())
encoding = json.loads((root / 'artifacts/destination-video-encoding.json').read_text())
quality = []
for clip in clips:
    record = next(row for row in encoding if row['id'] == clip['id'])
    for variant in record['variants']:
        assert variant['audioStreams'] == 0
        assert abs(variant['duration'] - clip['duration']) < .1
        path = root / variant['file']
        assert path.stat().st_size == variant['bytes']
        if path.suffix == '.mp4':
            data = path.read_bytes()
            assert 0 < data.find(b'moov') < data.find(b'mdat'), 'MP4 metadata must precede media'
        # Compare a two-second sample at its delivered resolution, not to 4K.
        crop = f"crop={clip['crop']}," if clip.get('crop') else ''
        # Align by frame ordinal: WebM's millisecond clock otherwise mismatches
        # neighbouring frames against MP4/FFmpeg's finer 30fps timebase.
        filters = f"[0:v]{crop}scale={variant['width']}:{variant['height']}:flags=lanczos,fps=30,setsar=1,settb=AVTB,setpts=N/(30*TB)[ref];[1:v]settb=AVTB,setpts=N/(30*TB)[dist];[dist][ref]ssim"
        result = subprocess.run(['ffmpeg', '-hide_banner', '-ss', str(clip['start']), '-i', str(args.source_dir / clip['sourceFile']), '-i', str(path), '-filter_complex', filters, '-t', '2', '-an', '-f', 'null', '-'], capture_output=True, text=True, check=True)
        score = float(re.findall(r'All:([0-9.]+)', result.stderr)[-1])
        quality.append({'file': variant['file'], 'sampleSeconds': 2, 'ssimAgainstResizedOriginal': score})
        print(path.name, 'SSIM', score, flush=True)
    source = args.source_dir / clip['sourceFile']
    target = root / f"artifacts/video-frames-{clip['id']}.jpg"
    frames = [30, int(clip['duration'] * 15), int((clip['duration'] - 1) * 30)]
    select = '+'.join(f'eq(n,{frame})' for frame in frames)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(root / f"public/assets/videos/{clip['id']}-desktop.mp4"), '-vf', f"select='{select}',scale=480:-2,tile=3x1", '-frames:v', '1', str(target)], check=True)
(root / 'artifacts/destination-video-quality.json').write_text(json.dumps(quality, indent=2) + '\n')
print('All 20 variants are silent and match their configured duration; MP4 fast-start verified.')
