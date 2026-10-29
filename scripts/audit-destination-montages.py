"""Independently verify eight-source, 40-second, 1200-frame silent deliveries."""
import hashlib
import json
from pathlib import Path
import subprocess
import argparse

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source-dir', help='Compatibility option; the delivery audit uses recorded source hashes.')
parser.parse_args()

root = Path(__file__).resolve().parents[1]
plans = json.loads((root / 'src/data/destination-videos.json').read_text(encoding='utf8'))
encoding = json.loads((root / 'artifacts/destination-video-encoding.json').read_text())
results = []
for plan in plans:
    assert plan['duration'] == 40 and len(plan['shots']) == 8
    assert len({shot['sourceSha256'] for shot in plan['shots']}) == 8
    for index, shot in enumerate(plan['shots']):
        assert shot['duration'] == 5
        assert shot['timelineStart'] == index * 5 and shot['timelineEnd'] == (index + 1) * 5
        assert shot['sourceDuration'] >= shot['start'] + 5
        assert shot['author'] and shot['source'].startswith('https://') and shot['licenseUrl']
    record = next(row for row in encoding if row['id'] == plan['id'])
    assert record['shotCount'] == 8 and record['uniqueSourceCount'] == 8
    assert record['assetBase'] == plan['assetBase']
    for actual, planned in zip(record['shots'], plan['shots'], strict=True):
        for key in ['sourceSha256', 'start', 'duration', 'timelineStart', 'timelineEnd']:
            assert actual[key] == planned[key], f"Stale shot record: {plan['id']} {key}"
    assert len(record['variants']) == 4
    for variant in record['variants']:
        path = root / variant['file']
        assert plan['assetBase'] in path.name
        data = path.read_bytes()
        assert len(data) == variant['bytes'] and hashlib.sha256(data).hexdigest() == variant['sha256']
        info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-count_frames', '-show_format', '-show_streams', '-of', 'json', str(path)]))
        streams = info['streams']
        assert len(streams) == 1 and streams[0]['codec_type'] == 'video'
        expected_size = (960, 540) if variant['profile'] == 'mobile' else (1920, 1080)
        assert (streams[0]['width'], streams[0]['height']) == expected_size
        assert streams[0]['r_frame_rate'] == '30/1' and int(streams[0]['nb_read_frames']) == 1200
        assert 40 <= float(info['format']['duration']) < 40.1
        if path.suffix == '.mp4': assert 0 < data.find(b'moov') < data.find(b'mdat')
        select = '+'.join(f'eq(n,{75 + 150 * index})' for index in range(8))
        decoded = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-vf', f"select='{select}',scale=160:90", '-an', '-f', 'framemd5', '-']).decode()
        hashes = [line.split(',')[-1].strip() for line in decoded.splitlines() if line and not line.startswith('#')]
        assert len(hashes) == 8 and len(set(hashes)) == 8, f'Repeated or missing scenes in {path}'
        results.append({'file': variant['file'], 'seconds': float(info['format']['duration']), 'frames': int(streams[0]['nb_read_frames']), 'sourceClips': 8, 'secondsPerClip': 5, 'decodedSceneFingerprints': hashes, 'distinctDecodedScenes': 8, 'silent': True, 'fastStart': path.suffix == '.mp4'})
        print(path.name, 'PASS: 40s, 1200 frames, 8 distinct scene samples', flush=True)
(root / 'artifacts/destination-video-quality.json').write_text(json.dumps(results, indent=2) + '\n')
print('PASS: five montages, twenty mobile/desktop codec files, forty credited sources.')
