const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://localhost:3023', { waitUntil: 'networkidle' });
      await page.screenshot({ path: `.artifacts/light-home-${width}.png` });
      assert.equal(await page.getByText('Ask David', { exact: true }).count(), 0);
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(255, 255, 255)');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal((await page.request.post('http://localhost:3023/api/chat', { data: { messages: [] } })).status(), 410);
      if (width === 390) {
        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.locator('#mobile-navigation').getByRole('link', { name: 'Projects', exact: true }).click();
        await page.waitForTimeout(800);
      }
      await page.locator('#projects').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `.artifacts/light-projects-${width}.png` });
      await page.locator('.project-overview a').first().click();
      await page.waitForTimeout(1000);
      assert.ok(page.url().includes('/projects/'));
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}: white theme, no assistant, retired API, navigation, project route, no runtime errors`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
