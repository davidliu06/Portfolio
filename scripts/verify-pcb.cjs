const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:3014', { waitUntil: 'networkidle' });
      assert.match(await page.locator('body').innerText(), /B\.S\. Engineering/);
      for (let index = 0; index < 2; index++) {
        const viewer = page.locator('.pcb-viewer').nth(index);
        await viewer.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await viewer.locator('canvas').waitFor();
        await viewer.getByRole('status').waitFor({ state: 'hidden' });
        await page.waitForTimeout(500);
        const painted = await viewer.locator('canvas').evaluate(canvas => {
          const gl = canvas.getContext('webgl2');
          const pixels = new Uint8Array(canvas.width * canvas.height * 4);
          gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          let count = 0;
          for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) count++;
          return count;
        });
        assert.ok(painted > 1000, `PCB ${index} nonblank (${painted})`);
        await viewer.screenshot({ path: `.artifacts/pcb-${width}-${index}.png` });
        const before = await viewer.locator('canvas').evaluate(c => c.toDataURL());
        await viewer.getByRole('button', { name: 'Flip board' }).click();
        await page.waitForTimeout(200);
        assert.equal(await viewer.getByRole('button', { name: 'Flip board' }).getAttribute('aria-pressed'), 'true');
        const after = await viewer.locator('canvas').evaluate(c => c.toDataURL());
        assert.notEqual(before, after, 'Flip changes rendered board');
        await viewer.screenshot({ path: `.artifacts/pcb-${width}-${index}-back.png` });
        await viewer.getByRole('button', { name: 'Rotate right' }).click();
        await viewer.getByRole('button', { name: 'Zoom in' }).click();
        await viewer.getByRole('button', { name: 'Reset view' }).click();
        assert.equal(await viewer.getByRole('button', { name: 'Flip board' }).getAttribute('aria-pressed'), 'false');
        console.log(`PASS ${width}px PCB ${index}: ${painted} pixels, flip, rotation, zoom, reset`);
      }
      await page.locator('#electrical summary').first().click();
      assert.equal(await page.locator('#electrical details').first().getAttribute('open'), '');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
