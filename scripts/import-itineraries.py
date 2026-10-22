"""Rebuild document-derived outlines; no network, model-generated itinerary or runtime dependency.
Run: python scripts/import-itineraries.py [--check]
Paragraph numbering is 1-based over direct body paragraphs, including blanks.
"""
from pathlib import Path
import hashlib, json, re, sys, unicodedata, zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'client_details/TOUR ITINERARIES.docx'
manifest = json.loads((ROOT / 'client_details/itinerary-sections.json').read_text(encoding='utf8'))
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
xml = ET.fromstring(zipfile.ZipFile(SOURCE).read('word/document.xml'))
paragraphs = [''.join(t.text or '' for t in p.findall('.//w:t', ns)).strip() for p in xml.findall('./w:body/w:p', ns)]
digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
countries = {1:'Indonesia',2:'United Arab Emirates',8:'Nepal',34:'Russia',35:'Thailand / Malaysia / Singapore',36:'Egypt',37:'Azerbaijan',38:'South Africa',39:'Vietnam',40:'Singapore / Malaysia',41:'Thailand',42:'Mauritius',44:'Sri Lanka',45:'Japan'}
themes = {1:'Romance & coast',2:'City & desert',3:'Mountains',4:'Mountains & culture',5:'Mountains',6:'Mountains',7:'Mountains & pilgrimage',8:'Culture & nature',9:'Mountains & wildlife',10:'Culture & nature',11:'Culture & pilgrimage',12:'Culture & pilgrimage',13:'Culture & pilgrimage',14:'Coast',15:'Heritage & pilgrimage',16:'Mountains & culture',17:'Royal heritage',18:'Royal heritage',19:'Pilgrimage',20:'Culture & nature',21:'Mountains & adventure',22:'Mountains & adventure',23:'Mountains & adventure',24:'Pilgrimage',25:'Coast & culture',26:'Coast & nature',27:'Nature & wildlife',28:'Coast & nature',29:'Culture & pilgrimage',30:'Culture & pilgrimage',31:'Islands & coast',32:'Islands & coast',33:'Mountains & nature',34:'Culture & heritage',35:'City & culture',36:'History & coast',37:'City & culture',38:'Nature & wildlife',39:'Culture & nature',40:'City & culture',41:'Coast & culture',42:'Romance & coast',43:'Heritage',44:'Culture & coast',45:'Culture & heritage'}
def slugify(text):
    return re.sub(r'[^a-z0-9]+','-',unicodedata.normalize('NFKD',text).lower()).strip('-')
def public_text(text):
    text = re.sub(r'\b\d+(?:\.\d+)?%\s*(?:TCS|GST)\b[^.]*\.?', 'Applicable taxes require confirmation in the final quotation.', text, flags=re.I)
    if re.search(r'\b(?:TCS|GST)\b', text, re.I): return 'Applicable taxes and their treatment must be confirmed in your final quotation.'
    return text
records=[]
for item in manifest:
    start,end = item['startParagraph'],item['endParagraph']
    section = paragraphs[start-1:end]
    if section[0] != item['title']: raise ValueError(f"Source heading changed: {item['order']}")
    name = re.split(r'\s+[–—-]\s+\d+\s+Nights?',item['title'],flags=re.I)[0]
    name = re.sub(r'\s+(?:Group\s+)?Tour Package$', '', name, flags=re.I)
    if name.isupper(): name=name.title()
    slug=slugify(name)+f"-{item['duration']}-days"
    days=[]; includes=[]; excludes=[]; notes=[]; intro=[]; mode='intro'; current=None
    for raw in section[1:]:
        if not raw: continue
        if re.fullmatch(r'(?:package |honeymoon package |tour cost |cost )?(?:inclusions?|includes)',raw,re.I): mode='includes';current=None;continue
        if re.fullmatch(r'(?:package |tour cost |cost )?(?:exclusions?|excludes)',raw,re.I): mode='excludes';current=None;continue
        day=re.match(r'^Day\s*0?(\d+)\b\s*[:–—.\-]*\s*(.*)',raw,re.I)
        if day:
            title=day.group(2).strip()
            if re.search(r'\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|December|2026)\b',title,re.I): title=''
            current={'day':int(day.group(1)),'title':title,'lines':[]};days.append(current);mode='days';continue
        if re.fullmatch(r'(?:day[- ]wise itinerary|itinerary|tour highlights|package details)',raw,re.I): continue
        clean=public_text(raw)
        if mode=='days' and current is not None:
            if not current['title']: current['title']=clean
            else: current['lines'].append(clean)
        elif mode=='includes': includes.append(clean)
        elif mode=='excludes': excludes.append(clean)
        else: intro.append(clean)
    if [d['day'] for d in days] != list(range(1,item['duration']+1)): raise ValueError(f"Day count/order mismatch: {name}")
    if not includes or not excludes: raise ValueError(f'Missing inclusions/exclusions: {name}')
    optional=[]
    for d in days:
        for line in d['lines']:
            if re.search(r'\boptional\b|at (?:your )?own (?:cost|expense)',line,re.I): optional.append(line)
    conditional=[line for line in includes if re.search(r'\boptional\b',line,re.I)]
    optional.extend(conditional); includes=[line for line in includes if line not in conditional]
    for line in section:
        if line.lower().startswith('note:'): notes.append(public_text(line))
    if item['relatedLegacy']: notes.append('A separate source outline in this route family is also available. Compare the route, duration and inclusions before choosing.')
    if item['order']==1: notes.append('The source mentions 10–16 December 2026 and tax-sensitive quotation details. These are not confirmed departures or tax advice. Reconfirm dates, flights, visa arrangements and floating breakfast with the team.')
    if item['order']==2: notes.append('The source describes Abu Dhabi and several Dubai experiences as optional alongside broad inclusion wording. Only your final quotation establishes the included visits and meals.')
    notes.append('This is a document-supplied outline, not live availability. Dates, accommodation, permits, taxes, optional activities and final arrangements require confirmation.')
    summary=next((x for x in intro if len(x)>85 and not re.match(r'^(Duration|Destination|Accommodation)',x,re.I)),f"Explore {name} with a {item['duration']}-day source itinerary, personalised with our Pune team.")
    if len(summary)>250: summary=summary[:247].rsplit(' ',1)[0]+'…'
    route=next((re.split(r'Destinations?:',x,flags=re.I)[-1] for x in intro if re.search(r'Destinations?:',x,re.I)), '')
    route=re.split(r'\s*\|\s*Duration:',route,flags=re.I)[0]
    stops=[s.strip() for s in re.split(r'\s+[–—]\s+|\s*→\s*',route) if s.strip()] if route else []
    stops=item.get('route',stops)
    if not stops: raise ValueError(f'Missing reviewed route: {name}')
    records.append({'id':f"itinerary-{item['order']:02d}",'slug':slug,'name':name,'aliases':[item['title']], 'country':countries.get(item['order'],'India'),'scope':item['scope'],'region':countries.get(item['order'],'India'),'theme':themes[item['order']],'category':'Honeymoon' if item['order'] in [1,42] else 'Group' if 'group' in item['title'].lower() else 'Holiday','duration':item['duration'],'nights':item['nights'],'summary':summary,'stops':stops,'days':[{'title':d['title'],'description':' '.join(d['lines'])} for d in days], 'includes':list(dict.fromkeys(includes)),'excludes':list(dict.fromkeys(excludes)),'optional':list(dict.fromkeys(optional)),'notes':list(dict.fromkeys(notes)),'highlights':[d['title'] for d in days[1:4]],'relatedSlugs':[item['relatedLegacy']] if item['relatedLegacy'] else [],'source':{'file':'client_details/TOUR ITINERARIES.docx','paragraphRange':[start,end],'paragraphBasis':'1-based direct body paragraphs including blanks','sha256':digest,'order':item['order']},'evidenceStatus':'owner-supplied-document','approval':'outline-only; commercial terms pending','publication':'published-outline','reconciliation':item['reconciliation'],'image':None})
if len(records)!=45 or len({r['slug'] for r in records})!=45: raise ValueError('Catalogue coverage/slug collision')
legacy=json.loads((ROOT/'src/data/tours.json').read_text(encoding='utf8'))
if set(r['slug'] for r in records)&set(r['slug'] for r in legacy): raise ValueError('Legacy slug collision')
payload=json.dumps(records,ensure_ascii=False,indent=2)+'\n'
target=ROOT/'src/data/imported-tours.json'
if '--check' in sys.argv:
    if not target.exists() or target.read_text(encoding='utf8')!=payload: raise ValueError('Generated content is stale; rerun importer')
else: target.write_text(payload,encoding='utf8')
print(f"Accounted for {len(records)} new outlines ({sum(r['scope']=='India' for r in records)} India / {sum(r['scope']=='International' for r in records)} international); {len(legacy)} legacy records preserved. No automatic merges.")
audit = '''# Content audit — Living Travel Journal

Reviewed 22 October 2026. Authoritative source: client_details/TOUR ITINERARIES.docx, with a SHA-256 recorded on every imported record. Paragraph ranges are 1-based direct Word body paragraphs including blanks; supplied external indices were zero-based.

## Publication and reconciliation

45 newer sections (31 India, 14 international) are published as document-supplied outlines. All 11 earlier records and URLs remain intact. That makes 56 outline records, including 8 explicitly linked route-family variants, rather than 56 unique bookable products. No automatic merges, live departures, prices or payments are introduced. No outline is wholly withheld; commercial approval, final pricing, operating dates and supplier terms remain pending for every record.

Run `python scripts/import-itineraries.py` to regenerate the content and this audit; run with `--check` to detect a stale generated catalogue. The reviewed section manifest fixes headings, paragraph boundaries, durations and source-derived route labels. Import fails on changed headings, missing sections, day-count/order mismatches, missing inclusions/exclusions and slug collisions. Source files are preserved. All 45 sections have sequential day headings matching their stated duration. The existing Kashmir daily breakdown remains absent and explicitly requested on enquiry.

Optional activity sentences are recorded separately; source dates and contradictory inclusions require confirmation. Tax lines are replaced publicly with a final-quotation confirmation statement. No source tax percentage is advertised as current advice. Route-family variants remain separate even where their duration matches; differences in route and inclusions have not received merge approval.

## Owner confirmations still needed

- History: logo Since 1998, written 30+ years and earlier Instagram 25 years conflict. Public copy now describes the family-run, three-generation business without a numeric age or invented founding date; original logo is preserved.
- Email: later owner update shreevandanatravels@gmail.com remains public; source sales.svttpune@gmail.com is not silently substituted. website.svttpune@gmail.com is an administration account, not the public contact email.
- Red/white logo takes precedence over old blue JSON; primary WhatsApp remains +91 96652 38966, secondary telephone +91 94220 02115.
- Bali: source 10–16 December 2026 dates, flights, visa wording, floating breakfast and tax-sensitive TCS language need final confirmation. No live departure or definitive tax claim is published.
- Dubai: optional Abu Dhabi, cruise and attractions conflict with broad inclusion language. Only a confirmed quotation establishes included sightseeing and meals.
- Different Sri Lanka (8/7 days), Egypt (9/8), Kerala–Kanyakumari (9/8), Kashmir (10/9/7), Himachal, Sikkim and Nepal routes are not automatically replacements.
- Approved company/customer originals and destination photography rights are still needed for wider photographic coverage. Existing licensed photos are reused only for the same destination family, with original credits. Unillustrated routes use clearly decorative journal artwork, not unrelated labelled photographs.
- Reviews remain three attributed excerpts from the dated 5 October snapshot; no live counts, fabricated travellers, guarantees or testimonials were added.

## New document treatments

| Source section | Outline / public route | Days | Paragraphs | Treatment / related legacy URL |
|---|---|---:|---|---|
'''
for item,tour in zip(manifest,records):
    audit += f"| {item['order']} | [{tour['name']}](/tours/{tour['slug']}) | {tour['duration']} | {item['startParagraph']}–{item['endParagraph']} | Published outline" + (f"; distinct variant of /tours/{item['relatedLegacy']}" if item['relatedLegacy'] else '') + ' |\n'
audit += '\n## Preserved older records\n\n'
for tour in legacy: audit += f"- /tours/{tour['slug']}: preserved {tour.get('duration') or len(tour['days'])}-day source outline.\n"
audit += '\n## Verification scope\n\nContent-completeness tests cover source hash, all 45 ordered sections, the 31/14 split, day counts, distinct slugs, legacy preservation, variant durations, tax handling and expanded filters. Production smoke discovers all sitemap routes and checks HTTP status, headings, unique descriptions, canonicals, breadcrumbs, WhatsApp, legacy URLs and demo isolation. Browser, performance and final delivery evidence are recorded separately in docs/JOURNAL_DELIVERY.md. Earlier PageSpeed scores describe earlier deployments, not this expansion.\n'
if '--check' not in sys.argv: (ROOT/'docs/CONTENT_AUDIT.md').write_text(audit,encoding='utf8')
