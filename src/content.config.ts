import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const LANGS = ['zh', 'en', 'fr', 'es', 'ru', 'ja', 'ko', 'pt', 'de', 'id'] as const;
export const SUPPORTED_LANGS = LANGS;
export const DEFAULT_LANG = 'en';

const post = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx,markdown}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Astro'),
    heroImage: z.url(),
    heroImageAlt: z.string(),
    locales: z.enum(LANGS),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const page = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx,markdown}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locales: z.enum(LANGS),
    draft: z.boolean().default(false),
  }),
});

const author = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx,markdown}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    bio: z.string().default(''),
    avatar: z.string().optional(),
    socials: z
      .array(
        z.object({
          label: z.string(),
          url: z.url(),
        }),
      )
      .default([]),
    locales: z.enum(LANGS),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  post,
  page,
  author,
};
