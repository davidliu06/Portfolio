const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3014';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    for (const width of [1440, 768, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(base, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.project-overview').count(), 5);
      assert.equal(await page.getByRole('button', { name: 'Overview', exact: true }).getAttribute('aria-pressed'), 'true');
      if (width < 1024) {
        const menu = page.getByRole('button', { name: 'Open menu' });
        await menu.click();
        assert.equal(await page.getByRole('button', { name: 'Close menu' }).getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Escape');
        assert.equal(await menu.getAttribute('aria-expanded'), 'false');
        assert.equal(await menu.evaluate(el => el === document.activeElement), true);
      }
      await page.locator('#projects').evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.locator('.project-overview img').first().evaluate(img => img.decode());
      await page.screenshot({ path: `.artifacts/ux-projects-${width}.png` });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.route('**/api/contact', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
      await page.locator('#contact').getByLabel('Name', { exact: true }).fill('Test recruiter');
      await page.locator('#contact').getByLabel('Email', { exact: true }).fill('test@example.com');
      await page.locator('#contact').getByLabel('Message', { exact: true }).fill('UI verification only; no email sent.');
      await page.getByRole('button', { name: 'Send Message', exact: true }).click();
      await page.getByText('Message sent. Thanks for reaching out.', { exact: true }).waitFor();
      await page.goto(`${base}/electrical`, { waitUntil: 'networkidle' });
      const viewer = page.locator('.pcb-viewer').first();
      await viewer.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await viewer.getByRole('button', { name: 'Show static image' }).click();
      assert.equal(await viewer.locator('canvas').count(), 0);
      assert.equal(await viewer.locator('img').count(), 1);
      await viewer.getByRole('button', { name: 'Show 3D model' }).click();
      await viewer.locator('canvas').waitFor();
      await page.locator('#electrical summary').first().click();
      assert.equal(await page.locator('#electrical details').first().getAttribute('open'), '');
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}: overview, navigation, layout, mocked contact, PCB image/3D toggle, design disclosure`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
