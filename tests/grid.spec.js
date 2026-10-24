// Every box in <main> must start and be tall in whole 24px units, at phone and
// desktop width, in both themes. The check itself is src/scripts/grid-check.js,
// the same one behind the ?grid overlay.
import { test, expect } from '@playwright/test';
import { readdirSync, statSync } from 'node:fs';
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
