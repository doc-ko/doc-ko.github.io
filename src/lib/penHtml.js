import { edges } from './pen.js';

// The markup of a few pen devices as HTML strings, for code that cannot render
// an Astro component: the Markdown directives in remarkDirectives.js. The
// Astro components (DrawnEdges, Dot) use the same functions, so a note written
// in Markdown and one written in a template come out identical.

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** The pen-drawn sides of a box; see DrawnEdges.astro for the options. */
export function drawnEdgesHtml(name, keys = 'trbl', tone = 'pen', ink = tone === 'pen') {
    return edges(name, keys, { ink })
        .map((side) => {
            const line = `<path class="drawn-edge__line" d="${side.d}" opacity="${side.opacity}"/>`;
            const heavy = side.ink
                ? `<path class="drawn-edge__ink" d="${side.ink}" opacity="${side.opacity}"/>`
                : '';
            return (
                `<svg class="drawn-edge drawn-edge--${side.key} drawn-edge--${tone}" ` +
                `viewBox="${side.viewBox}" preserveAspectRatio="none" aria-hidden="true">${line}${heavy}</svg>`
            );
        })
        .join('');
}

/** A coloured grid dot; see Dot.astro. */
export function dotHtml(color = 'ink') {
    return `<i class="dot dot--${escape(color)}" aria-hidden="true"></i>`;
}
