# Personal Site

Astro site for Karl Oberio, deployed to GitHub Pages at `oberio.me`. Its homepage copy is currently a stub. A dot-grid redesign is planned in `.claude/plans/dot-grid-redesign.md`.

## Project context

- `.claude/notes/site-context.md`: what this site is for, domains, and what not to break.
- `.claude/plans/`: plans and decisions that span sessions. Read the relevant one before design or layout work, and keep its status list current.
- `.claude/scratch/`: optional place for temporary working files (gitignored); `/tmp` is fine too.

## Working with the owner

- Explain web and build concepts in plain language and define terms the first time; the owner is a technical writer still learning this vocabulary. Lead with a simple mental model and keep tables short.
- For any visual design choice, first show several options side by side, rendered with the site's real content, and let the owner pick before changing the codebase.
- When asked to remove content (posts, samples, drafts), delete the content but keep the pages and features that host it, such as the blog index and tag pages. Ask before removing a route or feature.
- Never write the contact email address in plain text in the repo; use `EmailLink.astro`, `email: true` in YAML, or `:email[]` in Markdown.

## Tracking work

Issues track development, configuration and maintenance work: code, build and deploy, dependencies, styling, docs tooling and agent instructions. Open or find the issue before any file changes.

- Look for an existing issue first (`gh issue list --search`). If none fits, propose one and wait for a yes before creating it. Use the `github-issues` skill for the wording, labels and links.
- If the owner dictated the issue ("issue: ..."), create it straight away.
- Do not start an issue that is blocked by an open one. Say what blocks it.
- Put `Refs #N` in the commit message and `Closes #N` in the PR body, so a PR that finishes only part of an issue does not close it.
- Write PR bodies in the shape of `.github/pull_request_template.md`. Add a section to the template only when a real need comes up, not in advance.
- Plans in `.claude/plans/` list their issue numbers.
- Update a plan's status list in the same PR as the work it describes, not in a separate follow-up PR: every merge to `main` redeploys the site on GitHub Actions. When parallel PRs would edit the same status line, rebase or merge `main` into the later ones and resolve the conflict there.

No issue is needed for:

- the owner writing or adding a new post (a `post/<slug>` branch is enough);
- copy edits to existing pages, posts and `src/data/homepage.yaml` text, as long as no keys, components or layout change;
- small fixes: a typo, a broken link, or a one-line change that does not alter behaviour;
- questions, reading code and research.

## Commands

- `npm run dev`: dev server with live reload at http://localhost:4321. The user normally has this running already.
- `npm run build`: production build into `dist/`; run before committing larger changes
- `npm run test:grid`: builds, then runs every Playwright check in Chromium, Firefox and WebKit: the 24px grid, WCAG 2.2 AA (axe-core) and reduced motion, on every page (phone and desktop, both themes)
- `npm run docs`: build and serve the Antora docs with Docker at http://localhost:8080

## Before pushing

The pull-request check on GitHub only runs `npm run build`, to keep it fast. The browser checks run on this machine instead.

- Run `npm run test:grid` before every push that changes what the site renders or how it is tested: `src/`, `public/`, `astro.config.*`, `package.json`, `package-lock.json`, `playwright.config.js` or `tests/`. Push only when it passes, and say so under "Checks" in the PR body.
- Pushes that only touch `docs/`, `.claude/`, `AGENTS.md` or `.github/` need `npm run build` at most.
- Do not add browser installs or Playwright runs back to `.github/workflows/build.yml`; the owner wants the PR check to finish in seconds.

## Dev server

The user runs `npm run dev` themselves and uses it as their live preview.

- Do not start your own dev server, on any port.
- Never stop one: no `pkill`, `killall`, or `kill` on `astro` or `node` processes, since that can take down the user's server.
- To check a change visually, point `agent-browser` at http://localhost:4321 and, if nothing is listening there, ask the user to start `npm run dev`.
- To check that the site compiles, run `npm run build`.
- Astro caches each post's rendered HTML, keyed on the file's text and not on the plugin code. After changing a Markdown plugin (`src/lib/remark*.js`, `markdownPlugins.js`) the dev server and `npm run build` keep serving the old render. Delete `.astro/data-store.json` and `node_modules/.astro/data-store.json` before building, and for the running dev server change the post file (a blank line is enough) instead of stopping it.

## Layout

- `src/pages/`: routes. Markdown posts need frontmatter with at least one tag.
- `src/components/`, `src/layouts/`: shared pieces
- `src/styles/`: all styling, in cascade layers: `tokens.css` (every colour, as `light-dark()` pairs), `grid.css`, `devices.css`, `pages.css`
- `src/data/homepage.yaml`: homepage copy

## Documentation

Owner documentation is an Antora site in `docs/` (pages in `docs/modules/ROOT/pages/`, listed in `docs/modules/ROOT/nav.adoc`).

- `homepage-yaml.adoc` documents every key in `src/data/homepage.yaml`. When you add, rename, or remove a key, or change how a component renders it, update that page in the same change.
- `customising-the-site.adoc` is the task-oriented walkthrough.
- `branch-changes.adoc` summarises what the branch changed.

Write AsciiDoc with one sentence per line. Do not edit `docs/build/`; it is generated and ignored by git.

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes
