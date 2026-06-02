# Architecture Research

**Domain:** 二次元可爱风 (anime / kawaii) personal blog + portfolio — static site
**Stack candidate:** Astro (recommended) / Hexo (fallback)
**Researched:** 2026-06-02
**Confidence:** HIGH for Astro mechanics, MEDIUM for Live2D / 二次元 ecosystem patterns (well-documented but constantly evolving), MEDIUM for Twikoo Vercel specifics (verified against official docs)

---

## TL;DR — Recommended Architecture

A **static-first Astro site** with **typed content collections**, a **layered atmosphere runtime** that hydrates via `client:visible`/`client:idle` so it never blocks first paint, and a **small set of external runtime services** (Twikoo, APlayer+MetingJS, Live2D-widget) that are loaded only after the static HTML/CSS paints.

**Why this shape, not a SPA:** all 12 page requirements (PAGE-01..12) and 6 atmosphere requirements (ATM-01..06) are renderable as static HTML + progressive enhancement. The owner explicitly excluded accounts, real-time data, and analytics. SSR/SPA would buy complexity the project does not need.

**Why Astro over Hexo:** Astro gives the owner a modern, typed, component-based setup (cleaner for the mixed-genre article/two-works-modules/community-hub split), islands for atmosphere widgets, content collections with Zod-validated frontmatter (eliminates a whole class of typo bugs), and first-class `output: 'static'` + Vercel/Cloudflare Pages fit. Hexo remains a credible fallback **only** if the owner needs a battle-tested 二次元 theme (Sakura / Butterfly / Yun) out of the box — those themes bundle Live2D, BGM, APlayer, friends links, custom right-click, falling petals pre-wired.

---

## Standard Architecture

### System Overview

```
                         ┌──────────────────────────────┐
                         │     BUILD TIME (CI/CD)       │
                         │  Vercel/Cloudflare build     │
                         └──────────────┬───────────────┘
                                        │
   ┌────────────┐  ┌────────────┐  ┌────▼──────────────────┐
   │  Markdown  │  │  JSON/YAML │  │  Remote APIs          │
   │  /content  │  │  /data     │  │  - Bangumi (build)    │
   │  .md, .mdx │  │  friends,  │  │  - GitHub Repos       │
   └─────┬──────┘  │  microblog │  │  - AvatarGen config   │
         │         └─────┬──────┘  └─────┬─────────────────┘
         │               │               │
         └───────────────┴───────┬───────┘
                                 ▼
                   ┌──────────────────────────┐
                   │   ASTRO BUILD PIPELINE   │
                   │  - content.config.ts     │
                   │    (Zod schemas)         │
                   │  - getStaticPaths()      │
                   │  - RSS, sitemap, pagefind│
                   └─────────────┬────────────┘
                                 ▼
                       /dist (static HTML/CSS/JS)
                                 │
                                 ▼
   ┌─────────────────────────────────────────────────────────────┐
   │              EDGE CDN (Vercel / Cloudflare)                 │
   │         static files + assets (Live2D, audio, images)       │
   └─────────────────────────┬───────────────────────────────────┘
                             │  HTTPS GET (browser)
                             ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                  BROWSER RUNTIME (Client)                    │
   │                                                              │
   │  ┌──────────────────────────┐  ┌──────────────────────────┐  │
   │  │ Static HTML/CSS paints   │  │ Hydrated "Islands"       │  │
   │  │ (all 12 pages)           │  │ - Live2D (client:visible)│  │
   │  │ - Article body           │  │ - APlayer + Meting       │  │
   │  │ - Works grid             │  │ - Twikoo (client:visible)│  │
   │  │ - Anime list             │  │ - Theme switcher         │  │
   │  │ - Friend links           │  │ - Custom right-click     │  │
   │  │ - Microblog feed         │  │ - Falling petals         │  │
   │  └──────────────┬───────────┘  │ - Cursor trail           │  │
   │                 │              │ - Konami easter egg      │  │
   │                 │              └────────────┬─────────────┘  │
   │                 │                           │                 │
   │                 │  Third-party calls        │                 │
   │                 │  - Twikoo envId  ──────────┼──────────┐      │
   │                 │  - Bangumi v0     ─────────┼──────────┤      │
   │                 │  - Meting API    ─────────┼──────────┤      │
   │                 │                           │          │      │
   └─────────────────┴───────────────────────────┴──────────┴──────┘
                                                              │
                       ┌──────────────────────────────────────┴───┐
                       │ Runtime services (NOT in static bundle)  │
                       │  - Twikoo (Vercel serverless + Mongo)    │
                       │  - Meting API (NetEase/Tencent proxied)  │
                       │  - Bangumi v0 (cache: 12h)               │
                       └──────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Content sources** | Author-supplied raw input. Markdown for prose, JSON/YAML for structured lists (friends, microblog, works). Lives in the repo. | `src/content/{articles,projects,creations,microblog,timeline}/` |
| **`content.config.ts`** | Single source of truth for content schemas. Validates frontmatter at build via Zod, catches typos/typos before they ship. | Astro `defineCollection()` + Zod |
| **Remote data fetchers** | Pull external data at build time (Bangumi anime list, GitHub project stars, etc.) and cache JSON into `src/data/`. | Astro `getCollection()` + fetch in `getStaticPaths`, or build script step |
| **Astro build pipeline** | Renders every page to static HTML, generates `dist/`, produces RSS, sitemap, search index (Pagefind). | `astro build` (`output: 'static'`) |
| **Page templates (layouts)** | `BaseLayout`, `ArticleLayout`, `WorksLayout`, `MicroblogLayout` — shared chrome (nav, footer, theme, atmosphere). | `src/layouts/*.astro` |
| **Static page output** | All PAGE-01..12 rendered as `.html` files in `dist/`. SEO-friendly, no JS required to read. | `src/pages/**/*.astro` |
| **Atmosphere runtime** | Hydrated islands: Live2D widget, APlayer, theme switcher, falling petals, right-click menu, Konami. All opt-in via `client:*` directives. | `src/components/atmosphere/*` |
| **Search index** | Build-time search index for articles + works + microblog. Client queries it. | Pagefind (default) or Fuse.js for tiny sites |
| **RSS / JSON Feed** | Auto-generated from article collection. | `@astrojs/rss` |
| **Comment system (external)** | Twikoo — serverless backend on Vercel + MongoDB Atlas, frontend snippet loaded `client:visible` per article. | Twikoo v1.7+ |
| **Music player (external)** | APlayer + MetingJS for NetEase/Tencent playlists. Self-contained `<meting-js>` custom element. | `dist/APlayer.min.js` + `Meting.min.js` |
| **Avatar generator (optional v1)** | Client-side canvas + style tokens JSON. No backend. | `src/components/avatar/*` |
| **Hosting / CDN** | Static files served from edge. Auto HTTPS. | Vercel (preferred) or Cloudflare Pages |

---

## Recommended Project Structure

### Astro layout (recommended)

```
merlinalex.me/
├── public/                              # Served verbatim, no processing
│   ├── favicon.ico
│   ├── live2d/                          # Live2D model assets
│   │   ├── model_list.json
│   │   ├── shizuku/                     # Model folder
│   │   │   ├── shizuku.model.json
│   │   │   ├── shizuku.moc3
│   │   │   ├── textures.cache
│   │   │   └── *.png                    # Texture atlases
│   │   └── (other models)
│   ├── audio/                           # BGM fallback (if not using Meting)
│   │   └── *.mp3
│   ├── images/
│   │   ├── banners/                     # Per-article hero
│   │   ├── works/                       # Creations thumbnails
│   │   └── friends/                     # Friend link avatars
│   └── models/                          # 3D mascot variants, easter eggs
│
├── src/
│   ├── content/                         # Authored content (Zod-validated)
│   │   ├── config.ts                    # Re-exports collection registry
│   │   ├── articles/                    # PAGE-03, PAGE-04
│   │   │   ├── hello-world.md
│   │   │   └── react-vs-vue.md
│   │   ├── projects/                    # PAGE-06 (open-source works)
│   │   │   └── my-cli-tool.md
│   │   ├── creations/                   # PAGE-07 (illustrations, photos)
│   │   │   └── spring-sketch.md
│   │   ├── microblog/                   # PAGE-09 (说说/碎碎念)
│   │   │   └── 2026-05-30.md
│   │   ├── anime/                       # PAGE-10
│   │   │   └── list.json                # or per-item .json
│   │   ├── books/                       # PAGE-10
│   │   │   └── list.json
│   │   ├── music/                       # PAGE-10
│   │   │   └── list.json
│   │   └── timeline/                    # PAGE-11
│   │       └── 2026.md
│   │
│   ├── data/                            # Static data, no schema validation
│   │   ├── friends.json                 # PAGE-08
│   │   ├── profile.json                 # About-page persona
│   │   ├── social.json                  # Footer + about links
│   │   ├── theme.config.ts              # Theme variants / palette
│   │   └── easter-eggs.json             # Konami sequence + actions
│   │
│   ├── components/
│   │   ├── core/                        # Always-on, no client JS
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Nav.astro
│   │   │   ├── Card.astro
│   │   │   └── Tag.astro
│   │   ├── content/                     # Domain-specific renderers
│   │   │   ├── ArticleCard.astro
│   │   │   ├── ProjectCard.astro
│   │   │   ├── CreationCard.astro
│   │   │   ├── MicroblogItem.astro
│   │   │   ├── AnimeCard.astro
│   │   │   ├── TimelineItem.astro
│   │   │   ├── FriendCard.astro
│   │   │   └── TOC.astro
│   │   ├── atmosphere/                  # ATM-01..06, all client-side
│   │   │   ├── Live2D.astro             # ATM-01, client:visible
│   │   │   ├── FallingPetals.astro      # ATM-02
│   │   │   ├── CursorTrail.astro        # ATM-02
│   │   │   ├── RightClickMenu.astro     # ATM-03
│   │   │   ├── ThemeSwitcher.astro      # ATM-04
│   │   │   ├── BGMPlayer.astro          # ATM-05
│   │   │   └── EasterEgg.astro          # ATM-06
│   │   ├── discovery/                   # DISC-01..03
│   │   │   ├── SearchBox.astro          # DISC-02
│   │   │   ├── TagCloud.astro           # DISC-03
│   │   │   └── ArchiveList.astro        # DISC-03
│   │   ├── widgets/                     # PAGE-12 etc.
│   │   │   └── AvatarGenerator.astro
│   │   └── comments/
│   │       └── Twikoo.astro             # Comments island
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro             # <html> shell, theme, atmosphere
│   │   ├── ArticleLayout.astro          # PAGE-04
│   │   ├── WorksLayout.astro            # PAGE-05
│   │   ├── MicroblogLayout.astro        # PAGE-09
│   │   └── ListLayout.astro             # Reusable list page
│   │
│   ├── pages/                           # File = URL
│   │   ├── index.astro                  # PAGE-01
│   │   ├── about.astro                  # PAGE-02
│   │   ├── articles/
│   │   │   ├── index.astro              # PAGE-03 (list, tag-filtered)
│   │   │   ├── tag/
│   │   │   │   └── [tag].astro          # PAGE-03 (per-tag)
│   │   │   └── [slug].astro             # PAGE-04 (detail, getStaticPaths)
│   │   ├── works/
│   │   │   ├── index.astro              # PAGE-05
│   │   │   ├── projects/
│   │   │   │   ├── index.astro          # PAGE-06
│   │   │   │   └── [slug].astro
│   │   │   └── creations/
│   │   │       ├── index.astro          # PAGE-07
│   │   │       └── [slug].astro
│   │   ├── friends.astro                # PAGE-08
│   │   ├── microblog/
│   │   │   ├── index.astro              # PAGE-09
│   │   │   └── page/[page].astro        # Pagination
│   │   ├── bangumi/                     # PAGE-10
│   │   │   ├── index.astro              # Redirects to /anime
│   │   │   ├── anime.astro
│   │   │   ├── books.astro
│   │   │   └── music.astro
│   │   ├── timeline.astro               # PAGE-11
│   │   ├── avatar.astro                 # PAGE-12
│   │   ├── 404.astro
│   │   ├── rss.xml.ts                   # DISC-01
│   │   └── search-index.json.ts         # DISC-02 (or Pagefind)
│   │
│   ├── styles/
│   │   ├── global.css                   # CSS variables, reset, theme tokens
│   │   ├── prose.css                    # Article body
│   │   ├── animations.css               # Falling petals, cursor trail
│   │   └── themes/
│   │       ├── light.css
│   │       ├── dark.css
│   │       └── holiday.css              # Holiday variants
│   │
│   ├── lib/                             # Pure utilities (no Astro imports)
│   │   ├── bangumi.ts                   # Build-time Bangumi client
│   │   ├── date.ts
│   │   ├── slug.ts
│   │   ├── reading-time.ts
│   │   ├── twikoo-config.ts
│   │   └── meting-config.ts
│   │
│   ├── scripts/                         # Build-time Node scripts
│   │   └── fetch-bangumi.ts             # Pulls user collection to src/data/
│   │
│   └── env.d.ts
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

### Hexo layout (fallback, if owner chooses Hexo)

```
merlinalex.me/
├── _config.yml                          # Site config
├── _config.butterfly.yml                # Theme config (or sakura / yun)
├── source/
│   ├── _posts/                          # Articles (PAGE-04)
│   │   └── hello-world.md
│   ├── _data/                           # Static data
│   │   ├── friends.yml
│   │   ├── microblog.yml
│   │   └── bangumi.json
│   ├── about/                           # PAGE-02
│   │   └── index.md
│   ├── friends/                         # PAGE-08
│   │   └── index.md
│   ├── microblog/                       # PAGE-09
│   │   └── index.md
│   ├── bangumi/                         # PAGE-10
│   │   ├── index.md
│   │   ├── anime.md
│   │   ├── books.md
│   │   └── music.md
│   ├── timeline/                        # PAGE-11
│   │   └── index.md
│   ├── avatar/                          # PAGE-12
│   │   └── index.md
│   ├── live2d-widget/                   # self-hosted live2d-widget dist
│   └── images/
├── themes/
│   └── butterfly/                       # or sakura / yun
│       ├── _config.yml
│       ├── layout/
│       │   ├── includes/
│       │   │   ├── live2d.pug
│       │   │   ├── aplayer.pug
│       │   │   ├── right-menu.pug
│       │   │   └── twikoo.pug
│       │   ├── index.pug
│       │   ├── post.pug
│       │   ├── page.pug
│       │   └── ...
│       ├── source/
│       │   ├── css/
│       │   ├── js/
│       │   └── live2d/
│       └── scripts/
├── scaffolds/
│   ├── post.md
│   ├── page.md
│   └── microblog.md
├── public/                              # Served verbatim
└── package.json
```

### Structure Rationale

- **`src/content/` is Zod-validated** (Astro): one typo in frontmatter fails the build, not silently ships a broken page. The dual `src/data/` directory holds non-Markdown data (friends list, theme tokens) that doesn't need frontmatter semantics.
- **`public/` for binaries**: Live2D model files (`.moc3`, texture atlases, model JSON) and audio files are large and should be served unchanged. Astro hashes the rest but leaves `public/` alone.
- **`components/atmosphere/`** isolates every "cute" feature. The owner can disable any one of them with a single line in `BaseLayout.astro` — important because some of these features are taste-dependent and may need toggling.
- **`lib/` over `utils/`**: pure functions only, no Astro imports. Easy to unit-test, no client-bundle bleed.
- **Hexo fallback is presented for completeness only** — if the owner wants Hexo, the content sources map 1:1, but the atmosphere components become Pug includes inside the theme and the build pipeline swaps to `hexo generate`.

---

## Content Schemas (Astro `content.config.ts`)

The following Zod schemas are the recommended shape for the five content types in PROJECT.md. These are validated at build time and surface as typed objects throughout the codebase.

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// ─────────────────────────────────────────────────────────────
// ARTICLES — mixed-genre blog posts (PAGE-03, PAGE-04)
// ─────────────────────────────────────────────────────────────
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),         // tech, life, review, notes...
    category: z.enum(['tech', 'life', 'review', 'notes']).optional(),
    cover: z.string().optional(),                  // /images/banners/foo.png
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    pinned: z.boolean().default(false),
    toc: z.boolean().default(true),                // show TOC
    showComments: z.boolean().default(true),
  }),
});

// ─────────────────────────────────────────────────────────────
// PROJECTS — open-source works (PAGE-06)
// ─────────────────────────────────────────────────────────────
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    cover: z.string().optional(),
    techStack: z.array(z.string()).default([]),     // ['TypeScript', 'Vite']
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    status: z.enum(['active', 'maintained', 'archived', 'wip']).default('active'),
    stars: z.number().int().nonnegative().optional(),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),            // manual sort
  }),
});

// ─────────────────────────────────────────────────────────────
// CREATIONS — illustrations, photos, crafts, videos (PAGE-07)
// ─────────────────────────────────────────────────────────────
const creations = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/creations' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    pubDate: z.coerce.date(),
    type: z.enum(['illustration', 'photo', 'craft', 'video', 'music', 'writing']),
    cover: z.string(),
    gallery: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),         // ['Procreate', 'CLIP STUDIO']
    externalUrl: z.string().url().optional(),      // Pixiv, Bilibili, etc.
    nsfw: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().int().default(0),
  }),
});

// ─────────────────────────────────────────────────────────────
// MICROBLOG — 说说 / 碎碎念 feed (PAGE-09)
// ─────────────────────────────────────────────────────────────
const microblog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/microblog' }),
  schema: z.object({
    pubDate: z.coerce.date(),
    mood: z.string().optional(),                   // emoji or short tag
    location: z.string().optional(),
    images: z.array(z.string()).default([]),
    pinned: z.boolean().default(false),
    showComments: z.boolean().default(false),      // microblog usually no comments
  }),
  // Body is plain markdown; no title field — first line is the post.
});

// ─────────────────────────────────────────────────────────────
// ANIME / BOOK / MUSIC — Bangumi-style list (PAGE-10)
// Stored as one JSON file per category so they can be edited in
// bulk from a form or hand-written. Use `file()` loader.
// ─────────────────────────────────────────────────────────────
const anime = defineCollection({
  loader: file('./src/content/anime/list.json'),
  schema: z.object({
    items: z.array(z.object({
      id: z.number().int(),                        // bangumi subject_id
      title: z.string(),
      status: z.enum(['wish', 'done', 'doing', 'on_hold', 'dropped']),
      rating: z.number().min(1).max(10).optional(),
      progress: z.number().int().nonnegative().default(0),
      total: z.number().int().nonnegative().optional(),
      comment: z.string().optional(),
      cover: z.string().url().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
    })),
  }),
});
// `books` and `music` mirror this shape.

export const collections = { articles, projects, creations, microblog, anime };
```

**Why a `file()` loader for anime list, `glob()` for everything else:** articles, projects, creations, and microblog are added one at a time and need frontmatter per file. Anime/book/music lists are usually mass-edited (synced from Bangumi) and live in a single JSON that a build script regenerates. The loader choice mirrors the author's natural workflow.

**Frontmatter design notes:**

- `status: z.enum([...])` on projects/creations ensures no "actiev" typos reach the build.
- `tags: z.array(z.string())` is intentionally flat (no nesting). The PROJECT spec says "tags: tech, life, review, notes…" — one tag set, no hierarchy.
- `pubDate: z.coerce.date()` accepts both string and `Date` inputs.
- `featured` + `order` gives the owner a manual promotion control without needing a database.

---

## Data Flow

### Build-time flow (the main one — this site is static)

```
Author edits .md / .json
       │
       ▼
git push → Vercel/Cloudflare webhook
       │
       ▼
┌──────────────────────────────────────────┐
│ npm install (cached)                     │
│ npm run prebuild                         │  ← fetch-bangumi.ts pulls
│   - fetch-bangumi.ts → src/data/         │    Bangumi v0 collection
│                                          │    into JSON, cached 12h
│ npm run build                            │
│   - astro build (output: 'static')       │
│   - reads src/content.config.ts          │
│   - validates every frontmatter (Zod)    │
│   - calls getCollection() for all 5      │
│   - calls getStaticPaths() for dynamic   │
│     routes (article/[slug], project/...)  │
│   - runs RSS endpoint (rss.xml.ts)       │
│   - runs Pagefind indexer on dist/       │
│   - emits /dist                          │
└──────────────────────────────────────────┘
       │
       ▼
CDN deploy (Vercel/Cloudflare)
       │
       ▼
Browser GET /articles/my-post
       │
       ▼
Returns: pre-rendered HTML + CSS + minimal JS
       │
       ▼
Islands hydrate on visibility / interaction
```

### Runtime (client) flow

```
Static HTML painted ✓
       │
       ├── <link rel=stylesheet> for APlayer.css
       ├── <script defer> for theme-switcher (FOUC-prevention)
       │
       ▼
IntersectionObserver fires (Live2D container visible)
       │
       ├── dynamic import: live2d-widget/dist/waifu-tips.js
       │   └── fetches /live2d/model_list.json
       │       └── for each model: /live2d/{name}/{name}.model.json
       │           └── .moc3 + texture atlases
       │
       ▼
User clicks BGM toggle → dynamic load: APlayer + Meting
       │
       ├── GET https://meting-api.example/api?server=netease&type=playlist&id=...
       │   (or local /audio/*.mp3)
       │
       ▼
User scrolls to comments → dynamic load: Twikoo
       │
       ├── GET <envId>/comment  (Vercel serverless → MongoDB)
       │
       ▼
User searches → Pagefind index (already in /dist/pagefind/)
       │
       └── No backend roundtrip; entirely client-side index lookup
```

### Key Data Flows

1. **Article publish:** author writes `src/content/articles/foo.md` → git push → CI build → static HTML at `/articles/foo/` (Astro `[slug].astro` + `getStaticPaths`).
2. **Bangumi sync:** `scripts/fetch-bangumi.ts` calls `GET /v0/users/{username}/collections?subject_type=2&type={status}` → writes `src/content/anime/list.json` → build reads it via `file()` loader → renders `<AnimeCard>` per item.
3. **Theme switch:** `ThemeSwitcher.astro` writes `localStorage.theme` and toggles `data-theme` on `<html>`. Pure CSS variables do the work — no re-render, no flash if the script is in `<head>` with `defer`.
4. **Comments:** Twikoo script loaded `client:visible` inside the article layout. The widget's container is empty until the user scrolls into the comments area; this keeps Twikoo's ~80KB JS off the critical path.
5. **Live2D model switch:** `Live2D.astro` exposes an `initWidget({ modelId, cdnPath, cubism5Path })` call pointing at `/live2d/`. The widget self-fetches `model_list.json` and lets the user click a button to swap.

### Data Flow Direction Summary

| Direction | When | Carries |
|-----------|------|---------|
| Build-time: filesystem → build pipeline | Every CI run | Markdown, JSON, Zod-validated |
| Build-time: external API → filesystem | `prebuild` script | Bangumi collection (cached) |
| Build-time: pipeline → CDN | Deploy | Pre-rendered HTML, CSS, JS, search index |
| Runtime: CDN → browser | Every page load | Static files (cacheable, immutable) |
| Runtime: browser → third-party | User interaction | Twikoo writes, Meting reads, Bangumi optional refresh |

**Crucially: no runtime data flows *into* the site from external APIs during the page view.** All dynamic data is either pre-fetched at build or fetched lazily on user action (comments, BGM). This is the "static-first" guarantee the PROJECT spec asks for.

---

## Architectural Patterns

### Pattern 1: Islands Architecture (Astro)

**What:** The page is fully static HTML; only explicitly-marked components ship JavaScript and hydrate on the client.

**When:** Always, on this site. Default `Astro` components render zero JS. Use `client:load` / `client:idle` / `client:visible` / `client:media` / `client:only` to control when each island hydrates.

**Trade-offs:**
- Pro: First paint is pure HTML+CSS. No FOUC, no JS-blocking. Most pages (about, friends, anime list) are *zero* JS.
- Pro: Easy to keep atmosphere widgets out of the critical path (Live2D is heavy; `client:visible` defers it).
- Con: Cross-island state sharing needs a store (nanostores) or shared `localStorage`. For a personal site this is fine.

**Example:**
```astro
---
// src/pages/articles/[slug].astro
import ArticleLayout from '../../layouts/ArticleLayout.astro';
import { getCollection } from 'astro:content';
import Twikoo from '../../components/comments/Twikoo.astro';

export async function getStaticPaths() {
  const posts = await getCollection('articles', ({ data }) => !data.draft);
  return posts.map(post => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<ArticleLayout title={post.data.title} description={post.data.description}>
  <Content />
  {post.data.showComments && <Twikoo client:visible />}
</ArticleLayout>
```

### Pattern 2: Content Collections + Zod (Type-Safe Content)

**What:** Define a schema per content type in `content.config.ts`. Astro validates every entry at build time and infers the TypeScript type from the Zod schema.

**When:** Every collection, from day one. The cost of writing a schema once is repaid the first time it catches a typo.

**Trade-offs:**
- Pro: Frontmatter typos fail the build, not silently.
- Pro: `getCollection('articles')` returns typed `CollectionEntry<'articles'>[]` — no `any` in render code.
- Con: One extra file to maintain. Negligible.

### Pattern 3: Layered Atmosphere Runtime (defer by default)

**What:** A single `BaseLayout.astro` mounts a small set of atmosphere islands. Each island is opt-in and uses the lightest possible hydration directive. Owner can disable any feature with a single comment.

**When:** All atmosphere features (ATM-01..06). This is the architectural answer to "the Live2D mascot must not block first paint."

**Trade-offs:**
- Pro: Performance ceiling is "no atmosphere" — every feature is additive.
- Pro: Owner can A/B test disabling features with a build flag.
- Con: The atmosphere components need careful ordering (theme-switcher MUST be in `<head>`; Live2D should be `client:visible`; BGM is `client:idle`).

**Example layering:**
```astro
<!-- src/layouts/BaseLayout.astro -->
<head>
  <!-- MUST be in head to prevent flash -->
  <ThemeSwitcher />
  ...
</head>
<body>
  <Header />
  <main><slot /></main>

  <!-- Defer all interactive chrome until idle/visible -->
  <BGMPlayer client:idle />
  <FallingPetals client:visible />
  <Live2D client:visible />
  <RightClickMenu client:idle />
  <CursorTrail client:visible />
  <EasterEgg client:idle />
</body>
```

### Pattern 4: External-Backend for User-Generated Content (Twikoo)

**What:** Comments are NOT pre-rendered. The Twikoo widget is a `client:visible` island that talks to a separate Vercel serverless function (with MongoDB Atlas). The static site never touches user data.

**When:** Comments, and *only* comments. If the owner later wants guestbook, reactions, or likes, the same Twikoo envId can host them (Twikoo supports `el: '#twikoo-guestbook'`).

**Trade-offs:**
- Pro: Static site stays purely static; no DB on the same host.
- Pro: Free tier (Vercel hobby + MongoDB M0).
- Con: Twikoo Vercel domain can be slow in mainland China; binding a custom domain is recommended. The `region` option helps for Tencent CloudBase.

**Embed:**
```html
<!-- pages/articles/[slug].astro renders this once per article -->
<div id="tcomment"></div>
<script>
  twikoo.init({
    envId: 'https://twikoo-merlinalex.vercel.app',  // Vercel domain = envId
    el: '#tcomment',
    // region: 'ap-guangzhou',  // only for Tencent CloudBase
    lang: 'zh-CN',
  });
</script>
```

### Pattern 5: Build-Time External Data Sync (Bangumi)

**What:** A `prebuild` script (`scripts/fetch-bangumi.ts`) calls the Bangumi API at build time and writes a JSON file into `src/content/anime/list.json` (or `src/data/anime.json`). The build then reads the JSON, not the API. The page itself is static HTML; the JSON is regenerated every build.

**When:** Any external data that's "owner-owned, not user-personalized" (anime list, book list, GitHub stars, npm downloads).

**Trade-offs:**
- Pro: No runtime API call, no rate limiting, no CORS drama.
- Pro: Build fails loudly if Bangumi is down (or the script can fall back to a cached JSON).
- Con: Owner needs to rebuild to reflect external changes. Mitigation: trigger rebuilds via a daily Vercel cron hitting a deploy hook.

**Example prebuild:**
```ts
// scripts/fetch-bangumi.ts
import { writeFile } from 'node:fs/promises';

const USER = 'merlinalex';
const URL = `https://api.bgm.tv/v0/users/${USER}/collections?subject_type=2&limit=50`;

const res = await fetch(URL, { headers: { 'User-Agent': 'merlinalex-site/1.0' } });
const data = await res.json();

await writeFile('./src/content/anime/list.json', JSON.stringify(data, null, 2));
console.log(`Fetched ${data.data.length} anime entries`);
```

### Pattern 6: CDN-Served Decorative Assets (Live2D, Audio)

**What:** Heavy binary assets (Live2D `.moc3` files, audio, banners) live in `public/` and are served directly by the CDN with long cache headers. The Astro bundle does not process them.

**When:** Any asset > 50KB that doesn't need Astro's image optimization.

**Trade-offs:**
- Pro: Zero build cost; CDN does the work.
- Pro: Long-cacheable (Astro / Vercel hashes paths or sets immutable headers via config).
- Con: No image optimization (use Astro's `<Image>` for `< 100KB` images that benefit from WebP conversion).

---

## Anti-Patterns

### Anti-Pattern 1: Hydrating the Whole Page as a Single SPA

**What people do:** Build a Next.js / Nuxt / full-SPA app because the atmosphere widgets are interactive. Bundle React/Vue across the entire site.

**Why it's wrong:** Kills first-paint performance for content that is 95% static. Wastes free-tier edge invocations. The PROJECT spec says "performance: < 2s on broadband" — a JS-heavy SPA routinely misses this.

**Do this instead:** Astro islands. Static HTML by default, opt-in hydration per feature.

### Anti-Pattern 2: Loading Live2D on Every Page Load (`client:load`)

**What people do:** Mount the Live2D widget eagerly so it appears "as the page loads."

**Why it's wrong:** Live2D fetches the Cubism Core (~200KB+), the model JSON, the .moc3 binary, and texture atlases (often 1-5MB total). Doing this on first paint blocks interactivity and burns bandwidth on pages the visitor may bounce from.

**Do this instead:** `client:visible` on the Live2D mount point. The widget fetches only after the user scrolls into a region near the bottom-right corner where the widget lives.

### Anti-Pattern 3: Self-Hosted MongoDB / Backend on the Same Vercel Project

**What people do:** Add a Vercel Postgres / Mongo / KV to the same project that serves the static site.

**Why it's wrong:** Static sites on Vercel's free tier get unlimited bandwidth; adding a database hits the 12KB-function-request and 100GB-hobby-tier limits fast. It also tightly couples the blog to a server.

**Do this instead:** Keep Twikoo in a *separate* Vercel project (one-click deploy), tied only by `envId` in the embed snippet. Site stays pure static.

### Anti-Pattern 4: Untyped Frontmatter ("just use string tags")

**What people do:** Trust authors to write correct YAML. Skip the Zod schema.

**Why it's wrong:** A typo (`tags: techh, life`) silently produces a broken tag filter; a wrong date format (`2026-13-01`) ships a broken page; a missing `cover` URL 404s in production.

**Do this instead:** Spend 30 minutes writing Zod schemas in `content.config.ts`. Astro's type inference then makes broken frontmatter *unrepresentable* in render code.

### Anti-Pattern 5: Mixing Projects and Creations in One Schema

**What people do:** One `works/` collection with a `type: project | creation` discriminator.

**Why it's wrong:** The PROJECT spec explicitly calls these out as "two distinct works modules" with "different audiences and visual treatments." Conflating them at the schema level means every `WorksCard` component branches on `type` and renders two completely different layouts.

**Do this instead:** Two collections (`projects`, `creations`) in `content.config.ts`. The Works hub page (`/works/`) aggregates both, but each module has its own page, schema, and visual treatment.

### Anti-Pattern 6: Calling Bangumi / Meting at Runtime in the Page

**What people do:** `useEffect` / `client:load` fetches the user's anime list when the page loads.

**Why it's wrong:** Bangumi rate-limits anonymous requests; the CORS preflight is slow from China; the list is owner-owned data, not user-personalized.

**Do this instead:** Prebuild script fetches once per build, writes JSON, page reads JSON.

### Anti-Pattern 7: Writing a Custom Avatar Generator Backend

**What people do:** Spin up a serverless function with PIL/Canvas to render avatars server-side.

**Why it's wrong:** Avatar generation is client-side-renderable with `<canvas>` and a tokens JSON. The "feel" of a kawaii avatar (eyes, hair, accessory layers) is data, not server logic.

**Do this instead:** Pure client-side `<canvas>` + a `tokens.json` of SVG parts. Zero backend. Free.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Twikoo (comments)** | Separate Vercel serverless + MongoDB Atlas. Embed via `<div id="tcomment">` + `twikoo.init({ envId })`. `envId` = Vercel deployment URL. Loaded `client:visible` per article. | Free tier: Vercel hobby + MongoDB M0. Bind a custom domain for China reachability. Requires twikoo.js ≥ 1.4.0 frontend. |
| **APlayer + MetingJS (BGM)** | CDN scripts + `<meting-js server="netease" type="playlist" id="60198">` custom element. Global `meting_api` var overrides backend URL. Loaded `client:idle` globally. | APlayer v1.10.x or v2.0.x supported. Built-in Meting API works OOTB; self-host if you need custom auth. |
| **Live2D-widget** | Fork of stevenjoezhang/live2d-widget, `dist/` served from `/public/live2d/`. Include `<script src="/live2d/autoload.js">` with `live2d_path` constant. Loaded `client:visible` on a fixed mount point. | Cubism 2 / Cubism 3+ both supported (loaded dynamically). Models NOT included in widget repo — owner must obtain from Live2D Cubism SDK or community. |
| **Bangumi API v0** | Build-time only: `GET /v0/users/{username}/collections?subject_type=2&type={status}`. `subject_type=2` is anime; types are `wish|done|doing|on_hold|dropped`. | Anonymous reads OK; private collections need OAuth token. Owner should set a `User-Agent` header to avoid being blocked. |
| **Vercel / Cloudflare Pages** | Push-to-deploy from git. Vercel: `build = npm run build`, `output = dist`. Cloudflare: `npx astro build`, set `assets.directory` in `wrangler.jsonc` to `./dist`. | Both give free global CDN + auto HTTPS. No adapter needed for `output: 'static'`. |
| **Pagefind (search)** | Build-time indexer. After `astro build`, run `pagefind --site dist`. Result lives in `dist/pagefind/`. Client queries it via `pagefind.search()`. | Recommended over Fuse.js for content-heavy sites. Self-contained, no server. |
| **@astrojs/rss** | `src/pages/rss.xml.ts` exports a `GET` function calling `rss({...})` over the articles collection. | Requires `site:` in `astro.config.mjs`. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `BaseLayout` ↔ atmosphere islands | Direct `<Component client:* />` mount; no shared store unless explicitly needed | Keep atmosphere components props-only; share state via `localStorage` (theme) or per-island |
| `content.config.ts` ↔ page components | Astro's `getCollection('articles')` → typed `CollectionEntry<'articles'>[]` | Pages should never read frontmatter as `any`; trust the inferred type |
| `lib/bangumi.ts` ↔ `content/anime/list.json` | Prebuild script writes JSON; build reads it | No runtime calls. If data freshness matters, trigger rebuild via Vercel cron hitting a deploy hook |
| `Twikoo.astro` ↔ Vercel envId | Embed snippet hardcodes `envId` from `astro.config.mjs` env or constant | If envId changes, only one file needs editing |
| `Live2D.astro` ↔ `/public/live2d/model_list.json` | Widget fetches on init | `model_list.json` is a static file the owner hand-edits or generates from a build script |
| `RSS endpoint` ↔ articles collection | `getCollection('articles')` filtered to non-draft, sorted by `pubDate desc` | Use `draft: true` to keep WIP posts out of the feed |

---

## Scalability Considerations

This is a personal site with an explicit "$0/month, no self-hosted DB, no accounts" constraint. The "scaling" axis is "owner productivity at 1 / 50 / 500 posts," not "users at 1k / 100k / 1M." A CDN handles user traffic essentially for free.

| Owner scale | What changes |
|-------------|--------------|
| **0–50 articles / projects / creations** | Static builds in <5s on Vercel. No optimizations needed. |
| **50–500 items** | Build starts to feel the cost of (a) Pagefind indexing everything, (b) Bangumi sync on every push. Mitigation: trigger Bangumi sync only on a schedule, not on every commit. |
| **500+ items** | Add incremental builds (Astro 5+ supports `astro:db` and partial rebuilds). Consider per-collection RSS feeds. Pagefind remains fast up to ~10k pages. |

### Scaling Priorities (in order of when they actually bite)

1. **First bottleneck:** Search index size. If Pagefind bundle > 1MB at 500+ items, switch from "index everything" to "index articles only" with separate searches for works.
2. **Second bottleneck:** Build time. Bangumi sync + Pagefind together. Cache Bangumi response for 12h, only run on cron.
3. **Third bottleneck:** User-driven traffic. Unlikely to ever hit it on a personal site. Vercel free tier covers ~100GB bandwidth/month; that's 5M page views for a 20KB page. If crossed: upgrade to Vercel Pro ($20/mo) or move to Cloudflare Pages (no cap).

---

## Suggested Build Order (Phase Implications)

The roadmap phases should respect these dependency edges. Listed bottom-up (foundations first):

```
1. FOUNDATION
   ├─ Astro project init + TS config + content.config.ts (Zod schemas)
   ├─ BaseLayout with theme-switcher in <head>
   ├─ Global CSS tokens (light/dark/holiday)
   ├─ Hosting on Vercel/Cloudflare (proves the deploy pipeline)
   └─ PAGE-01 (home), PAGE-02 (about) — proves the layout works

2. CORE CONTENT
   ├─ articles collection schema + getStaticPaths + ArticleLayout
   ├─ PAGE-03 (articles index with tag filter)
   ├─ PAGE-04 (article detail, TOC, reading time)
   ├─ RSS endpoint (DISC-01) — easy once articles exist
   └─ Twikoo comments integration (PAGE-04 dependency, INFRA-03)

3. WORKS MODULES (the differentiator)
   ├─ projects collection + PAGE-05/06
   ├─ creations collection + PAGE-07
   ├─ PAGE-12 (avatar generator) — small, fun, validates
   └─ PAGE-08 (friend links) — `src/data/friends.json` + simple list

4. COMMUNITY PAGES
   ├─ microblog collection + PAGE-09
   ├─ PAGE-10 (anime/book/music) — needs Bangumi prebuild script
   ├─ PAGE-11 (timeline) — `src/content/timeline/*.md` or JSON
   └─ DISC-02 (Pagefind search) — index all collections

5. ATMOSPHERE (the polish)
   ├─ ATM-04 (theme switcher) — already in foundation, but iterate
   ├─ ATM-05 (BGM player) — APlayer + MetingJS, client:idle
   ├─ ATM-02 (falling petals / cursor trail) — `client:visible`
   ├─ ATM-01 (Live2D mascot) — heaviest, do last
   ├─ ATM-03 (right-click menu) — small script in <body>
   └─ ATM-06 (easter eggs) — tiny, fits anywhere

6. DISCOVERY
   ├─ DISC-03 (tag cloud + archive)
   └─ Custom 404 page
```

**Dependency rules encoded in the order:**

- Schemas (1) must exist before collections (2/3/4) can be rendered.
- BaseLayout (1) must exist before any page uses it.
- Twikoo (2) requires the owner's Vercel account + MongoDB; can't be wired before articles exist.
- Live2D (5) is heaviest and most failure-prone in CI; do it after everything else validates the site works.
- Bangumi (4) is a one-time script per build; safer to ship after the site already has content worth showing.
- Pagefind (4→6) only makes sense once there are things to search.

**Phase research flags** (which phases likely need `/gsd-research-phase` deep-dives):

| Phase | Research needed? | Reason |
|-------|------------------|--------|
| Foundation (1) | No | Standard Astro setup, well-documented |
| Core content (2) | Maybe (Twikoo) | Vercel + MongoDB wiring is non-trivial; one deep-dive phase for comments |
| Works (3) | No | Just schemas + components |
| Community (4) | Yes (Bangumi) | API specifics, sync strategy, caching, refresh policy |
| Atmosphere (5) | Yes (Live2D) | Cubism licensing, model acquisition, perf tuning |
| Discovery (6) | No | Pagefind is one `npx` command away |

---

## Open Questions / Phase-Specific Research Needed Later

1. **Live2D model licensing.** The widget itself is MIT, but Cubism models have their own licenses. Does the owner have a model already, or do we need to acquire one? (Phase 5)
2. **Twikoo custom domain.** Will the project have a `twikoo.merlinalex.me` subdomain, or share `merlinalex.me/twikoo/`? Affects envId and DNS. (Phase 2)
3. **Bangumi token.** Does the owner want public collections only, or are there private entries that require OAuth + refresh-token handling at build? (Phase 4)
4. **MetingJS source.** Default Meting API (a public proxy) or self-hosted? The default works but can be flaky. (Phase 5)
5. **Avatar generator scope.** "Generate a kawaii avatar in the site's style" — is this a single static style, a layered "kisekae" with swaps, or a "type your name and get a badge" thing? Affects PAGE-12 scope. (Phase 3)
6. **Migrating off Twikoo.** If the owner later wants to leave Twikoo (e.g., for Artalk or Giscus), the embed is one `<div>` + one `<script>` — easy. But the historical comments are stuck in MongoDB. Worth a one-time export to JSON in Phase 2.

---

## Sources

### Verified against documentation (HIGH confidence)
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/) — Zod schemas, `defineCollection`, `glob` / `file` loaders
- [Astro islands](https://docs.astro.build/en/concepts/islands/) — hydration directives, partial hydration
- [Astro project structure](https://docs.astro.build/en/basics/project-structure/) — `src/`, `public/`, layouts, components conventions
- [Astro dynamic routes](https://docs.astro.build/en/guides/routing/) — `getStaticPaths()` for SSG
- [Astro deploy to Vercel/Cloudflare](https://docs.astro.build/en/guides/deploy/) — `output: 'static'`, no adapter needed
- [Twikoo backend deployment](https://twikoo.js.org/backend.html) — Vercel + MongoDB Atlas, envId = Vercel domain
- [Twikoo frontend embed](https://twikoo.js.org/frontend.html) — `<div id="tcomment">` + `twikoo.init({...})` snippet
- [Bangumi API v0 spec](https://github.com/bangumi/server/blob/master/openapi/v0.yaml) — `GET /v0/users/{username}/collections` endpoint shape
- [MetingJS README](https://github.com/metowolf/MetingJS) — `<meting-js>` custom element, APlayer pairing
- [APlayer README](https://github.com/DIYgod/APlayer) — Hexo plugin list, format support
- [Hexo docs](https://hexo.io/docs/) — directory structure, frontmatter, layouts
- [Hexo front-matter](https://hexo.io/docs/front-matter) — `tags`/`categories`/`layout` fields
- [live2d-widget README](https://github.com/stevenjoezhang/live2d-widget) — `dist/autoload.js`, model serving, init options
- [hexo-tag-aplayer](https://github.com/DIYgod/hexo-tag-aplayer) — Hexo tag syntax for APlayer

### Verified against README (MEDIUM confidence)
- [hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly) — APlayer, Twikoo, friends links support
- [hexo-theme-sakura](https://github.com/honjun/hexo-theme-sakura) (referenced as inspiration; not directly fetched)
- [hexo-theme-yun](https://github.com/jieyou/hexo-theme-yun) (referenced; not directly fetched)

### Ecosystem knowledge (LOW confidence — would need validation)
- Specific Bunny CDN, Tencent COS, jsDelivr behavior for Live2D assets in mainland China
- Specific Twikoo MongoDB M0 connection limits at high comment volume
- Specific Bangumi rate limits for anonymous reads (only User-Agent is documented as required)

---

*Architecture research for: 二次元可爱风 personal blog + portfolio (Astro, static-first)*
*Researched: 2026-06-02*
