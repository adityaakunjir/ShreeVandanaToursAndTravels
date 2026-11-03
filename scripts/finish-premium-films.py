"""Add balanced desktop delivery to completed full-HD films without re-cutting sources."""
import json, subprocess, hashlib, concurrent.futures, argparse
from pathlib import Path
root=Path(__file__).resolve().parents[1]
path=root/'artifacts/premium-film-encoding.json'
reports=json.loads(path.read_text(encoding='utf8'))
parser=argparse.ArgumentParser(); parser.add_argument('--only',nargs='*'); args=parser.parse_args()
def finish(report):
    if args.only and report['id'] not in args.only: return report
    desktop=next(v for v in report['variants'] if v['profile']=='desktop')
    output=root/f"public/assets/videos/{report['assetBase']}-balanced.mp4"
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(root/desktop['file']),'-an','-vf','scale=960:540','-c:v','libx264','-crf','25','-preset','fast','-maxrate','1300k','-bufsize','2600k','-pix_fmt','yuv420p','-threads','2','-movflags','+faststart',str(output)],check=True)
    report['variants']=[v for v in report['variants'] if v['profile']!='balanced']
    report['variants'].append(dict(file=output.relative_to(root).as_posix(),profile='balanced',width=960,height=540,bytes=output.stat().st_size,sha256=hashlib.sha256(output.read_bytes()).hexdigest()))
    print(report['id'],'balanced desktop complete',flush=True)
    return report
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool: reports=list(pool.map(finish,reports))
path.write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
