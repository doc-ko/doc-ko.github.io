# Dot-grid redesign: implementation plan

Reference for work across sessions. Last updated 2026-10-24.

## Sources of truth

- Brief (Claude Doc): [oberio.dev design brief (consolidated)](https://claude.ai/artifact/Lj37ZkisAZbSGWouZjK5dJ). Wins over everything else, including the canvas.
- Canvas: [oberio.dev design](https://claude.ai/artifact/GeqMkhNgjnzGWRSascKdJJ). Specimen, line spec, homepage and inner pages in light, dark and 390px. `project/home.css` and `project/pages.css` hold the reference styles.
- Older design artifacts are superseded; ignore them.

The artifacts say "oberio.dev"; the site is `oberio.me`. Use `oberio.me` everywhere.

Superseded artifacts, history only: the first brief doc (`HXShMDyBNPezKRk6QEjtB4`), Light Papers comparison (`5geVVmiePTcmYZTWGVRv9e`, options A to G), dot-grid lines canvas (`JgsiMfrgZsmBWH7ycRDkQj`), dot-grid pages canvas (`HoBp4d22NrQ48jXMHJxznv`).

## How the direction came about

- 2026-10-23: the light mode on `ai-rewrite` grew into a wider redesign. The owner picked "recycled grey" paper (#e8e6e1, graphite ink) with dots instead of grid lines, and boxes drawn like pen lines through the dots ("option G") rather than filled cards. They wanted the lines to feel more hand-drawn than plain CSS borders.
- The dot grid is the layout's foundation: 24px unit, every baseline and box edge aligned to it, dots in the gap between lines (on the baseline they read as full stops).
- Light and dark themes with a header toggle, following the system setting by default. Keep the toggle separable from the grid work.
- The lemma, proposition and status-card types were dropped: they felt like decoration without purpose. Design a small set of elements with one meaning each; never new lemma/theorem/proof-style variants.
- Hatching and highlighter are both general ways to make something visually distinct. Hatching is the playful, noisier one; it does not mean "unfinished".

## Decisions (2026-10-24)

| Decision | Chosen |
| --- | --- |
| Status notes | Kept; labels and corner dots in ink. Amber, teal and violet mark fields, never status. |
| Homepage | Drop the "01 What I do" field diagram and the "Where to go" strip. "State of this site" becomes section 01. |
| Footer | Kept: copyright, then LinkedIn, GitHub, Repo, Docs as quiet links under a pencil rule. Show its design before building. |
| Font | Literata, self-hosted (regular and semibold, plus italic if posts need it). Mono and sans stay system fonts. |
| Code blocks | Pencil bracket on the left: vertical rule with one-unit hooks at top and bottom pointing inward, pen wobble and ink load, no right-hand line. Language label (12px mono, `--warm`) on the top row beside the top hook. Wide code scrolls. |
| Highlights in posts | `:hl[text]` directive with optional `{field=logic\|linguistics\|mathematics}`. `==text==` shorthand mapped to a directive by one exported constant, `markShorthand` in `src/lib/markdownPlugins.js`; `null` disables it. Never fires inside code or across a link; `\==` is a literal. |

## Known risks

- **Vertical rhythm.** Anything whose height is not whole units shifts every line below it off the dots. Images: round their box up to whole units at build time (Astro knows dimensions). Unknown heights: a small script pads the element to the next unit; the page must still work without it.
- **Dot alignment.** Put the dot background on a page wrapper, not `100vw`, so Windows scrollbars don't shift it.
- **Heading halo** relies on `paint-order` on HTML text; check Firefox.
- **Sub-pixel wobble** (0.6px) may just look blurry on 1x screens; check on one.
- **Margin note vs code block**: both are left-hand pencil lines; check they stay distinct on a real page.
- Don't copy the canvas CSS wholesale: it still holds rejected treatments (`t-pencil`, `t-chalk`, `wash-marker`, `wash-highlight`, `wash-swipe`), and its pen code is duplicated per artboard.

## Phases

Each phase ends with `npm run build` passing. Phases 1 to 3 are worth doing whatever the site's purpose becomes; 4 to 6 depend on content.

### Phase 1: tokens, light theme, toggle

- Split `src/styles/global.css` into `tokens.css`, `grid.css`, `devices.css`, `pages.css` under cascade layers; resets via `:where()`.
- Light (recycled grey) and dark tokens from the brief's palette table. Dark is close to today's site.
- Theme follows the system by default. Inline script in `<head>` of `src/layouts/BaseLayout.astro` sets the theme before first paint (no flash) from `localStorage`.
- Toggle button in `src/components/Header.astro` (`aria-pressed`, 44px target), script next to `src/scripts/menu.js`.
- Done when: both themes render every existing page legibly, the toggle persists, and no hard-coded colours remain outside `tokens.css`.

### Phase 2: the grid

- `--u: 24px`; column `min(1080px, round(down, 100% - 32px, 24px))` with fixed-breakpoint fallback; one column under 680px.
- Dot background on the page wrapper, offset so dots sit 2px below each line top.
- Self-host Literata; type scale on whole-unit lines (h1 64/72, page title 48/48, h2 40/48, body 16/24 and so on); re-tune baseline nudges for Literata.
- Heading halo; page heads open and tight.
- Unit-padding script for unknown heights.
- Tooling: `?grid` overlay showing unit lines; a Playwright check at 390px and 1440px in both themes that fails when an element's top or height in `main` is not a multiple of 24.
- Done when: the grid check passes on every page.

### Phase 3: pen library and the five devices

- `src/lib/pen.js`: one copy of the seeded wobble, ink load, hatching and highlighter ends; pure functions, deterministic per seed.
- Components: `DrawnEdges`, `Note` (inline or margin, optional label, highlight, hatched ring, corner dot), `PencilRule`, `Dot`, `Highlight` (CSS, `box-decoration-break: clone`), `CodeBlock` (the bracket).
- Replace `NoteBlock`, `MarginNote` and the lemma card with `Note`. `FieldEmblem` gets build-time hatched tiles in both sizes and keeps its glyph animations.
- Header: current-page pen circle, drawn in on hover and focus (#38; first built as tab edges and a dot), menu under 680px.
- Done when: the canvas specimen can be rebuilt from these components.

### Phase 4: homepage and YAML

- Rebuild `src/pages/index.astro` and `src/components/HomeHero.astro` per the decisions; remove `FieldDiagram` and the garden strip.
- `src/data/homepage.yaml`: `lemma` becomes `note`; `propositions` becomes `notes` (ink); drop `sections.fields` and `garden`; `accent` for fields only. Update `src/data/homepage.js`.
- Update `docs/modules/ROOT/pages/homepage-yaml.adoc` in the same change (AGENTS.md).

### Phase 5: inner pages and footer

- `src/layouts/MarkdownPostLayout.astro`: 672px reading column plus details note; settle date format (canvas ISO vs current `en-NZ` long).
- `src/pages/blog.astro`: ruled list and "No posts yet" margin note.
- `src/pages/tags/index.astro` (tag notes, 9 × 5 units) and `src/pages/tags/[tag].astro` (ruled list).
- `src/components/Footer.astro` per the footer decision.

### Phase 6: Markdown support

- Extend the `remark-directive` setup in `src/lib/markdownPlugins.js`: `:::note[Label]`, `:hl[...]`, the `==` shorthand, and code-fence wrapping into the bracket. All draw edges at build time from `pen.js`.

### Phase 7: checks and docs

- WCAG 2.2 AA at 390px and desktop, both themes; Firefox, Chrome, Safari (halo, wobble, `round()`).
- Reduced motion turns off glyph animations.
- Update `docs/modules/ROOT/pages/customising-the-site.adoc` and `branch-changes.adoc`.

## Not yet designed

Contact page, 404, block quotes, figures, footnotes, display maths (renderer undecided; display maths must round its height up to whole units), margin notes on About.

## Working rules

Follow `AGENTS.md`, especially the dev-server rules and "Working with the owner".

## Status

- [x] Brief critique and the five pre-build decisions
- [x] Brief updated with the decisions
- [x] Canvas updated with the decisions (version 4: Literata, oberio.me, ink status notes, section 01, bracket code block on the post template, footer on every page). Frame heights for the footer were estimated; check nothing is clipped.
- [x] Phase 1 (#16): tokens use `light-dark()`; theme set by `data-theme` on `<html>`; toggle in `ThemeToggle.astro`, `src/scripts/theme.js`
- [x] Phase 2 and 3 (#17): grid, Literata, `?grid` overlay, `tests/grid.spec.js`, `src/lib/pen.js`, `Note`, `DrawnEdges`, `Dot`, `PencilRule`, `Highlight`, `CodeBlock`, hatched `FieldEmblem`, drawn header. Not blocking this merge or #17 (decided 2026-10-24); still worth doing: Firefox halo, 1x wobble, margin note vs bracket on a real post; image heights are padded by script only (no build-time rounding yet)
- [x] Phase 4 (#18, merged 2026-10-24): homepage rebuilt, YAML keys renamed (`note`, `notes`), field diagram and garden strip removed, Contact tab removed from the header. Copy is still placeholder (#11)
- [x] Header hover (#38, merged 2026-10-24): `PenLoop` circle for the current page and on hover; theme toggle morphs sun/moon with hatching in the other theme's tone (`IconHatch`); hamburger hatched, kept while open. Reduced motion for these is untested with the setting on
- [x] Homepage margin note joined to the field emblem (#13): `.hero-diagram-stack` has no gap, so the note's pencil rule meets the emblem's bottom edge
- [ ] Phase 5
- [x] Phase 6 (#19, merged 2026-10-24): `src/lib/remarkDirectives.js` (`:::note`, `:hl`, `==`, code brackets) and `src/lib/penHtml.js`; `markShorthand` is in `markdownPlugins.js`. Known gap: inline `code` in a paragraph makes the line 26px tall and pushes the rest of a post off the grid (Phase 5)
- [ ] Phase 7
