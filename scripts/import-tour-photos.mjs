import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import sharp from 'sharp';

// Explicitly licensed destination photographs; never run during a site build.
const sources = [
  [
    'kashi-gaya-prayag-ayodhya',
    'Varanasi ghats at the sunrise.JPG',
    'Ilya Mauter',
    'by/3.0',
    'Sunrise over the river ghats in Varanasi',
  ],
  [
    'shimla-kullu-manali',
    'Solang Valley Manali.JPG',
    'Jishnu2602',
    'by-sa/3.0',
    'Mountain scenery in Solang Valley near Manali',
  ],
  [
    'darjeeling-gangtok-pelling',
    'Darjeeling, India, Tea plantation.jpg',
    'Vyacheslav Argenberg',
    'by/4.0',
    'Green tea plantations in Darjeeling',
  ],
  [
    'kashmir-amritsar-vaishno-devi',
    'Dal Lake Srinagar Kashmir.jpg',
    'Sauood07',
    'by/4.0',
    'Dal Lake in Srinagar, Kashmir',
  ],
  [
    'pithapur-kuravpur',
    'Shrisailam Temple , Hyderabad , Andhra Pradesh , India.jpg',
    'Nishant Jajoo',
    'by-sa/3.0',
    'Srisailam temple architecture in Andhra Pradesh',
  ],
  [
    'dubai-abu-dhabi',
    'Dubai Skyline at sunset.jpg',
    'Lxs',
    'by/4.0',
    'Dubai skyline glowing at sunset',
  ],
  [
    'nepal',
    'Phewa lake , Pokhara.jpg',
    'Arju stha',
    'by-sa/4.0',
    'Phewa Lake surrounded by hills in Pokhara, Nepal',
  ],
  [
    'sri-lanka',
    'Sigiriya Rock Fortress.jpg',
    'Satheesha J.',
    'by-sa/4.0',
    'Sigiriya rock fortress above the forest in Sri Lanka',
  ],
  [
    'kerala-kanyakumari',
    'Munnar Tea Plantation.jpg',
    'Raj',
    'by/2.0',
    'Rolling green tea plantations in Munnar, Kerala',
  ],
  [
    'royal-bhutan',
    'Paro Taktsang, Bhutan (49694769472).jpg',
    'Nina R',
    'by/2.0',
    'Mountain landscape around Paro Taktsang in Bhutan',
  ],
  [
    'egypt-hurghada',
    'All pyramids of Giza panorama 1.jpg',
    'kallerna',
    'by-sa/3.0',
    'The pyramids of Giza across the desert in Egypt',
  ],
];
await mkdir('public/assets/images/tours', { recursive: true });
const photos = [];
for (let offset = 0; offset < sources.length; offset += 1) {
  photos.push(
    ...(await Promise.all(
      sources
        .slice(offset, offset + 1)
        .map(async ([slug, file, author, license, alt]) => {
          const name = file.replaceAll(' ', '_');
          const hash = createHash('md5').update(name).digest('hex');
          const download = `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(name)}`;
          let cached;
          try {
            cached = await readFile(
              'public/assets/images/tours/' + slug + '.webp',
            );
          } catch {}
          let response;
          if (!cached) {
            for (let attempt = 0; attempt < 4; attempt++) {
              const requestUrl =
                attempt === 0
                  ? download
                  : download.replace('/commons/', '/commons/thumb/') +
                    '/1280px-' +
                    encodeURIComponent(name);
              response = await fetch(requestUrl, {
                signal: AbortSignal.timeout(120000),
              });
              if (response.status !== 429) break;
              await new Promise((resolve) =>
                setTimeout(resolve, 5000 * (attempt + 1)),
              );
            }
          }
          if (!cached && !response.ok)
            throw new Error(`${slug}: HTTP ${response.status}`);
          const input = cached || Buffer.from(await response.arrayBuffer());
          const { data, info } = cached
            ? { data: cached, info: await sharp(cached).metadata() }
            : await sharp(input)
                .rotate()
                .resize({ width: 1400, withoutEnlargement: true })
                .webp({ quality: 66 })
                .toBuffer({ resolveWithObject: true });
          const src = `/assets/images/tours/${slug}.webp`;
          await writeFile(`public${src}`, data);
          console.log(`${slug}: ${Math.round(data.length / 1024)} KB`);
          return {
            slug,
            src,
            width: info.width,
            height: info.height,
            alt,
            author,
            license: `CC ${license.replace('by-sa', 'BY-SA').replace('by', 'BY').replace('/', ' ')}`,
            licenseUrl: `https://creativecommons.org/licenses/${license}/`,
            source: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name)}`,
            changes:
              'Resized and compressed to WebP; cropped to fit the displayed frame.',
          };
        }),
    )),
  );
}
await writeFile(
  'src/data/tour-photos.json',
  JSON.stringify(photos, null, 2) + '\n',
);
