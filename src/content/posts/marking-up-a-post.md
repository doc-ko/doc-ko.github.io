---
title: "Marking up a post"
pubDate: 2026-10-24
description: "The three pen-drawn devices a post on this site can use, each shown live next to the Markdown that makes it."
tags: ["site", "markdown", "ai-generated"]
author: "Claude Sonnet 5.5"
origin: ai
---

This site draws its boxes and highlights the way a pen would, on a grid of dots. A post can use three of those devices without any special setup. Each one below appears as it renders, followed by the Markdown behind it.

## Highlights

A highlight marks a phrase that matters. Use two or three on a screen at most, or none of them will stand out. The simplest form is a pair of double equals signs around the words, like ==this phrase==.

```markdown
Like ==this phrase==.
```

When a phrase belongs to one of the fields this site cares about, name it. A good :hl[definition]{field=logic} is where an argument starts, the :hl[schwa]{field=linguistics} is the most common vowel in English, and a :hl[proof]{field=mathematics} ends when nothing is left to doubt. Cyan is logic, amber is linguistics and violet is mathematics.

```markdown
A good :hl[definition]{field=logic} is where an argument starts.
```

The double-equals form is careful about what it takes. It leaves code and maths alone, it does not reach across a link, and it ignores equals signs with a space just inside them, so a == b stays as written. To show two equals signs on purpose, put a backslash in front: \==.

## Notes

A note sets a passage apart from the running text. It can have a small label, a note beside the label, and a title, and its body is ordinary Markdown, so ==highlights== and *emphasis* work inside it.

:::note[Status]{notation="draft" title="What this is"}
A box drawn with a pen, in the flow of the page. Use it for something the reader should see but that is not part of the argument.
:::

```markdown
:::note[Status]{notation="draft" title="What this is"}
A box drawn with a pen, in the flow of the page.
:::
```

A margin note is lighter: a pencil rule and a dot, for a thought that leans on the paragraph above it.

:::note[Aside]{variant=margin}
Margin notes default to an amber dot. Choose another with dot=ink, dot=cyan or dot=violet.
:::

```markdown
:::note[Aside]{variant=margin}
A thought that leans on the paragraph above.
:::
```

Two more options change how a note looks. Highlight fills the whole note with the highlighter, and hatched fills the ring of padding round it with pen strokes. Hatching is the noisier, more playful of the two.

:::note[Careful]{highlight=cyan dot=ink}
A whole note on the highlighter.
:::

:::note[Playful]{hatched=violet title="The padding ring"}
The same box with its padding hatched.
:::

```markdown
:::note[Careful]{highlight=cyan dot=ink}
A whole note on the highlighter.
:::

:::note[Playful]{hatched=violet title="The padding ring"}
The same box with its padding hatched.
:::
```

## Code

Every fenced code block is drawn in a pencil bracket: a line down the left with a short hook at the top and the bottom, and no line on the right. The language, if you give one, sits on the top row.

```js
const greet = (name) => `Hello, ${name}`;
console.log(greet('world'));
```

A block with no language has no label.

```
Plain text, no label.
```

## Maths

Maths is written in LaTeX between double dollar signs and drawn by KaTeX. A display equation sits on its own line.

$$
\int_0^1 x^2\,dx = \tfrac{1}{3}
$$

```markdown
$$
\int_0^1 x^2\,dx = \tfrac{1}{3}
$$
```

A longer one shows how a display equation sits between paragraphs.

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

The highlight shorthand leaves maths alone.
