import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const origin='http://localhost:3005';
const xml=await(await fetch(origin+'/sitemap.xml')).text();
const paths=[...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).pathname).concat(['/photo-credits','/tours/saved','/tours/compare','/not-a-real-route']))];
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
  for(const width of [390,1440]) {
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    for(const path of paths) {
      await page.goto(origin+path,{waitUntil:'domcontentloaded'});await page.locator('h1').waitFor();
      const state=await page.evaluate(()=>({hasHero:!!document.querySelector('.home-hero-fullscreen,.tour-hero-fullscreen'),heroHeader:document.querySelector('.site-header').classList.contains('is-hero'),background:getComputedStyle(document.querySelector('.site-header')).backgroundColor}));
      results.push({path,width,...state});assert.equal(state.heroHeader,state.hasHero,path);
    }
    await page.close();
  }
  await writeFile('artifacts/header-theme-validation.json',JSON.stringify(results,null,2)+'\n');
  console.log('PASS header theme matches actual page composition:',results.length,'page/view combinations');
} finally {await browser.close();}
