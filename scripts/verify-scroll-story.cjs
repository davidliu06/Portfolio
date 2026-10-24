const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:3016';

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    for (const [width, height] of [[1440, 900], [390, 844], [844, 390]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(`${base}/electrical`, { waitUntil: 'networkidle' });
      const track = page.locator('.pcb-story-track');
      const canvas = page.locator('.pcb-story-model canvas');
      await canvas.waitFor();
      const frames = [];
      for (let chapter = 0; chapter < 6; chapter++) {
        await track.evaluate((el, i) => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top + (el.offsetHeight - innerHeight) * i / 5), chapter);
        await page.waitForTimeout(900);
        assert.equal(await page.locator('.pcb-story-stage').getAttribute('data-chapter'), String(chapter));
        const pixels = await canvas.evaluate(c => {
          const gl = c.getContext('webgl2');
          const data = new Uint8Array(c.width * c.height * 4);
          gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
          let painted = 0;
          for (let i = 3; i < data.length; i += 4) if (data[i]) painted++;
          return painted;
        });
        assert.ok(pixels > 1000, `Chapter ${chapter}: nonblank ${pixels}`);
        frames.push(await canvas.evaluate(c => c.toDataURL()));
        const text = page.locator('.pcb-story-chapter').nth(chapter);
        const box = await text.boundingBox();
        const nav = await page.locator('.pcb-story-chapters').boundingBox();
        assert.ok(box.y + box.height <= nav.y + 2, `Chapter ${chapter}: text clear of controls`);
        await page.screenshot({ path: `.artifacts/story-${width}-${chapter}.png` });
      }
      assert.notEqual(frames[0], frames[2], 'Scroll changes board view');
      await page.getByRole('button', { name: 'Chapter 2: The surface', exact: true }).click();
      await page.waitForTimeout(1500);
      assert.equal(await page.locator('.pcb-story-stage').getAttribute('data-chapter'), '1');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.locator('#inspect-card .pcb-viewer').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
      const viewer = page.locator('#inspect-card .pcb-viewer');
      await viewer.locator('canvas').waitFor();
      await viewer.getByRole('status').waitFor({ state: 'hidden' });
      const before = await viewer.locator('canvas').evaluate(c => c.toDataURL());
      const bounds = await viewer.locator('canvas').boundingBox();
      await page.mouse.move(bounds.x + bounds.width * 0.45, bounds.y + bounds.height * 0.5);
      await page.mouse.down();
      await page.mouse.move(bounds.x + bounds.width * 0.65, bounds.y + bounds.height * 0.55, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(200);
      assert.notEqual(before, await viewer.locator('canvas').evaluate(c => c.toDataURL()), 'Final viewer drags');
      await page.screenshot({ path: `.artifacts/story-inspect-${width}.png` });
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}: six chapters, rendered pixels, scroll motion, text framing, final drag, no runtime errors`);
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(`${base}/electrical`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.pcb-story-track').count(), 0);
    assert.equal(await page.getByRole('heading', { name: 'The connection is in the copper.' }).count(), 1);
    console.log('PASS reduced-motion static story');
    await page.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
