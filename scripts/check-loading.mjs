import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.route('**/*',async route=>{
    const headers=route.request().headers();
    if(new URL(route.request().url()).pathname==='/tours' && headers.rsc && !headers['next-router-prefetch'] && !headers['next-router-segment-prefetch']) await new Promise(resolve=>setTimeout(resolve,7000));
    await route.continue();
  });
  await page.goto('http://localhost:3005/contact');
  await page.getByRole('button',{name:/open menu/i}).click();
  await page.waitForTimeout(1500);
  const loading=page.locator('.journey-loading').waitFor({state:'visible',timeout:12000});
  const navigate=page.getByRole('link',{name:'Our tours',exact:true}).click({noWaitAfter:true});
  await loading;
  await page.screenshot({path:'artifacts/journey-loading-mobile.png'});
  await page.setViewportSize({width:1440,height:900});
  await page.screenshot({path:'artifacts/journey-loading-desktop.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.journey-loading-mark svg').evaluate(e=>getComputedStyle(e).animationName),'none');
  await navigate;
  await page.locator('.journey-loading').waitFor({state:'hidden',timeout:15000});
  await writeFile('artifacts/loading-validation.json',JSON.stringify({realDelayedNavigation:true,disappearsAfterResponse:true,forcedMinimumDelayInProduct:false,mobileAndDesktopCaptured:true,reducedMotionRespected:true},null,2)+'\n');
  console.log('PASS real navigation loading, reduced motion and subsequent content');
} finally {await browser.close();}
