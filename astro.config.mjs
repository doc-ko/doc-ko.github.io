import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { markdownPlugins } from './src/lib/markdownPlugins.js';

// https://astro.build/config
export default defineConfig({
    site: 'https://oberio.me',
    integrations: [mdx()],
    markdown: {
        // Astro 7 defaults to Sätteri, which does not run remark plugins.
        // The :ai[] and :email[] directives need the unified pipeline.
        processor: unified({
            remarkPlugins: markdownPlugins,
        }),
    },
});
