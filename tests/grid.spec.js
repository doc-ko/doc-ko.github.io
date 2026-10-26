// Every box in <main> must start and be tall in whole 24px units, at phone and
// desktop width, in both themes. The check itself is src/scripts/grid-check.js,
// the same one behind the ?grid overlay.
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { routes, viewports } from './routes.js';

for (const viewport of viewports) {
    for (const theme of ['light', 'dark']) {
        for (const route of routes()) {
            test(`${route} on the grid, ${viewport.name}, ${theme}`, async ({ page }) => {
                await page.setViewportSize(viewport);
                await page.emulateMedia({ colorScheme: theme });
                await page.goto(`${route}?grid`);
                await page.evaluate(() => document.fonts.ready);
                await page.waitForFunction(() => typeof window.__findOffGrid === 'function');

                const off = await page.evaluate(() =>
                    window.__findOffGrid().map(({ selector, top, height }) => `${selector} top ${top} height ${height}`),
                );
                expect(off).toEqual([]);
            });
        }
    }
}

// Boxes the stylesheet cannot size (an image of odd height, wide code, display
// maths) are rounded up to whole units by src/scripts/grid.js. This test splices
// such content into a copy of the About page and serves the copy at a path that
// exists only inside the test, so nothing extra ships in dist/.
const fixtureHtml = () =>
    readFileSync('dist/about/index.html', 'utf8').replace('</main>', `${readFileSync('tests/fixtures/grid-content.html', 'utf8')}</main>`);

for (const viewport of viewports) {
    for (const theme of ['light', 'dark']) {
        test(`images, code and maths pad to the grid, ${viewport.name}, ${theme}`, async ({ page }) => {
            await page.route(/\/__fixture\//, (route) => route.fulfill({ contentType: 'text/html', body: fixtureHtml() }));
            await page.setViewportSize(viewport);
            await page.emulateMedia({ colorScheme: theme });
            await page.goto('/__fixture/?grid');
            await page.evaluate(() => document.fonts.ready);
            await page.waitForFunction(() => typeof window.__findOffGrid === 'function');
            // Give the resize observers a frame to apply the padding.
            await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));

            const off = await page.evaluate(() =>
                window.__findOffGrid().map(({ selector, top, height }) => `${selector} top ${top} height ${height}`),
            );
            expect(off).toEqual([]);

            // grid.js sets --grid-pad on each <pre>. A <pre> inside .code-block gets
            // exactly that as bottom padding (not doubled); a bare <pre> keeps its
            // unit of padding and adds it on top. The pad is not always a whole
            // number of units: where scrollbars take room it is the remainder.
            const padding = await page.evaluate(() => {
                const read = (pre) => ({
                    padding: parseFloat(getComputedStyle(pre).paddingBottom),
                    pad: parseFloat(pre.style.getPropertyValue('--grid-pad')) || 0,
                });
                return {
                    code: read(document.querySelector('.code-block pre')),
                    bare: read([...document.querySelectorAll('main pre')].find((el) => !el.closest('.code-block'))),
                };
            });
            expect(padding.code.padding).toBeCloseTo(padding.code.pad, 1);
            expect(padding.bare.padding).toBeCloseTo(24 + padding.bare.pad, 1);
        });
    }
}
