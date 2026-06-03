# Phase 1: Foundation - Pattern Map

**Mapped:** 2026-06-02
**Files analyzed:** 40 (new) / 0 (modified)
**Analogs found:** 0 in-repo / 40 — **greenfield project, all references are external canonical sources**

> **Greenfield notice.** Per `01-CONTEXT.md` §code_context: "Greenfield project. No prior code, no existing patterns, no reusable components." Therefore the "Closest Analog" column for every file points to an **external canonical reference** (Astro docs, Tailwind docs, Cloudflare docs) plus the **already-verified code excerpt** in `01-RESEARCH.md` or `01-UI-SPEC.md`. The planner should treat the cited research-doc line ranges as the "analog file" to mirror.

---

## File Classification

### Configuration (root)

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `astro.config.mjs` | config | build-time | Astro docs `docs.astro.build/en/guides/styling/` + `01-RESEARCH.md` §Code Examples — Example 1 (lines 808–833) | exact (verified excerpt) |
| `tsconfig.json` | config | build-time | Astro `astro/tsconfigs/strict` preset — `astro create` scaffold default; `01-RESEARCH.md` §Plan 01-01 task 2 | exact |
| `package.json` | config | build-time | `pnpm create astro@latest` scaffold default + `01-RESEARCH.md` §Standard Stack `[VERIFIED: npm registry]` versions (lines 95–106) | exact |
| `.nvmrc` | config | n/a | Single-line `22`; `01-RESEARCH.md` §Plan 01-01 task 8 | exact |
| `.env.example` | config | n/a | `01-RESEARCH.md` §Pitfall 7 (lines 778–788); single line `TWIKOO_ENV_ID=` | exact |
| `.gitignore` | config | n/a | Astro scaffold default + `01-RESEARCH.md` §Plan 01-01 task 20 (must include `.env`, `.env.local`, `node_modules`, `dist`, `.astro`) | exact |

### Schema / Model

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/content.config.ts` | model (Zod schemas) | build-time validation | Astro docs `docs.astro.build/en/guides/content-collections/` + `01-RESEARCH.md` §Pattern 2 (lines 397–520) — full 9-collection example verified against Astro 6 API | exact (verified excerpt, ready to copy) |
| `src/env.d.ts` | model (TS types) | build-time | Astro scaffold default `/// <reference path="../.astro/types.d.ts" />` | exact |

### Layouts

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/layouts/BaseLayout.astro` | layout (HTML shell) | server-render + pre-paint browser script | `01-RESEARCH.md` §Code Example 2 (lines 836–921) + §Pattern 1 (lines 309–395); Astro `<script is:inline>` docs `docs.astro.build/en/guides/client-side-scripts/` | exact (verified pattern — FOUC-safe; do NOT modify the script structure) |

### Pages (routes)

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/pages/index.astro` | page/route | request-response (static) | `01-RESEARCH.md` §Code Example 4 (lines 977–1008) — `getCollection` + filter + sort + slice; `01-UI-SPEC.md` §Home (lines 291–315) | exact (verified excerpt) |
| `src/pages/about.astro` | page/route | request-response (static) | `01-UI-SPEC.md` §About (lines 317–336) for layout; YAML load pattern: `import persona from '../data/persona.yaml'` (Astro auto-supports YAML via `vite-plugin-yaml`; if not, use `await import(...)` + `js-yaml` — see open question) | role-match (no verified excerpt for YAML import — see "External Reference Required" below) |
| `src/pages/404.astro` | page/route + status code | request-response (static, HTTP 404) | `01-RESEARCH.md` §Pattern 4 (lines 636–656) + `01-UI-SPEC.md` §404 stub (lines 338–352); Astro 6 API ref `docs.astro.build/en/reference/api-reference/` | exact (verified excerpt) |

### Components — Core (chrome / cross-cutting)

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/components/core/Header.astro` | component (layout chrome) | server-render | `01-UI-SPEC.md` §Component Inventory line 264 + §Page-by-Page (sticky 56px tall); standard Astro component pattern (frontmatter + template) | role-match (no verified excerpt — pattern below) |
| `src/components/core/Footer.astro` | component (layout chrome) | server-render; reads `src/data/social.json` at build | `01-UI-SPEC.md` §Component Inventory line 265 + §Copywriting line 416 | role-match |
| `src/components/core/Nav.astro` | component (layout chrome) | server-render | `01-UI-SPEC.md` §Component Inventory line 266; `aria-disabled` on Phase 1 dead links | role-match |
| `src/components/core/ThemeSwitcher.astro` | component (interactive island) | event-driven; localStorage R/W via `window.__atmo__.set` | `01-RESEARCH.md` §Code Example 3 (lines 926–971) — full inline script verified | exact (verified excerpt) |
| `src/components/core/IntensityBadge.astro` | component (interactive island) | event-driven; localStorage R/W via `window.__atmo__.set` | Mirror of ThemeSwitcher pattern; cycles `off→subtle→full→off`; `01-UI-SPEC.md` lines 233–238 + §Copywriting lines 412–415 | role-match (same shape as ThemeSwitcher) |
| `src/components/core/NoticeBar.astro` | component (interactive island) | event-driven; reads `src/data/notice.md` at build, writes `localStorage["notice:dismissed:<id>"]` on click | `01-UI-SPEC.md` line 269 + Out-of-Phase line 542; ARCHITECTURE.md §Pattern 1 islands | role-match |
| `src/components/core/NotFound.astro` | component (presentational) | server-render | `01-UI-SPEC.md` §404 stub (lines 338–352) + §Copywriting lines 403–405 | exact (UI-SPEC has full copy) |

### Components — Home (PAGE-01)

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/components/home/Hero.astro` | component (presentational) | server-render; reads `persona.yaml` | `01-UI-SPEC.md` line 270 + §Home contract lines 297–300 + §Copywriting lines 383–385 | role-match |
| `src/components/home/LatestArticles.astro` | component (data-list) | server-render; accepts `articles` prop from parent | `01-UI-SPEC.md` line 271 + §Home empty-state line 311; consumer of `getCollection('articles')` | role-match |
| `src/components/home/LatestMicroblog.astro` | component (data-list) | server-render; accepts `posts` prop | `01-UI-SPEC.md` line 272 + line 312 (empty state with mascot) | role-match |
| `src/components/home/Hitokoto.astro` | component (placeholder island) | server-render Phase 1; future `client:visible` Phase 4 | `01-UI-SPEC.md` line 273 + line 301 + Out-of-Phase line 540 (Phase 1: static `「 一言 」` placeholder) | role-match |
| `src/components/home/SiteStats.astro` | component (data-display) | server-render; receives counts as props | `01-UI-SPEC.md` line 274 + lines 302, 391–393 (zero-state row) | role-match |

### Components — About (PAGE-02)

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/components/about/PersonaCard.astro` | component (container) | server-render; accepts `persona` prop | `01-UI-SPEC.md` line 275 + §About contract lines 322–323 | role-match |
| `src/components/about/PersonaStats.astro` | component (chips) | server-render | `01-UI-SPEC.md` line 276 + line 326 (3 chips, `radius-full`, accent border) | role-match |
| `src/components/about/SkillBars.astro` | component (data viz) | server-render; accepts `skills` array | `01-UI-SPEC.md` line 277 + line 327 (label + bar + percent) | role-match |
| `src/components/about/PersonaFavorites.astro` | component (data-list, 2-col) | server-render; accepts favorites arrays | `01-UI-SPEC.md` line 278 + lines 328–330 | role-match |
| `src/components/about/PersonaQA.astro` | component (data-list) | server-render; accepts Q&A array | `01-UI-SPEC.md` line 279 + line 331 | role-match |

### Components — SEO

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/components/seo/SEOMeta.astro` | component (head meta) | server-render | `01-UI-SPEC.md` §SEO meta (lines 354–374); Astro Sitemap docs `docs.astro.build/en/guides/integrations-guide/sitemap/` | exact (UI-SPEC enumerates every meta tag) |

### Styles

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/styles/global.css` | utility (CSS tokens + reset + a11y) | browser CSS | `01-RESEARCH.md` §Pattern 3 (lines 535–613) — full Tailwind v4 `@theme` + light/dark + reduced-motion verified excerpt; Tailwind v4 docs `tailwindcss.com/docs/installation/framework-guides/astro` | exact (verified, ready to copy) |

### Data (non-collection)

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/data/persona.yaml` | data (single instance) | build-time read | CONTEXT D-14 (lines 106–108); fields enumerated there. No verified YAML schema example — author per CONTEXT field list | role-match |
| `src/data/notice.md` | data (markdown short) | build-time read | CONTEXT D-15 + `01-UI-SPEC.md` line 543 (optional `id:` frontmatter); start empty | role-match |
| `src/data/social.json` | data (footer links) | build-time read by Footer | `01-UI-SPEC.md` §Component Inventory line 265 (data source for Footer); start with single GitHub link | role-match |
| `src/data/friends-health.json` | data (health-check cache) | build-time read (consumer Phase 1, producer Phase 6) | CONTEXT D-03 (line 39); start with `{}` | role-match |

### Content collection seeds

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `src/content/articles/.gitkeep` (or `welcome.md`) | content seed | build-time validated by `articles` schema | Schema in `src/content.config.ts`; Astro Content Collections docs | role-match |
| `src/content/projects/.gitkeep` | content seed | build-time validated | same | role-match |
| `src/content/creations/.gitkeep` | content seed | build-time validated | same | role-match |
| `src/content/microblog/.gitkeep` | content seed | build-time validated | same | role-match |
| `src/content/timeline/.gitkeep` | content seed | build-time validated | same | role-match |
| `src/content/friends/friends.json` | content (file loader) | build-time validated by `friends` schema | `01-RESEARCH.md` §Pattern 2 lines 467–479 (`file` loader expects `{ items: [...] }`); start with `{ "items": [] }` | exact |
| `src/content/anime/list.json` | content (placeholder) | build-time validated by `anime` placeholder schema | `01-RESEARCH.md` §Pattern 2 lines 496–501; start with `{ "items": [] }` | exact |
| `src/content/books/list.json` | content (placeholder) | build-time | same shape as `anime/list.json` | exact |
| `src/content/music/list.json` | content (placeholder) | build-time | same shape as `anime/list.json` | exact |

### Public assets

| New File | Role | Data Flow | Closest Analog (external + research) | Match Quality |
|---|---|---|---|---|
| `public/robots.txt` | static asset | served as-is by CDN | `01-RESEARCH.md` §Code Example 5 (lines 1014–1019) — verified 3-line content | exact (verified excerpt) |
| `public/favicon.svg` | static asset | served as-is | `01-UI-SPEC.md` §File Organization line 513 (sakura-pink blob + "M" monogram, 200×200 SVG). No code excerpt — author by hand or stub | role-match (asset, not code) |
| `public/og-default.png` | static asset | served as-is | `01-UI-SPEC.md` line 514 (1200×630 gradient + name). No code; create via design tool or skip to Phase 6 polish — Phase 1 acceptable with placeholder | role-match (asset, not code) |

---

## Pattern Assignments

### `astro.config.mjs` (config, build-time)

**External canonical:** `docs.astro.build/en/guides/styling/` (Tailwind section) + `docs.astro.build/en/guides/integrations-guide/sitemap/`
**Verified excerpt:** `01-RESEARCH.md` lines 808–833

**Imports + integration registration:**
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://merlinalex.me',        // REQUIRED for @astrojs/sitemap
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],            // CRITICAL: NOT in `integrations: []`
  },
  trailingSlash: 'never',
  build: { inlineStylesheets: 'auto' },
});
```

**Critical invariants (from `01-RESEARCH.md` Anti-pattern 6, lines 665–666):**
- `@tailwindcss/vite` lives in `vite.plugins`, NEVER in `integrations`
- Do NOT install `@astrojs/tailwind` (Tailwind 3 legacy, removed)
- `site:` URL must be set or sitemap integration fails

---

### `src/content.config.ts` (model, build-time validation)

**External canonical:** `docs.astro.build/en/guides/content-collections/` + `docs.astro.build/en/guides/upgrade-to/v6/`
**Verified excerpt:** `01-RESEARCH.md` lines 397–520 — full 9-collection example, ready to copy verbatim

**Imports pattern (Astro 6 — see also Anti-patterns 1, 2 below):**
```ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
```

> **NOTE:** `01-RESEARCH.md` lines 130, 404, 520, 661 are mutually inconsistent on whether `z` imports from `astro:content` or `astro/zod`. The Astro 6 upgrade guide says `astro:content` is deprecated for `z`; use `import { z } from 'astro/zod'`. The Pattern 2 code block (line 405) uses the deprecated form — the planner should adopt the corrected import below per the Anti-patterns 1–3 table at line 660.

**CORRECTED imports:**
```ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';
```

**Core pattern — collection shape (one per collection):**
```ts
const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // ... optional fields per CONTEXT D-02
  }),
});

export const collections = { articles, projects, creations, microblog, friends, timeline, anime, books, music };
```

**File-loader variant (used for JSON list collections — `friends`, `anime`, `books`, `music`):**
```ts
const friends = defineCollection({
  loader: file('./src/content/friends/friends.json'),
  schema: z.object({
    items: z.array(z.object({ name: z.string(), url: z.string().url(), /* ... */ })).default([]),
  }),
});
```

**Placeholder schemas (anime/books/music — D-01):**
```ts
const anime = defineCollection({
  loader: file('./src/content/anime/list.json'),
  schema: z.object({ items: z.array(z.object({})).default([]) }),
});
```

**Critical Astro 6 changes the executor MUST honor** (`01-RESEARCH.md` lines 522–527):
- File path is `src/content.config.ts` (NOT `src/content/config.ts` — Astro 6 throws `LegacyContentConfigError`)
- Every collection MUST declare a `loader`
- `entry.id` (slug-based) replaces `entry.slug`
- `import { render } from 'astro:content'; render(entry)` replaces `entry.render()`
- `getEntry()` replaces `getEntryBySlug()` / `getDataEntryById()`

---

### `src/layouts/BaseLayout.astro` (layout, server-render + browser pre-paint script)

**External canonical:** `docs.astro.build/en/guides/client-side-scripts/` (for `is:inline` semantics)
**Verified excerpt:** `01-RESEARCH.md` §Pattern 1 (lines 309–395) — full pre-paint IIFE; §Code Example 2 (lines 836–921) — layout shell with slot

**Frontmatter pattern:**
```astro
---
import '../styles/global.css';
import Header from '../components/core/Header.astro';
import Footer from '../components/core/Footer.astro';
import SEOMeta from '../components/seo/SEOMeta.astro';

const { title, description = 'merlinalex.me — 二次元可爱风个人站',
        image = '/og-default.png', type = 'website' } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).toString();
---
```

**Pre-paint script (the most load-bearing code in Phase 1 — see `01-RESEARCH.md` lines 309–387 for full version):**
```astro
<script is:inline>
  (function () {
    try {
      var storedTheme = localStorage.getItem('theme') || 'system';
      var storedAtmo  = localStorage.getItem('atmo:level') || 'full';
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var effectiveTheme = storedTheme === 'system' ? (prefersDark ? 'dark' : 'light') : storedTheme;
      var effectiveAtmo  = reduceMotion ? 'off' : storedAtmo;     // display-only override
      document.documentElement.dataset.theme = effectiveTheme;
      document.documentElement.dataset.atmo  = effectiveAtmo;
      window.__atmo__ = {
        level: effectiveAtmo, storedLevel: storedAtmo,
        theme: effectiveTheme, storedTheme: storedTheme,
        reducedMotion: reduceMotion,
        set: function (patch) { /* mutates localStorage + dataset; full impl in RESEARCH §Pattern 1 */ },
        subscribe: function (fn) { this._listeners = this._listeners || []; this._listeners.push(fn); },
        _listeners: []
      };
    } catch (e) {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.dataset.atmo  = 'full';
    }
  })();
</script>
```

**Critical invariants** (PITFALLS §P-4, CONTEXT D-08, A11Y-02 — non-negotiable):
1. `<script is:inline>` — Astro must NOT bundle/defer it
2. Placed FIRST inside `<head>` (after `<meta charset>`), BEFORE any `<link rel="stylesheet">` or `@import "tailwindcss"`
3. Wrapped in IIFE + `try/catch` so private-mode browsers don't throw
4. Does NOT mutate `localStorage["atmo:level"]` when reduce-motion is on (display-only override — see Pitfall 2 lines 718–728)
5. Reduce-motion forces `data-atmo="off"` for DISPLAY but `storedAtmo` is preserved untouched

**Body / slot pattern:**
```astro
<body>
  <a href="#main" class="skip-link">跳到主要内容</a>
  <Header />
  <main id="main"><slot /></main>
  <Footer />
</body>
```

---

### `src/pages/index.astro` (page, build-time render)

**Verified excerpt:** `01-RESEARCH.md` §Code Example 4 (lines 977–1008) — `getCollection` with filter callback + sort + slice; `01-UI-SPEC.md` §Home (lines 291–315) for section order

**Frontmatter pattern:**
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/home/Hero.astro';
// ... other home components

const allArticles = await getCollection('articles', ({ data }) => !data.draft);
const latestArticles = allArticles
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
  .slice(0, 3);

const allMicroblog = await getCollection('microblog');
const latestMicroblog = allMicroblog
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
  .slice(0, 5);
---
```

**Template section order (locked by UI-SPEC lines 295–306):** NoticeBar → Hero → Hitokoto → SiteStats → LatestArticles → LatestMicroblog
**Empty-state contract:** UI-SPEC lines 309–315 enumerate every empty branch.

---

### `src/pages/about.astro` (page, build-time render)

**Verified excerpt:** `01-UI-SPEC.md` §About (lines 317–336) for layout; §Copywriting lines 397–402 for section headings

**YAML data load pattern** — **no verified analog**, see "External Reference Required" below. Likely:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PersonaCard from '../components/about/PersonaCard.astro';
// Astro supports YAML import via vite-plugin-yaml; if not installed, fall back to:
//   import { readFile } from 'node:fs/promises';
//   import yaml from 'js-yaml';
//   const persona = yaml.load(await readFile('./src/data/persona.yaml', 'utf8'));
import persona from '../data/persona.yaml';
---
<BaseLayout title="关于" description={persona.tagline}>
  <PersonaCard persona={persona} />
</BaseLayout>
```

> **Open question:** Astro 6 may or may not auto-resolve `.yaml` imports — confirm during plan 01-03. If not, install `@rollup/plugin-yaml` and register in `astro.config.mjs` `vite.plugins`.

**Field omission contract** (UI-SPEC line 334): missing persona fields → section omitted entirely (no placeholder text within PersonaCard).

---

### `src/pages/404.astro` (page, build-time render with HTTP 404 status)

**Verified excerpt:** `01-RESEARCH.md` §Pattern 4 (lines 640–656); `01-UI-SPEC.md` §404 stub (lines 338–352); §Copywriting lines 403–405

**Full file:**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import NotFound from '../components/core/NotFound.astro';

Astro.response.status = 404;
Astro.response.statusText = 'Not Found';
---
<BaseLayout title="404 · 迷路了？">
  <NotFound />
</BaseLayout>
```

**Critical invariants:**
- Filename MUST be exactly `404.astro` (CF Pages auto-serves `dist/404.html`)
- `Astro.response.status = 404` MUST be in frontmatter (Pitfall 6 lines 768–776; without it, soft-200s leak)
- Verify post-deploy with `curl -I https://merlinalex.me/nonexistent` → `HTTP/2 404`

---

### `src/components/core/ThemeSwitcher.astro` (component, event-driven)

**Verified excerpt:** `01-RESEARCH.md` §Code Example 3 (lines 926–971) — full inline-script implementation, ready to copy

**Self-contained pattern (component + inline `<script is:inline>`):**
```astro
<button type="button" class="theme-switcher" aria-label="切换主题" data-current-theme="system">
  <span class="sr-only">当前主题：</span>
  <span data-theme-icon>🖥️</span>
  <span data-theme-label class="hidden md:inline">跟随系统</span>
</button>

<script is:inline>
  (function () {
    var btn = document.querySelector('.theme-switcher');
    if (!btn || !window.__atmo__) return;
    var CYCLE  = ['light', 'dark', 'system'];
    var ICONS  = { light: '☀️', dark: '🌙', system: '🖥️' };
    var LABELS = { light: '浅色', dark: '深色', system: '跟随系统' };
    function render() {
      var cur = window.__atmo__.storedTheme;
      btn.setAttribute('data-current-theme', cur);
      btn.setAttribute('aria-label', '切换主题：当前' + LABELS[cur]);
      btn.querySelector('[data-theme-icon]').textContent = ICONS[cur];
      btn.querySelector('[data-theme-label]').textContent = LABELS[cur];
    }
    btn.addEventListener('click', function () {
      var next = CYCLE[(CYCLE.indexOf(window.__atmo__.storedTheme) + 1) % 3];
      window.__atmo__.set({ theme: next });
      render();
    });
    render();
  })();
</script>
```

**Critical invariants:**
- The component is self-contained — NO `client:*` directive needed (`is:inline` ships the script verbatim)
- Reads `window.__atmo__.storedTheme` (raw stored value), NEVER `localStorage` directly — single source of truth
- Calls `window.__atmo__.set({ theme })` to mutate; do not write to `localStorage.theme` directly
- aria-label copy is locked by `01-UI-SPEC.md` lines 408–410

---

### `src/components/core/IntensityBadge.astro` (component, event-driven)

**No verified excerpt** — mirror the ThemeSwitcher pattern. Locked contract from `01-UI-SPEC.md` lines 233–238 and §Copywriting lines 412–415.

**Pattern to mirror (transposed from ThemeSwitcher):**
- Same `<button>` + `<script is:inline>` IIFE shape
- `CYCLE = ['off', 'subtle', 'full']`
- `LABELS = { off: '氛围：关', subtle: '氛围：柔', full: '氛围：满' }`
- aria-labels: `'氛围强度：关闭' | '...：轻柔' | '...：满级'` (UI-SPEC line 412–414)
- Calls `window.__atmo__.set({ atmo: next })` (NOT `theme`)
- Reads `window.__atmo__.storedLevel` (the raw stored value, NOT `level` which is the reduce-motion-adjusted display value)

---

### `src/components/core/NoticeBar.astro` (component, event-driven, build-time data read)

**No verified excerpt** — pattern derived from `01-UI-SPEC.md` line 269 + line 542.

**Frontmatter (build-time markdown read):**
```astro
---
import notice from '../../data/notice.md?raw'; // or front-matter parse for `id` field
// If markdown has YAML frontmatter `id: welcome-2026`, parse via gray-matter
const noticeId = /* parsed id or null */;
const noticeBody = /* parsed body or null */;
---
```

**Inline script for dismiss (mirror ThemeSwitcher's IIFE pattern):**
- localStorage key: `notice:dismissed:<id>` = `"1"`
- On dismiss click → write key, hide element via `hidden` attribute
- On mount, check key; if `"1"` → hide
- Empty `notice.md` → component returns `null` (do not render)

---

### `src/components/seo/SEOMeta.astro` (component, head meta)

**Verified contract:** `01-UI-SPEC.md` §SEO meta (lines 354–374) enumerates every meta tag

**Required tags (all required in Phase 1):**
- `<title>{title} · merlinalex.me</title>`
- `<meta name="description" content={description}>`
- `<link rel="canonical" href={canonical}>`
- OG: `og:type`, `og:title`, `og:description`, `og:image` (default `/og-default.png`), `og:url`, `og:site_name=merlinalex.me`, `og:locale=zh_CN`
- Twitter: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
- `<meta name="theme-color" content="#FF6B9D">` (light theme; flip to `#1A0F1A` for dark — use `media="(prefers-color-scheme: dark)"`)
- `<link rel="alternate" type="application/rss+xml" title="merlinalex.me" href="/feed.xml">` (Phase 1 stub; Phase 2 creates the endpoint)

---

### `src/styles/global.css` (utility, browser CSS)

**External canonical:** Tailwind v4 docs `tailwindcss.com/docs/installation/framework-guides/astro` for `@import "tailwindcss"`
**Verified excerpt:** `01-RESEARCH.md` §Pattern 3 (lines 535–613) — full file ready to copy

**Structure (locked order):**
```css
@import "tailwindcss";

/* 1. Light theme tokens */
:root[data-theme="light"] { --color-bg: #FFF8FA; /* ... 14 tokens per UI-SPEC §Color */ }

/* 2. Dark theme tokens */
:root[data-theme="dark"]  { --color-bg: #1A0F1A; /* ... */ }

/* 3. Atmosphere intensity gate (Phase 5 contract) */
:root[data-atmo="off"] .atmo-petals,
:root[data-atmo="off"] .atmo-cursor-trail,
:root[data-atmo="off"] .atmo-live2d { display: none; }

/* 4. Reduced-motion baseline (CONTEXT D-10, EXACT code) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

/* 5. Base styles (html/body/focus) */
html { scroll-behavior: smooth; }
body { background: var(--color-bg); color: var(--color-fg); font-family: "Zen Maru Gothic", ...; }
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
```

**Critical invariants:**
- Reduced-motion rule is EXACT code per CONTEXT D-10 (lines 72–82) — do not abbreviate or change
- All color tokens use CSS variables under `:root[data-theme]` — NO Tailwind `dark:` variant for tokens (Anti-pattern 7 line 666)
- Token names: kebab-case (`--color-fg-muted`, not `--colorFgMuted`) — see Open Question 5 (RESEARCH lines 1114–1117) for auto-class behavior

---

### `public/robots.txt` (static asset)

**Verified excerpt:** `01-RESEARCH.md` §Code Example 5 (lines 1014–1019)

```
User-agent: *
Allow: /

Sitemap: https://merlinalex.me/sitemap-index.xml
```

---

## Shared Patterns

### Pattern A: Pre-paint Theme + Atmosphere Gate

**Source:** `01-RESEARCH.md` §Pattern 1 (lines 309–395) — verified against Astro docs
**Apply to:** `src/layouts/BaseLayout.astro` (the only file that owns it)
**Read-only consumers:** `src/components/core/ThemeSwitcher.astro`, `src/components/core/IntensityBadge.astro`, any future atmosphere component

**Contract:**
| Storage key | Values | Default | Mutator |
|---|---|---|---|
| `localStorage.theme` | `"light" \| "dark" \| "system"` | `"system"` | ThemeSwitcher only |
| `localStorage["atmo:level"]` | `"off" \| "subtle" \| "full"` | `"full"` | IntensityBadge only |
| `data-theme` (HTML attr) | `"light" \| "dark"` (resolved) | resolved at pre-paint | pre-paint + `window.__atmo__.set` |
| `data-atmo` (HTML attr) | `"off" \| "subtle" \| "full"` | resolved at pre-paint | pre-paint + `window.__atmo__.set` |
| `window.__atmo__` global | `{ level, storedLevel, theme, storedTheme, reducedMotion, set(patch), subscribe(fn) }` | populated by pre-paint | pre-paint only owns the shape |

**Invariant:** Reduce-motion forces DISPLAY `data-atmo="off"` but NEVER mutates `localStorage["atmo:level"]` (Pitfall 2 lines 718–728, CONTEXT D-08).

### Pattern B: Astro Component Frontmatter + Slot

**Source:** Astro docs `docs.astro.build/en/basics/astro-components/`
**Apply to:** Every `.astro` file (layouts, pages, components)

**Standard shape:**
```astro
---
// 1. Imports (BaseLayout, sub-components, content APIs)
import BaseLayout from '../layouts/BaseLayout.astro';

// 2. Prop destructure with defaults
const { title, description = 'default' } = Astro.props;

// 3. Build-time data fetch (Zod-validated)
const items = await getCollection('articles', ({ data }) => !data.draft);
---

<BaseLayout {title} {description}>
  <section>
    <!-- 4. Template uses JSX-like expressions -->
    {items.map(item => <article>{item.data.title}</article>)}
  </section>
</BaseLayout>

<style>
  /* 5. Optional scoped CSS */
  section { padding: var(--space-2xl); }
</style>
```

### Pattern C: Zod Schema per Collection

**Source:** `01-RESEARCH.md` §Pattern 2 lines 397–520
**Apply to:** Every collection declared in `src/content.config.ts`

**Standard shape:**
```ts
const <name> = defineCollection({
  loader: glob({ base: './src/content/<name>', pattern: '**/*.{md,mdx}' }),
  // OR for JSON list: loader: file('./src/content/<name>/<name>.json'),
  schema: z.object({
    // REQUIRED fields first
    <field>: z.<type>(),
    // OPTIONAL fields second
    <field>: z.<type>().optional(),
    // DEFAULTED fields last
    <field>: z.<type>().default(<value>),
  }),
});
```

**Type conventions** (locked by CONTEXT D-02..D-07):
- Dates: `z.coerce.date()` (handles both ISO strings and Date objects from YAML)
- URLs: `z.string().url()` (validates at build time)
- Enums: `z.enum([...])` when set is closed (e.g., creations.category); `z.string()` when freeform (e.g., articles.category per D-02)
- Arrays: `z.array(z.<type>()).default([])` (never `.optional()` for arrays — empty default is the idiom)
- Booleans: `z.boolean().default(false)` or `.default(true)` per field semantics

### Pattern D: Inline Browser Script Pattern (`<script is:inline>`)

**Source:** `01-RESEARCH.md` Pattern 1 + Code Example 3
**Apply to:** `BaseLayout.astro`, `ThemeSwitcher.astro`, `IntensityBadge.astro`, `NoticeBar.astro`

**Standard shape:**
```html
<script is:inline>
  (function () {
    // 1. Guard — bail if prerequisite (element / global) missing
    var el = document.querySelector('.<class>');
    if (!el || !window.__atmo__) return;

    // 2. Pure-function helpers (no closures over module scope)
    function render() { /* ... */ }

    // 3. Event wiring
    el.addEventListener('click', function () { /* ... */ });

    // 4. Initial render
    render();
  })();
</script>
```

**Critical invariants:**
- `is:inline` directive — Astro ships verbatim, no bundling
- IIFE — no globals leak; safe to ship multiple inline scripts
- `var` (not `let`/`const`) — defensive against legacy browsers though all targets are modern; consistency with pre-paint script
- Read state from `window.__atmo__` (single source of truth), NEVER touch `localStorage` directly from these helpers

### Pattern E: Astro 6 Content API Imports

**Source:** `01-RESEARCH.md` §Alternatives Considered lines 124–134 + Anti-patterns 1–3 (lines 660–662)
**Apply to:** Every file that reads content collections

**Correct (Astro 6):**
```ts
import { defineCollection, getCollection, getEntry } from 'astro:content';
import { z } from 'astro/zod';                  // NOT 'astro:content'
import { glob, file } from 'astro/loaders';
import { render } from 'astro:content';         // for rendering MDX bodies
// usage: const { Content } = await render(entry);
// usage: entry.id (NOT entry.slug)
```

**Forbidden (Astro 5 / legacy):**
- `import { z } from 'astro:content'` — deprecated
- `entry.render()` — removed
- `entry.slug` — removed (use `entry.id`)
- `getEntryBySlug('articles', slug)` — removed (use `getEntry('articles', id)`)
- File at `src/content/config.ts` — throws `LegacyContentConfigError`

---

## No Analog Found

All files in Phase 1 fall into one of two buckets:
1. **Verified excerpt available** — copy from cited `01-RESEARCH.md` line range
2. **Role-match without code excerpt** — follow the cited UI-SPEC contract + Pattern B (Astro component shape) + Pattern D (inline script shape)

There are NO files in Phase 1 that lack both a verified excerpt and a UI-SPEC contract. Every file has at least one authoritative source.

---

## External Reference Required

For these specific concerns the executor must consult an external doc during execution (not pre-mappable):

| Concern | File(s) affected | External reference |
|---|---|---|
| YAML import (`import x from './data/persona.yaml'`) | `src/pages/about.astro`, `src/components/home/Hero.astro` | Check Astro 6 release notes for native YAML support; if absent, `@rollup/plugin-yaml` README or `js-yaml` README. Open Question logged in RESEARCH (not in OQ list — flagged here) |
| `astro-icon` integration setup | header (theme/intensity icons) | `github.com/natemoo-re/astro-icon#readme` — confirm v1 API matches `<Icon name="lucide:sun" />` pattern. RESEARCH OQ #4 (lines 1109–1113) |
| Tailwind v4 auto-class names from `@theme` tokens | `src/components/**/*.astro` | `tailwindcss.com/docs/v4-beta#theme-variables` — confirm `--color-fg-muted` → `text-fg-muted` (kebab) vs `text-fgMuted` (camel). RESEARCH OQ #5 (lines 1114–1117) |
| Cloudflare Pages `_redirects` fallback for `www` → apex 301 | (deploy-only, no code) | `developers.cloudflare.com/pages/configuration/redirects/` — fallback if dashboard toggle is gone. RESEARCH §Assumption A7 + OQ #1 |
| `astro add tailwind` codemod behavior | `astro.config.mjs` | After running, manually verify it added `import tailwindcss from '@tailwindcss/vite'` + `vite.plugins: [tailwindcss()]`. RESEARCH OQ #2 (lines 1097–1098) |
| `nodejs_compat` flag necessity for pure-static Astro 6 | (deploy-only) | `developers.cloudflare.com/pages/configuration/build-configuration/` — likely NOT needed for static; only matters if SSR adapter added. RESEARCH OQ #1 + Assumption A6 |

---

## Anti-Patterns to Forbid in All Plans

Copied from `01-RESEARCH.md` lines 658–669 — the planner MUST flag each plan that even superficially resembles one:

1. `src/content/config.ts` path → throws `LegacyContentConfigError` (use `src/content.config.ts`)
2. `import { z } from 'astro:content'` → deprecated (use `astro/zod`)
3. `entry.render()` or `entry.slug` → removed (use `render(entry)` from `astro:content` and `entry.id`)
4. Deferring the pre-paint script (any directive other than `is:inline` in `<head>` BEFORE stylesheets) → FOUC
5. Mutating `localStorage["atmo:level"]` on reduce-motion → corrupts user preference
6. Installing `@astrojs/tailwind` → Tailwind 3 only; deprecated
7. Tailwind `dark:` variant for color tokens → violates CONTEXT D-08 (use `:root[data-theme]` in CSS only)
8. 404 page as soft-200 → missing `Astro.response.status = 404`
9. Single Zod schema for all 9 collections → defeats type safety
10. Custom 404 redirecting via meta refresh → use `src/pages/404.astro` directly

---

## Metadata

**Analog search scope:** N/A — no in-repo source code exists
**Files scanned in repo:** 0 (greenfield confirmed)
**Authoritative sources consulted:**
- `/Users/huangjingping/i/merlinalex.me/.planning/phases/01-foundation/01-CONTEXT.md` (199 lines)
- `/Users/huangjingping/i/merlinalex.me/.planning/phases/01-foundation/01-RESEARCH.md` (1379 lines — primary source for verified excerpts)
- `/Users/huangjingping/i/merlinalex.me/.planning/phases/01-foundation/01-UI-SPEC.md` (lines 259–525 — component inventory, page contracts, file organization)
- `/Users/huangjingping/i/merlinalex.me/.planning/research/ARCHITECTURE.md` (outline scanned; deferred to RESEARCH which already cites it)
- `/Users/huangjingping/i/merlinalex.me/CLAUDE.md` (project rules confirmed)

**Pattern extraction date:** 2026-06-02
**Mapping confidence:** HIGH for files with verified RESEARCH excerpts (`content.config.ts`, `BaseLayout.astro`, `ThemeSwitcher.astro`, `global.css`, `astro.config.mjs`, `index.astro`, `404.astro`, `robots.txt`); MEDIUM for files with UI-SPEC contract only (most home/about components — shape locked, exact code not pre-verified).
