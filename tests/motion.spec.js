// With "reduce motion" on, nothing may keep moving: no looping animation, and
// no transition longer than a blink. Most motion only starts on hover or click,
// so the test hovers every tile, link and button and flips the theme first.
import { test, expect } from '@playwright/test';
import { routes } from './routes.js';

for (const route of routes()) {
    test(`${route} is still with reduced motion`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);

        // Move the pointer over each thing that might react, without the waits a
        // real hover does for scrolling and overlap.
        for (const element of await page.locator('.field-emblem__tile, a, button').all()) {
            const box = await element.boundingBox();
            if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        }
        await page.locator('.theme-toggle').click();

        const moving = await page.evaluate(() =>
            document
                .getAnimations()
                .filter((animation) => {
                    const timing = animation.effect.getComputedTiming();
                    return timing.iterations === Infinity || timing.duration > 10;
                })
                .map((animation) => `${animation.animationName ?? animation.transitionProperty} on ${animation.effect.target?.className?.baseVal ?? animation.effect.target?.className}`),
        );
        expect(moving).toEqual([]);
    });
}
