"""Publish manually selected photographs and verify existing Commons attributions."""
import json, urllib.request, urllib.parse, urllib.error, time, re, html, hashlib, argparse, subprocess
from pathlib import Path
from PIL import Image, ImageOps

root=Path(__file__).resolve().parents[1]
cache=root.parent/'media-sources/premium'
research=json.loads((cache/'research-index.json').read_text(encoding='utf8'))
photos=json.loads((root/'src/data/tour-photos.json').read_text(encoding='utf8'))
parser=argparse.ArgumentParser(); parser.add_argument('--only',nargs='*'); args=parser.parse_args()
selections={
 'bali-indonesia-7-days':('bali',1,'The limestone headland and turquoise water at Kelingking Beach, Nusa Penida, Bali'),
 'kashmir-amritsar-vaishno-devi':('kashmir',0,'Shikaras on Dal Lake beneath snow-covered mountains, Srinagar'),
 'darjeeling-gangtok-pelling':('sikkim',0,'Golden first light on Kangchenjunga viewed from Darjeeling'),
 'nepal':('nepal',1,'Aerial view of Pokhara, Phewa Lake and the Annapurna range above the clouds'),
 'kerala-kanyakumari':('kerala-hills',1,'Sunrise over the tea plantations and mountain slopes of Munnar, Kerala'),
 'kerala-6-days':('kerala-hills',1,'Sunrise over the tea plantations and mountain slopes of Munnar, Kerala'),
 'sri-lanka':('sri-lanka',0,'Aerial view of Sigiriya Lion Rock rising above the forest in Sri Lanka'),
 'egypt-hurghada':('egypt',2,'The Great Sphinx and pyramids on the Giza plateau, Egypt'),
 'royal-bhutan':('bhutan',0,'Paro Taktsang monastery perched on a cliff in Bhutan'),
 'lakshadweep-6-days':('islands',2,'White sand, palms and clear lagoon water at Agatti, Lakshadweep'),
 'south-africa-8-days':('cape-town',0,'Golden light on Table Mountain above Cape Town, South Africa'),
 'nainital-kausani-jim-corbett-8-days':('nainital',0,'Drone panorama of Naini Lake and the surrounding hill town of Nainital'),
 'singapore-malaysia-6-days':('singapore',4,'Marina Bay and the Singapore skyline illuminated at blue hour'),
 'thailand-malaysia-singapore-8-days':('singapore',0,'Marina Bay waterfront and Singapore skyline at dusk'),
 'full-rajasthan-12-days':('rajasthan',1,'The pink sandstone facade of Hawa Mahal in Jaipur, Rajasthan'),
 'hyderabad-srisailam-5-days':('hyderabad',0,'The four minarets of Charminar above the old city of Hyderabad'),
 'tamil-nadu-8-days':('tamil-nadu',0,'Aerial view of the Meenakshi temple complex and Madurai, Tamil Nadu'),
 'gujarat-8-days':('gujarat',1,'White salt flats beside a curving road in the Rann of Kutch, Gujarat'),
 'goa-5-days':('goa-coast',2,'Golden sand and clear water along Palolem Beach, Goa'),
 'mauritius-honeymoon-package-6-days':('mauritius-aerial',5,'Aerial view of Le Morne peninsula, its forest and turquoise lagoon in Mauritius'),
 'char-dham-yatra-13-days':('kedarnath',3,'Kedarnath temple beneath the snow-covered Himalayan mountains'),
 'andaman-with-baratang-island-7-days':('andaman',1,'Evening light across the quiet shoreline of Radhanagar Beach, Havelock Island, Andaman'),
 'vietnam-7-days':('vietnam',0,'Limestone islands and boats seen from above Ha Long Bay, Vietnam'),
 'baku-azerbaijan-5-days':('baku-night',1,'The illuminated Flame Towers and city architecture of Baku at night'),
}
def request(url):
    for attempt in range(3):
        try: return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'VandanaMediaCuration/1.0 (travel image licensing and attribution)'}),timeout=120).read()
        except urllib.error.HTTPError as e:
            if e.code!=429 or attempt==2: raise
            time.sleep(max(30,int(e.headers.get('Retry-After','30'))))
def plain(s): return html.unescape(re.sub('<[^>]+>',' ',s)).strip()
report_path=root/'artifacts/premium-photo-import.json'
results=[r for r in json.loads(report_path.read_text()) if r['slug'] not in args.only] if args.only and report_path.exists() else []
if not args.only or 'dubai-abu-dhabi' in args.only:
    photo=next(p for p in photos if p['slug']=='dubai-abu-dhabi')
    source=root.parent/'media-sources/dubai.mp4'
    target=root/'public/assets/images/tours/dubai-abu-dhabi-premium-v2.webp'
    subprocess.run(['ffmpeg','-v','error','-y','-ss','3','-i',str(source),'-frames:v','1','-vf','scale=2560:-2','-quality','86',str(target)],check=True)
    image=Image.open(target)
    photo.update(src='/assets/images/tours/dubai-abu-dhabi-premium-v2.webp',width=image.width,height=image.height,alt='Aerial view of Downtown Dubai skyscrapers and the Burj Khalifa',author='Nelemson G',license='Pexels License',licenseUrl='https://www.pexels.com/license/',source='https://www.pexels.com/video/stunning-dubai-skyline-aerial-view-31257785/',changes='Still frame extracted from licensed aerial footage, resized to WebP.',checked='2026-11-03')
    results.append(dict(slug=photo['slug'],status='upgraded',selected=True,source=photo['source'],bytes=target.stat().st_size,sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest()))
for photo in photos:
    slug=photo['slug']
    if slug=='dubai-abu-dhabi': continue
    if args.only and slug not in args.only: continue
    try:
        if slug in selections:
            key,index,alt=selections[slug]; candidate=research[key][index]; title=candidate['title']
            info=candidate['info']; photo['alt']=alt
        else:
            title=urllib.parse.unquote(photo['source'].split('/wiki/')[-1]).replace('_',' ')
            meta=cache/f"verified-{slug}.json"
            if not meta.exists():
                params={'action':'query','format':'json','titles':title,'prop':'imageinfo','iiprop':'url|size|extmetadata','iiurlwidth':2560}
                meta.write_bytes(request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))
            page=next(iter(json.loads(meta.read_text()).get('query',{}).get('pages',{}).values()))
            info=page['imageinfo'][0]
        # Request the provider's generated image URL at sufficient display resolution.
        if slug in selections:
            meta=cache/f"selected-{slug}.json"
            if not meta.exists():
                params={'action':'query','format':'json','titles':title,'prop':'imageinfo','iiprop':'url|size|extmetadata','iiurlwidth':2560}
                meta.write_bytes(request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))
            info=next(iter(json.loads(meta.read_text())['query']['pages'].values()))['imageinfo'][0]
        metadata=info['extmetadata']; license=metadata['LicenseShortName']['value']
        assert re.match(r'CC (BY|0)|Public domain',license), license
        # Wikimedia explicitly recommends its standard thumbnail sizes; avoid
        # original/unscaled download URLs when a thumbnail is available.
        if 'thumbnail_unscaled' in info.get('thumburl',''):
            params={'action':'query','format':'json','titles':title,'prop':'imageinfo','iiprop':'url|size|extmetadata','iiurlwidth':1920}
            info=next(iter(json.loads(request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))['query']['pages'].values()))['imageinfo'][0]
        original=cache/f"master-{slug}.jpg"
        if original.exists() and photo['source'] != info['descriptionurl']:
            original=cache/f"master-{slug}-{hashlib.sha256(info['descriptionurl'].encode()).hexdigest()[:8]}.jpg"
        if not original.exists():
            original.write_bytes(request(info.get('thumburl',info['url'])))
            time.sleep(.3)
        image=ImageOps.exif_transpose(Image.open(original)).convert('RGB')
        image.thumbnail((2560,2560),Image.Resampling.LANCZOS)
        src=f'/assets/images/tours/{slug}-premium-v2.webp'; target=root/('public'+src)
        image.save(target,'WEBP',quality=86,method=6)
        photo.update(src=src,width=image.width,height=image.height,author=plain(metadata.get('Artist',{}).get('value',metadata.get('Credit',{}).get('value',''))),license=license,licenseUrl=html.unescape(metadata.get('LicenseUrl',{}).get('value','https://creativecommons.org/publicdomain/zero/1.0/')),source=info['descriptionurl'],changes='Resized from the licensed original to a high-resolution WebP master; responsive crops preserve proportions.',checked='2026-11-03')
        assert photo['author']
        results.append(dict(slug=slug,status='upgraded',selected=slug in selections,source=photo['source'],bytes=target.stat().st_size,sourceSha256=hashlib.sha256(original.read_bytes()).hexdigest()))
        print(slug,'UPGRADED',flush=True)
    except Exception as e:
        results.append(dict(slug=slug,status='retained',reason=str(e)))
        print(slug,'RETAINED:',str(e),flush=True)
    (root/'src/data/tour-photos.json').write_text(json.dumps(photos,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    (root/'artifacts/premium-photo-import.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
