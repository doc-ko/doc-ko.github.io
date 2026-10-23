# Homepage Editing Notes

Most homepage content is in `homepage.yaml`.

The full key reference lives in the Antora docs: `docs/modules/ROOT/pages/homepage-yaml.adoc`.

- `meta`: browser title and search description.
- `hero`: opening headline, short note, lemma, and top links.
- `sections`: section headings and notes.
- `fields`: the subject cards in section 01.
- `propositions`: definition/proposition blocks.
- `garden.links`: closing navigation links.

For routine copy changes, edit strings inside `homepage.yaml` and keep the
object shape the same. The Astro components in `src/components/` handle the
layout and visual design. `homepage.js` is only the loader that parses the YAML
and exports it to the page.

Homepage copy fields support Markdown for links, emphasis, inline code,
paragraphs, and lists. Keep labels, link text, symbols, and notation short; use
body fields such as `lede`, `note`, `margin`, `description`, and `body` for
multi-paragraph Markdown.
