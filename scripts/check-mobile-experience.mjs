import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(
  pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const origin = process.env.QA_ORIGIN || 'http://localhost:3005';
const report = { checkedAt: new Date().toISOString(), checks: [] };
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route(/instagram\.com/, (route) => route.abort());
  const slugs = new Set();
  for (let number = 1; number <= 5; number++) {
    await page.goto(`${origin}/tours?page=${number}`);
    const links = await page
      .locator('.brochure-tour-card h2 a')
      .evaluateAll((elements) => elements.map((el) => el.getAttribute('href')));
    assert.equal(links.length, number === 5 ? 8 : 12);
    for (const href of links) {
      assert(!slugs.has(href), `Duplicate ${href}`);
      slugs.add(href);
    }
    assert.match(
      await page.locator('.catalogue-pagination').innerText(),
      new RegExp(`Page ${number} of 5`),
    );
  }
  assert.equal(slugs.size, 56);
  report.checks.push(
    'All 56 tours are reachable across five pages without duplicates',
  );
  await page.goto(`${origin}/tours?region=India&sort=shortest`);
  assert(
    (await page.locator('.discovery-options').getAttribute('open')) !== null,
  );
  const next = await page
    .getByRole('link', { name: 'Next tours' })
    .getAttribute('href');
  assert(
    next.includes('region=India') &&
      next.includes('sort=shortest') &&
      next.includes('page=2'),
  );
  await page.getByRole('link', { name: 'Next tours' }).click();
  await page.waitForURL(/page=2/);
  await page.locator('#tour-q').fill('Japan');
  await page.locator('#tour-region').selectOption('');
  await page.getByRole('button', { name: 'Find my journey' }).click();
  await page.waitForURL(/q=Japan/);
  assert(!new URL(page.url()).searchParams.has('page'));
  assert.equal(await page.locator('.brochure-tour-card').count(), 1);
  report.checks.push(
    'Pagination preserves filters; new searches reset the page; active filters stay expanded',
  );
  await page.goto(`${origin}/tours/nepal`);
  await page.locator('.tour-section-nav a[href="#itinerary"]').click();
  await page.waitForTimeout(150);
  const anchor = await page.locator('#itinerary').boundingBox();
  const rail = await page.locator('.tour-section-nav').boundingBox();
  assert(
    anchor.y >= rail.y + rail.height - 2,
    'Sticky navigation covers itinerary heading',
  );
  await page.locator('#itinerary details').nth(1).locator('summary').click();
  assert.notEqual(
    await page.locator('#itinerary details').nth(1).getAttribute('open'),
    null,
  );
  report.checks.push(
    'Sticky tour rail leaves anchor headings visible; itinerary day expansion works',
  );
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  await desktop.goto(`${origin}/tours`);
  assert.equal(await desktop.locator('.brochure-tour-card').count(), 12);
  assert(
    await desktop.getByRole('button', { name: 'Find my journey' }).isVisible(),
  );
  await desktop.locator('.discovery-options summary').click();
  assert(await desktop.locator('#tour-country').isVisible());
  report.checks.push('Desktop catalogue and expanded filters remain usable');
  const noJS = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  await noJS.goto(`${origin}/tours`);
  await noJS.locator('.discovery-options summary').click();
  assert(await noJS.locator('#tour-country').isVisible());
  await noJS.getByRole('link', { name: 'Next tours' }).click();
  assert.match(noJS.url(), /page=2/);
  report.checks.push(
    'Search disclosure and pagination work without JavaScript',
  );
  assert.deepEqual(errors, []);
  report.checks.push('No browser runtime errors during mobile interactions');
} finally {
  await writeFile(
    'artifacts/mobile-experience-validation.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  await browser.close();
}
console.log(report.checks.join('\n'));
