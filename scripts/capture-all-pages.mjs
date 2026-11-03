import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(
  pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
);
const origin = process.env.QA_ORIGIN || 'http://localhost:3005';
const output =
  process.env.QA_CAPTURE_DIR ||
  'D:/Vandana Travels/media-sources/site-review-2026-11-03';
await mkdir(output, { recursive: true });
const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
const paths = [
  ...new Set(
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname)
      .concat([
        '/photo-credits',
        '/tours/saved',
        '/tours/compare',
        '/not-a-real-route',
      ]),
  ),
];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
async function settleVisible(page) {
  await page.locator('main img').evaluateAll(async (images) => {
    const visible = images.filter((i) => {
      const r = i.getBoundingClientRect();
      return (
        i.checkVisibility() &&
        r.top < innerHeight &&
        r.bottom > 0 &&
        r.left < innerWidth &&
        r.right > 0
      );
    });
    await Promise.race([
      Promise.all(visible.map((i) => i.decode().catch(() => {}))),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]);
  });
}

const report = {
  checkedAt: new Date().toISOString(),
  output,
  records: [],
  failures: [],
  externalFailures: [],
};
if (process.env.QA_RESUME === '1') {
  const previous = JSON.parse(
    await readFile('artifacts/final-all-pages-review.json', 'utf8'),
  );
  report.records = previous.records;
  report.failures = previous.failures;
}
try {
  for (const [view, width, height] of [
    ['mobile', 390, 844],
    ['desktop', 1440, 900],
  ]) {
    let cursor = 0;
    await Promise.all(
      Array.from({ length: 3 }, async () => {
        const context = await browser.newContext({
          viewport: { width, height },
          deviceScaleFactor: 1,
          reducedMotion: 'no-preference',
        });
        await context.addInitScript(() => {
          Object.defineProperty(navigator, 'hardwareConcurrency', {
            value: 8,
            configurable: true,
          });
          Object.defineProperty(navigator, 'deviceMemory', {
            value: 8,
            configurable: true,
          });
          Object.defineProperty(navigator, 'connection', {
            value: Object.assign(new EventTarget(), {
              effectiveType: '4g',
              downlink: 20,
              rtt: 30,
            }),
            configurable: true,
          });
        });
        const page = await context.newPage();
        while (cursor < paths.length) {
          const index = cursor++;
          const route = paths[index];
          if (report.records.some((r) => r.route === route && r.view === view))
            continue;
          const key =
            String(index).padStart(3, '0') +
            '-' +
            (route === '/' ? 'home' : route.slice(1).replaceAll('/', '-'));
          const errors = [],
            badResources = [];
          const onerror = (e) => errors.push(e.message);
          const onresponse = (r) => {
            if (
              r.url().startsWith(origin) &&
              r.status() >= 400 &&
              !r.url().includes('/not-a-real-route')
            )
              badResources.push({ url: r.url(), status: r.status() });
          };
          page.on('pageerror', onerror);
          page.on('response', onresponse);
          try {
            const response = await page.goto(origin + route, {
              waitUntil: 'domcontentloaded',
              timeout: 45000,
            });
            await page.locator('h1').waitFor();
            await page.evaluate(() => document.fonts.ready);
            const days = await page.locator('.itinerary-list details').all();
            for (const day of days)
              if (
                !(await day.getAttribute('open')) &&
                (await day.getAttribute('open')) !== ''
              )
                await day.locator('summary').click();
            let total = await page.evaluate(
              () => document.documentElement.scrollHeight,
            );
            for (let y = 0; y < total; y += height * 1.5) {
              await page.evaluate(
                (y) => scrollTo({ top: y, behavior: 'instant' }),
                y,
              );
              await page.waitForTimeout(45);
            }
            await page.evaluate(() =>
              scrollTo({ top: 0, behavior: 'instant' }),
            );
            await settleVisible(page);
            await page.waitForTimeout(180);
            await page.evaluate(() => {
              for (const video of document.querySelectorAll('video')) {
                video.pause();
                if (video.readyState >= 2) video.currentTime = 2;
              }
            });
            const record = await page.evaluate(() => ({
              title: document.title,
              heading: document.querySelector('h1')?.textContent,
              headings: document.querySelectorAll('h1').length,
              height: document.documentElement.scrollHeight,
              overflow: document.documentElement.scrollWidth > innerWidth + 1,
              brokenImages: [...document.querySelectorAll('main img')]
                .filter((i) => i.complete && i.naturalWidth === 0)
                .map((i) => i.currentSrc),
            }));
            const captures = {};
            for (const [section, y] of [
              ['top', 0],
              ['middle', Math.max(0, (record.height - height) * 0.48)],
              ['bottom', Math.max(0, record.height - height)],
            ]) {
              await page.evaluate(
                (y) => scrollTo({ top: y, behavior: 'instant' }),
                y,
              );
              await page.waitForTimeout(90);
              await settleVisible(page);
              const file =
                output + '/' + view + '-' + key + '-' + section + '.jpg';
              await page.screenshot({
                path: file,
                type: 'jpeg',
                quality: 78,
                animations: 'disabled',
              });
              captures[section] = file;
            }
            await page.evaluate(() =>
              scrollTo({ top: 0, behavior: 'instant' }),
            );
            const full = output + '/' + view + '-' + key + '-full.jpg';
            try {
              await page.screenshot({
                path: full,
                type: 'jpeg',
                quality: 68,
                fullPage: true,
                animations: 'disabled',
                timeout: 30000,
              });
              captures.full = full;
            } catch {
              captures.full =
                'Too tall for a single browser capture; viewport panels retained';
            }
            const row = {
              route,
              view,
              width,
              status: response.status(),
              ...record,
              captures,
              errors,
              badResources,
            };
            report.records.push(row);
            if (
              record.overflow ||
              record.headings !== 1 ||
              record.brokenImages.length ||
              errors.length ||
              badResources.length ||
              response.status() !== (route === '/not-a-real-route' ? 404 : 200)
            )
              report.failures.push(row);
            console.log(view, route, record.overflow ? 'OVERFLOW' : 'captured');
          } catch (error) {
            report.failures.push({ route, view, error: String(error) });
          } finally {
            page.off('pageerror', onerror);
            page.off('response', onresponse);
          }
          await writeFile(
            'artifacts/final-all-pages-review.json',
            JSON.stringify(report, null, 2) + '\n',
          );
        }
        await context.close();
      }),
    );
  }
} finally {
  await browser.close();
}
await writeFile(
  'artifacts/final-all-pages-review.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  `Captured ${report.records.length} page/view combinations; ${report.failures.length} structural/runtime failures.`,
);
if (report.failures.length) process.exitCode = 1;
