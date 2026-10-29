import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(
  pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
);
const origin = process.env.QA_ORIGIN || 'http://localhost:3005';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { checkedAt: new Date().toISOString(), checks: [] };
async function playback(page) {
  await page.waitForFunction(
    () => {
      const v = document.querySelector('video');
      return v && !v.paused && v.currentTime > 0.2 && v.readyState >= 2;
    },
    undefined,
    { timeout: 15000 },
  );
}
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route(/instagram\.com/, (route) => route.abort());
  await page.goto(origin, { waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('video').getAttribute('src'), null);
  await playback(page);
  assert.match(
    await page.locator('video').getAttribute('src'),
    /nepal-montage-v1-mobile/,
  );
  await page.screenshot({ path: 'artifacts/scenic-video-mobile.png' });
  await page.getByRole('button', { name: /Pause scenery video/ }).click();
  assert(await page.locator('video').evaluate((v) => v.paused));
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  await page.waitForTimeout(200);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(200);
  assert(await page.locator('video').evaluate((v) => v.paused));
  await page.getByRole('button', { name: /Play scenery video/ }).click();
  await playback(page);
  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  await page.waitForTimeout(300);
  assert(await page.locator('video').evaluate((v) => v.paused));
  report.checks.push(
    'Mobile playback is deferred; pause persists; offscreen video stops',
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${origin}/destinations/dubai`);
  await playback(page);
  assert.match(
    await page.locator('video').getAttribute('src'),
    /dubai-montage-v1-desktop/,
  );
  assert.equal(await page.locator('video').evaluate((v) => v.videoWidth), 1920);
  await page.screenshot({ path: 'artifacts/scenic-video-desktop.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(300);
  assert(
    await page
      .locator('video')
      .evaluate((v) => v.paused && !v.getAttribute('src')),
  );
  report.checks.push(
    'Desktop selects full-HD footage; preference change stops and unloads it',
  );
  for (const policy of ['reduced', 'save-data', '3g']) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: policy === 'reduced' ? 'reduce' : 'no-preference',
    });
    if (policy !== 'reduced')
      await context.addInitScript(
        (policy) =>
          Object.defineProperty(navigator, 'connection', {
            value: {
              saveData: policy === 'save-data',
              effectiveType: policy === '3g' ? '3g' : '4g',
              addEventListener() {},
              removeEventListener() {},
            },
          }),
        policy,
      );
    const p = await context.newPage();
    const mediaRequests = [];
    p.on('request', (request) => {
      if (/\.(mp4|webm)/.test(request.url())) mediaRequests.push(request.url());
    });
    await p.goto(origin);
    await p.waitForTimeout(1800);
    assert.equal(mediaRequests.length, 0, policy);
    await p.getByRole('button', { name: /Play scenery video/ }).click();
    await playback(p);
    await context.close();
    report.checks.push(
      `${policy}: no automatic video download; explicit play works`,
    );
  }
  const clips = JSON.parse(
    await readFile('src/data/destination-videos.json', 'utf8'),
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const clip of clips) {
    for (const route of [
      ...clip.tourSlugs.map((s) => `/tours/${s}`),
      ...clip.destinationSlugs
        .filter((s) => s !== 'united-arab-emirates')
        .map((s) => `/destinations/${s}`),
    ]) {
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200);
      assert.equal(await page.locator('video').count(), 1, route);
      assert.match(
        await page.locator('video').getAttribute('aria-label'),
        new RegExp(clip.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      );
      assert(
        !(await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )),
      );
    }
    const response = await page.request.get(
      `${origin}/assets/videos/${clip.assetBase}-mobile.mp4`,
      { headers: { Range: 'bytes=0-1023' } },
    );
    assert.equal(response.status(), 206);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${origin}/destinations/${clip.destinationSlugs[0]}`);
    await page.getByRole('button', { name: /Play scenery video/ }).click();
    await playback(page);
    assert.match(
      await page.locator('video').getAttribute('src'),
      new RegExp(`${clip.assetBase}-mobile`),
    );
    assert(
      Math.abs((await page.locator('video').evaluate((v) => v.duration)) - 40) <
        0.1,
    );
    await page.locator('video').evaluate(async (v) => {
      v.pause();
      const sought = new Promise((resolve) =>
        v.addEventListener('seeked', resolve, { once: true }),
      );
      v.currentTime = 37.5;
      await sought;
    });
    assert(
      await page
        .locator('video')
        .evaluate((v) => v.currentTime > 37 && v.readyState >= 2),
    );
    if (clip.id === 'sikkim')
      await page.screenshot({
        path: 'artifacts/scenic-video-sikkim-mobile.png',
      });
  }
  report.checks.push(
    'All mapped tours and five destinations show the correct montage; five mobile videos play for 40 seconds and decode scene eight at 37.5 seconds; MP4 byte ranges work',
  );
  const fallback = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
  });
  await fallback.route('**/*.mp4', (route) => route.abort());
  await fallback.goto(origin);
  await playback(fallback);
  assert.match(await fallback.locator('video').getAttribute('src'), /\.webm$/);
  report.checks.push('WebM fallback plays when MP4 cannot load');
  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto(origin);
  assert(await noJS.locator('.scenic-media img').isVisible());
  assert.equal(await noJS.locator('video').getAttribute('src'), null);
  assert(!(await noJS.locator('.scenic-control').isVisible()));
  assert.deepEqual(errors, []);
  report.checks.push(
    'No-JS image fallback is visible without inert controls; no page runtime errors',
  );
} finally {
  await writeFile(
    'artifacts/scenic-video-validation.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  await browser.close();
}
console.log(report.checks.join('\n'));
