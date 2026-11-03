"""Independently decode and validate all adaptive film exports."""
import json, hashlib, subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
reports=json.loads((root/'artifacts/premium-film-encoding.json').read_text(encoding='utf8'))
plans=json.loads((root/'src/data/destination-videos.json').read_text(encoding='utf8'))
results=[]
for report in reports:
    plan=next(p for p in plans if p['id']==report['id'])
    assert len(plan['shots'])==8 and len({s['sourceSha256'] for s in plan['shots']})==8
    assert all(s['duration']==5 and s['timelineStart']==i*5 for i,s in enumerate(plan['shots']))
    assert {v['profile'] for v in report['variants']}=={'lite','mobile','balanced','desktop'}
    for v in report['variants']:
        path=root/v['file']; data=path.read_bytes()
        assert hashlib.sha256(data).hexdigest()==v['sha256']
        info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(path)]))
        assert len(info['streams'])==1
        stream=info['streams'][0]
        assert stream['codec_type']=='video' and int(stream['nb_read_frames'])==1200
        assert (stream['width'],stream['height'])==(v['width'],v['height'])
        assert abs(float(info['format']['duration'])-40)<.1
        assert 0<data.find(b'moov')<data.find(b'mdat')
        selector='+'.join(f'eq(n,{75+i*150})' for i in range(8))
        decoded=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-vf',f"select='{selector}',scale=120:120",'-an','-f','framemd5','-']).decode()
        hashes=[line.split(',')[-1].strip() for line in decoded.splitlines() if line and not line.startswith('#')]
        assert len(set(hashes))==8
        results.append(dict(file=v['file'],duration=40,frames=1200,distinctScenes=8,bytes=len(data),profile=v['profile'],silent=True,fastStart=True))
        print(path.name,'PASS',flush=True)
(root/'artifacts/premium-film-quality.json').write_text(json.dumps(results,indent=2)+'\n')
print('PASS: six films; 24 adaptive variants; 8 distinct scenes per film.')
