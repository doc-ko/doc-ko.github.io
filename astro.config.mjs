import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import { markdownPlugins } from './src/lib/markdownPlugins.js';
import { rehypeExternalLinks } from './src/lib/externalLinks.js';

// https://astro.build/config
export default defineConfig({
    site: 'https://oberio.me',
    integrations: [mdx()],
    markdown: {
        // Astro 7 defaults to Sätteri, which does not run remark plugins.
        // The :ai[] and :email[] directives need the unified pipeline.
        processor: unified({
            remarkPlugins: markdownPlugins,
            rehypePlugins: [rehypeKatex, rehypeExternalLinks],
        }),
        // Both themes are emitted as CSS variables (--shiki-light, --shiki-dark)
        // with no background, so tokens.css picks the theme and the background.
        shikiConfig: {
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false,
        },
    },
});
