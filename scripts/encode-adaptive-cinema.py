"""Restore eight source shots and encode each device crop directly from originals."""
import json, hashlib, subprocess, concurrent.futures
from pathlib import Path
root=Path(__file__).resolve().parents[1]
sources=root.parent/'media-sources'
work=sources/'cinema-v3-work';work.mkdir(exist_ok=True)
out=root/'public/assets/videos'
plans=json.loads((root/'src/data/premium-film-sources.json').read_text(encoding='utf8'))
profiles=[('economy',640,360,30,'250k','h264_nvenc'),('lite',480,854,30,'250k','h264_nvenc'),('mobile',1080,1920,21,'3000k','h264_nvenc'),('balanced',1280,720,23,'1500k','h264_nvenc'),('desktop',1920,1080,20,'4000k','h264_nvenc'),('4k',3840,2160,20,'8000k','h264_nvenc'),('4k-hevc',3840,2160,22,'4000k','hevc_nvenc')]
def run(args):subprocess.run(['ffmpeg','-v','error','-y',*map(str,args)],check=True)
def encode(plan):
 assert len(plan['shots'])==8 and len({s['sourceSha256'] for s in plan['shots']})==8
 plan['assetBase']=plan['assetBase'].replace('-v2','-v3')
 report={'id':plan['id'],'assetBase':plan['assetBase'],'shotCount':8,'secondsPerShot':5,'duration':40,'variants':[]}
 plan['native4k']=all(s['sourceWidth']>=3840 and s['sourceHeight']>=2160 for s in plan['shots'])
 for profile,w,h,cq,rate,codec in profiles:
  if profile.startswith('4k') and not plan['native4k']: continue
  parts=[]
  for i,s in enumerate(plan['shots']):
   assert s['duration']==5
   src=sources/s['sourceFile']
   assert hashlib.sha256(src.read_bytes()).hexdigest()==s['sourceSha256']
   key=hashlib.sha256(json.dumps([2,s,profile,w,h,cq,rate,codec]).encode()).hexdigest()[:14]
   part=work/f'{key}.mp4';parts.append(part)
   valid=False
   if part.exists():
    try:
     probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=nb_frames','-of','json',str(part)],stderr=subprocess.DEVNULL))
     valid=abs(float(probe['format']['duration'])-5)<.05 and int(probe['streams'][0]['nb_frames'])==150
    except (subprocess.CalledProcessError,KeyError,ValueError): pass
   if not valid:
    vf=f"scale={w}:{h}:force_original_aspect_ratio=increase:flags=lanczos,crop={w}:{h}:(iw-ow)*{s.get('focusX',.5)}:(ih-oh)*{s.get('focusY',.5)},fps=30,setsar=1,setpts=PTS-STARTPTS"
    opts=['-tag:v','hvc1'] if codec=='hevc_nvenc' else []
    run(['-threads',2,'-ss',s['start'],'-i',src,'-frames:v',150,'-an','-vf',vf,'-c:v',codec,'-preset','p6','-rc','vbr','-cq',cq,'-b:v',rate,'-maxrate',rate,'-bufsize',str(int(rate[:-1])*2)+'k','-pix_fmt','yuv420p','-g',60,'-video_track_timescale',90000,'-threads',2,'-map_metadata',-1,*opts,part])
  listing=work/f"{plan['id']}-{profile}.txt";listing.write_text(''.join(f"file '{p.as_posix()}'\n" for p in parts))
  target=out/f"{plan['assetBase']}-{profile}.mp4"
  run(['-f','concat','-safe',0,'-i',listing,'-c','copy','-movflags','+faststart',target])
  report['variants'].append(dict(file=target.relative_to(root).as_posix(),profile=profile,width=w,height=h,codec=codec,bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
  print(plan['id'],profile,'40s / 8 scenes',round(target.stat().st_size/1e6,2),'MB',flush=True)
 return report
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:reports=list(pool.map(encode,plans))
for name in ['premium-film-sources.json','destination-videos.json']:(root/'src/data'/name).write_text(json.dumps(plans,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(root/'artifacts/premium-film-encoding.json').write_text(json.dumps(reports,indent=2)+'\n')
