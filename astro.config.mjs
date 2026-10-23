import { defineConfig } from 'astro/config';
import { markdownPlugins } from './src/lib/markdownPlugins.js';

// https://astro.build/config
export default defineConfig({
    site: 'https://oberio.me',
    markdown: {
        remarkPlugins: markdownPlugins,
    },
});
