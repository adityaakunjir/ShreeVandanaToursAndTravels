"""Keep each edited Creative Commons scene available under its own licence."""
import json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
films=json.loads((root/'src/data/destination-videos.json').read_text(encoding='utf8'))
for film in films:
 for i,shot in enumerate(film['shots']):
  shot['timelineStart']=i*5;shot['timelineEnd']=(i+1)*5
 if any(s['license'].startswith('CC') for s in film['shots']):film['license']='Scene-specific licences'
 for i,shot in enumerate(film['shots']):
  if not shot['license'].startswith('CC'):continue
  subprocess.run(['ffmpeg','-v','error','-y','-ss',str(i*5),'-i',str(root/f"public/assets/videos/{film['assetBase']}-desktop.mp4"),'-frames:v','150','-an','-c:v','libx264','-preset','fast','-crf','23','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',str(root/f"public/assets/videos/{film['id']}-cc-scene-{i+1}.mp4")],check=True)
for name in ['destination-videos.json','premium-film-sources.json']:(root/'src/data'/name).write_text(json.dumps(films,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Scene-specific attribution and downloadable CC excerpts updated.')
