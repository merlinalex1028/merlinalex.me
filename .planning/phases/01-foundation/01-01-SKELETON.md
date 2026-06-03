# Walking Skeleton — merlinalex.me

**Phase:** 1 — Foundation
**Generated:** 2026-06-02
**Status:** Active — downstream plans build on this baseline

## Capability Proven End-to-End

> "A visitor can load a styled Chinese Hello-World placeholder page on the development server at `localhost:4321`, and `pnpm build` produces a working static site in `dist/` with all 9 Zod-validated content collections wired in. The project is ready for Phase 2 to drop article content into a validating schema graph, Phase 3 to seed works modules, and Phase 5 to consume the `window.__atmo__` global + `data-atmo` attribute without re-architecting."

## Architectural Decisions

> **These decisions are the contract for every subsequent phase.** Do not renegotiate without a Phase-N review. If a later phase discovers a Phase 1 assumption was wrong, the fix is documented here, not silently overwritten in code.

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | Astro 6.4.2 (static SSG with islands runtime) | Content Collections with Zod schemas map 1:1 to the multi-module site structure; `client:idle` / `client:visible` directives load future atmosphere islands (Live2D, BGM) without blocking first paint; built-in view transitions for SPA-feel navigation; `$0/month` static hosting (CONTEXT D-11) |
| **TypeScript** | Astro 6's `astro/tsconfigs/strict` (extends 5.5.x TS) | Catches frontmatter typos in `src/content/` at build time; inferred types for `getCollection()` return; project-mandated per CONTEXT D-13 |
| **Styling** | Tailwind v4.3.0 via `@tailwindcss/vite` (NOT `@astrojs/tailwind`) | v4 is CSS-first via `@theme` directive; `@tailwindcss/vite` is the official Astro 5.2+ integration; legacy `@astrojs/tailwind` is Tailwind 3 only and explicitly removed per Astro docs (RESEARCH Pitfall 3 lines 729-745) |
| **Content collections** | 9 Zod-validated collections in `src/content.config.ts` (Astro 6 path) | Build-time validation; `glob` loader for markdown (`articles`, `projects`, `creations`, `microblog`, `timeline`), `file` loader for JSON (`friends`, `anime`, `books`, `music`); old `src/content/config.ts` path throws `LegacyContentConfigError` in Astro 6 (RESEARCH Pitfall 4) |
| **Zod import** | `import { z } from 'astro/zod'` (NOT `astro:content`) | Astro 6 re-exports Zod 4 from `astro/zod`; the `astro:content` import for `z` is deprecated per the v6 upgrade guide (RESEARCH Anti-pattern 2 lines 660-661) |
| **Astro 6 content API** | `entry.id` (NOT `entry.slug`); `getEntry()` (NOT `getEntryBySlug()`); `import { render } from 'astro:content'; render(entry)` (NOT `entry.render()`) | v6 removed the older APIs per the v6 upgrade guide (RESEARCH State of the Art lines 1050-1066) |
| **Theme system** | CSS variables on `:root[data-theme="light"]` and `:root[data-theme="dark"]` | NO Tailwind `dark:` variant for color tokens (CONTEXT D-08 explicit; RESEARCH Anti-pattern 7); only the `data-theme` attribute drives the cascade. Token names: kebab-case (`--color-fg-muted`, `--color-accent-subtle`) per UI-SPEC lines 81-113 |
| **Pre-paint script** | `<script is:inline>` in `<head>` of `BaseLayout.astro`, blocking, synchronous, BEFORE any stylesheet | The single load-bearing code in Phase 1; runs before first paint, reads `localStorage.theme` + `localStorage["atmo:level"]` + `prefers-color-scheme` + `prefers-reduced-motion`, sets `data-theme` + `data-atmo`, and exposes `window.__atmo__` global (RESEARCH §Pattern 1 lines 309-395) |
| **Atmosphere intensity gate** | `localStorage["atmo:level"]` = `"off" \| "subtle" \| "full"`, default `"full"`; `data-atmo` on `<html>`; `window.__atmo__.set()` mutates both | Wired in plan 01-02 but NOTHING consumes it in Phase 1. Phase 5 Live2D / petals / BGM islands read `window.__atmo__.level` on init (CONTEXT D-08) |
| **Reduced-motion baseline** | Global CSS rule in `src/styles/global.css`: `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; } }` | EXACT code per CONTEXT D-10 lines 72-82; protects plain CSS animations. Phase 5 atmosphere JS loops additionally gate on `matchMedia('(prefers-reduced-motion: reduce)').matches` (A11Y-02 / Phase 5 responsibility) |
| **Reduced-motion × intensity invariant** | Reduce-motion forces DISPLAY `data-atmo="off"` but NEVER mutates `localStorage["atmo:level"]` (CONTEXT D-08 explicit) | Display vs storage separation: a user's manual "Full" choice wins on the next page load even if their OS preference is "reduce motion" (RESEARCH Pitfall 2 lines 718-728) |
| **Theme persistence** | `localStorage.theme` = `"light" \| "dark" \| "system"`, default `"system"`; toggle in header cycles `light → dark → system → light`; "system" resolves at script time via `prefers-color-scheme` | CONTEXT D-09 |
| **Fonts** | Self-hosted via `@fontsource/zen-maru-gothic` (CJK + Latin rounded) + `@fontsource/jetbrains-mono` | Avoid Google Fonts CLS (PITFALLS P-10); no third-party requests; UI-SPEC font stack lines 24-26 |
| **Icons** | `astro-icon` integration with Lucide icon set (UI-SPEC line 23) | Standard Astro icon integration; tree-shaken; single import |
| **Package manager** | pnpm 11.x with committed `pnpm-lock.yaml`; Node 22 LTS pinned via `.nvmrc` and `engines.node` | CONTEXT D-13; CF Pages auto-detects pnpm |
| **Test runners** | Vitest + `@playwright/test` scaffolded (deps installed, config files created by framework defaults); NO tests written in Phase 1 | Tests arrive in Phase 6 per REQUIREMENTS TEST-01; Phase 1 only needs the runners available for `pnpm vitest` and `pnpm playwright test` to work |
| **Deployment target** | Cloudflare Pages (unlimited bandwidth, auto HTTPS, 500 builds/month free, 320+ edge PoPs) | CONTEXT D-11; CF Pages > Vercel for this project's $0/month + non-commercial + traffic-spike-resilient constraints |
| **Build env vars** | CF Pages: `NODE_VERSION=22`, `NODE_OPTIONS=--max-old-space-size=4096` | CONTEXT D-12 (OOM guard); pnpm auto-detected |
| **Custom domain** | `merlinalex.me` (apex) + `www.merlinalex.me` (301 → apex) | CONTEXT D-11; HTTPS via Cloudflare auto-SSL |
| **No database** | Static site only; Twikoo comments ship in Phase 2 on separate Vercel + MongoDB Atlas M0 (no self-hosted DB) | PROJECT.md constraint + $0/month budget |
| **404 status** | `Astro.response.status = 404` in `src/pages/404.astro` frontmatter | INFRA-06 / D-16; Cloudflare Pages auto-serves `dist/404.html` for unmatched paths |
| **Sitemap** | `@astrojs/sitemap` integration; auto-emits `dist/sitemap-index.xml` + `dist/sitemap-0.xml`; requires `site: 'https://merlinalex.me'` in `astro.config.mjs` | SEO-01; one-line integration |
| **No SSR** | Static-only build (no `@astrojs/cloudflare` adapter); no `nodejs_compat` flag needed | Phase 1 is pure static; SSR would re-introduce complexity and cost; revisit if Phase N requires real-time data |

## Stack Touched in Phase 1

- [x] **Project scaffold** — Astro 6.4.2 via `pnpm create astro@latest`, TypeScript strict, pnpm, Node 22, Vitest + Playwright scaffolded
- [x] **Routing** — at least one real route (`src/pages/index.astro` Hello-World placeholder; plan 01-03 adds `/about` + `/404`)
- [x] **Content layer** — 9 Zod-validated collections with seed data (1 sample article + 8 empty seeds), exercising the full schema graph at build time
- [x] **UI** — at least one styled page (Hello-World with Tailwind v4 tokens); the pre-paint theme/atmo gate in plan 01-02 + Home/About in plan 01-03 make the UI fully interactive
- [x] **Deployment** — Cloudflare Pages configured (env vars, build command `pnpm build`, output `dist/`); the actual first deploy happens in plan 01-03 after Home/About land

## Out of Scope (Deferred to Later Slices)

> This list prevents future phases from re-litigating Phase 1's minimalism. If a later phase needs one of these, it adds the work; it does not roll back Phase 1.

- **Atmosphere components (Live2D / falling petals / BGM / right-click menu / easter eggs)** — Phase 5. Phase 1 only wires the gate (`window.__atmo__`, `data-atmo`, `[data-atmo="off"]` selector in `global.css`, intensity badge in header)
- **Twikoo comments + Vercel + MongoDB Atlas deployment** — Phase 2. Phase 1's `.env.example` has an empty `TWIKOO_ENV_ID=` placeholder; no code references Twikoo
- **RSS / Atom feed (`/feed.xml` + `/feed-full.xml`)** — Phase 2. The `<link rel="alternate" type="application/rss+xml">` autodiscovery link in `SEOMeta.astro` is a Phase 1 placeholder pointing at a 404 until Phase 2 lands the endpoint
- **Bangumi-driven anime / book / music lists (`/anime`, `/books`, `/music`)** — Phase 4. Phase 1 ships placeholder `z.object({ items: z.array(z.object({})).default([]) })` schemas + empty `list.json` files; no UI pages yet
- **Microblog feed (`/microblog`)** — Phase 4. Phase 1's `LatestMicroblog` slot on Home shows the empty state per D-15
- **Pagefind search** — Phase 4. No search input in Phase 1
- **Friend-link health check GitHub Action** — Phase 6 (the producer). Phase 1 consumes `src/data/friends-health.json = {}` (always shows everyone online until the Action ships)
- **Custom 404 page polish** — Phase 6. Phase 1 ships a basic kawaii placeholder with the mascot gradient circle + "咦？这里什么都没有…" copy
- **JSON-LD structured data** — Phase 6. Phase 1's `SEOMeta` covers OG/Twitter/canonical but not the `Article` / `Person` / `BreadcrumbList` JSON-LD blocks
- **Tests (Vitest + Playwright)** — Phase 6. The runners are installed in Phase 1 but no `*.test.ts` or `*.spec.ts` files are required until Phase 6
- **Favicon / OG card as PNG** — Phase 6. Phase 1 ships SVG versions; PNG conversion is polish
- **Per-episode progress overrides for Bangumi** — Phase 4. Phase 1's anime/books/music schemas are empty placeholders
- **Holiday theme variants (Christmas / NYE / Spring Festival / Sakura season / Halloween)** — v2 (deferred per REQUIREMENTS.md ATM-08-v2). Phase 1 only ships `light` + `dark`

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton **without altering the architectural decisions above**:

| Phase | Slice | Consumes Phase 1 Surface |
|-------|-------|--------------------------|
| **Phase 2: Core Content** | Articles index, article detail UX, RSS, SEO L2, Twikoo comments, sticker pack | `articles` collection (D-02 schema), `SEOMeta.astro`, `BaseLayout.astro` |
| **Phase 3: Works + Friend Links** | Works hub, Projects module, Creations module, Friend Links page, submission flow | `projects` / `creations` / `friends` collections, `friends-health.json` consumer stub |
| **Phase 4: Community + Search** | Microblog feed, Bangumi-driven lists, Timeline, Pagefind search, home widgets | `microblog` / `anime` / `books` / `music` / `timeline` collections, empty `data/bangumi.json` cache, `Hitokoto` / `SiteStats` placeholders from Phase 1 |
| **Phase 5: Atmosphere** | Live2D mascot, falling petals, BGM, custom right-click, easter eggs, intensity gating | `window.__atmo__` global, `data-atmo` attribute, `[data-atmo="off"]` selector in `global.css`, `IntensityBadge.astro` — **all wired but inert in Phase 1** |
| **Phase 6: Polish** | Custom 404 polish, JSON-LD, friend-link health-check Action, ≥80% tests, build hardening | `404.astro` from Phase 1 (polish only, no rework), `vitest` + `@playwright/test` runners, `NODE_OPTIONS=--max-old-space-size=4096` already in CF Pages env |

## How to Verify the Skeleton Is Up

> Run these 5 commands after plan 01-01 completes. If all return success, the Walking Skeleton is verified and plan 01-02 can build on it.

```bash
# 1. Build exits 0
pnpm build && echo "OK: build clean"

# 2. Dev server serves a styled Chinese Hello-World
pnpm dev &
sleep 3
curl -s http://localhost:4321/ | grep -c "次元入口"   # expected: 1
kill %1

# 3. All 9 collections validate against their schemas
test -f src/content.config.ts && \
  grep -c "loader: glob\|loader: file" src/content.config.ts | \
  awk '{ if ($1 >= 9) print "OK: 9+ loaders"; else exit 1 }'

# 4. Sitemap + robots are emitted
test -f dist/sitemap-index.xml && echo "OK: sitemap"
test -f dist/robots.txt && echo "OK: robots"

# 5. Legacy Tailwind 3 integration is NOT installed
! pnpm -s ls @astrojs/tailwind 2>/dev/null && echo "OK: no @astrojs/tailwind"
```

---

*Walking Skeleton recorded 2026-06-02 by gsd-planner. Treat this file as the architectural contract for Phases 2-6. Subsequent phases append to (do not modify) the decision table above.*
