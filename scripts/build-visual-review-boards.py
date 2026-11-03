"""Create labelled top/middle/footer boards for the complete browser capture set."""
import json
from pathlib import Path
from PIL import Image,ImageDraw,ImageOps
root=Path(__file__).resolve().parents[1]
report=json.loads((root/'artifacts/final-all-pages-review.json').read_text())
output=Path(report['output'])/'boards';output.mkdir(exist_ok=True)
for view in ['mobile','desktop']:
    records=sorted([r for r in report['records'] if r['view']==view],key=lambda r:r['route'])
    width,height=(390,844) if view=='mobile' else (480,300)
    for start in range(0,len(records),4):
        group=records[start:start+4]
        canvas=Image.new('RGB',(width*len(group),(height+24)*3+44),'#111b24');draw=ImageDraw.Draw(canvas)
        for col,row in enumerate(group):
            draw.text((col*width+5,8),row['route'][:60],fill='white')
            for i,section in enumerate(['top','middle','bottom']):
                im=Image.open(row['captures'][section]).convert('RGB').resize((width,height),Image.Resampling.LANCZOS)
                y=44+i*(height+24);canvas.paste(im,(col*width,y));draw.text((col*width+5,y+height+3),section.upper(),fill='#c4d4df')
        canvas.save(output/f'{view}-{start//4:02}.jpg',quality=86)
print(output)
