import { drawnEdgesHtml, dotHtml } from './penHtml.js';
import { highlighterEnds } from './pen.js';

// Markdown versions of three pen devices, so a post can use them without
// MDX or an import line. Each one builds the same markup as its Astro
// component (Note.astro, Highlight.astro, CodeBlock.astro), so devices.css
// styles both alike.
//
//   :::note[Label]{variant=margin dot=ink title="..." notation="..."}
//   Body, in Markdown.
//   :::
//
//   :hl[a phrase]{field=logic}      field: logic (cyan), linguistics (amber)
//                                   or mathematics (violet); amber if left out
//   ==a phrase==                    the same highlight, amber (see `shorthand`)
//
//   Every fenced code block is drawn in the pencil bracket, labelled with its
//   language.
//
// Run this after remark-directive and before remarkAiText, which turns any
// directive it does not know back into plain text.

const FIELDS = { logic: 'cyan', linguistics: 'amber', mathematics: 'violet' };
const COLORS = ['amber', 'cyan', 'violet'];
const DOTS = ['ink', ...COLORS];
const HATCHES = ['ink', ...COLORS];
const VARIANTS = ['inline', 'margin'];

// Nodes whose text must never be read for the shorthand.
const LITERAL = new Set(['code', 'inlineCode', 'math', 'inlineMath', 'html']);
const LINKS = new Set(['link', 'linkReference']);

/**
 * @param {{ shorthand?: string | null }} [options]  The text that opens and
 *   closes a highlight, e.g. '=='. `null` turns the shorthand off.
 */
export function remarkDirectives({ shorthand = null } = {}) {
    return (tree, file) => {
        const context = { file, shorthand, source: String(file.value ?? ''), codeBlocks: 0 };
        visit(tree, context);
    };
}

function visit(parent, context) {
    if (!parent.children) {
        return;
    }

    for (const child of parent.children) {
        if (!LITERAL.has(child.type)) {
            visit(child, context);
        }
    }

    parent.children = parent.children.map((node) => {
        if (node.type === 'containerDirective' && node.name === 'note') {
            return note(node, context);
        }
        if (node.type === 'textDirective' && node.name === 'hl') {
            return highlight(node.children, node.attributes?.field, node, context);
        }
        if (node.type === 'code') {
            return codeBracket(node, context);
        }
        return node;
    });

    if (context.shorthand && parent.children.some((node) => node.type === 'text')) {
        parent.children = markShorthand(parent.children, context);
    }
}

// ---- Highlight ------------------------------------------------------------

function highlight(children, field, at, context) {
    const color = field === undefined ? 'amber' : (FIELDS[field] ?? (COLORS.includes(field) ? field : undefined));
    if (!color) {
        context.file.fail(
            `:hl field "${field}" is not one of ${Object.keys(FIELDS).join(', ')}`,
            at,
        );
    }
    return {
        type: 'highlight',
        data: {
            hName: 'mark',
            hProperties: {
                className: ['highlight', `highlight--${color}`],
                style: `border-radius: ${highlighterEnds(plainText(children))}`,
            },
        },
        children,
    };
}

// ---- The == shorthand -----------------------------------------------------

// Split each text node at the delimiter, then pair delimiters up. A pair needs
// text next to the inside of both delimiters (so `a == b` stays as written)
// and cannot reach across a link. A delimiter after a backslash is a literal.
function markShorthand(children, context) {
    const { shorthand } = context;
    const items = children.flatMap((node) => (node.type === 'text' ? splitText(node, context) : [node]));
    const isDelim = (item) => item?.delim === true;
    const startsWithSpace = (item) => item?.type === 'text' && /^\s/.test(item.value);
    const endsWithSpace = (item) => item?.type === 'text' && /\s$/.test(item.value);

    const result = [];
    let open = -1;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (LINKS.has(item.type)) {
            open = -1;
        }
        if (!isDelim(item)) {
            result.push(item);
            continue;
        }

        const before = items[i - 1];
        const after = items[i + 1];
        const canClose = open >= 0 && result.length - open > 1 && before && !isDelim(before) && !endsWithSpace(before);
        const canOpen = after && !isDelim(after) && !startsWithSpace(after);

        if (canClose) {
            const inner = result.splice(open + 1);
            result.pop();
            result.push(highlight(inner, undefined, undefined, context));
            open = -1;
        } else if (canOpen) {
            open = result.length;
            result.push(item);
        } else {
            result.push({ type: 'text', value: shorthand });
        }
    }

    // Openers that never closed are ordinary text again.
    return result.map((item) => (isDelim(item) ? { type: 'text', value: shorthand } : item));
}

function splitText(node, context) {
    const { shorthand, source, file } = context;
    if (!node.value.includes(shorthand)) {
        return [node];
    }

    const escaped = escapedOffsets(node, source);
    if (!escaped) {
        file.message(`Skipped ${shorthand} in this text: could not tell which characters are escaped`, node);
        return [node];
    }

    const pieces = [];
    let start = 0;
    let at = node.value.indexOf(shorthand);
    while (at !== -1) {
        if (escaped.has(at) || escaped.has(at + shorthand.length - 1)) {
            at = node.value.indexOf(shorthand, at + 1);
            continue;
        }
        if (at > start) {
            pieces.push({ type: 'text', value: node.value.slice(start, at) });
        }
        pieces.push({ delim: true });
        start = at + shorthand.length;
        at = node.value.indexOf(shorthand, start);
    }
    if (start < node.value.length) {
        pieces.push({ type: 'text', value: node.value.slice(start) });
    }
    return pieces;
}

// Which characters of a text node's value were written with a backslash? The
// parser drops the backslash, so read it from the source. Returns null when the
// source and the value cannot be lined up (a backslash in a quote or list, say).
function escapedOffsets(node, source) {
    const { start, end } = node.position ?? {};
    if (!start || !end) {
        return null;
    }

    const raw = source.slice(start.offset, end.offset);
    const escaped = new Set();
    if (!raw.includes('\\')) {
        return escaped;
    }

    let length = 0;
    for (let i = 0; i < raw.length; i++, length++) {
        if (raw[i] === '\\' && /[!-/:-@[-`{-~]/.test(raw[i + 1] ?? '')) {
            escaped.add(length);
            i++;
        }
    }
    return length === node.value.length ? escaped : null;
}

// ---- Note -----------------------------------------------------------------

function note(node, context) {
    const { file } = context;
    const {
        variant = 'inline',
        highlight: fill,
        hatched,
        title,
        notation,
        seed,
    } = node.attributes ?? {};
    const dot = node.attributes?.dot ?? (variant === 'margin' ? 'amber' : undefined);

    choose(file, node, 'variant', variant, VARIANTS);
    choose(file, node, 'highlight', fill, COLORS);
    choose(file, node, 'hatched', hatched, HATCHES);
    choose(file, node, 'dot', dot, DOTS);

    const [first, ...rest] = node.children;
    const label = first?.data?.directiveLabel ? first.children : undefined;
    const body = label ? rest : node.children;
    const margin = variant === 'margin';

    const classes = [
        'drawn',
        'note',
        `note--${variant}`,
        ...(fill ? ['note--highlight', `note--${fill}`] : []),
        ...(hatched ? ['note--hatched', `note--hatch-${hatched}`] : []),
    ];

    const parts = [
        raw(drawnEdgesHtml(`note:${seed ?? (label ? plainText(label) : variant)}`, margin ? 'lu' : 'trbl', margin ? 'pencil' : 'pen')),
    ];
    if (dot) {
        parts.push(raw(dotHtml(dot)));
    }
    if (label || notation) {
        const line = [];
        if (label) {
            line.push(element('span', ['note__label-text', `note__label-text--${dot ?? 'plain'}`], label));
        }
        if (notation) {
            line.push(element('code', [], [{ type: 'text', value: notation }]));
        }
        parts.push(element('p', ['note__label'], line));
    }
    if (title) {
        parts.push(element('h3', ['note__title'], [{ type: 'text', value: title }]));
    }
    parts.push(element('div', ['note__body'], body));

    return {
        type: 'note',
        data: { hName: 'div', hProperties: { className: classes, role: 'note' } },
        children: parts,
    };
}

function choose(file, node, name, value, allowed) {
    if (value !== undefined && !allowed.includes(value)) {
        file.fail(`:::note ${name} "${value}" is not one of ${allowed.join(', ')}`, node);
    }
}

// ---- Code in a pencil bracket ---------------------------------------------

function codeBracket(node, context) {
    const lang = node.lang || undefined;
    const seed = `${lang ?? 'code'}:${context.codeBlocks++}`;
    const parts = [raw(drawnEdgesHtml(`code:${seed}`, 'uld', 'pencil', true))];
    if (lang) {
        parts.push(element('p', ['code-block__lang'], [{ type: 'text', value: lang }]));
    }
    parts.push(element('div', ['code-block__code'], [node]));

    return {
        type: 'codeBracket',
        data: { hName: 'div', hProperties: { className: ['drawn', 'code-block'] } },
        children: parts,
    };
}

// ---- Helpers --------------------------------------------------------------

// Types of our own, so nothing downstream mistakes these for directives.
function element(name, classes, children) {
    return {
        type: `pen-${name}`,
        data: { hName: name, hProperties: classes.length ? { className: classes } : {} },
        children,
    };
}

function raw(value) {
    return { type: 'html', value };
}

function plainText(nodes) {
    return nodes
        .map((node) => node.value ?? (node.children ? plainText(node.children) : ''))
        .join('');
}
