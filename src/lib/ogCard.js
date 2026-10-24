import { readFileSync } from 'node:fs';
import satori from 'satori';
import sharp from 'sharp';

// The preview card shown when a link to the site is pasted into Slack, Discord,
// iMessage and similar apps. 1200x630 is the size they all expect. The look is
// the site's light theme: grey paper with dots on a 48px pitch, Literata, and
// the favicon glove on a cream tile. Colours mirror tokens.css, which cannot
// be read from here.
const WIDTH = 1200;
const HEIGHT = 630;
const PAPER = '#e8e6e1';

// satori does not draw radial-gradient dots, so the grid is a 48px SVG tile
// repeated as a background image.
const dotTile = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><circle cx="12" cy="12" r="2.2" fill="rgb(60 55 45)" fill-opacity="0.28"/></svg>`;
const dots = `data:image/svg+xml;base64,${Buffer.from(dotTile).toString('base64')}`;
const INK = '#141416';
const MUTED = '#504e4a';

// satori reads woff and ttf but not woff2, so the fonts come from the
// @fontsource package and not from public/fonts.
const fontFile = (weight) =>
    readFileSync(`node_modules/@fontsource/literata/files/literata-latin-${weight}-normal.woff`);
const fonts = [
    { name: 'Literata', data: fontFile(400), weight: 400, style: 'normal' },
    { name: 'Literata', data: fontFile(600), weight: 600, style: 'normal' },
];
const glove = `data:image/png;base64,${readFileSync('src/assets/og/glove.png').toString('base64')}`;

const el = (type, style, children) => ({ type, props: { style, children } });

// Long titles drop a size so they still fit in three lines.
const titleSize = (title) => (title.length > 40 ? 64 : title.length > 18 ? 76 : 92);

// showSite is false when the title already says oberio.me.
export async function renderCard({ title, description, byline, showSite = true }) {
    const parts = showSite ? ['oberio.me', ...byline] : byline;
    const line = parts.flatMap((part, i) => [
        i > 0 && el('span', { fontSize: 30, color: MUTED, margin: '0 16px' }, '·'),
        el('span', { fontSize: i === 0 && showSite ? 34 : 30, color: MUTED }, part),
    ]).filter(Boolean);

    const card = el(
        'div',
        {
            display: 'flex',
            flexDirection: 'column',
            width: WIDTH,
            height: HEIGHT,
            padding: '72px 84px',
            fontFamily: 'Literata',
            backgroundColor: PAPER,
            backgroundImage: `url(${dots})`,
            backgroundSize: '48px 48px',
        },
        [
            el('div', { display: 'flex', alignItems: 'center' }, line),
            el('div', { display: 'flex', flexDirection: 'column', maxWidth: 640, marginTop: 54 }, [
                el(
                    'div',
                    {
                        display: 'block',
                        fontSize: titleSize(title),
                        fontWeight: 600,
                        lineHeight: 1.1,
                        color: INK,
                        lineClamp: 3,
                    },
                    title,
                ),
                description &&
                    el(
                        'div',
                        { display: 'block', fontSize: 32, lineHeight: 1.35, color: MUTED, marginTop: 24, lineClamp: 3 },
                        description,
                    ),
            ].filter(Boolean)),
            el(
                'div',
                {
                    position: 'absolute',
                    right: 104,
                    top: 165,
                    width: 360,
                    height: 360,
                    borderRadius: 84,
                    backgroundColor: '#fbf3dc',
                    boxShadow: '0 14px 40px rgba(0, 0, 0, 0.18)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                },
                { type: 'img', props: { src: glove, width: 285, height: 285, style: { marginTop: 38 } } },
            ),
        ],
    );

    const svg = await satori(card, { width: WIDTH, height: HEIGHT, fonts });
    return sharp(Buffer.from(svg)).png().toBuffer();
}
