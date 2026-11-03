import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(
  pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
);
const origin = process.env.QA_ORIGIN || 'http://localhost:3005';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const films = JSON.parse(
  await readFile('src/data/destination-videos.json', 'utf8'),
);
const report = {
  checkedAt: new Date().toISOString(),
  checks: [],
  layouts: [],
  network: [],
};
async function context({
  width = 390,
  cores = 8,
  memory = 8,
  downlink = 20,
  saveData = false,
  reduced = 'no-preference',
  js = true,
} = {}) {
  const c = await browser.newContext({
    viewport: { width, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: reduced,
    javaScriptEnabled: js,
  });
  await c.addInitScript(
    ({ cores, memory, downlink, saveData }) => {
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        configurable: true,
        value: cores,
      });
      Object.defineProperty(navigator, 'deviceMemory', {
        configurable: true,
        value: memory,
      });
      Object.defineProperty(navigator, 'connection', {
        configurable: true,
        value: Object.assign(new EventTarget(), {
          downlink,
          saveData,
          effectiveType: '4g',
          rtt: 30,
        }),
      });
      window.__lcp = 0;
      new PerformanceObserver((list) => {
        window.__lcp = list.getEntries().at(-1).startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    },
    { cores, memory, downlink, saveData },
  );
  return c;
}
async function plays(p) {
  await p.waitForFunction(
    () => {
      const v = document.querySelector('video');
      return v && v.currentTime > 0.2 && !v.paused;
    },
    null,
    { timeout: 25000 },
  );
}
try {
  const c = await context();
  const p = await c.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  await p.route(/instagram\.com/, (r) => r.abort());
  await p.goto(origin, { waitUntil: 'domcontentloaded' });
  assert.equal(await p.locator('video').getAttribute('src'), null);
  await plays(p);
  assert.match(
    await p.locator('video').getAttribute('src'),
    /home-cinema-v2-mobile/,
  );
  assert.deepEqual(
    await p.locator('video').evaluate((v) => [v.videoWidth, v.videoHeight]),
    [720, 1280],
  );
  assert.equal(await p.locator('.scenic-control').count(), 0);
  await p.getByRole('button', { name: 'Motion on' }).click();
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(100);
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(100);
  assert(await p.locator('video').evaluate((v) => v.paused));
  report.checks.push(
    'Automatic portrait-HD playback without a Play scenery button; footer motion preference pauses across scrolling',
  );
  await p.getByRole('button', { name: 'Motion off' }).click();
  await p.evaluate(() => scrollTo(0, 0));
  await plays(p);
  await p.screenshot({ path: 'artifacts/premium-home-mobile.png' });
  await p
    .getByRole('button', { name: 'Surprise me with a destination' })
    .click();
  await plays(p);
  assert.match(
    await p.locator('.hero-actions a').first().getAttribute('href'),
    /^\/destinations\//,
  );
  assert.equal(await p.locator('.drone-pill[aria-pressed="true"]').count(), 1);
  const selected = await p
    .locator('.drone-pill[aria-pressed="true"]')
    .innerText();
  assert(
    decodeURIComponent(
      await p.locator('.hero-chat').getAttribute('href'),
    ).includes(selected),
  );
  report.checks.push(
    'Destination shuffle changes the film, discovery link and contextual WhatsApp enquiry',
  );
  for (const film of films.filter((f) => f.destinationSlugs.length)) {
    await p.goto(origin + '/destinations/' + film.destinationSlugs[0]);
    await plays(p);
    assert.equal(
      Math.round(await p.locator('video').evaluate((v) => v.duration)),
      40,
    );
    await p.locator('video').evaluate(async (v) => {
      v.pause();
      const sought = new Promise((resolve) =>
        v.addEventListener('seeked', resolve, { once: true }),
      );
      v.currentTime = 37.5;
      await sought;
    });
    assert(
      await p
        .locator('video')
        .evaluate((v) => v.readyState >= 2 && v.currentTime > 37),
    );
    const seo = await p.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent,
      title: document.title,
      canonical: document.querySelector('link[rel=canonical]')?.href,
      schemas: [
        ...document.querySelectorAll('script[type="application/ld+json"]'),
      ].map((s) => JSON.parse(s.textContent)),
    }));
    assert(seo.canonical.endsWith('/destinations/' + film.destinationSlugs[0]));
    assert(seo.schemas.length >= 2);
  }
  report.checks.push(
    'All five destination films decode the eighth scene at 37.5s; canonical and structured data present',
  );
  const desktop = await context({ width: 1440 });
  const d = await desktop.newPage();
  await d.goto(origin);
  await plays(d);
  assert.deepEqual(
    await d.locator('video').evaluate((v) => [v.videoWidth, v.videoHeight]),
    [1920, 1080],
  );
  await d.screenshot({ path: 'artifacts/premium-home-desktop.png' });
  await desktop.close();
  report.checks.push(
    'Fast desktop plays full-HD; source framing differs from portrait mobile',
  );
  for (const mode of [
    { name: 'save-data', saveData: true },
    { name: 'slow-4g', downlink: 0.2 },
    { name: 'low-end', cores: 2, memory: 2 },
    { name: 'reduced-motion', reduced: 'reduce' },
  ]) {
    const restricted = await context(mode);
    const r = await restricted.newPage();
    const downloads = [];
    r.on('request', (req) => {
      if (req.url().includes('/assets/videos/') && req.url().endsWith('.mp4'))
        downloads.push(req.url());
    });
    await r.goto(origin);
    await r.waitForTimeout(1800);
    if (mode.name === 'save-data' || mode.name === 'reduced-motion') {
      assert.equal(downloads.length, 0, mode.name);
      assert.equal(await r.locator('video').getAttribute('src'), null);
      report.checks.push(
        mode.name + ': explicit browser preference retains the photograph',
      );
    } else {
      await plays(r);
      assert.match(await r.locator('video').getAttribute('src'), /-lite\.mp4$/);
      report.checks.push(
        mode.name +
          ': lighter video starts automatically without a play button',
      );
    }
    assert.equal(await r.locator('.scenic-control').count(), 0);
    await restricted.close();
  }
  const slow = await context({ cores: 2, memory: 2, downlink: 0.128 });
  const s = await slow.newPage();
  const cdp = await slow.newCDPSession(s);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 250,
    downloadThroughput: 16 * 1024,
    uploadThroughput: 8 * 1024,
    connectionType: 'cellular3g',
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  const started = Date.now();
  await s.goto(origin, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await s.locator('.scenic-media img').evaluate((img) => img.decode());
  const metrics = await s.evaluate(() => ({
    lcpMs: window.__lcp,
    heroUrl: document.querySelector('.scenic-media img').currentSrc,
    video: document.querySelector('video').getAttribute('src'),
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    paint: performance
      .getEntriesByType('paint')
      .map((x) => ({ name: x.name, ms: x.startTime })),
  }));
  assert(!metrics.video || /-lite\.mp4$/.test(metrics.video));
  assert.equal(metrics.overflow, false);
  assert.match(metrics.heroUrl, /-(384|640)\.webp/);
  report.network.push({
    profile: '128kbps,250ms latency,6x CPU slowdown,2 cores/2GB',
    elapsedMs: Date.now() - started,
    ...metrics,
  });
  await s.screenshot({ path: 'artifacts/premium-slow-mobile.png' });
  await slow.close();
  for (const width of [320, 390, 768, 1440]) {
    await p.setViewportSize({ width, height: 844 });
    for (const route of [
      '/',
      '/tours',
      '/destinations',
      '/tours/bali-indonesia-7-days',
      '/tours/nepal',
      '/destinations/sikkim-darjeeling',
      '/gallery',
    ]) {
      await p.goto(origin + route);
      assert(
        !(await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )),
        route + ' ' + width,
      );
      assert.equal(await p.locator('h1').count(), 1, route);
      report.layouts.push({ route, width, overflow: false });
    }
  }
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto(origin + '/tours/bali-indonesia-7-days');
  await p.locator('.tour-hero-fullscreen img').evaluate((img) => img.decode());
  await p.screenshot({ path: 'artifacts/premium-bali-mobile.png' });
  assert.match(
    await p.locator('.tour-hero-actions a').first().getAttribute('href'),
    /919665238966/,
  );
  const nojs = await context({ js: false });
  const n = await nojs.newPage();
  await n.goto(origin);
  assert.equal(await n.locator('video').getAttribute('src'), null);
  assert(await n.locator('.scenic-media img').isVisible());
  assert.equal(await n.locator('.scenic-control').count(), 0);
  await nojs.close();
  const failure = await context();
  const f = await failure.newPage();
  await f.route('**/*.mp4', (r) => r.abort());
  await f.goto(origin);
  await f.waitForTimeout(2200);
  assert.equal(await f.locator('.scenic-media.is-playing-frame').count(), 0);
  assert(await f.locator('.scenic-media img').isVisible());
  await failure.close();
  assert.deepEqual(errors, []);
  report.checks.push(
    '28 responsive layouts; one H1 each; contextual WhatsApp; no-JS and video-failure photo fallbacks; no page errors',
  );
  const credits = await p.request.get(origin + '/photo-credits');
  assert((await credits.text()).includes('Download this edited excerpt'));
  const sitemap = await p.request.get(origin + '/sitemap.xml');
  assert((await sitemap.text()).includes('image:loc'));
  report.checks.push(
    'Scene-level licences and edited CC downloads; image sitemap entries served',
  );
} finally {
  await writeFile(
    'artifacts/premium-experience-validation.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
