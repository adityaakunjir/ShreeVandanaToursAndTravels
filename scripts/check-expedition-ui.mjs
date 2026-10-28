import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
// Browser tooling is optional for local QA, not a production dependency.
if (!process.env.PLAYWRIGHT_MODULE)
  throw new Error(
    'Set PLAYWRIGHT_MODULE to the installed playwright index.mjs',
  );
const { chromium } = await import(
  pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
);
const origin = 'http://localhost:3005';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
// These checks cover first-party layout; third-party playback is independent.
await page.route(/instagram\.com/, (route) => route.abort());
const report = {
  checkedAt: new Date().toISOString(),
  layouts: [],
  interactions: [],
};
try {
  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  );
  const representative = [
    '/',
    '/tours',
    '/destinations',
    '/destinations/dubai',
    '/about',
    '/services',
    '/gallery',
    '/contact',
    '/faq',
    '/tours/japan-8-days',
    '/tours/odisha-7-days',
    '/collections/honeymoon-romance',
    '/tours/saved',
    '/tours/compare',
    '/travel-information',
  ];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of width === 320
      ? [...new Set([...paths, ...representative])]
      : representative) {
      const response = await page.goto(`${origin}${path}`, {
        waitUntil: 'domcontentloaded',
      });
      await page.locator('h1').waitFor();
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        headings: document.querySelectorAll('h1').length,
        serifHeadings: [...document.querySelectorAll('h1,h2,h3')]
          .filter((el) => getComputedStyle(el).fontFamily.startsWith('Georgia'))
          .map((el) => el.textContent),
      }));
      report.layouts.push({
        path,
        width,
        status: response.status(),
        ...result,
      });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);
  await page
    .locator('.curated-hero-image img')
    .evaluate((image) => image.decode());
  await page.screenshot({ path: 'artifacts/expedition-mobile.png' });
  const toggle = page.getByRole('button', { name: /open menu/i });
  await toggle.click();
  assert.equal(
    await page.locator('#main-content').evaluate((el) => el.inert),
    true,
  );
  await page.keyboard.press('Escape');
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  report.interactions.push(
    'Mobile menu opens, makes background inert and closes on Escape',
  );
  await page.goto(`${origin}/tours`);
  await page.locator('.optional-discovery > summary').click();
  await page.locator('#journal-mood').selectOption('romance');
  await page.locator('#journal-time').selectOption('6');
  await page.getByRole('button', { name: /surprise me/i }).click();
  assert.match(
    await page.locator('.surprise-postcard').innerText(),
    /Mauritius/,
  );
  report.interactions.push(
    'Mood and duration select the matching Mauritius itinerary',
  );
  await page.goto(`${origin}/tours`);
  await page.screenshot({ path: 'artifacts/expedition-tours-mobile.png' });
  await page.locator('#tour-q').fill('Japan');
  await page.locator('.discovery-options summary').click();
  await page.locator('#tour-duration').selectOption('8');
  await page.locator('form[role=search] button[type=submit]').click();
  await page.waitForURL(/q=Japan/);
  assert.equal(await page.locator('.brochure-tour-card').count(), 1);
  assert.match(await page.locator('.brochure-tour-card').innerText(), /Japan/);
  report.interactions.push('Tour search returns Japan for Japan/eight days');
  await page.goto(`${origin}/tours/japan-8-days`);
  const whatsApp = await page
    .locator('.brochure-mobile-action a')
    .getAttribute('href');
  assert.ok(whatsApp.includes('919665238966'));
  report.interactions.push(
    'Tour mobile enquiry targets the primary WhatsApp number',
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin);
  await page
    .locator('.curated-hero-image img')
    .evaluate((image) => image.decode());
  await page.screenshot({ path: 'artifacts/expedition-desktop.png' });
  const failures = report.layouts.filter(
    (r) =>
      r.status !== 200 ||
      r.overflow ||
      r.headings !== 1 ||
      r.serifHeadings.length,
  );
  report.failures = failures;
  assert.equal(failures.length, 0, JSON.stringify(failures));
} finally {
  await writeFile(
    'artifacts/expedition-validation.json',
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await browser.close();
}
console.log(
  `Passed ${report.layouts.length} layouts and ${report.interactions.length} interaction checks`,
);
