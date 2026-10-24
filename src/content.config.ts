import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Everything in src/content/posts/ on main is published. A work-in-progress
// post lives on its own post/<slug> branch.
const posts = defineCollection({
    loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        tags: z.array(z.string()).min(1),
        description: z.string().optional(),
        updatedDate: z.coerce.date().optional(),
        author: z.string().optional(),
        origin: z.enum(['ai']).optional(),
    }),
});

export const collections = { posts };
