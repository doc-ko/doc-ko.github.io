// Every box in <main> must start and be tall in whole 24px units, at phone and
// desktop width, in both themes. The check itself is src/scripts/grid-check.js,
// the same one behind the ?grid overlay.
import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Every page in dist/ is a route: dist/about/index.html is /about/.
function routes(dir = 'dist', base = '') {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return routes(path, `${base}/${name}`);
        return name === 'index.html' ? [`${base}/`] : [];
    });
}

const viewports = [
    { name: 'phone', width: 390, height: 844 },
    { name: 'desktop', width: 1440, height: 900 },
];

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

            // The code block's <pre> is padded once, not twice.
            const doubled = await page.evaluate(() => {
                const pre = document.querySelector('.code-block pre');
                return parseFloat(getComputedStyle(pre).paddingBottom) % 24 !== 0 ? 'off' : getComputedStyle(pre).paddingBottom;
            });
            expect(doubled).not.toBe('off');

            // A bare <pre> keeps its unit of padding at the bottom, plus whatever
            // grid.js adds, so it is at least one unit and a whole number of them.
            const bare = await page.evaluate(() => {
                const pre = [...document.querySelectorAll('main pre')].find((el) => !el.closest('.code-block'));
                return parseFloat(getComputedStyle(pre).paddingBottom);
            });
            expect(bare).toBeGreaterThanOrEqual(24);
            expect(bare % 24).toBe(0);
        });
    }
}
