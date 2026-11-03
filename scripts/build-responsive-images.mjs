import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const photos = JSON.parse(await readFile('src/data/tour-photos.json', 'utf8'));
const prioritySlugs = ['dubai-abu-dhabi','nepal','kerala-kanyakumari','kashmir-amritsar-vaishno-devi','darjeeling-gangtok-pelling'];
await writeFile('src/data/priority-photos.json', JSON.stringify(Object.fromEntries(photos.filter(p => prioritySlugs.includes(p.slug)).map(p => [p.slug,p.src])),null,2)+'\n');
const films = JSON.parse(await readFile('src/data/destination-videos.json', 'utf8'));
const sources = [...new Set([...photos.map(p => p.src), ...films.map(p => `/assets/videos/${p.assetBase}-poster.webp`)])];
await mkdir('public/assets/responsive', { recursive: true });
const manifest = {};
const report = [];
for (const src of sources) {
  const bytes = await readFile('public' + src);
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 14);
  const metadata = await sharp(bytes).metadata();
  const widths = [...new Set([384, 640, 960, 1280, 1920, 2560].map(w => Math.min(w, metadata.width)))];
  const variants = [];
  for (const width of widths) {
    const target = `/assets/responsive/${hash}-${width}.webp`;
    const encoded = await sharp(bytes).resize({width, withoutEnlargement: true}).webp({quality: 80, effort: 5}).toBuffer();
    await writeFile('public' + target, encoded);
    variants.push({width, bytes: encoded.length, src: target});
  }
  manifest[src] = {hash, widths};
  report.push({src, masterWidth: metadata.width, masterHeight: metadata.height, variants});
}
await writeFile('src/data/responsive-images.json', JSON.stringify(manifest, null, 2) + '\n');
await writeFile('artifacts/responsive-image-delivery.json', JSON.stringify(report, null, 2) + '\n');
const active = new Set(report.flatMap(r => r.variants.map(v => v.src.split('/').at(-1))));
for (const name of await readdir('public/assets/responsive')) {
  if (/^[a-f0-9]{14}-\d+\.webp$/.test(name) && !active.has(name)) await unlink('public/assets/responsive/' + name);
}
console.log(`Prebuilt ${report.length} photographs/posters; responsive files use immutable content hashes.`);
