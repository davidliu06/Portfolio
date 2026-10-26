const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${process.env.PREVIEW_URL || 'http://127.0.0.1:3019'}/electrical`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('#can-bus-shield').count(), 0);
      const project = page.locator('#pocket-rhythm');
      await project.scrollIntoViewIfNeeded();
      const canvas = project.locator('canvas');
      await canvas.waitFor();
      await page.waitForFunction(() => !document.querySelector('#pocket-rhythm [role="status"]'));
      await page.waitForTimeout(500);
      assert.ok(await canvas.evaluate(c => {
        const gl = c.getContext('webgl2');
        const pixels = new Uint8Array(c.width * c.height * 4);
        gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        let count = 0;
        for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) count++;
        return count > 1000;
      }));
      await page.screenshot({ path: `.artifacts/pocket-rhythm-${width}.png` });
      const before = await canvas.evaluate(c => c.toDataURL());
      await project.getByRole('button', { name: 'Flip board', exact: true }).click();
      await page.waitForTimeout(300);
      assert.notEqual(await canvas.evaluate(c => c.toDataURL()), before);
      await project.getByRole('button', { name: 'Show static image', exact: true }).click();
      await page.waitForFunction(() => [...document.querySelectorAll('#pocket-rhythm img')].some(img => img.complete && img.naturalWidth > 0));
      assert.match(await project.innerText(), /physical control testing remain pending/);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}: drum machine, rendered 3D model, flip, image fallback, validation copy`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
