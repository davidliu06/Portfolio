const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1116-1220-0_26.1116.1220.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3028';
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${base}/projects/formula-sae-chassis-jig`);
      assert.equal(response.status(), 200);
      await page.getByRole('heading', { name: 'Formula SAE Chassis Jig', exact: true }).waitFor();
      const pictures = page.locator('img');
      assert.equal(await pictures.count(), 2);
      for (let i = 0; i < 2; i++) {
        await pictures.nth(i).scrollIntoViewIfNeeded();
        await pictures.nth(i).evaluate(img => img.decode());
        assert(await pictures.nth(i).evaluate(img => img.naturalWidth > 0 && getComputedStyle(img).objectFit === 'contain'));
      }
      await page.screenshot({ path: `.artifacts/fsae-gallery-${width}.png` });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(900);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: `.artifacts/fsae-hero-${width}.png` });
      const fullImage = page.getByRole('link', { name: /Open full-size image/ });
      assert.equal(await fullImage.getAttribute('href'), '/images/fsae-chassis-jig.png');
      await page.getByRole('button', { name: 'Back to projects', exact: true }).first().click();
      await page.waitForURL(`${base}/#projects`);
      await page.getByRole('heading', { name: 'Selected projects', exact: true }).waitFor();
      assert.equal(await page.locator('#projects .project-overview').count(), 5);
      assert.equal(await page.locator('#projects a[href="/projects/formula-sae-chassis-jig"]').count(), 2);
      await page.goto(`${base}/projects/aerodynamic-nose-cones`);
      await page.getByRole('heading', { level: 1 }).waitFor();
      assert.equal(await page.locator('img').count(), 4);
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`${width}: project, both images, full-size link, return navigation, and existing-project regression passed`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
