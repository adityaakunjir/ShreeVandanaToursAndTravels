import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(
  pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const origin = process.env.QA_ORIGIN || 'http://localhost:3005';
const report = { checkedAt: new Date().toISOString(), layouts: [], checks: [] };
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.route(/instagram\.com/, (route) => route.abort());
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(origin);
    await page
      .locator('.home-hero-parallax .scenic-media img')
      .evaluate((image) => image.decode());
    const metrics = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      homeSections: document.querySelectorAll('main > section').length,
      emoji: /[\u{1F000}-\u{1FAFF}\u2600-\u27BF\uFE0F]/u.test(
        document.querySelector('main').innerText,
      ),
    }));
    assert(!metrics.overflow);
    assert(!metrics.emoji);
    if (width === 390) {
      assert(
        metrics.height < 6000,
        `Homepage still too long: ${metrics.height}px`,
      );
      await page.screenshot({
        path: 'artifacts/focused-home-mobile.png',
        fullPage: true,
      });
    }
    report.layouts.push({ width, ...metrics });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);
  assert.equal(await page.locator('main .reel-screen > iframe').count(),2);
  await page.locator('#instagram').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelectorAll('main iframe[src*="instagram.com/reel"]').length===2);
  assert.equal(
    await page.locator('main iframe[src*="instagram.com/reel"]').count(),
    2,
  );
  assert.equal(await page.locator('.destination-shortcuts a').count(), 5);
  assert.equal(await page.locator('main .brochure-tour-card').count(), 5);
  assert.equal(
    await page.locator('.footer-directory').getAttribute('open'),
    null,
  );
  await page.locator('.footer-directory summary').click();
  assert(await page.locator('.footer-directory a[href="/faq"]').isVisible());
  report.checks.push(
    'Five priority destinations and tours remain; two automatic reel embeds remain; footer links expand',
  );
  await page.goto(`${origin}/destinations`);
  assert.equal(await page.locator('.destination-card').count(), 5);
  assert(!(await page.locator('#atlas').isVisible()));
  await page.locator('.optional-discovery summary').click();
  assert(await page.locator('#atlas').isVisible());
  report.checks.push(
    'Five destination cards and expandable full directory work',
  );
  await page.goto(`${origin}/collections/himalayan-escapes`);
  assert.equal(await page.locator('.brochure-tour-card:visible').count(), 6);
  await page.locator('.optional-discovery summary').click();
  assert((await page.locator('.brochure-tour-card:visible').count()) > 6);
  report.checks.push(
    'Collection initially shows six outlines and expands to remaining routes',
  );
  const noJS = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  await noJS.goto(`${origin}/destinations`);
  await noJS.locator('.optional-discovery summary').click();
  assert(await noJS.locator('#atlas').isVisible());
  await noJS.locator('.footer-directory summary').click();
  assert(await noJS.locator('.footer-directory a[href="/faq"]').isVisible());
  report.checks.push(
    'Destination directory and footer expand without JavaScript',
  );
} finally {
  await writeFile(
    'artifacts/focused-mobile-validation.json',
    JSON.stringify(report, null, 2) + '\n',
  );
  await browser.close();
}
console.log(JSON.stringify(report, null, 2));
