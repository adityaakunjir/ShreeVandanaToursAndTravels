"""Build review sheets from licensed Commons photographs; no automatic publishing."""
import json, urllib.request, urllib.parse, time, re, html
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

root = Path(__file__).resolve().parents[1]
cache = root.parent / 'media-sources/premium'
cache.mkdir(exist_ok=True)
queries = {
 'bali': 'Kelingking Beach aerial', 'dubai': 'Dubai skyline sunset',
 'kashmir': 'Dal Lake mountains', 'sikkim': 'Kangchenjunga Darjeeling panorama',
 'kerala': 'Munnar tea plantations aerial', 'nepal': 'Annapurna Pokhara landscape',
 'sri-lanka': 'Sigiriya rock aerial', 'egypt': 'Giza pyramids panorama',
 'andaman': 'Radhanagar Beach', 'goa': 'Palolem beach aerial',
 'lakshadweep': 'Bangaram island aerial', 'south-africa': 'Cape Town Table Mountain panorama',
 'nainital': 'Panorama Nainital town lake', 'vietnam': 'Ha Long Bay panorama',
 'baku': 'Baku skyline panorama', 'bhutan': 'Paro Taktsang monastery',
 'rajasthan': 'Hawa Mahal facade Jaipur', 'hyderabad': 'Charminar panorama',
 'kerala-backwaters': 'Kerala backwaters houseboat', 'singapore': 'Marina Bay Singapore skyline',
 'goa-coast': 'Palolem Beach Goa', 'islands': 'Lakshadweep lagoon',
 'dubai-blue': 'Dubai Marina blue hour', 'cape-town': 'Cape Town Table Mountain cityscape',
 'baku-night': 'Flame Towers Baku night', 'tamil-nadu': 'Meenakshi temple panorama',
 'gujarat': 'Rann Kutch white desert', 'karnataka': 'Murudeshwar temple aerial',
 'ladakh': 'Diskit monastery Nubra valley panorama', 'kerala-hills': 'Munnar tea gardens landscape',
 'mauritius-aerial': 'Le Morne Mauritius aerial', 'murudeshwar': 'Murudeshwar aerial',
 'goa-aerial': 'Goa beach aerial', 'kedarnath': 'Kedarnath temple mountain',
}
def request(url):
    for attempt in range(3):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'VandanaMediaCuration/1.0 (licensed travel photography research)'}),timeout=90).read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or attempt == 2: raise
            time.sleep(max(30, int(e.headers.get('Retry-After','30'))))

records = {}
for key, query in queries.items():
    metadata = cache / f'research-{key}.json'
    if not metadata.exists():
        params = {'action':'query','format':'json','generator':'search','gsrsearch':query+' filetype:bitmap','gsrnamespace':6,'gsrlimit':12,'prop':'imageinfo','iiprop':'url|size|extmetadata','iiurlwidth':600}
        metadata.write_bytes(request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))
        time.sleep(.5)
    pages = json.loads(metadata.read_text()).get('query',{}).get('pages',{}).values()
    candidates=[]
    for page in sorted(pages,key=lambda x:x.get('index',99)):
        if not page.get('imageinfo'): continue
        info=page['imageinfo'][0]; meta=info.get('extmetadata',{})
        license=meta.get('LicenseShortName',{}).get('value','')
        if info['width'] < 2000 or info['width']/info['height'] < 1.25 or not re.match(r'CC (BY|0)|Public domain',license): continue
        target=cache/f"candidate-{key}-{page['pageid']}.jpg"
        if not target.exists():
            try: target.write_bytes(request(info['thumburl'])); time.sleep(.3)
            except Exception as e: print(key,e,flush=True); continue
        candidates.append({'title':page['title'],'info':info,'preview':str(target),'license':license})
        if len(candidates)==6: break
    records[key]=candidates
    canvas=Image.new('RGB',(1200,max(1,(len(candidates)+2)//3)*230),'#101820')
    for i,c in enumerate(candidates):
        canvas.paste(ImageOps.fit(Image.open(c['preview']).convert('RGB'),(400,200)),((i%3)*400,(i//3)*230))
        ImageDraw.Draw(canvas).text(((i%3)*400+4,(i//3)*230+202),f"{i} {c['title'][5:48]}",fill='white')
    canvas.save(cache/f'review-{key}.jpg')
    (cache/'research-index.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf8')
    print(key,len(candidates),'review candidates',flush=True)
