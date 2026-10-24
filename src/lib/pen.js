// The pen: everything that makes a line look hand-drawn. Pure functions, run at
// build time. The same name always gives the same drawing, so the wobble never
// changes between page loads or builds.
//
// A drawn edge is a thin SVG strip (8px across) laid on a dot row or column.
// Its path runs along 1000 units, so the strip can be stretched to any length
// while the stroke width and wobble stay in px (vector-effect: non-scaling-stroke
// on the path; see devices.css).

/** Largest sideways wobble of a line, in px. */
export const WOBBLE = 0.6;

/** Strip thickness in px; the line runs through the middle of it. */
export const STRIP = 8;

const round = (value) => Math.round(value * 100) / 100;

/** FNV-1a, so any string becomes a stable seed. */
export function hash(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

/** A small seeded random number generator: each call returns a number in [0, 1). */
export function rng(seed) {
    let state = seed || 1;
    return () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}

// Seven control points along the run. The wobble is scaled by sin(pi * t), so
// it falls to zero at both ends and corners meet cleanly.
function wobblePoints(random, vertical, amplitude) {
    const points = [];
    for (let i = 0; i <= 6; i++) {
        const t = i / 6;
        const offset = (random() * 2 - 1) * amplitude * Math.sin(Math.PI * t);
        points.push(vertical ? [STRIP / 2 + offset, t * 1000] : [t * 1000, STRIP / 2 + offset]);
    }
    return points;
}

// A smooth line through the points: quadratic curves between midpoints.
function smooth(points) {
    let d = `M${round(points[0][0])} ${round(points[0][1])}`;
    for (let i = 1; i < points.length - 1; i++) {
        const mx = (points[i][0] + points[i + 1][0]) / 2;
        const my = (points[i][1] + points[i + 1][1]) / 2;
        d += ` Q${round(points[i][0])} ${round(points[i][1])} ${round(mx)} ${round(my)}`;
    }
    const last = points[points.length - 1];
    return `${d} L${round(last[0])} ${round(last[1])}`;
}

// Ink load: a heavier stroke over the first fifth of the edge, where the pen
// lands. Run it from the end the pen starts at.
function inkLoad(points, reverse) {
    const [a, b, c] = reverse ? [...points].reverse() : points;
    const ex = b[0] + (c[0] - b[0]) * 0.3;
    const ey = b[1] + (c[1] - b[1]) * 0.3;
    return `M${round(a[0])} ${round(a[1])} L${round(b[0])} ${round(b[1])} L${round(ex)} ${round(ey)}`;
}

// Which end the pen starts at, going round a box clockwise from the top left:
// top left to right, right top-down, bottom right to left, left bottom-up.
// Hooks: the top hook starts at its free end, the bottom hook at the rule.
const REVERSED = new Set(['b', 'l', 'u']);

/**
 * One drawn edge.
 *
 * @param {string} name  Seed. Give every box its own, e.g. `note:status-1`.
 * @param {'t'|'r'|'b'|'l'|'u'|'d'} key  Side of the box; `u` and `d` are the
 *   top and bottom hooks of a code bracket.
 * @param {{ amplitude?: number, ink?: boolean }} [options]  `ink: false` skips
 *   the heavier start (focus lines are an even weight).
 * @returns {{ key: string, viewBox: string, d: string, ink: string, opacity: number }}
 */
export function edge(name, key, { amplitude = WOBBLE, ink = true } = {}) {
    const random = rng(hash(`${name}:${key}`));
    const vertical = key === 'l' || key === 'r';
    const points = wobblePoints(random, vertical, amplitude);
    return {
        key,
        viewBox: vertical ? `0 0 ${STRIP} 1000` : `0 0 1000 ${STRIP}`,
        d: smooth(points),
        ink: ink ? inkLoad(points, REVERSED.has(key)) : '',
        // Each edge has its own ink density, 84 to 100%.
        opacity: round(0.84 + random() * 0.16),
    };
}

/** Several edges of one box, e.g. `edges('note:a', 'trbl')`. */
export function edges(name, keys, options) {
    return [...keys].map((key) => edge(name, key, options));
}

/**
 * A hand-drawn loop round a word, as one open stroke: it starts at the upper
 * left, goes clockwise round an ellipse and overshoots the start a little,
 * spiralling inward the way a pen does when it closes a circle.
 * The path lives in a 100 x 40 box and is stretched to the word, so it uses
 * `vector-effect: non-scaling-stroke` (see devices.css).
 *
 * @param {string} name  Seed.
 * @returns {string}  An SVG path `d`.
 */
export function loop(name) {
    const random = rng(hash(`${name}:loop`));
    const steps = 12;
    const start = -Math.PI * 0.75 + (random() - 0.5) * 0.3;
    const sweep = Math.PI * 2 + 0.45 + random() * 0.2;
    const points = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = start + sweep * t;
        const radius = 1 + (random() - 0.5) * 0.05 - 0.1 * Math.max(0, (t - 0.85) / 0.15);
        points.push([50 + 46 * radius * Math.cos(angle), 20 + 16 * radius * Math.sin(angle)]);
    }
    // Catmull-Rom through the points, written as cubic curves.
    let d = `M${round(points[0][0])} ${round(points[0][1])}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(p2[0])} ${round(p2[1])}`;
    }
    return d;
}

// How far a stroke stops short of a skipped rectangle's edge, in y: a little
// under the pen's round end, so two strokes meeting there touch, not overlap.
const JOIN = 0.3;

/**
 * Hatching: 1px strokes at 45 degrees, `spacing` px apart, each a little
 * shorter and bent differently so it looks drawn rather than printed.
 * Coordinates are px inside a box of `width` x `height`.
 *
 * @param {string} name  Seed.
 * @param {{ width: number, height: number, inset?: number, spacing?: number,
 *   skip?: Array<[number, number, number, number]>, gaps?: boolean }} shape
 *   `skip` lists rectangles `[x0, y0, x1, y1]` the strokes stay out of, such
 *   as the row a label sits on. With `gaps` set, the strokes are drawn only
 *   inside those rectangles instead, so they can fill in what `skip` leaves.
 * @returns {string}  One SVG path `d` for every stroke.
 */
export function hatch(name, { width, height, inset = 5, spacing = 5.5, skip = [], gaps = false }) {
    const random = rng(hash(`${name}:hatch`));
    const x0 = inset;
    const y0 = inset;
    const x1 = width - inset;
    const y1 = height - inset;
    let d = '';

    // Strokes run down and to the left: every point has x + y = c.
    for (let c = x0 + y0 + 3; c < x1 + y1 - 3; c += spacing) {
        // Each span is [from, to, cutFrom, cutTo]; a cut end sits exactly on the
        // edge of a skipped rectangle, so the strokes either side of it meet there.
        let spans = [[Math.max(y0, c - x1), Math.min(y1, c - x0), false, false]];

        if (gaps) {
            const [top, bottom] = spans[0];
            spans = skip
                .map(([sx0, sy0, sx1, sy1]) => {
                    const from = Math.max(top, sy0, c - sx1);
                    const to = Math.min(bottom, sy1, c - sx0);
                    return [from, to, from === sy0, to === sy1];
                })
                .filter(([from, to]) => to > from);
        } else for (const [sx0, sy0, sx1, sy1] of skip) {
            // Where this stroke is inside the skipped rectangle, in y.
            const from = Math.max(sy0, c - sx1);
            const to = Math.min(sy1, c - sx0);
            if (from >= to) continue;
            spans = spans.flatMap(([a, b, cutA, cutB]) => {
                if (to <= a || from >= b) return [[a, b, cutA, cutB]];
                return [[a, from, cutA, true], [to, b, true, cutB]].filter(([p, q]) => q > p);
            });
        }

        for (const [from, to, cutFrom, cutTo] of spans) {
            // Each end stops a little short, by a different amount, except
            // where it meets another set of strokes: there both stop JOIN short
            // of the edge, so their round ends touch without doubling up.
            const shortA = random() * 2.5;
            const shortB = random() * 2.5;
            const a = from + (cutFrom ? JOIN : shortA);
            const b = to - (cutTo ? JOIN : shortB);
            if (b - a < 4) continue;
            const bend = (random() * 2 - 1) * 0.5;
            const ax = c - a;
            const bx = c - b;
            d += `M${round(ax)} ${round(a)} Q${round((ax + bx) / 2 + bend)} ${round((a + b) / 2 + bend)} ${round(bx)} ${round(b)} `;
        }
    }
    return d.trim();
}

/**
 * Highlighter ends: the uneven corners a chisel-tip pen leaves. Returns a CSS
 * `border-radius` for one highlighted phrase; the base shape is nudged by up
 * to a quarter either way, differently for every seed.
 */
export function highlighterEnds(name) {
    const random = rng(hash(`${name}:ends`));
    const vary = (value) => `${round(value * (0.75 + random() * 0.5))}px`;
    return `${vary(3)} ${vary(9)} ${vary(4)} ${vary(10)} / ${vary(9)} ${vary(3)} ${vary(10)} ${vary(4)}`;
}
