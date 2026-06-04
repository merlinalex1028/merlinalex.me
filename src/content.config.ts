import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

// ─── ARTICLES (detailed, D-02) ──────────────────────────
const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    description: z.string().optional(),
    cover: z.string().optional(),
    category: z.string().optional(), // freeform per CONTEXT D-02
    sticky: z.boolean().default(false),
    password: z.string().optional(),
    toc: z.boolean().default(true),
  }),
});

// ─── PROJECTS (detailed, D-06) ──────────────────────────
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

// ─── CREATIONS (detailed, D-07) ────────────────────────
const creations = defineCollection({
  loader: glob({ base: './src/content/creations', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    images: z.array(z.string()).min(1),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    category: z.enum(['illustration', 'photography', 'craft', 'video']).optional(),
  }),
});

// ─── MICROBLOG (detailed, D-05) ────────────────────────
const microblog = defineCollection({
  loader: glob({ base: './src/content/microblog', pattern: '**/*.md' }),
  schema: z.object({
    publishedAt: z.coerce.date(),
    content: z.string(),
    images: z.array(z.string()).default([]),
    mood: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

// ─── FRIENDS (detailed, D-03) ──────────────────────────
// The `file()` loader treats the JSON as a map of entries:
// - Array form: each element becomes an entry, id derived from element.id or element.slug
// - Object form: each key-value pair becomes an entry, key is id, value is data
// We use the array form so the schema is applied to each friend object directly.
const friends = defineCollection({
  loader: file('./src/content/friends/friends.json'),
  schema: z.object({
    id: z.string().optional(),
    name: z.string(),
    url: z.string().url(),
    avatar: z.string().url().optional(),
    description: z.string().optional(),
    category: z.enum(['tech', 'anime', 'life', 'other']).optional(),
    featured: z.boolean().default(false),
  }),
});

// ─── TIMELINE (detailed, D-04) ──────────────────────────
const timeline = defineCollection({
  loader: glob({ base: './src/content/timeline', pattern: '**/*.md' }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    link: z.string().url().optional(),
    side: z.enum(['left', 'right', 'auto']).default('auto'),
  }),
});

// ─── ANIME / BOOKS / MUSIC (Bangumi, PAGE-10) ──────────
const bangumiItemSchema = z.object({
  subjectId: z.number(),
  name: z.string(),
  nameCn: z.string().default(''),
  cover: z.string().url().or(z.literal('')).default(''),
  score: z.number().default(0),
  rate: z.number().default(0),
  type: z.number(), // 1=wish, 2=done, 3=doing
  epStatus: z.number().default(0),
  volStatus: z.number().default(0),
  eps: z.number().default(0),
  updatedAt: z.string().optional(),
  comment: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

const anime = defineCollection({
  loader: file('./src/content/anime/list.json'),
  schema: z.array(bangumiItemSchema).default([]),
});
const books = defineCollection({
  loader: file('./src/content/books/list.json'),
  schema: z.array(bangumiItemSchema).default([]),
});
const music = defineCollection({
  loader: file('./src/content/music/list.json'),
  schema: z.array(bangumiItemSchema).default([]),
});

export const collections = {
  articles,
  projects,
  creations,
  microblog,
  friends,
  timeline,
  anime,
  books,
  music,
};
