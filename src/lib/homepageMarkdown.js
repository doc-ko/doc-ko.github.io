import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { markdownPlugins } from './markdownPlugins.js';
import { rehypeExternalLinks } from './externalLinks.js';

const processor = createMarkdownProcessor({
    gfm: true,
    smartypants: true,
    syntaxHighlight: false,
    remarkPlugins: markdownPlugins,
    rehypePlugins: [rehypeExternalLinks],
    remarkRehype: {
        allowDangerousHtml: false,
    },
});

export async function renderMarkdown(content = '') {
    if (!content) {
        return '';
    }

    const { code } = await (await processor).render(String(content));
    return code.trim();
}

export async function renderInlineMarkdown(content = '') {
    const html = await renderMarkdown(content);
    return unwrapSingleParagraph(html);
}

function unwrapSingleParagraph(html) {
    const trimmed = html.trim();

    if (!trimmed.startsWith('<p>') || !trimmed.endsWith('</p>')) {
        return trimmed;
    }

    const inner = trimmed.slice(3, -4);
    return inner.includes('</p>') ? trimmed : inner;
}
