# Personal Site

Astro site for Karl Oberio, deployed to GitHub Pages. The `ai-rewrite` branch is a redesign ("mathematical notebook"); its homepage copy is currently a stub.

## Commands

- `npm run dev`: dev server with live reload at http://localhost:4321
- `npm run build`: production build into `dist/`; run before committing larger changes
- `npm run docs`: build and serve the Antora docs with Docker at http://localhost:8080

## Layout

- `src/pages/`: routes. Markdown posts need frontmatter with at least one tag.
- `src/components/`, `src/layouts/`: shared pieces
- `src/styles/global.css`: all styling
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
