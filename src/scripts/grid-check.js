// Finds boxes in <main> whose top or height is not a whole number of units.
// Only block-level boxes count: an inline box sits inside a line, and the
// line height is already a whole number of units.
const UNIT = 24;
const TOLERANCE = 0.5;
const SKIP_INSIDE = 'svg, .katex, .visually-hidden, [data-grid-ignore]';

const onGrid = (value) => {
    const remainder = ((value % UNIT) + UNIT) % UNIT;
    return remainder < TOLERANCE || UNIT - remainder < TOLERANCE;
};

function describe(element) {
    const id = element.id ? `#${element.id}` : '';
    const classes = [...element.classList].filter((name) => name !== 'grid-off').map((name) => `.${name}`).join('');
    return `${element.tagName.toLowerCase()}${id}${classes}`;
}

export function findOffGrid() {
    const main = document.querySelector('main');
    if (!main) return [];

    const found = [];
    const mainTop = main.getBoundingClientRect().top;

    // <main> itself must start on a unit line of the page.
    const pageTop = (document.querySelector('.page') ?? document.body).getBoundingClientRect().top;
    if (!onGrid(mainTop - pageTop)) {
        found.push({ element: main, selector: describe(main), top: mainTop - pageTop, height: main.getBoundingClientRect().height });
    }

    for (const element of main.querySelectorAll('*')) {
        if (element.closest(SKIP_INSIDE)) continue;
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.display === 'contents' || style.display.startsWith('inline')) continue;
        if (style.position === 'absolute' || style.position === 'fixed') continue;

        const box = element.getBoundingClientRect();
        if (box.height === 0) continue;

        const top = box.top - mainTop;
        if (!onGrid(top) || !onGrid(box.height)) {
            found.push({ element, selector: describe(element), top: Math.round(top * 100) / 100, height: Math.round(box.height * 100) / 100 });
        }
    }
    return found;
}
