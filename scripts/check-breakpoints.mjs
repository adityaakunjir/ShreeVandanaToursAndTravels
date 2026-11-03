import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const browser=await chromium.launch({channel:'chrome',headless:true});
const rows=[];
try {
 for(const width of [360,414,900,901,1024,1280,1920]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  for(const path of ['/','/tours','/destinations/india','/tours/japan-8-days','/contact','/gallery']) {
   await page.goto('http://localhost:3005'+path,{waitUntil:'load'});
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,clippedNav:[...document.querySelectorAll('.main-nav a')].filter(e=>e.checkVisibility()&&e.getBoundingClientRect().width>0&&(e.getBoundingClientRect().right>innerWidth+1||e.getBoundingClientRect().left<0)).map(e=>e.textContent)}));
   rows.push({width,path,...state});assert.equal(state.overflow,false);assert.equal(state.clippedNav.length,0,JSON.stringify(rows.at(-1)));
   if(path==='/gallery' && [414,1280].includes(width)) {
    const tiles=page.locator('.photo-tile');
    await tiles.first().scrollIntoViewIfNeeded();await page.waitForTimeout(800);
    await page.screenshot({path:`artifacts/gallery-final-${width}.png`});
    for(let i=0;i<await tiles.count();i++) {
     await tiles.nth(i).scrollIntoViewIfNeeded();
     await tiles.nth(i).locator('img').evaluate(i=>i.decode());
    }
    assert.equal(await tiles.locator('img').evaluateAll(xs=>xs.filter(i=>i.naturalWidth===0).length),0);
   }
  }
  await page.close();
 }
 await writeFile('artifacts/breakpoint-validation.json',JSON.stringify(rows,null,2)+'\n');console.log('PASS',rows.length,'breakpoint layouts; every gallery image decodes');
} finally {await browser.close();}
