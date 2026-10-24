# Site context

Last updated 2026-10-24.

## What this site is

On 2026-10-23 the owner decided the earlier "mathematical notebook" redesign was muddled because one site was trying to be both a hiring portfolio and a personal space. The plan is two separate projects:

- a portfolio, for other people (not this repo);
- this repo, the personal site.

Decided 2026-10-24: the personal site has two purposes, and they have different audiences.

- **The published site (`oberio.me`) is for the owner to write.** It is a blog, with posts as the main content. The home and about pages support it. Tone: a notebook that is careful, plain and a little playful; not cute, corporate or templated. Let the writing carry the page.
- **The repo is a showcase of how the site is developed and maintained.** The owner builds it methodically on purpose: issues before work, plans and notes kept in the repo rather than in memory, skills for commits and issues, and owner documentation in `docs/`. `docs/` is where this second purpose is documented. Keep that working style visible when adding to the repo.

When a change touches both (a new workflow, say), the site stays simple for readers and the process is written down in the repo.

Documentation work samples were removed from this repo. It keeps the home and about pages and an empty blog; the blog and tag pages stay on purpose for future posts.

Ask which site a design or content change is for before doing it.

## Domains

- `oberio.me` is live: Astro `site`, `CNAME`, header logo and Antora site domain all use it. The `ai-rewrite` branch was merged to `main` on 2026-10-24 (PR #9) and the GitHub Pages custom domain switched to `oberio.me` with HTTPS enforced.
- `docko.dev` no longer serves the site and has no redirect. It may be decommissioned; if so, the footer's `docs.docko.dev` link (the separate antora-site repo, kept on purpose) breaks, so flag that.
- Git commits use an `oberio.dev` identity; ownership of that domain is not confirmed. Design artifacts that say "oberio.dev" mean this site, `oberio.me`.

## Contact email

The address lives on `oberio.me`, stored reversed in `src/data/contact.js` and assembled in the browser to dodge scrapers.

## Branches

The `next` branch (an MDX and React prototype) is superseded; its worktree was removed but the branch was kept.
