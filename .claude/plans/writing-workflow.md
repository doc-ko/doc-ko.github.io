# Writing and publishing workflow

Tracking: umbrella #20; steps are #21 (Astro upgrade), #22 (collection, MDX, lists, RSS), #23 (math and code), #24 (scaffold), #25 (docs and agent instructions). Related: #13 (redesign).

Goal: writing a post should need no code tweaking. Create a file, write Markdown (with math and code), set it to published, push.

Status: steps 0-3 and 5 done (#21 and #22 merged; #23 in PR #31: KaTeX maths and dual-theme Shiki code). Light-theme check of code and maths waits for the redesign (#16). Scaffold and docs not started. `:ai[]`, `:email[]`, stray-colon fallback and `remark-math` (`$a<b$`, `{` in maths) were checked in `.mdx` on 2026-10-24. An empty `src/content/posts/` builds with harmless warnings. An earlier prototype was discarded on 2026-10-24; the plan is the source of truth.

## Decisions to confirm

| Question | Proposed default |
| --- | --- |
| Where do posts live? | `src/content/posts/` as an Astro content collection |
| Post URLs | `/posts/<file-name>/`, same as the current blog |
| Drafts | No `draft` field. A work-in-progress post lives on its own branch (`post/<slug>`) and is published by merging to `main`. Everything in `src/content/posts/` on `main` is published |
| Tags | Required, at least one (matches the current rule) |
| RSS | Yes, `/rss.xml` |
| "Blog" in the nav | Not yet; add on the first real post |
| Astro version | Upgrade first (4.1.2 to latest, 7.x at time of writing), before any new features |
| Post format | MDX is the default (`.mdx`); plain `.md` still accepted (see Formats) |
| Maths | LaTeX syntax rendered by KaTeX. Typst is out of scope |
| Scaffold script | Creates the file and a `post/<slug>` branch, and switches to it |
| About page | Stays a plain page in `src/pages/about/`, not a post |
| Tag pages | Posts only (drops the `about` tag page) |

## Relationship to the dot-grid redesign

The redesign plan (`.claude/plans/dot-grid-redesign.md` on branch `claude/design-briefs-analysis-b6d5ba`, notes only, not built, not on `main`) touches the same files: `markdownPlugins.js`, `MarkdownPostLayout.astro`, `blog.astro`, and code blocks. It also has the posts layout, `:hl` and `:::note` directives, and leaves display maths renderer undecided.

- This plan supplies the infrastructure: upgraded Astro, post collection, workflow, KaTeX and Shiki. The redesign supplies how it looks.
- Do this plan first. It changes data flow, not appearance, so the redesign can then style `entry-content`, math and code without reworking routing.
- KaTeX settles the redesign's open maths question. Its constraint (display maths height rounded up to whole grid units) still needs a CSS or wrapper solution in the redesign.
- Any new Markdown plugin in the redesign (`:hl`, `:::note`, code-fence wrapping) must work on whatever Markdown pipeline step 0 settles on. Plugin order stays: `remarkMath` before `remark-directive`.
- Light and dark themes mean KaTeX colour must inherit text colour (it does by default).
- Merge the redesign notes branch (or at least its plan) to `main` so both plans live together.

## Steps

0. **Upgrade Astro.** Do this first, as its own change, so everything after is written against the current APIs. Use `npx @astrojs/upgrade`, one major at a time if it balks, and read each upgrade guide. Things to expect: Node version floor, the content collection API (4.x `src/content/config.ts` and `post.slug` became loader-based `src/content.config.ts` and `post.id`), `Astro.glob` removal, and the new Rust compiler being stricter about HTML. Check that `src/lib/remarkEmail.js` and `remarkAiText.js` still run, because the Markdown pipeline may default to Satteri, which does not run remark or rehype plugins (verify in the Astro 7 Markdown docs; the legacy options are reported to work but be deprecated, removed in Astro 8). Keep the unified pipeline selected explicitly. Gate: `npm run build` produces the same pages as before and the CI deploy works.
1. **Content collection.** a collection config (path depends on step 0) with a schema: `title`, `pubDate`, `tags` (min 1), optional `description`, `updatedDate`, `author`, `origin`. A bad frontmatter field fails the build and names the file.
2. **Post route.** `src/pages/posts/[...slug].astro` renders each entry with the existing `MarkdownPostLayout`, so posts need no `layout:` line, passing the shared component map to `<Content>`. Add `@astrojs/mdx` here.
3. **Math.** `remark-math` + `rehype-katex`, KaTeX CSS imported in the post layout. `remarkMath` must run before `remark-directive` so `$a:b$` is not read as a directive.
4. **Code.** Astro's built-in Shiki, configured for the redesign's light and dark themes: dual themes emitting CSS variables, with no background of its own. Colours come from the site's tokens, so there is no background to match. The redesign's bracket-style `CodeBlock` replaces the visible frame; Shiki only supplies token colours.
5. **Listings.** Blog list, tag index, tag pages and RSS read from a shared `src/lib/posts.js` (sorted newest first).
6. **Scaffold script.** `npm run new -- "Title"` creates `src/content/posts/<slug>.mdx` with frontmatter filled in, creates a `post/<slug>` branch and switches to it.
7. **Cheat sheet.** A page in the Antora docs (`writing-guide.adoc`) showing math, code, tables, footnotes and the `:ai` markup, with source and result. It is not a post, so it can never publish. Keep one real test post on a branch to check rendering.
8. **Docs.** `writing-posts.adoc` in Antora, nav entry, and the layout section of `AGENTS.md`.

## Verification

- `npm run build` passes.
- With the guide post present, the built page contains KaTeX output, Shiki-highlighted blocks, footnotes and `ai-text` elements.
- Still to do: view `writing-guide` in the dev server for styling on the dark theme (KaTeX colour, code-block background, wide equations and code scrolling on mobile).

## Open risks

- The Astro jump is three majors. The content collection and Markdown pipeline changes land on exactly what this plan builds on, which is why it comes first.
- Shiki's default inline background and single dark theme would clash with the redesign's light theme. Avoided by step 4 (dual themes, transparent background).
- Deploy is unchanged (GitHub Actions on push to `main`); no preview deploys, so a branch post is only viewable locally.
- Switching branches changes the whole site under the running dev server; use a git worktree if that gets annoying.

## Formats: MDX

**MDX is the default post format** (decided 2026-10-24). It uses the official `@astrojs/mdx` integration, which inherits the site's `markdown` config (remark and rehype plugins, Shiki) by default, so it does not fight Astro. It supports content collections.

- Posts are `.mdx`; the collection also accepts `.md`, so the scaffold and the About page are not forced to change.
- **No imports per post.** Render with `<Content components={{ Note, ... }} />` in the post route, so any site component is usable in every post without an import line. This is the main way MDX reduces tweaking rather than adding it.
- **Cost:** `<` and `{` in prose are syntax, so a stray one fails the build with a file and line. Write `\{`, `\<` or `&lt;` in prose. Inside code fences and `$...$` they are safe.
- **Must verify in step 0:** `remark-directive`, `remarkEmail`, `remarkAiText` and `remark-math` all run on `.mdx` in the upgraded Astro, including `$a<b$` and `{` inside maths, and `:ai[...]` text. The `restore()` fallback in `remarkAiText` rebuilds stray `:word` from source; confirm it behaves in MDX. Also confirm MDX does not use the Rust Markdown processor if that becomes the default, since it would skip these plugins.
- The superseded `next` branch was an earlier MDX prototype; ignore it.

**Maths: LaTeX with KaTeX only.** Typst was checked on 2026-10-24: its HTML export is experimental, there is no maintained Astro integration, and it would mean a custom build step. Not worth it. Revisit only if a figure KaTeX and hand-drawn SVG cannot do appears.

## Later, if wanted

- Syntax-highlight copy button, heading anchors, reading time.
- Sitemap (`@astrojs/sitemap`).
- Images in posts (co-locate with the post; Astro `<Image>`).
