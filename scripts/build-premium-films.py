"""Encode the reviewed source plan; originals and intermediates remain outside Git."""
import json, subprocess, hashlib, urllib.request, concurrent.futures, argparse
from pathlib import Path
from PIL import Image, ImageDraw

root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(); parser.add_argument('--only',nargs='*'); args=parser.parse_args()
masters=root.parent/'media-sources'
work=masters/'premium-film-work'; work.mkdir(exist_ok=True)
output=root/'public/assets/videos'; output.mkdir(exist_ok=True)
plans=json.loads((root/'src/data/premium-film-sources.json').read_text(encoding='utf8'))
assert len(plans)==6
for plan in plans:
    assert len(plan['shots'])==8 and len({s['sourceSha256'] for s in plan['shots']})==8
(root/'src/data/destination-videos.json').write_text(json.dumps(plans,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def run(args): subprocess.run(['ffmpeg','-v','error','-y',*map(str,args)],check=True)

profiles=[('lite',480,854,28,'650k'),('mobile',720,1280,23,'1900k'),('desktop',1920,1080,22,'4200k')]
def encode(p):
    report=dict(id=p['id'],assetBase=p['assetBase'],shotCount=8,secondsPerShot=5,duration=40,shots=p['shots'],variants=[])
    folder=work/p['assetBase']; folder.mkdir(exist_ok=True)
    for profile,width,height,crf,rate in profiles:
        parts=[]
        for i,s in enumerate(p['shots']):
            fingerprint=hashlib.sha256(json.dumps([s['sourceSha256'],s['start'],s.get('focusX',.5),s.get('focusY',.5),width,height,crf,rate]).encode()).hexdigest()[:10]
            part=folder/f'{profile}-{i}-{fingerprint}.mp4'; parts.append(part)
            # Reframe originals per device; never crop a landscape delivery a second time.
            vf=f"scale={width}:{height}:force_original_aspect_ratio=increase:flags=lanczos,crop={width}:{height}:(iw-ow)*{s.get('focusX',.5)}:(ih-oh)*{s.get('focusY',.5)},fps=30,setsar=1,setpts=PTS-STARTPTS"
            if not part.exists():
                run(['-threads',2,'-ss',s['start'],'-i',masters/s['sourceFile'],'-frames:v',150,'-an','-vf',vf,'-c:v','libx264','-preset','fast','-crf',crf,'-maxrate',rate,'-bufsize',str(int(rate[:-1])*2)+'k','-pix_fmt','yuv420p','-g',60,'-video_track_timescale',90000,'-threads',2,'-map_metadata',-1,part])
            print(p['id'],profile,f'{i+1}/8',flush=True)
        listing=folder/f'{profile}.txt'; listing.write_text(''.join(f"file '{f.as_posix()}'\n" for f in parts))
        target=output/f"{p['assetBase']}-{profile}.mp4"
        run(['-f','concat','-safe',0,'-i',listing,'-c','copy','-movflags','+faststart',target])
        report['variants'].append(dict(file=target.relative_to(root).as_posix(),profile=profile,width=width,height=height,bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
        if profile=='desktop':
            poster=output/f"{p['assetBase']}-poster.webp"
            run(['-ss',2,'-i',target,'-frames:v',1,'-vf','scale=1920:-2','-quality',84,poster])
            canvas=Image.new('RGB',(1600,480),'#101820')
            for i in range(8):
                frame=folder/f'frame-{i}.jpg'; run(['-ss',i*5+2.5,'-i',target,'-frames:v',1,'-vf','scale=400:225',frame])
                canvas.paste(Image.open(frame),((i%4)*400,(i//4)*240))
                ImageDraw.Draw(canvas).text(((i%4)*400+4,(i//4)*240+225),p['shots'][i]['label'][:50],fill='white')
            canvas.save(root/f"artifacts/cinema-review-{p['id']}.jpg")
        print(p['id'],profile,'COMPLETE',flush=True)
    return report

selected=[p for p in plans if not args.only or p['id'] in args.only]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool: reports=list(pool.map(encode,selected))
if args.only:
    previous=json.loads((root/'artifacts/premium-film-encoding.json').read_text(encoding='utf8'))
    reports=[r for r in previous if r['id'] not in args.only]+reports
(root/'artifacts/premium-film-encoding.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Six 40-second films exported in three device tiers.',flush=True)
