# Homepage Editing Notes

Most homepage content is in `homepage.js`.

- `meta`: browser title and search description.
- `hero`: opening headline, short note, lemma, and top links.
- `sections`: section headings and margin notes.
- `fields`: the four field labels below the first diagram.
- `writing`: homepage writing links.
- `propositions`: definition/proposition blocks.
- `garden.links`: closing navigation links.

For routine copy changes, edit strings inside `homepage.js` and keep the object
shape the same. The Astro components in `src/components/` handle the layout and
visual design.

Homepage copy fields support Markdown for links, emphasis, inline code,
paragraphs, and lists. Keep labels, link text, symbols, and notation short; use
body fields such as `lede`, `note`, `margin`, `description`, and `body` for
multi-paragraph Markdown.
