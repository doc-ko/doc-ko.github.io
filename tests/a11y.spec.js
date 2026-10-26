// WCAG 2.2 AA on every built page, at phone and desktop width, in both themes.
// axe-core checks contrast, names, landmarks, target size and the rest of what a
// machine can judge; keyboard order and screen-reader wording still need a look.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes, viewports } from './routes.js';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const viewport of viewports) {
    for (const theme of ['light', 'dark']) {
        for (const route of routes()) {
            test(`${route} meets WCAG 2.2 AA, ${viewport.name}, ${theme}`, async ({ page }) => {
                await page.setViewportSize(viewport);
                await page.emulateMedia({ colorScheme: theme });
                await page.goto(route);
                await page.evaluate(() => document.fonts.ready);

                const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
                expect(
                    violations.map(({ id, nodes }) => `${id}: ${nodes.map((node) => node.target.join(' ')).join(' | ')}`),
                ).toEqual([]);
            });
        }
    }
}
