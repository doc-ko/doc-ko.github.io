// Keeps boxes of unknown height on the 24px grid, and switches on the ?grid
// overlay. Without this script the page still works; lines below an image or
// a scrolling code block just drift off the dots.
const UNIT = 24;
const TOLERANCE = 0.5;
const SELECTOR = '[data-grid-pad], main pre, main .katex-display, main img';

// The extra bottom padding that rounds a box up to a whole number of units.
// --grid-pad is part of the box's own height, so take it out before measuring.
function pad(element) {
    const current = parseFloat(element.style.getPropertyValue('--grid-pad')) || 0;
    const height = element.getBoundingClientRect().height - current;
    const remainder = height % UNIT;
    const next = remainder < TOLERANCE || UNIT - remainder < TOLERANCE ? 0 : UNIT - remainder;
    if (Math.abs(next - current) > 0.01) element.style.setProperty('--grid-pad', `${next}px`);
}

const observer = new ResizeObserver((entries) => entries.forEach((entry) => pad(entry.target)));
document.querySelectorAll(SELECTOR).forEach((element) => {
    observer.observe(element);
    if (element instanceof HTMLImageElement && !element.complete) {
        element.addEventListener('load', () => pad(element), { once: true });
    }
});

// Web fonts change how text wraps, which changes heights.
document.fonts?.ready.then(() => {
    document.querySelectorAll(SELECTOR).forEach(pad);
});

// ?grid draws the unit lines and outlines every box that is off the grid. The
// same check backs the Playwright test (tests/grid.spec.js).
if (new URLSearchParams(location.search).has('grid')) {
    import('./grid-check.js').then(({ findOffGrid }) => {
        document.querySelector('.page')?.classList.add('show-grid');
        window.__findOffGrid = findOffGrid;
        const mark = () => {
            document.querySelectorAll('.grid-off').forEach((element) => element.classList.remove('grid-off'));
            findOffGrid().forEach(({ element }) => element.classList.add('grid-off'));
        };
        mark();
        document.fonts?.ready.then(mark);
        window.addEventListener('resize', mark);
    });
}
