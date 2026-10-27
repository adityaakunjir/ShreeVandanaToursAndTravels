import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(
  pathToFileURL(process.env.PLAYWRIGHT_MODULE).href
);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      reducedMotion,
    });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route(/instagram\.com/, (route) => route.abort());
    await page.addInitScript(() => {
      window.motionCount = 0;
      const original = Element.prototype.animate;
      Element.prototype.animate = function (...args) {
        window.motionCount++;
        return original.apply(this, args);
      };
    });
    await page.goto('http://localhost:3005/');
    await page.waitForTimeout(700);
    for (let y = 500; y < 5500; y += 500) {
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: 'instant' }),
        y,
      );
      await page.waitForTimeout(120);
    }
    const count = await page.evaluate(() => window.motionCount);
    assert(
      reducedMotion === 'reduce' ? count === 0 : count > 0,
      `Reveal count: ${count}`,
    );
    const surprise = page.getByRole('button', { name: 'Surprise me' });
    await surprise.click();
    assert.equal(
      await page
        .locator('.surprise-postcard')
        .evaluate((el) => getComputedStyle(el).animationName),
      reducedMotion === 'reduce' ? 'none' : 'destination-arrival',
    );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    assert.deepEqual(errors, []);
    console.log(
      `${reducedMotion}: ${count} scroll entrances; surprise, preference change, overflow and console checks passed`,
    );
    await page.close();
  }
  const page = await browser.newPage({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
  });
  await page.goto('http://localhost:3005/');
  assert(await page.locator('h1').isVisible());
  assert.equal(
    await page
      .locator('.brochure-tour-card')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity),
    '1',
  );
  console.log('JavaScript disabled: headline and tour content remain visible');
} finally {
  await browser.close();
}
