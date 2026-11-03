"""Keep edited CC excerpts individually available under their original terms."""
import json, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
for name in ['destination-videos.json','premium-film-sources.json']:
    path=root/'src/data'/name
    films=json.loads(path.read_text(encoding='utf8'))
    film=next(f for f in films if f['id']=='sikkim')
    film['license']='Scene-specific licences'
    path.write_text(json.dumps(films,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
film=next(f for f in films if f['id']=='sikkim')
for index,shot in enumerate(film['shots']):
    if not shot['license'].startswith('CC'): continue
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(index*5),'-i',str(root/f"public/assets/videos/{film['assetBase']}-desktop.mp4"),'-frames:v','150','-an','-c:v','libx264','-preset','fast','-crf','23','-threads','2','-pix_fmt','yuv420p','-movflags','+faststart',str(root/f'public/assets/videos/sikkim-cc-scene-{index+1}.mp4')],check=True)
print('Edited CC scenes retain individual attribution and licence; Pexels scenes are not relicensed.')
