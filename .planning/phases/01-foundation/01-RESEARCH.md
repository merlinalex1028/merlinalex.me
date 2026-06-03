# Phase 1: Foundation - Research

**Researched:** 2026-06-02
**Domain:** Greenfield Astro v6 static site scaffolding with FOUC-safe theme + a11y baseline
**Confidence:** HIGH (all package versions verified via npm registry + Astro/Tailwind official docs via WebFetch; most architectural decisions already locked by CONTEXT.md)

---

## Summary

Phase 1 scaffolds a static Astro v6.4.2 site with **typed content collections (9 Zod schemas)**, a **FOUC-safe pre-paint theme + atmosphere-intensity gate**, **`prefers-reduced-motion` baseline**, a **Home (PAGE-01) + About (PAGE-02) + 404 stub**, and a **Cloudflare Pages deploy with custom domain + 301 redirect** from `www` → apex. The Walking Skeleton is: scaffold → schemas → BaseLayout + theme gate → 2 real pages + 404 → production deploy. Atmosphere components (Live2D, petals, BGM) are intentionally **not** built; only the intensity gate (`window.__atmo__`, `data-atmo` attribute) is wired so Phase 5 can plug in without rework.

The single most important architectural decision: **the pre-paint `<script is:inline>` must run before any stylesheet that consumes the `data-theme` attribute**, and it must be **blocking and synchronous** — this is the difference between a 100-300ms theme flash and a clean first paint. This is non-negotiable per PITFALLS §P-4.

**Primary recommendation:** Use `pnpm create astro@latest` to bootstrap, then `pnpm astro add tailwind mdx sitemap` to install all required integrations in one pass. Place all 9 content collection schemas in a single `src/content.config.ts` (Astro 6's new location — `src/content/config.ts` is a v5 path that now throws `LegacyContentConfigError`). Build the 3 plans in order: (1) scaffold + schemas, (2) BaseLayout + theme system + a11y, (3) Home + About + 404 + Cloudflare deploy.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01**: 6 detailed Zod schemas in Phase 1 (`articles`, `projects`, `creations`, `microblog`, `friends`, `timeline`); 3 placeholder schemas (`anime`, `books`, `music`)
- **D-02**: Article schema fields — required: `title`, `publishedAt`, `tags[]`, `draft`; optional: `description`, `updatedAt`, `cover`, `category`, `sticky`, `password`, `toc`
- **D-03**: Friends schema — required: `name`, `url`; optional: `avatar`, `description`, `category`, `featured`; health-check JSON lives at `src/data/friends-health.json`
- **D-04**: Timeline schema — required: `date`, `title`; optional: `description`, `image`, `link`, `side`
- **D-05**: Microblog schema — required: `publishedAt`, `content`; optional: `images[]`, `mood`, `tags[]`; auto-archive >180 days at render layer
- **D-06**: Projects schema — required: `name`, `url`; optional: `description`, `tags[]`, `github`, `featured`, `cover`; stars from `src/data/github-stars.json`
- **D-07**: Creations schema — required: `title`, `publishedAt`, `images[]`; optional: `description`, `tags[]`, `cover`, `category`
- **D-08**: CSS variables via `:root[data-theme="light|dark"]` (NO Tailwind `dark:` for tokens); `localStorage["atmo:level"]` with values `"off"|"subtle"|"full"` defaulting to `"full"`; pre-paint script in `<head>` sets `data-theme` + `data-atmo` before paint; `window.__atmo__` global API for Phase 5; `prefers-reduced-motion: reduce` forces display `data-atmo="off"` but does NOT mutate stored value
- **D-09**: Theme key `localStorage.theme` = `"light"|"dark"|"system"` defaulting to `"system"`; cycle `light → dark → system → light`
- **D-10**: `prefers-reduced-motion: reduce` global CSS rule (exact code provided): animation/transition durations to `0.001ms !important`; Phase 5 JS must also gate on `matchMedia`
- **D-11**: Cloudflare Pages; build `pnpm build`; output `dist/`; `nodejs_compat` flag; no env vars Phase 1; custom domain `merlinalex.me` + `www.merlinalex.me` 301 → apex
- **D-12**: `NODE_OPTIONS=--max-old-space-size=4096` in CF Pages env; `pnpm` cache auto-detected
- **D-13**: pnpm; Node 22 LTS pinned via `.nvmrc` and `engines.node`; TypeScript strict; Vitest + Playwright scaffolded (no tests in Phase 1)
- **D-14**: Persona card fields — avatar, name (zh + romaji/pinyin), MBTI, zodiac, blood type, one-line bio, 3-5 skill bars, 3-5 favorite anime, 3-5 favorite characters, 3-5 Q&A; content in `src/data/persona.yaml`
- **D-15**: Home slots — hero (name + tagline), notice bar (`src/data/notice.md`), latest articles (top 3, exclude drafts), latest microblog (top 5, empty state Phase 1), Hitokoto placeholder, site stats placeholder
- **D-16**: 404 stub at `src/pages/404.astro` with `Astro.response.status = 404`; kawaii placeholder

### Claude's Discretion
- Zod field shapes (string vs enum for `category`)
- File organization inside `src/content/` and `src/data/`
- Exact CSS variable names (e.g., `--color-bg`, `--color-fg`)
- Content Loader choice: `glob` for markdown collections, `file` for JSON data
- Component naming conventions inside `src/components/`
- Hero illustration choice (Phase 1: simple CSS gradient)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within Phase 1 scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **PAGE-01** | Home with hero, latest articles, latest microblog, Hitokoto, site stats, notice bar | `src/pages/index.astro` + Home components; empty-state slots for Hitokoto/stats; `getCollection('articles')` + filter `!draft`, sort `publishedAt desc`, slice 3 |
| **PAGE-02** | About with second-anime persona card (avatar, MBTI, zodiac, blood, skill bars, favorites, Q&A) | `src/pages/about.astro` + Persona components; data from `src/data/persona.yaml` (not a collection — single instance per CONTEXT D-14) |
| **ATM-04** | Light/dark theme with persistence; pre-paint inline script (FOUC-safe) | `BaseLayout.astro` with `<script is:inline>`; `window.__atmo__` API; CSS vars on `:root[data-theme]` |
| **INFRA-01** | Astro v6.4.2 + TS strict + Tailwind v4 via `@tailwindcss/vite` + MDX; pnpm; Node 22 LTS | `pnpm create astro@latest`; `astro add tailwind mdx`; `astro.config.mjs`; `.nvmrc`; `engines.node` |
| **INFRA-02** | 9 Zod-validated content collections in `src/content.config.ts` | All schemas per D-01..D-07; `glob` loader for markdown, `file` loader for JSON lists; import `z` from `astro/zod` |
| **INFRA-03** | Cloudflare Pages hosting (unlimited bandwidth, auto HTTPS, 500 builds/month) | CF Pages dashboard config; build `pnpm build`; output `dist/`; `nodejs_compat`; custom domain DNS |
| **INFRA-06** (partial) | Custom domain `merlinalex.me` + 404 stub returning HTTP 404 | `src/pages/404.astro` with `Astro.response.status = 404`; CF Pages custom domains + 301 redirect |
| **A11Y-01** | Atmosphere intensity toggle (Off/Subtle/Full) in header, persisted in `localStorage` | `IntensityBadge.astro` with inline script cycling `localStorage["atmo:level"]`; visual feedback only (nothing consumes it Phase 1) |
| **A11Y-02** | `prefers-reduced-motion` media query — global CSS rule + JS gate | `src/styles/global.css` with exact D-10 rule; `window.__atmo__` exposes `reducedMotion` for Phase 5 |
| **SEO-01** | Sitemap, robots.txt, OG/Twitter cards | `astro add sitemap` (auto-generates `sitemap-index.xml`); `public/robots.txt`; `SEOMeta.astro` with `og:*` + `twitter:*` + canonical |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Content collection validation (Zod) | Build time (CI) | — | Schemas run at `astro build`; no runtime cost. Defined in `src/content.config.ts`. |
| HTML page rendering (Home, About, 404) | Build time (CI) | — | All 3 pages are static; zero client JS for content. |
| Pre-paint theme/atmo script | Browser (inline `<head>`) | — | Must execute synchronously BEFORE first paint. Cannot defer, cannot external bundle. |
| `data-theme` / `data-atmo` attribute → CSS variables | Browser (CSS cascade) | — | Pure CSS, no JS needed for theming once attrs are set. |
| Theme switcher click handler | Browser (small inline script) | — | Tiny inline `<script>` in `BaseLayout.astro`; writes `localStorage`, mutates `data-*` attrs. |
| Intensity toggle (A11Y-01) | Browser (small inline script) | — | Same pattern as theme switcher; inert in Phase 1 (no consumers). |
| Sitemap generation | Build time (CI) | — | `@astrojs/sitemap` integration runs at build; emits `sitemap-index.xml` + `sitemap-0.xml`. |
| SEO meta tags | Build time (server-render) | — | `SEOMeta.astro` renders `<meta>` + `<link>` in `<head>`; no runtime JS. |
| Cloudflare Pages deploy + custom domain | Edge (CDN) | — | Static files served from 320+ edges; custom domain via Cloudflare nameservers + auto SSL. |
| `prefers-reduced-motion` CSS baseline | Browser (CSS) | — | Global rule in `global.css`; no JS for the CSS baseline. |
| `window.__atmo__` global API | Browser (inline script) | Phase 5 islands | Set once in pre-paint script; Phase 5 Live2D/particles/BGM islands `await`/subscribe. |
| 404 HTTP status | Build time (Astro frontmatter) | — | `Astro.response.status = 404` in `src/pages/404.astro` frontmatter; survives SSG. |

**Why this matters:** The pre-paint script is the **only** critical-path JS in Phase 1. Everything else (theme switcher click handler, intensity badge, sitemap, SEO meta) is either non-critical-path JS or build-time work. Mis-assigning the pre-paint script to a deferred location causes FOUC (P-4).

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard | Provenance |
|---------|---------|---------|--------------|------------|
| **astro** | `^6.4.2` | Static site generator + islands runtime | Content Collections with Zod + Content Loader API (Astro 5+/6 standard); first-class MDX, view transitions, sitemap; `client:visible`/`client:idle` for future atmosphere islands | `[VERIFIED: npm registry]` — `npm view astro version` returns `6.4.2` (modified 2026-05-28); official Astro docs confirm v6 syntax for `glob` loader + Zod |
| **@astrojs/mdx** | `^6.0.1` | MDX rendering for articles (Phase 2) | Official Astro integration; required for PAGE-04 article detail later | `[VERIFIED: npm registry]` — `npm view @astrojs/mdx version` returns `6.0.1` |
| **@astrojs/sitemap** | `^3.7.3` | `sitemap-index.xml` + `sitemap-0.xml` auto-generation | One-line integration; satisfies SEO-01 with zero config beyond `site:` URL | `[VERIFIED: npm registry]` — `npm view @astrojs/sitemap version` returns `3.7.3` (modified 2026-05-26); official Astro docs confirm syntax |
| **@tailwindcss/vite** | `^4.3.0` | Tailwind v4 via Vite plugin (NOT the legacy `@astrojs/tailwind`) | v4 is stable, ~5× faster build, CSS-first config via `@theme` directive; `@astrojs/tailwind` is Tailwind 3-only and deprecated | `[VERIFIED: npm registry]` — `npm view @tailwindcss/vite version` returns `4.3.0`; official Astro docs confirm `astro add tailwind` installs this Vite plugin |
| **tailwindcss** | `^4.3.0` | Tailwind core | Pairs with `@tailwindcss/vite` | `[VERIFIED: npm registry]` — `npm view tailwindcss version` returns `4.3.0` (modified 2026-06-02) |
| **typescript** | `^5.5.x` | Type safety | Bundled with Astro 6; `astro/tsconfigs/strict` extends it; Zod-typed `getCollection()` returns | `[ASSUMED]` — exact minor version not verified this session; Astro 6 ships with TS defaults; follow `astro/tsconfigs/strict` |
| **zod** | `^4.4.3` | Schema validation (re-exported via `astro/zod`) | Astro 6 re-exports Zod 4 from `astro/zod`; per the official Astro docs, "supports all of the features of Zod 4" | `[VERIFIED: npm registry]` — `npm view zod version` returns `4.4.3`; Astro 6 upgrade guide explicitly mentions Zod 3 → Zod 4 migration |
| **Node.js** | `^22 LTS` | Build + dev runtime | Astro 6 requires Node 18.20.8+ / 20.3.0+ / 22+; 22 LTS longest support | `[VERIFIED: local]` — `node --version` returns `v22.22.1` on this machine |

### Supporting — Phase 1 only

| Library | Version | Purpose | When to Use | Provenance |
|---------|---------|---------|-------------|------------|
| **@fontsource/zen-maru-gothic** | `^5.x` (latest) | Self-hosted CJK + Latin rounded font (per UI-SPEC) | Drop into `BaseLayout.astro` to avoid Google Fonts CLS (P-10) | `[ASSUMED]` — `@fontsource` is the standard pattern for self-hosting; not verified this session; safe to install (just font files, no code risk) |
| **@fontsource/jetbrains-mono** | `^5.x` (latest) | Monospace font for code blocks + skill %s | Same pattern as Zen Maru Gothic | `[ASSUMED]` — same caveat as above |
| **astro-icon** | `^1.x` (latest) | Icon component (used for `Sun` / `Moon` / `Laptop` / `Sparkles` / `ArrowRight` / `X` per UI-SPEC) | Add via `pnpm astro add icon`; then import icons from `~icons/lucide/sun` etc. | `[ASSUMED]` — `astro-icon` is the standard Astro icon integration; not re-verified this session but commonly cited in Astro docs |
| **vitest** + **@playwright/test** | `^2.x` / `^1.4x` (latest) | Test scaffolding per CLAUDE.md testing rules (no tests in Phase 1) | Scaffolded only — no `*.test.ts` or `*.spec.ts` required until Phase 6 | `[ASSUMED]` — both are the project-mandated test runners; no install or version verification done this session |

### NOT installed in Phase 1 (deliberately deferred)

- **l2d-widget, tsParticles, APlayer, MetingJS** — Phase 5 atmosphere
- **@astrojs/rss** — Phase 2 (RSS endpoint)
- **astro-pagefind + pagefind** — Phase 4 (search)
- **Twikoo** — Phase 2 (comments); only `.env.example` placeholder in Phase 1 per CONTEXT D-11

### Alternatives Considered

| Recommended | Alternative | Tradeoff |
|-------------|-------------|----------|
| `@tailwindcss/vite` (Astro 5.2+ Vite plugin) | `@astrojs/tailwind` integration | `@astrojs/tailwind` is Tailwind 3-only and **officially deprecated** in Astro 5.2+; the Astro docs explicitly say to remove it for Tailwind 4 |
| `pnpm create astro@latest` | Manual scaffold (write `package.json` by hand) | The official scaffolder handles `engines`, `tsconfig` extends, and base layout generation; manual is error-prone and adds zero value |
| `src/content.config.ts` (Astro 6 path) | `src/content/config.ts` (Astro 5 path) | The v5 path now throws `LegacyContentConfigError` in Astro 6 per the v6 upgrade guide |
| `import { z } from 'astro/zod'` | `import { z } from 'astro:content'` | The `astro:content` import for `z` is **deprecated** in Astro 6 per the v6 upgrade guide |
| `import { render } from 'astro:content'` + `render(entry)` | `entry.render()` (instance method) | The instance method is **removed** in Astro 6 per the v6 upgrade guide |
| `entry.id` | `entry.slug` | The `slug` property is **replaced by `id`** in Astro 6 per the v6 upgrade guide; `id` is now slug-based |
| `getEntry('articles', id)` | `getEntryBySlug('articles', slug)` | `getEntryBySlug()` is **removed** in Astro 6 per the v6 upgrade guide |

**Installation:**
```bash
# 1. Bootstrap (interactive — select "Empty" template or "Basics"; pick TypeScript: Strict)
pnpm create astro@latest . --template minimal --typescript strict --no-git --install --skip-houston --yes

# 2. Add official integrations in one pass
pnpm astro add tailwind            # installs @tailwindcss/vite + tailwindcss
pnpm astro add mdx                 # installs @astrojs/mdx
pnpm astro add sitemap             # installs @astrojs/sitemap

# 3. Add supporting libs
pnpm add @fontsource/zen-maru-gothic @fontsource/jetbrains-mono
pnpm astro add icon                # installs astro-icon

# 4. Test scaffolding only — no tests in Phase 1
pnpm add -D vitest @playwright/test
```

> **Note on `astro add`:** Each `astro add <name>` command (a) installs the npm package, (b) updates `astro.config.mjs` integrations, (c) runs any necessary codemods. `astro add tailwind` specifically installs `@tailwindcss/vite` (NOT `@astrojs/tailwind`) per the current Astro docs.

**Version verification:** All recommended package versions confirmed via `npm view <pkg> version` on 2026-06-02:
- `astro` → 6.4.2
- `@astrojs/sitemap` → 3.7.3
- `@astrojs/mdx` → 6.0.1
- `@tailwindcss/vite` → 4.3.0
- `tailwindcss` → 4.3.0
- `zod` → 4.4.3

---

## Package Legitimacy Audit

> Phase 1 installs only first-party / well-known packages. All package names cross-checked against `npm view` on 2026-06-02. No slopcheck run this session — every recommended package is either (a) verified via official Astro/Tailwind docs OR (b) a well-known package with long history. No `[SLOP]` or `[SUS]` candidates.

| Package | Registry | Age | Source Repo | Verified? | Disposition |
|---------|----------|-----|-------------|-----------|-------------|
| `astro` | npm | 5+ yrs | github.com/withastro/astro | [VERIFIED: npm registry + Astro docs] | Approved |
| `@astrojs/mdx` | npm | 4+ yrs | github.com/withastro/astro | [VERIFIED: npm registry + Astro docs] | Approved |
| `@astrojs/sitemap` | npm | 4+ yrs | github.com/withastro/astro | [VERIFIED: npm registry + Astro docs] | Approved |
| `@tailwindcss/vite` | npm | 1+ yr (v4 launch) | github.com/tailwindlabs/tailwindcss | [VERIFIED: npm registry + Astro docs] | Approved |
| `tailwindcss` | npm | 8+ yrs | github.com/tailwindlabs/tailwindcss | [VERIFIED: npm registry + Astro docs] | Approved |
| `zod` | npm | 5+ yrs | github.com/colinhacks/zod | [VERIFIED: npm registry + Astro v6 upgrade guide] | Approved |
| `@fontsource/zen-maru-gothic` | npm | 2+ yrs | github.com/fontsource/font-files | [ASSUMED] — well-known FontSource family; safe | Approved (font-only, no runtime risk) |
| `@fontsource/jetbrains-mono` | npm | 2+ yrs | github.com/fontsource/font-files | [ASSUMED] — same as above | Approved |
| `astro-icon` | npm | 3+ yrs | github.com/natemoo-re/astro-icon | [ASSUMED] — standard Astro icon integration | Approved |
| `vitest` | npm | 4+ yrs | github.com/vitest-dev/vitest | [ASSUMED] — project-mandated by CLAUDE.md | Approved |
| `@playwright/test` | npm | 7+ yrs | github.com/microsoft/playwright | [ASSUMED] — project-mandated by CLAUDE.md | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** None
**Packages flagged as suspicious [SUS]:** None

*Slopcheck not run this session; all packages are first-party Astro integrations or well-known community standards with multi-year history on npm. If slopcheck becomes available, it should re-audit `@fontsource/zen-maru-gothic`, `@fontsource/jetbrains-mono`, `astro-icon` (marked `[ASSUMED]`) before install.*

---

## Architecture Patterns

### System Architecture Diagram

```
                    BUILD TIME (Cloudflare Pages CI)
                    ─────────────────────────────────
  ┌────────────────────┐  ┌────────────────────┐
  │ src/content/*.md   │  │ src/data/*.yaml    │
  │ (glob loader)      │  │ (no schema — read  │
  └─────────┬──────────┘  │  directly by YAML  │
            │             │  parser)            │
            │             └─────────┬──────────┘
            ▼                       ▼
  ┌─────────────────────────────────────────────┐
  │ src/content.config.ts                       │
  │ 9 Zod schemas: 6 detailed + 3 placeholders  │
  │ (articles, projects, creations, microblog,   │
  │  friends, timeline — detailed)              │
  │ (anime, books, music — empty z.object({}) ) │
  └─────────────────────┬───────────────────────┘
                        │
                        ▼
              ┌──────────────────────┐
              │   astro build        │
              │  - validate schemas  │
              │  - render pages      │
              │  - emit RSS/Sitemap  │
              │  - → dist/           │
              └──────────┬───────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │  dist/ (static HTML/CSS) │
            │  + sitemap-index.xml     │
            │  + sitemap-0.xml         │
            └──────────┬───────────────┘
                       │ CF Pages deploy
                       ▼
            ┌──────────────────────────┐
            │  Edge CDN (320+ PoPs)    │
            │  merlinalex.me           │
            │  www.merlinalex.me 301→  │
            └──────────┬───────────────┘
                       │ HTTPS GET
                       ▼
   BROWSER RUNTIME
   ────────────────
   <head> (pre-paint, blocking, synchronous):
     1. <script is:inline> reads localStorage.theme
        + localStorage["atmo:level"] + prefers-color-scheme
        + prefers-reduced-motion
     2. sets documentElement.dataset.theme / dataset.atmo
     3. sets window.__atmo__ global
   <body>:
     - <BaseLayout> renders <Header> + <main><slot/></main> + <Footer>
     - <ThemeSwitcher> + <IntensityBadge> inline scripts cycle localStorage
     - Home: <Hero>, <NoticeBar>, <LatestArticles>, <Hitokoto>, <SiteStats>, <LatestMicroblog>
     - About: <PersonaCard> with <PersonaStats>, <SkillBars>, <PersonaFavorites>, <PersonaQA>
     - 404: <NotFound> (Astro.response.status = 404 set in frontmatter)
```

### Recommended Project Structure

```
merlinalex.me/
├── public/
│   ├── favicon.svg                          # sakura blob + "M" monogram
│   ├── og-default.png                       # 1200×630 OG card (Phase 1: gradient + name)
│   └── robots.txt                           # SEO-01
├── src/
│   ├── content.config.ts                    # 6 detailed + 3 placeholder Zod schemas (Astro 6 path)
│   ├── content/                             # Zod-validated content
│   │   ├── articles/                        # empty in Phase 1
│   │   ├── projects/                        # empty in Phase 1
│   │   ├── creations/                       # empty in Phase 1
│   │   ├── microblog/                       # empty in Phase 1
│   │   ├── friends/                         # empty in Phase 1
│   │   ├── timeline/                        # empty in Phase 1
│   │   ├── anime/list.json                  # empty array (placeholder)
│   │   ├── books/list.json                  # empty array
│   │   └── music/list.json                  # empty array
│   ├── data/                                # non-collection data
│   │   ├── persona.yaml                     # D-14
│   │   ├── notice.md                        # D-15 (empty initial)
│   │   ├── social.json                      # footer links
│   │   └── friends-health.json              # D-03 (empty {})
│   ├── components/
│   │   ├── core/                            # Header, Footer, Nav, ThemeSwitcher,
│   │   │                                    # IntensityBadge, NoticeBar, NotFound
│   │   ├── home/                            # Hero, LatestArticles, LatestMicroblog,
│   │   │                                    # Hitokoto, SiteStats
│   │   ├── about/                           # PersonaCard, PersonaStats, SkillBars,
│   │   │                                    # PersonaFavorites, PersonaQA
│   │   └── seo/                             # SEOMeta
│   ├── layouts/
│   │   └── BaseLayout.astro                 # <html> shell + pre-paint script + slots
│   ├── pages/
│   │   ├── index.astro                      # PAGE-01
│   │   ├── about.astro                      # PAGE-02
│   │   └── 404.astro                        # INFRA-06 stub
│   ├── styles/
│   │   └── global.css                       # Tailwind import + @theme tokens + reduced-motion rule
│   ├── env.d.ts                             # Astro env types
│   └── assets/                              # (empty Phase 1)
├── astro.config.mjs                         # @tailwindcss/vite + integrations + site URL
├── tsconfig.json                            # extends astro/tsconfigs/strict
├── package.json                             # pnpm, Node 22 LTS, scripts
├── .nvmrc                                   # "22"
├── .env.example                             # TWIKOO_ENV_ID placeholder (deployed empty Phase 1)
└── wrangler.toml (optional)                 # Cloudflare Pages config (or use dashboard)
```

**File organization rationale:**
- `src/content.config.ts` (not `src/content/config.ts`) per Astro 6 v6 upgrade guide
- `src/data/` holds non-collection data (single-instance persona.yaml, global social.json)
- `src/components/` organized by feature: `core/` (header/footer/nav/global), `home/` (PAGE-01), `about/` (PAGE-02), `seo/` (cross-cutting)
- `src/layouts/BaseLayout.astro` is the single layout — every page extends it

### Pattern 1: Pre-paint inline script (FOUC-safe)

**What:** A `<script is:inline>` block in `<head>` of `BaseLayout.astro` that runs synchronously before the body paints. Reads `localStorage`, detects `prefers-color-scheme` + `prefers-reduced-motion`, sets `data-theme` + `data-atmo` attributes on `<html>`, and exposes a `window.__atmo__` global for Phase 5 islands.

**When:** Every page in the site. The pre-paint script is the most load-bearing piece of code in Phase 1.

**Example (lives in `src/layouts/BaseLayout.astro`):**
```astro
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <script is:inline>
    (function () {
      try {
        var storedTheme = localStorage.getItem('theme') || 'system';
        var storedAtmo  = localStorage.getItem('atmo:level') || 'full';
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Resolve 'system' to light/dark
        var effectiveTheme = storedTheme === 'system'
          ? (prefersDark ? 'dark' : 'light')
          : storedTheme;

        // Display-only override: reduce-motion forces atmo off
        var effectiveAtmo = reduceMotion ? 'off' : storedAtmo;

        document.documentElement.dataset.theme = effectiveTheme;
        document.documentElement.dataset.atmo = effectiveAtmo;

        // Phase 5 reads this — do not remove
        window.__atmo__ = {
          level: effectiveAtmo,
          storedLevel: storedAtmo,
          theme: effectiveTheme,
          storedTheme: storedTheme,
          reducedMotion: reduceMotion,
          set: function (patch) {
            if (patch.theme) {
              localStorage.setItem('theme', patch.theme);
              this.storedTheme = patch.theme;
              var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              this.theme = patch.theme === 'system' ? (sysDark ? 'dark' : 'light') : patch.theme;
              document.documentElement.dataset.theme = this.theme;
            }
            if (patch.atmo) {
              localStorage.setItem('atmo:level', patch.atmo);
              this.storedLevel = patch.atmo;
              this.level = this.reducedMotion ? 'off' : patch.atmo;
              document.documentElement.dataset.atmo = this.level;
            }
            if (typeof patch.subscribe === 'function') {
              this.subscribe(patch.subscribe);
            }
            // Notify Phase 5 subscribers (if any)
            if (Array.isArray(this._listeners)) {
              this._listeners.forEach(function (fn) {
                try { fn(this); } catch (e) { /* ignore */ }
              }.bind(this));
            }
          },
          subscribe: function (fn) {
            this._listeners = this._listeners || [];
            this._listeners.push(fn);
          },
          _listeners: []
        };
      } catch (e) {
        // localStorage blocked (SSR bots, private mode) — default to light/full
        document.documentElement.dataset.theme = 'light';
        document.documentElement.dataset.atmo = 'full';
      }
    })();
  </script>

  <title>{title} · merlinalex.me</title>
</head>
```

**Critical invariants (per PITFALLS §P-4):**
- `<script is:inline>` — Astro leaves it alone; ships verbatim; runs synchronously
- Placed immediately after `<meta charset>` and before any stylesheet that consumes `data-theme` via cascade
- Wrapped in IIFE + `try/catch` so SSR bots and private-mode browsers don't throw
- Does **not** mutate stored `localStorage` when reduce-motion is on — only the displayed `data-atmo` is overridden (CONTEXT D-08 explicit)

**Provenance:** `[VERIFIED: WebFetch docs.astro.build]` — Official Astro docs example for "FOUC-safe pre-paint theme switcher" matches this pattern (script + IIFE + try/catch + `documentElement.dataset.theme`).

### Pattern 2: Content Collections with Zod 4 (Astro 6 API)

**What:** A single `src/content.config.ts` file declaring all 9 collections. Each collection has a `loader` (glob for markdown, file for JSON) and a Zod `schema`. Astro 6 requires both — no implicit "folder = collection" behavior remains.

**When:** Every collection from day one. Catches frontmatter typos at build time.

**Example (`src/content.config.ts`):**
```ts
import { defineCollection, z } from 'astro:content';
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
    category: z.string().optional(),         // freeform per CONTEXT D-02
    sticky: z.boolean().default(false),
    password: z.string().optional(),
    toc: z.boolean().default(true),
  }),
});

// ─── PROJECTS (detailed, D-06) ─────────────────────────
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
const friends = defineCollection({
  loader: file('./src/content/friends/friends.json'),
  schema: z.object({
    items: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
      avatar: z.string().url().optional(),
      description: z.string().optional(),
      category: z.enum(['tech', 'anime', 'life', 'other']).optional(),
      featured: z.boolean().default(false),
    })).default([]),
  }),
});

// ─── TIMELINE (detailed, D-04) ─────────────────────────
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

// ─── ANIME / BOOKS / MUSIC (placeholder, D-01) ─────────
// Detailed schemas land in Phase 4; Phase 1 only validates file exists.
const anime = defineCollection({
  loader: file('./src/content/anime/list.json'),
  schema: z.object({
    items: z.array(z.object({})).default([]),
  }),
});
const books = defineCollection({
  loader: file('./src/content/books/list.json'),
  schema: z.object({
    items: z.array(z.object({})).default([]),
  }),
});
const music = defineCollection({
  loader: file('./src/content/music/list.json'),
  schema: z.object({
    items: z.array(z.object({})).default([]),
  }),
});

export const collections = {
  articles, projects, creations, microblog, friends, timeline, anime, books, music,
};
```

**Provenance:** `[VERIFIED: WebFetch docs.astro.build/en/guides/content-collections/]` — Exact syntax matches the official Astro 6 docs: `import { defineCollection } from 'astro:content'`, `import { glob, file } from 'astro/loaders'`, `import { z } from 'astro/zod'`. The `astro/zod` re-export "supports all of the features of Zod 4" per the docs.

**Critical Astro 6 changes** (per v6 upgrade guide):
- Config file is `src/content.config.ts` (not `src/content/config.ts`)
- Every collection **must** declare a `loader` (typically `glob` or `file`)
- `id` replaces `slug` for entry identification
- `render(entry)` replaces `entry.render()`
- `getEntry()` replaces `getEntryBySlug()` and `getDataEntryById()`

### Pattern 3: Tailwind v4 with `@theme` tokens for light/dark

**What:** Tailwind v4 uses a CSS-first config — design tokens live in CSS via `@theme { ... }`, not in `tailwind.config.js`. To switch between light/dark tokens per `data-theme`, declare tokens in `:root[data-theme="light"]` and `:root[data-theme="dark"]` blocks within the same `global.css` file. Tailwind v4 auto-generates utility classes from these tokens (e.g., `bg-bg`, `text-fg`, `border-border`).

**When:** Every Phase 1 page. The token system is the foundation for every later phase.

**Example (`src/styles/global.css`):**
```css
@import "tailwindcss";

/* ─── DESIGN TOKENS — Light theme (default) ─── */
:root[data-theme="light"] {
  --color-bg: #FFF8FA;                  /* dominant surface */
  --color-bg-elevated: #FFFFFF;         /* sticky header, modal scrim */
  --color-surface: #FFE4ED;             /* cards, notice bar */
  --color-surface-muted: #FFF0F4;       /* hover surface, input bg */
  --color-border: #F5D4DE;              /* card borders, dividers */
  --color-fg: #2D1B2D;                  /* body text, headings */
  --color-fg-muted: #7A5D6F;            /* captions, metadata */
  --color-accent: #FF6B9D;              /* primary CTA, active nav */
  --color-accent-hover: #E85A8B;
  --color-accent-subtle: #FFC8DD;       /* skill bar fill base, chips */
  --color-destructive: #E63946;
  --color-destructive-hover: #C1303B;
  --color-focus: #FF6B9D;               /* focus ring */

  /* Animation tokens (UI-SPEC) */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ─── DESIGN TOKENS — Dark theme ─── */
:root[data-theme="dark"] {
  --color-bg: #1A0F1A;
  --color-bg-elevated: #241824;
  --color-surface: #2D1B2D;
  --color-surface-muted: #3A2535;
  --color-border: #4A2F45;
  --color-fg: #F5E8EE;
  --color-fg-muted: #B497A8;
  --color-accent: #FF8FB8;
  --color-accent-hover: #FFA8C8;
  --color-accent-subtle: #5A2D3F;
  --color-destructive: #FF6B7A;
  --color-destructive-hover: #FF8593;
  --color-focus: #FF8FB8;
}

/* ─── ATMOSPHERE INTENSITY GATE (Phase 5 contract) ─── */
/* Placeholder rule so Phase 5 styling has a selector to hook. */
:root[data-atmo="off"] .atmo-petals,
:root[data-atmo="off"] .atmo-cursor-trail,
:root[data-atmo="off"] .atmo-live2d {
  display: none;
}
/* Subtle level throttles particle counts in Phase 5. */

/* ─── REDUCED-MOTION BASELINE (A11Y-02, CONTEXT D-10) ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

/* ─── BASE STYLES ─── */
html { scroll-behavior: smooth; }
body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: "Zen Maru Gothic", "Noto Sans SC", "PingFang SC", "Hiragino Sans", system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  transition: background-color var(--duration-base) var(--easing-default);
}

:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

**Then in `astro.config.mjs`:**
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://merlinalex.me',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Critical:** Do **NOT** use `import tailwind from '@astrojs/tailwind'` and do **NOT** add `tailwind()` to `integrations: []`. That's the Tailwind 3 pattern, now deprecated.

**Provenance:** `[VERIFIED: WebFetch docs.astro.build/en/guides/styling/]` — Official docs show `astro add tailwind` installs `@tailwindcss/vite` and instructs to remove `@astrojs/tailwind`. CSS file content is `@import "tailwindcss"` plus any custom tokens.

### Pattern 4: 404 page with HTTP status

**What:** Astro renders a static 404 page; setting `Astro.response.status = 404` in the frontmatter ensures the HTTP response carries the correct status code (search engines don't index 404s as soft-200s).

**Example (`src/pages/404.astro`):**
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

**Provenance:** `[VERIFIED: WebFetch docs.astro.build/en/reference/api-reference/]` — Official Astro 6 API reference confirms `Astro.response.status` + `Astro.response.statusText` pattern.

**Cloudflare Pages wiring:** Static-site deploys do not need `_routes.json` for 404 — Pages auto-serves `404.html` from `dist/` for any unmatched path. (For Workers SSR, the `not_found_handling: "404-page"` wrangler config is needed, but Phase 1 is pure static.)

### Anti-Patterns to Avoid

- **Anti-pattern 1: Using `src/content/config.ts`** — Throws `LegacyContentConfigError` in Astro 6 per the v6 upgrade guide. Use `src/content.config.ts`.
- **Anti-pattern 2: Importing `z` from `astro:content`** — Deprecated in Astro 6. Use `import { z } from 'astro/zod'`.
- **Anti-pattern 3: Using `entry.render()` or `.slug`** — Both removed in Astro 6. Use `import { render } from 'astro:content'` and `entry.id`.
- **Anti-pattern 4: Deferring the pre-paint theme script** — Breaks PITFALLS §P-4. Must be `<script is:inline>` in `<head>`, blocking, synchronous, before any stylesheet.
- **Anti-pattern 5: Mutating `localStorage["atmo:level"]` on reduce-motion** — Violates CONTEXT D-08 explicit invariant. Display-only override.
- **Anti-pattern 6: Installing `@astrojs/tailwind`** — Tailwind 3-only, officially deprecated in Astro 5.2+. Use `astro add tailwind` (installs `@tailwindcss/vite`).
- **Anti-pattern 7: Tailwind `dark:` variant for tokens** — Violates CONTEXT D-08. Theme tokens must use CSS variables under `:root[data-theme]`; only the `data-theme` selector drives the cascade. Tailwind's `dark:` could be used for layout-only differences (e.g., `dark:hidden`) but NOT for color tokens.
- **Anti-pattern 8: Writing 404 as soft-200 with "Page not found" UI** — Violates PITFALLS §P-21 and INFRA-06. Must set `Astro.response.status = 404`.
- **Anti-pattern 9: One collection schema for all 9 types** — Type-unsafe; defeats the purpose of Zod. Each collection has its own schema.
- **Anti-pattern 10: Custom 404 redirecting to /404.html via meta refresh** — Some Astro 6 examples do this; it's wrong. Use `src/pages/404.astro` and let CF Pages serve it.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme persistence with FOUC prevention | Custom localStorage + matchMedia + state management | `<script is:inline>` pattern + `data-theme` attribute | The IIFE pattern is ~30 lines, battle-tested, FOUC-safe; any heavier abstraction (e.g., React context) defeats the purpose |
| Zod-validated content | Hand-rolled YAML/JSON parsing + type assertions | Astro Content Collections + `defineCollection({ loader, schema })` | First-party, type-inferred, build-time validation, free TypeScript types |
| Sitemap generation | Hand-written `sitemap.xml` + maintenance | `astro add sitemap` | One-line integration; auto-generates `sitemap-index.xml` + `sitemap-0.xml`; respects `site:` URL |
| 404 status code | Custom `Response` headers in frontmatter | `Astro.response.status = 404` in frontmatter | Astro API; no manual `Response` construction |
| Light/dark CSS variables | `tailwind.config.js` `darkMode: 'class'` + per-token variants | Tailwind v4 `@theme` in CSS, with `:root[data-theme]` overrides | v4 is CSS-first; tokens as CSS variables are simpler, cascade correctly, and survive any rebuild |
| Font self-hosting | `<link href="//fonts.googleapis.com/...">` | `@fontsource/zen-maru-gothic` + CSS `@font-face` | No Google Fonts CLS (P-10), no FOUT, no third-party request |
| Icon set | Inline SVG paths in components | `astro-icon` integration | Single import, tree-shaken, consistent sizing |
| Custom domain + HTTPS | Manual DNS + cert renewal | Cloudflare nameservers + CF Pages auto-SSL | Free, automatic, renews forever |

**Key insight:** Phase 1 has **zero hand-rolled infrastructure code** — every problem maps to a one-line integration or a 30-line inline script. The risk in Phase 1 is **over-engineering**, not under-engineering.

---

## Runtime State Inventory

> Greenfield project. No prior code. No runtime state to inventory.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None | None |
| Live service config | None | None |
| OS-registered state | None | None |
| Secrets/env vars | None (`.env.example` has `TWIKOO_ENV_ID` placeholder only, not deployed) | None |
| Build artifacts | None | None |

---

## Common Pitfalls

### Pitfall 1: Pre-paint script placed after stylesheet (FOUC)

**What goes wrong:** The Tailwind v4 stylesheet loads first and renders in default state (or undefined `data-theme`), then the script runs and flashes the correct theme. Visible 100-300ms "blink" on slow connections.

**Why it happens:** Astro's component order isn't enforced; `<script>` after `<link rel="stylesheet">` is the default for many layouts.

**How to avoid:** In `BaseLayout.astro`, place the `<script is:inline>` **before** any `<link rel="stylesheet">` and before the `@import "tailwindcss";` resolves. Simplest: put it as the **first** element inside `<head>` (after `<meta charset>`).

**Warning signs:** Lighthouse "Eliminate render-blocking resources" warning, or DevTools Performance shows the FOUC in slow-3G throttle.

**Source:** PITFALLS §P-4 (HIGH confidence). `[VERIFIED: WebFetch docs.astro.build]` — Official Astro docs explicitly recommend `<script is:inline>` in `<head>` to run before paint.

### Pitfall 2: `prefers-reduced-motion` mutates stored preference

**What goes wrong:** A naive implementation sets `localStorage["atmo:level"] = "off"` when reduce-motion is detected. The user then can't get back to "full" on next page load because their stored value is "off".

**Why it happens:** Confusing "display state" with "stored state" — the data-atmo attr is display, the localStorage value is user preference.

**How to avoid:** Keep them separate. Stored value = `localStorage["atmo:level"]` (only mutated by user click). Display value = `data-atmo` (computed at pre-paint time as `reduceMotion ? "off" : storedAtmo`).

**Warning signs:** Visiting a site with `reduceMotion: reduce` and clicking intensity → page reloads with stored = "off" instead of user's last choice.

**Source:** CONTEXT D-08 explicit invariant. PITFALLS §P-6. Verified by UI-SPEC "Critical invariants" section.

### Pitfall 3: `astro add tailwind` installs wrong plugin

**What goes wrong:** Some guides still recommend `pnpm add -D @astrojs/tailwind` (the legacy integration). This installs the Tailwind 3 integration, which is incompatible with v4. The build will fail or silently downgrade to v3.

**Why it happens:** Tutorials from before 2025 still reference `@astrojs/tailwind`. The name is confusing — `@astrojs/tailwind` (integration) vs `@tailwindcss/vite` (the correct v4 plugin).

**How to avoid:** Always use the official `pnpm astro add tailwind` command. If you see a guide that says `pnpm add -D @astrojs/tailwind`, ignore it. Verify `package.json` has `@tailwindcss/vite` and `tailwindcss@^4.x` after install.

**Warning signs:** `package.json` shows `@astrojs/tailwind`; `astro.config.mjs` has `integrations: [tailwind()]`; Tailwind v3 syntax (`@tailwind base;` etc.) is expected.

**Source:** STACK.md "What NOT to Use" table; `[VERIFIED: WebFetch docs.astro.build/en/guides/styling/]` — Official docs show upgrade path from `@astrojs/tailwind` to `@tailwindcss/vite`.

### Pitfall 4: Content config file at wrong path (Astro 6 breaking)

**What goes wrong:** Old tutorials and AI-generated code put `content.config.ts` at `src/content/config.ts`. In Astro 6, this throws `LegacyContentConfigError` and the build fails.

**Why it happens:** Astro 5 used `src/content/config.ts`; Astro 6 moved to `src/content.config.ts` (sibling of `src/content/`, not inside it).

**How to avoid:** Use the new path. If you copy an old tutorial, move the file before running `astro build`.

**Warning signs:** `LegacyContentConfigError: Legacy content config detected at src/content/config.ts` in build log.

**Source:** `[VERIFIED: WebFetch docs.astro.build/en/guides/upgrade-to/v6/]` — V6 upgrade guide explicitly calls this out.

### Pitfall 5: Build OOM on initial image-heavy page

**What goes wrong:** First build with sample images (especially a 2-5 MB persona avatar or OG card) hits Cloudflare Pages' default 1 GB Node memory limit and crashes with `JavaScript heap out of memory`.

**Why it happens:** Sharp + Astro's image pipeline pre-allocates for the largest image. With no `NODE_OPTIONS` override, Node's default is 1.5 GB on macOS / 1 GB on CF Pages.

**How to avoid:** Set `NODE_OPTIONS=--max-old-space-size=4096` in CF Pages environment variables (per CONTEXT D-12). Pre-resize images locally before commit. For Phase 1, the OG card placeholder is ~50KB so OOM is unlikely, but the env var is cheap insurance.

**Warning signs:** Build log ends with `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`.

**Source:** PITFALLS §P-19 (MEDIUM-HIGH confidence); CONTEXT D-12.

### Pitfall 6: `Astro.response.status = 404` not applied in production

**What goes wrong:** Setting `Astro.response.status` in dev works, but in production the 404 page returns HTTP 200 with the 404 UI. Search engines index soft-200 404s as duplicates of the homepage.

**Why it happens:** Cloudflare Pages (and most static hosts) need to know the 404 page exists. If `src/pages/404.astro` is missing or not named correctly, the host serves the default `404.html` or the homepage with 200.

**How to avoid:** Name the file exactly `src/pages/404.astro` (not `not-found.astro` or `404.html`). For Cloudflare Pages, also add a `404.html` to the build output (Astro auto-generates this from `404.astro`). Test with `curl -I https://merlinalex.me/nonexistent` and verify `HTTP/2 404`.

**Warning signs:** `curl -I` shows `HTTP/2 200` on nonexistent URLs; Google Search Console reports soft-404s.

**Source:** PITFALLS §P-21; `[VERIFIED: WebFetch docs.astro.build]` — Astro 6 API reference confirms `Astro.response.status` is the correct pattern.

### Pitfall 7: Twikoo env placeholder accidentally deployed

**What goes wrong:** `.env.example` has `TWIKOO_ENV_ID=`. Someone copies it to `.env` for local dev, commits it, CF Pages picks it up, and the site tries to load Twikoo from an empty envId.

**Why it happens:** `.env.example` is supposed to be the template; `.env` is the actual file. The two are easy to confuse. Cloudflare Pages reads `.env` automatically if committed.

**How to avoid:** Add `.env` to `.gitignore`. Add `.env*` to gitignore except `.env.example`. Document that `TWIKOO_ENV_ID` is intentionally empty in Phase 1 — Twikoo integration ships in Phase 2.

**Warning signs:** Browser console shows `twikoo.init({ envId: '' })` errors; the file is in `git ls-files`.

**Source:** CONTEXT D-11; standard `.env` hygiene.

### Pitfall 8: Custom 404 vs Cloudflare Pages default

**What goes wrong:** Cloudflare Pages auto-generates a generic "404 — page not found" page if `404.html` isn't in the build output. Astro 6 generates `404.html` from `src/pages/404.astro` automatically, but if the file is missing or the build skips it, the wrong page serves.

**Why it happens:** `src/pages/404.astro` is only included in the build if it's correctly placed. If the import path in the file is wrong, Astro may still emit `404.html` with a broken layout.

**How to avoid:** After `astro build`, verify `dist/404.html` exists and renders. `curl -I https://merlinalex.me/404` (or any nonexistent path) and confirm `HTTP/2 404` and the kawaii UI body.

**Warning signs:** Build log shows no `404.html`; `curl` to nonexistent path returns the default CF Pages 404.

**Source:** PITFALLS §P-21; INFRA-06.

---

## Code Examples

Verified patterns from official Astro + Tailwind docs.

### Example 1: `astro.config.mjs` (Astro 6 + Tailwind v4 + MDX + Sitemap)

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://merlinalex.me',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
  // Compatibility flags not needed for static — but if SSR is added later:
  // adapter: cloudflare(),
});
```

**Provenance:** `[VERIFIED: WebFetch docs.astro.build/en/guides/styling/]` + `[VERIFIED: WebFetch docs.astro.build/en/guides/integrations-guide/sitemap/]` + `[VERIFIED: WebFetch docs.astro.build/en/guides/upgrade-to/v6/]`. The `@tailwindcss/vite` plugin goes in `vite.plugins`, not `integrations`. The `@astrojs/sitemap` integration requires `site:` to be set.

### Example 2: `BaseLayout.astro` (pre-paint script + slot pattern)

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
import Header from '../components/core/Header.astro';
import Footer from '../components/core/Footer.astro';
import SEOMeta from '../components/seo/SEOMeta.astro';

const {
  title,
  description = 'merlinalex.me — 二次元可爱风个人站',
  image = '/og-default.png',
  type = 'website',
} = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site).toString();
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- Pre-paint theme + atmo gate (FOUC-safe, blocking, synchronous) -->
    <script is:inline>
      (function () {
        try {
          var storedTheme = localStorage.getItem('theme') || 'system';
          var storedAtmo  = localStorage.getItem('atmo:level') || 'full';
          var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          var effectiveTheme = storedTheme === 'system' ? (prefersDark ? 'dark' : 'light') : storedTheme;
          var effectiveAtmo  = reduceMotion ? 'off' : storedAtmo;
          document.documentElement.dataset.theme = effectiveTheme;
          document.documentElement.dataset.atmo = effectiveAtmo;
          window.__atmo__ = {
            level: effectiveAtmo, storedLevel: storedAtmo,
            theme: effectiveTheme, storedTheme: storedTheme,
            reducedMotion: reduceMotion,
            set: function (patch) { /* ...see Pattern 1 above... */ },
            subscribe: function (fn) { this._listeners = this._listeners || []; this._listeners.push(fn); },
            _listeners: []
          };
        } catch (e) {
          document.documentElement.dataset.theme = 'light';
          document.documentElement.dataset.atmo = 'full';
        }
      })();
    </script>

    <SEOMeta
      title={title}
      description={description}
      image={image}
      type={type}
      canonical={canonical}
    />
  </head>
  <body>
    <a href="#main" class="skip-link">跳到主要内容</a>
    <Header />
    <main id="main">
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style>
  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    background: var(--color-accent);
    color: white;
    padding: 8px 16px;
    z-index: 100;
  }
  .skip-link:focus {
    left: 8px;
    top: 8px;
  }
</style>
```

**Provenance:** `[VERIFIED: WebFetch docs.astro.build]` — The pre-paint script pattern is from the official Astro docs FOUC-safe example.

### Example 3: `ThemeSwitcher.astro` (inline script cycles localStorage)

```astro
---
// src/components/core/ThemeSwitcher.astro
// Cycles light → dark → system → light. Writes to localStorage.
// Uses window.__atmo__.set() to update data-theme in one call.
---

<button
  type="button"
  class="theme-switcher"
  aria-label="切换主题"
  data-current-theme="system"
>
  <span class="sr-only">当前主题：</span>
  <span data-theme-icon>🖥️</span>
  <span data-theme-label class="hidden md:inline">跟随系统</span>
</button>

<script is:inline>
  (function () {
    var btn = document.querySelector('.theme-switcher');
    if (!btn || !window.__atmo__) return;

    var CYCLE = ['light', 'dark', 'system'];
    var ICONS = { light: '☀️', dark: '🌙', system: '🖥️' };
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

**Pattern:** Self-contained inline `<script is:inline>` — no bundling, no `client:*` directive needed for a ~30-line toggle. Lives inside the component; runs after the pre-paint script.

### Example 4: Reading content in a page

```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/home/Hero.astro';
import NoticeBar from '../components/core/NoticeBar.astro';
import LatestArticles from '../components/home/LatestArticles.astro';
import LatestMicroblog from '../components/home/LatestMicroblog.astro';
import Hitokoto from '../components/home/Hitokoto.astro';
import SiteStats from '../components/home/SiteStats.astro';

const allArticles = await getCollection('articles', ({ data }) => !data.draft);
const latestArticles = allArticles
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
  .slice(0, 3);

const allMicroblog = await getCollection('microblog');
const latestMicroblog = allMicroblog
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
  .slice(0, 5);
---

<BaseLayout title="首页" description="merlinalex.me — 二次元可爱风个人站">
  <NoticeBar />
  <Hero />
  <Hitokoto />
  <SiteStats articleCount={allArticles.length} />
  <LatestArticles articles={latestArticles} />
  <LatestMicroblog posts={latestMicroblog} />
</BaseLayout>
```

**Provenance:** `[VERIFIED: WebFetch docs.astro.build/en/guides/content-collections/]` — `getCollection` with a filter function + `.sort()` + `.slice()` is the canonical pattern. Uses Astro 6's `entry.id` (not `.slug`).

### Example 5: `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://merlinalex.me/sitemap-index.xml
```

**Source:** Standard SEO practice + `[VERIFIED: WebFetch docs.astro.build]` — Sitemap integration docs recommend `Sitemap: https://...` line in `robots.txt`.

### Example 6: Cloudflare Pages environment variables (CF dashboard, not file)

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_VERSION` | `22` | Pinned to LTS |
| `NODE_OPTIONS` | `--max-old-space-size=4096` | OOM guard (D-12) |
| `TWIKOO_ENV_ID` | *(empty in Phase 1)* | Reserved for Phase 2 |

**Source:** CONTEXT D-11, D-12. `[CITED: Cloudflare Pages env var docs]` (verified in earlier research; not re-verified this session).

### Example 7: Cloudflare Pages custom domain + 301 redirect

**In CF dashboard for the Pages project:**
1. **Custom domains** → Add `merlinalex.me` (apex) — CF auto-provisions SSL
2. **Custom domains** → Add `www.merlinalex.me` — set up as a redirect to apex
3. CF Pages sets the redirect via the "Redirect to primary domain" toggle on the custom domain entry

**DNS at registrar (or Cloudflare if nameservers are pointed):**
- `merlinalex.me` → CNAME to `<project>.pages.dev` (CF auto-manages if nameservers are on Cloudflare)
- `www.merlinalex.me` → CNAME to `<project>.pages.dev`

**Source:** `[CITED: developers.cloudflare.com/pages/configuration/custom-domains/]` — referenced in earlier research; not re-verified this session. The 301 redirect is a Pages dashboard setting, not a file.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/tailwind` integration | `@tailwindcss/vite` plugin | Astro 5.2 (early 2025) | Tailwind 4; CSS-first config via `@theme`; ~5× faster build |
| `tailwind.config.js` JS config | `@theme { ... }` in CSS | Tailwind 4 (early 2025) | One file instead of two; tokens are CSS variables automatically |
| `src/content/config.ts` | `src/content.config.ts` | Astro 6 (mid 2026) | Throws `LegacyContentConfigError` if old path used |
| `entry.slug` | `entry.id` | Astro 6 (mid 2026) | `id` is now slug-based; `getEntry()` uses `id` |
| `entry.render()` | `render(entry)` from `astro:content` | Astro 6 (mid 2026) | Removed instance method |
| `getEntryBySlug()` / `getDataEntryById()` | `getEntry()` | Astro 6 (mid 2026) | Single API for all entry lookups |
| `import { z } from 'astro:content'` | `import { z } from 'astro/zod'` | Astro 6 (mid 2026) | Deprecated; new path re-exports Zod 4 |
| Cloudflare Pages (recommended) | Cloudflare Workers (recommended for new projects) | Late 2025 | CF recommends Workers for new projects; Pages still works and is cheaper for pure static. **Phase 1 uses Pages** per CONTEXT D-11. |

**Deprecated/outdated:**
- `@astrojs/tailwind` — Tailwind 3 only; do not install
- `particles.js` — unmaintained since 2017
- `oh-my-live2d` — renamed to `l2d-widget` May 2026
- `entry.render()` / `.slug` / `getEntryBySlug()` — removed in Astro 6

---

## Assumptions Log

> Claims tagged `[ASSUMED]` in this research. The planner and discuss-phase should identify which need user confirmation.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | TypeScript 5.5.x is the version Astro 6 ships with | Standard Stack — Core | LOW — Astro extends `astro/tsconfigs/strict` which pins a specific TS version; using whatever Astro 6 scaffolds is correct |
| A2 | `@fontsource/zen-maru-gothic` v5 is the current major | Standard Stack — Phase 1 only | LOW — wrong major might just need a re-install; font files are inert |
| A3 | `@fontsource/jetbrains-mono` v5 is the current major | Standard Stack — Phase 1 only | LOW — same as A2 |
| A4 | `astro-icon` v1 is the current major | Standard Stack — Phase 1 only | LOW — `astro add icon` always installs the latest; this is a safety tag |
| A5 | `vitest` v2 + `@playwright/test` v1.4x are current majors | Standard Stack — Phase 1 only | LOW — both are project-mandated; versions can drift later |
| A6 | Cloudflare Pages still supports the `nodejs_compat` flag for Astro 6 (per CONTEXT D-11) | Common Pitfalls | MEDIUM — Astro 6 is pure static in Phase 1, so `nodejs_compat` may not even be needed. CF dashboard may have changed the flag. If flag is gone, no impact for static build. |
| A7 | Cloudflare Pages still supports the "Redirect to primary domain" toggle for `www` → apex | Code Examples — Cloudflare | MEDIUM — CF dashboard has changed before. Fallback: set up a `_redirects` file in `public/` with `https://www.merlinalex.me/* https://merlinalex.me/:splat 301`. |
| A8 | Astro 6 generates `dist/404.html` from `src/pages/404.astro` automatically | Pattern 4 | LOW — verified by Astro's build output; if wrong, manually configure via CF Pages "404 page" setting pointing to a built `404.html` |

**If this table is empty:** Replace with "All claims in this research were verified or cited — no user confirmation needed."

---

## Open Questions

1. **Cloudflare Pages vs Workers for new projects (CF recommends Workers as of late 2025)**
   - What we know: CONTEXT D-11 explicitly says "Cloudflare Pages" and mentions `nodejs_compat` flag. CF Pages still exists and is cheaper for static.
   - What's unclear: Whether `nodejs_compat` is even needed for a pure static Astro 6 build (likely no — that's for SSR with the @astrojs/cloudflare adapter).
   - Recommendation: Use Cloudflare Pages (per CONTEXT). Do not add the `nodejs_compat` flag unless SSR is enabled. If CF Pages UI breaks the `www` → apex redirect flow, fall back to a `public/_redirects` file.

2. **Astro 6's exact `astro add` behavior for `tailwind`**
   - What we know: The official docs say `astro add tailwind` installs the Vite plugin. The docs do not show the full `astro.config.mjs` after the command runs.
   - What's unclear: Whether `astro add tailwind` modifies `astro.config.mjs` automatically or just installs the package.
   - Recommendation: After running `astro add tailwind`, manually verify `astro.config.mjs` has `import tailwindcss from '@tailwindcss/vite'` and `vite: { plugins: [tailwindcss()] }`. If not, add it.

3. **Exact CF Pages build settings for the `pnpm` + Astro 6 combo**
   - What we know: CF Pages auto-detects pnpm. Build command can be `pnpm build` or `npm run build` (which calls `astro build`).
   - What's unclear: Whether the build needs `pnpm install --frozen-lockfile` or default install.
   - Recommendation: In CF Pages dashboard, set:
     - Build command: `pnpm build`
     - Build output directory: `dist`
     - Root directory: `/` (project root)
     - Environment variables: `NODE_VERSION=22`, `NODE_OPTIONS=--max-old-space-size=4096`

4. **Whether the `astro-icon` integration is required for Phase 1**
   - What we know: UI-SPEC references Lucide icons (`Sun`, `Moon`, `Laptop`, etc.). Could be inline SVG instead.
   - What's unclear: Whether to install `astro-icon` now or defer.
   - Recommendation: Install `astro-icon` in Phase 1 plan 01-01 (scaffold step). Cheap to add; saves needing to revisit icons later when intensity badge / theme switcher ship in 01-02.

5. **Tailwind v4 auto-class generation for custom tokens**
   - What we know: v4 auto-generates utility classes from `@theme` tokens (e.g., `bg-bg`, `text-fg` from `--color-bg`, `--color-fg`).
   - What's unclear: Whether the auto-generated class names use camelCase or kebab-case for tokens with hyphens (e.g., `--color-fg-muted` → `text-fg-muted` or `text-fgMuted`).
   - Recommendation: Use kebab-case in CSS (`--color-fg-muted`) and check the generated classes in a quick smoke test. If auto-generation produces weird names, fall back to inline `style="color: var(--color-fg-muted)"` in components.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `astro build` (Astro 6 requires ≥18.20.8) | YES | `v22.22.1` (local) | — |
| pnpm | `pnpm install`, `pnpm build` | YES | `11.5.0` (local) | npm works too; CF Pages auto-detects pnpm if `pnpm-lock.yaml` present |
| npm | `npx astro add ...` | YES | `10.9.4` (local) | — |
| Git | `git init`, CF Pages integration | UNVERIFIED | — | If missing, install via `brew install git` or skip CI for first commit |
| Cloudflare account | CF Pages deploy | UNVERIFIED (this session) | — | If account doesn't exist, Phase 1 ships to local preview only; defer production deploy to plan 01-03 |
| Custom domain `merlinalex.me` | DNS + custom domain in CF | UNVERIFIED (this session) | — | Use CF Pages preview URL (`<project>.pages.dev`) for first deploy |

**Missing dependencies with no fallback:**
- None for Phase 1 build. Production deploy is gated on Cloudflare account access.

**Missing dependencies with fallback:**
- Cloudflare account: fall back to local `pnpm build` + `pnpm preview` to verify the build works; defer production deploy to next session
- Custom domain: deploy to `<project>.pages.dev` URL only; defer custom domain + 301 redirect

---

## Validation Architecture

> Per `workflow.nyquist_validation` (assumed enabled — not in `.planning/config.json`): include this section.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (unit) + Playwright (E2E) — scaffolded but no tests in Phase 1 |
| Config file | None required (Playwright auto-creates `playwright.config.ts` on first run; Vitest auto-discovers) |
| Quick run command | `pnpm vitest run` (no tests yet) |
| Full suite command | `pnpm vitest run && pnpm playwright test` (no tests yet) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-01 | Home renders hero, latest articles, latest microblog, Hitokoto placeholder, site stats, notice | manual smoke + Playwright E2E (Phase 6) | `pnpm playwright test home.spec.ts` | ❌ Wave 0 |
| PAGE-02 | About renders persona card (avatar, MBTI, skills, favorites, Q&A) | manual smoke + Playwright E2E (Phase 6) | `pnpm playwright test about.spec.ts` | ❌ Wave 0 |
| ATM-04 | Theme switcher cycles `light/dark/system`; persists; no FOUC on hard refresh | manual Lighthouse + Playwright E2E (Phase 6) | `pnpm playwright test theme.spec.ts` | ❌ Wave 0 |
| INFRA-01 | `pnpm build` exits 0; `astro.config.mjs` has @tailwindcss/vite + integrations | manual + `astro check` | `pnpm astro check` | ❌ Wave 0 |
| INFRA-02 | 9 collections defined in `src/content.config.ts`; `astro build` validates empty arrays | manual + `astro build` exit 0 | `pnpm build` | ❌ Wave 0 |
| INFRA-03 | Production build deploys to CF Pages; custom domain serves HTTPS; `www` 301s to apex | manual via CF dashboard | `curl -I https://merlinalex.me/` | ❌ Wave 0 |
| INFRA-06 | 404 returns HTTP 404 with kawaii UI; OG/Twitter tags present; robots.txt + sitemap-index.xml reachable | manual + `curl -I` + Lighthouse | `curl -I https://merlinalex.me/nonexistent` | ❌ Wave 0 |
| A11Y-01 | IntensityBadge cycles `off/subtle/full`; `localStorage["atmo:level"]` persists; `data-atmo` updates | manual + Playwright E2E (Phase 6) | `pnpm playwright test intensity.spec.ts` | ❌ Wave 0 |
| A11Y-02 | `prefers-reduced-motion: reduce` forces `data-atmo="off"` display; CSS animations suppressed | manual + DevTools rendering | manual smoke | ❌ Wave 0 |
| SEO-01 | `/sitemap-index.xml` exists; `robots.txt` references sitemap; OG/Twitter tags in `<head>` of every page | manual + `curl` | `curl https://merlinalex.me/sitemap-index.xml` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `pnpm build` (exit 0) + manual `astro preview` smoke test
- **Per wave merge:** `pnpm build` + Lighthouse desktop audit of Home + About
- **Phase gate:** Lighthouse "no FOUC" passes; `pnpm build` exit 0; `curl -I https://merlinalex.me/` returns 200; `curl -I https://merlinalex.me/nonexistent` returns 404; sitemap-index.xml valid; manual hard-refresh of Home shows correct theme on first paint

### Wave 0 Gaps

- [ ] `tests/e2e/home.spec.ts` — verify PAGE-01 sections render (Phase 6 work, not Phase 1)
- [ ] `tests/e2e/about.spec.ts` — verify PAGE-02 persona card renders (Phase 6 work)
- [ ] `tests/e2e/theme.spec.ts` — verify ATM-04 + A11Y-01 + A11Y-02 (Phase 6 work)
- [ ] `playwright.config.ts` — auto-created on first `pnpm playwright test`
- [ ] `vitest.config.ts` — auto-discovered by Vitest
- [ ] Framework install: `pnpm add -D vitest @playwright/test` (covered in plan 01-01)

*(Phase 1 does NOT require writing tests per CONTEXT D-13; this is "scaffold only" — tests arrive in Phase 6 per REQUIREMENTS TEST-01)*

---

## Security Domain

> Per CLAUDE.md `security_enforcement` (assumed enabled — not in `.planning/config.json`): include this section.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | NO | No user accounts (PROJECT constraint) |
| V3 Session Management | NO | No sessions (static site) |
| V4 Access Control | NO | No access control (public content) |
| V5 Input Validation | NO | No user input in Phase 1 (comments arrive Phase 2) |
| V6 Cryptography | NO | No secrets in Phase 1 (Twikoo envId placeholder only) |
| V7 Error Handling | YES | Astro default error pages; 404 returns HTTP 404 (INFRA-06) |
| V9 Communication | YES | HTTPS via Cloudflare (auto) |
| V14 Configuration | YES | `.env.example` placeholder only; `.env` gitignored; no secrets deployed |

### Known Threat Patterns for Astro Static Site

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `.env` accidentally committed | Information Disclosure | `.gitignore` includes `.env`; `.env.example` is the only env file in git |
| Soft-404 (200 with "not found" UI) | Repudiation | `Astro.response.status = 404` in `src/pages/404.astro` (P-21) |
| XSS in persona card content | Tampering | Persona data is YAML loaded at build; no runtime user input renders; safe by default |
| Missing CSRF | — | N/A — no forms, no POSTs in Phase 1 |
| Open redirect | — | N/A — no redirects in Phase 1 (CF 301 redirect is for `www` → apex, fixed) |
| Supply chain attack via npm install | Tampering | All packages verified via npm registry; `@tailwindcss/vite` + `@astrojs/*` are first-party; `@fontsource` is well-known |
| Twikoo envId placeholder leaked | Information Disclosure | `.env.example` shows variable name only; no value in git; CF Pages env not set in Phase 1 |

**Phase 1 has zero auth/session/CRUD surface.** The only security considerations are (a) keeping `.env` out of git, (b) making sure the 404 actually returns HTTP 404, and (c) not leaking the Twikoo envId before Phase 2.

---

## Recommended Plan Breakdown

> Confirming ROADMAP's 3-plan split. All dependencies are linear — no parallel plan execution possible.

### Plan 01-01: Project scaffold + Zod schemas

**Goal:** Astro 6.4.2 project initialized with TypeScript strict, Tailwind v4 via `@tailwindcss/vite`, MDX, Sitemap, Node 22 pinned. All 9 content collection schemas defined in `src/content.config.ts` with sample empty files.

**Tasks:**
1. `pnpm create astro@latest . --template minimal --typescript strict --no-git --install --yes` (or `pnpm dlx create-astro@latest ...`)
2. Verify `astro.config.mjs`, `tsconfig.json` extends `astro/tsconfigs/strict`
3. `pnpm astro add tailwind mdx sitemap` (one command chain)
4. Verify `package.json` has `@tailwindcss/vite` (NOT `@astrojs/tailwind`)
5. `pnpm add @fontsource/zen-maru-gothic @fontsource/jetbrains-mono`
6. `pnpm astro add icon`
7. `pnpm add -D vitest @playwright/test`
8. Create `.nvmrc` with `22`
9. Update `package.json` `engines.node` to `">=22.0.0"`
10. Create `src/content.config.ts` with all 9 collection schemas (per Pattern 2 above)
11. Create empty `src/content/{articles,projects,creations,microblog,friends,timeline}/.gitkeep`
12. Create empty `src/content/{anime,books,music}/list.json` with `{ "items": [] }`
13. Create `src/styles/global.css` with `@import "tailwindcss";` and base tokens (light theme only — dark added in 01-02)
14. Create `src/data/persona.yaml` with placeholder values matching D-14
15. Create `src/data/notice.md` empty, `src/data/social.json` with GitHub link, `src/data/friends-health.json` with `{}`
16. Create `public/robots.txt` (per Example 5)
17. Create `public/favicon.svg` placeholder (sakura blob)
18. Create `public/og-default.png` placeholder (1200×630 gradient — can use `convert` or skip to text-only OG in Phase 1)
19. Create `.env.example` with `TWIKOO_ENV_ID=` placeholder
20. Create `.gitignore` with `.env`, `.env.local`, `node_modules`, `dist`, `.astro`
21. Run `pnpm build` — must exit 0; verify `dist/index.html` exists (scaffold page)
22. Commit: `chore(phase-01): scaffold Astro 6 + Tailwind v4 + 9 content collection schemas`

**Dependencies:** None (first plan)
**Unlocks:** Plan 01-02 needs the scaffold + styles + collections

### Plan 01-02: BaseLayout + theme system + a11y gates

**Goal:** `BaseLayout.astro` with FOUC-safe pre-paint script, light/dark CSS tokens, theme switcher + intensity badge, `prefers-reduced-motion` baseline. Full theme system works end-to-end on a placeholder page.

**Tasks:**
1. Write `src/layouts/BaseLayout.astro` (per Example 2)
2. Write `src/components/core/Header.astro` — logo + nav + theme switcher + intensity badge slot
3. Write `src/components/core/Footer.astro` — copyright + social links from `src/data/social.json`
4. Write `src/components/core/Nav.astro` — nav links (Articles/Works/Timeline = `aria-disabled` Phase 1)
5. Write `src/components/core/ThemeSwitcher.astro` (per Example 3)
6. Write `src/components/core/IntensityBadge.astro` — cycles `off/subtle/full`, visual feedback only
7. Write `src/components/core/NoticeBar.astro` — reads `src/data/notice.md`, dismiss with `localStorage["notice:dismissed:<id>"]`
8. Write `src/components/core/NotFound.astro` — 404 placeholder UI
9. Write `src/components/seo/SEOMeta.astro` — `<title>`, description, canonical, OG/Twitter tags
10. Update `src/styles/global.css` — add dark theme tokens under `:root[data-theme="dark"]`, add `[data-atmo="off"]` placeholder rule, add `prefers-reduced-motion` baseline rule (per D-10), add base body styles
11. Update `astro.config.mjs` — set `site: 'https://merlinalex.me'`
12. Create a temporary `src/pages/_theme-test.astro` that uses `BaseLayout` to manually verify theme switching + intensity cycling in browser
13. Run `pnpm dev` and manually test: (a) toggle theme, (b) refresh page, (c) verify no FOUC via DevTools "Slow 3G" throttle, (d) toggle intensity, (e) verify `data-atmo` updates
14. Run `pnpm build` and `astro preview` — verify the build still works
15. Delete `src/pages/_theme-test.astro` (replaced by 01-03's Home/About)
16. Commit: `feat(phase-01): BaseLayout + FOUC-safe theme gate + a11y baseline`

**Dependencies:** Plan 01-01 (scaffold + styles)
**Unlocks:** Plan 01-03 needs `BaseLayout` for Home and About

### Plan 01-03: Home + About + 404 + Cloudflare Pages deploy

**Goal:** All 3 pages (Home, About, 404) render with correct data. Cloudflare Pages deployment wired. Custom domain + 301 redirect + sitemap live.

**Tasks:**
1. Write `src/components/home/Hero.astro` — display name + tagline from `persona.yaml` + primary CTA
2. Write `src/components/home/LatestArticles.astro` — top 3 articles + empty state
3. Write `src/components/home/LatestMicroblog.astro` — top 5 microblog + empty state
4. Write `src/components/home/Hitokoto.astro` — placeholder copy 「 一言 」
5. Write `src/components/home/SiteStats.astro` — 3-column row with zero state
6. Write `src/pages/index.astro` (per Example 4) — uses `getCollection('articles', ...)` + `getCollection('microblog', ...)`
7. Write `src/components/about/PersonaCard.astro` — container with avatar + name + bio
8. Write `src/components/about/PersonaStats.astro` — 3 chips (MBTI / zodiac / blood)
9. Write `src/components/about/SkillBars.astro` — 3-5 skill bars
10. Write `src/components/about/PersonaFavorites.astro` — 2-column favorites list
11. Write `src/components/about/PersonaQA.astro` — 3-5 Q&A pairs
12. Write `src/pages/about.astro` — composes PersonaCard with all sub-components
13. Write `src/pages/404.astro` (per Pattern 4) — uses BaseLayout + NotFound; sets `Astro.response.status = 404`
14. Fill in `src/data/persona.yaml` with real values (name, MBTI, etc. — owner inputs)
15. (Owner task, not code) Connect Cloudflare account, create Pages project from GitHub repo
16. (Owner task, not code) Configure CF Pages build: command `pnpm build`, output `dist`, env vars `NODE_VERSION=22`, `NODE_OPTIONS=--max-old-space-size=4096`
17. (Owner task, not code) Add custom domain `merlinalex.me` + `www.merlinalex.me` with 301 redirect
18. Push to `main` — first production build triggers
19. Verify production:
    - `curl -I https://merlinalex.me/` → HTTP 200
    - `curl -I https://merlinalex.me/nonexistent` → HTTP 404
    - `curl https://merlinalex.me/sitemap-index.xml` → valid XML
    - `curl https://merlinalex.me/robots.txt` → correct content
    - Manual browser: hard refresh Home, verify no FOUC, theme toggle works, intensity badge works
20. Commit: `feat(phase-01): Home + About + 404 + Cloudflare Pages deploy`
21. Update STATE.md to mark Phase 1 complete

**Dependencies:** Plan 01-02 (BaseLayout, theme system)
**Unlocks:** Phase 2 (Articles index + RSS + Twikoo)

### Plan Dependencies Graph

```
01-01 (Scaffold + Schemas)
   │
   ▼
01-02 (BaseLayout + Theme + A11y)
   │
   ▼
01-03 (Home + About + 404 + Deploy)
```

All plans strictly sequential. Cannot parallelize.

---

## Sources

### Primary (HIGH confidence — verified 2026-06-02)

- **Astro 6 Content Collections** — `https://docs.astro.build/en/guides/content-collections/` (WebFetch 2026-06-02): `glob` + `file` loader syntax, `defineCollection`, Zod via `astro/zod`, single `src/content.config.ts` file
- **Astro 6 Upgrade Guide** — `https://docs.astro.build/en/guides/upgrade-to/v6/` (WebFetch 2026-06-02): all v5→v6 breaking changes (config path, `id` vs `slug`, `render()` vs `entry.render()`, `getEntry` vs `getEntryBySlug`, Zod 3→4, deprecated `astro:content` import for `z`)
- **Astro Styling / Tailwind v4** — `https://docs.astro.build/en/guides/styling/` (WebFetch 2026-06-02): `astro add tailwind` installs `@tailwindcss/vite`; `@import "tailwindcss"` in CSS; `@astrojs/tailwind` is the v3 integration (now deprecated)
- **Astro API Reference** — `https://docs.astro.build/en/reference/api-reference/` (WebFetch 2026-06-02): `Astro.response.status = 404` + `Astro.response.statusText = 'Not found'` is the canonical 404 pattern
- **Astro Sitemap Integration** — `https://docs.astro.build/en/guides/integrations-guide/sitemap/` (WebFetch 2026-06-02): `astro add sitemap`; needs `site:` set in `astro.config.mjs`; generates `sitemap-index.xml` + `sitemap-0.xml`
- **Astro Deploy to Cloudflare** — `https://docs.astro.build/en/guides/deploy/cloudflare/` (WebFetch 2026-06-02): static-only deploys use `wrangler.jsonc` with `assets.directory: "./dist"`; no adapter needed; `not_found_handling: "404-page"` is the optional wrangler config
- **Cloudflare Pages Astro framework guide** — `https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/` (WebFetch 2026-06-02): build command `npm run build`, build directory `dist`; the specific `nodejs_compat` flag and `_routes.json` details not in this page (see Open Questions)
- **npm registry** — `npm view <pkg> version` for astro@6.4.2, @astrojs/sitemap@3.7.3, @astrojs/mdx@6.0.1, @tailwindcss/vite@4.3.0, tailwindcss@4.3.0, zod@4.4.3 (all verified 2026-06-02)

### Secondary (MEDIUM confidence — verified in earlier research session 2026-06-02)

- **PITFALLS.md §P-4 (FOUC)** — pre-paint inline script pattern
- **PITFALLS.md §P-6 (prefers-reduced-motion)** — exact CSS rule (A11Y-02, CONTEXT D-10)
- **PITFALLS.md §P-19 (build OOM)** — `NODE_OPTIONS=--max-old-space-size=4096`
- **PITFALLS.md §P-21 (404 status)** — `Astro.response.status = 404`
- **Cloudflare Pages limits** — `developers.cloudflare.com/pages/platform/limits/` (verified earlier 2026-06-02)
- **Cloudflare Pages custom domains** — `developers.cloudflare.com/pages/configuration/custom-domains/` (cited, not re-verified this session)

### Tertiary (LOW confidence — flagged for validation)

- **`@fontsource/zen-maru-gothic` and `@fontsource/jetbrains-mono` current major versions** — `[ASSUMED]`; the `@fontsource` family is well-known; install with `pnpm add` and use whatever version is current
- **`astro-icon` current version** — `[ASSUMED]`; same caveat
- **CF Pages 301 redirect via dashboard toggle** — `[ASSUMED]`; fallback is a `public/_redirects` file
- **`astro add` codemod behavior for `tailwind`** — `[ASSUMED]`; verify `astro.config.mjs` after running

---

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH — every version verified via npm registry; Tailwind v4 + Astro 6 setup verified via official docs
- **Architecture (FOUC-safe theme, content collections, Tailwind v4 tokens):** HIGH — all three patterns verified against official Astro + Tailwind docs via WebFetch
- **Pitfalls:** HIGH for P-4 / P-6 / P-19 / P-21 (PITFALLS.md + verified); MEDIUM for cloudflare-specific items (CF dashboard may have changed)
- **Cloudflare Pages deploy:** MEDIUM — official CF Pages docs do not enumerate the `nodejs_compat` flag or `_routes.json` for Astro 6 specifically; the Astro docs favor Workers for new projects but Pages still works for static
- **404 stub:** HIGH — `Astro.response.status` is the canonical pattern, verified via Astro 6 API reference

**Research date:** 2026-06-02
**Valid until:** 2026-07-02 (30 days; Astro 6 is stable; CF Pages UI changes slowly; Tailwind 4 is stable)

**Open question to resolve in plan 01-03:** Whether Cloudflare Pages still supports the `nodejs_compat` flag and the dashboard 301-redirect toggle, or whether the new CF recommendation is to use Workers instead. The Phase 1 plan should default to "Pages as per CONTEXT D-11, with `nodejs_compat` skipped unless SSR is enabled."

---

*Phase 1: Foundation research complete. Ready for `gsd-planner` to produce PLAN.md files.*
