import { defineConfig } from 'astro/config';
import { aiTextPlugins } from './src/lib/remarkAiText.js';

// https://astro.build/config
export default defineConfig({
    site: 'https://docko.dev',
    markdown: {
        remarkPlugins: aiTextPlugins,
    },
});
