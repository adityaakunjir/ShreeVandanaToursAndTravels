"""Download verified public stock sources outside the repository and record rights."""
import concurrent.futures
import hashlib
import html
import json
from pathlib import Path
import re
import subprocess
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

root = Path(__file__).resolve().parents[1]
directory = root.parent / 'media-sources'
directory.mkdir(exist_ok=True)
seeds = json.loads((root / 'src/data/video-montage-sources.json').read_text())
agent = {'User-Agent': 'VandanaMediaResearch/1.0'}
commons_lock = threading.Lock()
cached = {}
for cached_path in [directory / 'montage-commons-research.json', *directory.glob('*metadata.json')]:
    for page in json.loads(cached_path.read_text(encoding='utf8')).get('query', {}).get('pages', {}).values():
        if page.get('imageinfo'): cached[page['title']] = page['imageinfo'][0]

def open_source(request):
    for attempt in range(3):
        try:
            return urllib.request.urlopen(request, timeout=120)
        except urllib.error.HTTPError as error:
            if error.code != 429 or attempt == 2: raise
            pause = max(30, int(error.headers.get('Retry-After', '30')))
            print('Rate limited; respecting', pause, 'second cooldown', flush=True)
            time.sleep(pause)

def prepare(pair):
    place, seed = pair
    record = dict(seed)
    if 'title' in seed:
        query = {'action': 'query', 'format': 'json', 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'titles': seed['title']}
        request = urllib.request.Request('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(query), headers=agent)
        if seed['title'] in cached:
            info = cached[seed['title']]
        else:
            with commons_lock:
                with open_source(request) as response: data = json.load(response)
                time.sleep(1)
            info = next(iter(data['query']['pages'].values()))['imageinfo'][0]
            (directory / f"{seed['id']}-metadata.json").write_text(json.dumps(data), encoding='utf8')
        meta = info['extmetadata']
        record.update(source=info['descriptionurl'], downloadUrl=info['url'], author=html.unescape(re.sub('<[^>]+>', '', meta['Artist']['value'])), license=meta['LicenseShortName']['value'], licenseUrl=meta['LicenseUrl']['value'])
        assert record['license'] in ['CC BY 3.0', 'CC BY 4.0', 'CC BY-SA 4.0'], record
    else:
        record.update(downloadUrl=f"https://www.pexels.com/download/video/{seed['id']}/", license='Pexels License', licenseUrl='https://www.pexels.com/license/')
    name = seed.get('existingFile') or f"montage-{place}-{seed['id']}.{'webm' if 'title' in seed else 'mp4'}"
    path = directory / name
    if not path.exists():
        request = urllib.request.Request(record['downloadUrl'], headers=agent)
        lock = commons_lock if 'title' in seed else threading.Lock()
        with lock, open_source(request) as response:
            assert response.headers.get_content_type().startswith('video/'), response.headers
            record['downloadUrl'] = response.geturl()
            temporary = path.with_suffix(path.suffix + '.partial')
            with temporary.open('wb') as output:
                while chunk := response.read(1024 * 1024):
                    output.write(chunk)
            temporary.replace(path)
    else:
        # Preserve the already recorded CDN URL for original four clips.
        old = json.loads((root / 'src/data/destination-videos.json').read_text())
        match = next((x for x in old if x.get('sourceFile') == name), None)
        if match: record['downloadUrl'] = match['downloadUrl']
    probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(path)]))
    video = next(stream for stream in probe['streams'] if stream['codec_type'] == 'video')
    record.update(sourceFile=name, sourceBytes=path.stat().st_size, sourceSha256=hashlib.sha256(path.read_bytes()).hexdigest(), sourceWidth=video['width'], sourceHeight=video['height'], sourceDuration=float(probe['format']['duration']), start=seed.get('start', .5), duration=5, checked='2026-10-29')
    assert record['sourceDuration'] >= record['start'] + 5, f"Too short: {place} {seed['id']} {record['sourceDuration']}"
    print(place, seed['id'], video['width'], video['height'], round(record['sourceDuration'], 2), flush=True)
    return place, record

items = [(place, seed) for place, rows in seeds.items() for seed in rows]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    prepared = list(executor.map(prepare, items))
result = {place: [row for p, row in prepared if p == place] for place in seeds}
(root / 'artifacts/montage-source-records.json').write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf8')
print('Prepared', len(prepared), 'distinct licensed source clips.')
