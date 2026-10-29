"""Generate the public, attributed eight-shot plan from verified download records."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
records = json.loads((root / 'artifacts/montage-source-records.json').read_text(encoding='utf8'))
clips = json.loads((root / 'src/data/destination-videos.json').read_text(encoding='utf8'))
labels = {
    'nepal': 'Nepal lakes, mountains and heritage',
    'dubai': 'Dubai skyline, marina and desert',
    'kerala': 'Kerala hills, backwaters and coast',
    'kashmir': 'Kashmir lakes, valleys and snow',
    'sikkim': 'Sikkim–Darjeeling mountains and heritage',
}
for clip in clips:
    shots = records[clip['id']]
    assert len(shots) == 8 and len({shot['id'] for shot in shots}) == 8
    for index, shot in enumerate(shots):
        assert shot['duration'] == 5 and shot['start'] + 5 <= shot['sourceDuration']
        shot['timelineStart'] = index * 5
        shot['timelineEnd'] = (index + 1) * 5
        shot['focusY'] = .3 if shot['id'] in ['tsongmo-lake', '38704850', '27817152'] else .5
        if shot['id'] == 'enchey-flags': shot['focusY'] = 0
    clip.update(label=labels[clip['id']], assetBase=clip['id'] + '-montage-v1', duration=40,
                author='Multiple creators — individual credits below', source=shots[0]['source'],
                sourceFile=shots[0]['sourceFile'], downloadUrl=shots[0]['downloadUrl'], start=0,
                shots=shots)
    clip.pop('crop', None)
(root / 'src/data/destination-videos.json').write_text(json.dumps(clips, ensure_ascii=False, indent=2) + '\n', encoding='utf8')
print('Five plans, each eight distinct source clips × five seconds = 40 seconds.')
