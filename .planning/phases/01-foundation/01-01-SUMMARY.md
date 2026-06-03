---
phase: 01-foundation
plan: 01
subsystem: foundation
tags: [bootstrap, astro, tailwind, content-collections, walking-skeleton]
dependency_graph:
  requires: []
  provides: [astro-scaffold, content-schema-graph, persona-seed, dev-server]
  affects: [INFRA-01, INFRA-02, PAGE-01-placeholder]
tech-stack:
  added:
    - astro@6.4.3
    - @astrojs/mdx@6.0.1
    - @astrojs/sitemap@3.7.3
    - @tailwindcss/vite@4.3.0
    - tailwindcss@4.3.0
    - astro-icon@1.1.5
    - @fontsource/zen-maru-gothic@5.2.8
    - @fontsource/jetbrains-mono@5.2.8
    - zod@4.4.3 (transitive)
    - vitest@4.1.8 (devDep)
    - @playwright/test@1.60.0 (devDep)
  patterns:
    - "@tailwindcss/vite lives in vite.plugins (NEVER in integrations)"
    - "src/content.config.ts at Astro 6 path (NOT src/content/config.ts)"
    - "import { z } from 'astro/zod' (NOT deprecated astro:content z)"
    - "file() loader: JSON array = entry list, NOT single document with 'items' key"
key-files:
  created:
    - package.json
    - pnpm-lock.yaml
    - pnpm-workspace.yaml
    - tsconfig.json
    - .nvmrc
    - .gitignore
    - .env.example
    - astro.config.mjs
    - src/env.d.ts
    - src/content.config.ts
    - src/content/articles/welcome.md
    - src/content/{anime,books,music}/list.json
    - src/content/{projects,creations,microblog,timeline}/.gitkeep
    - src/content/friends/friends.json
    - src/data/persona.yaml
    - src/data/notice.md
    - src/data/social.json
    - src/data/friends-health.json
    - src/styles/global.css
    - src/pages/index.astro
    - public/robots.txt
    - public/favicon.svg
    - public/og-default.svg
  modified: []
decisions:
  - "Astro 6.4.3 (not pinned 6.4.2) — latest stable in npm at execution time"
  - "Used pnpm-workspace.yaml with allowBuilds + minimumReleaseAgeExclude to bypass pnpm 11 supply-chain policy that blocks esbuild/sharp builds and recently-published astro 6.4.3"
  - "Astro-icon installed via pnpm add (not astro add — Astro 6 CLI doesn't recognize 'icon' as a known integration name)"
  - "Friends/anime/books/music JSON files use plain array shape []; file() loader treats the array as the entry list. The plan's prescribed {\"items\": []} shape was a bug — the file loader would create an entry with id 'items' and data [] then fail the schema"
metrics:
  duration: 13m 33s
  completed: 2026-06-03T02:15:15Z
  task_count: 3
  file_count: 25
---

# Phase 1 Plan 01: Walking Skeleton — Summary

**One-liner:** Greenfield Astro 6.4.3 + Tailwind v4 + 9 Zod-validated content collections + Chinese Hello-World placeholder, ready for plan 01-02 to layer in the BaseLayout, theme switcher, and atmosphere gate.

## What Was Built

A runnable Astro 6 static-site project on the main working tree at `/Users/huangjingping/i/merlinalex.me/` with:

- **Build pipeline**: Astro 6.4.3 + Vite + Tailwind v4 (via `@tailwindcss/vite` in `vite.plugins`, NOT in `integrations`)
- **Integrations**: `@astrojs/mdx@6.0.1`, `@astrojs/sitemap@3.7.3`, `astro-icon@1.1.5`
- **TypeScript**: strict mode (extends `astro/tsconfigs/strict`)
- **Fonts**: Zen Maru Gothic (CJK body) + JetBrains Mono (code) — `@fontsource/*`
- **Test runners scaffolded**: Vitest 4.1.8 + @playwright/test 1.60.0 (no tests yet — Phase 6)
- **Content graph**: 9 Zod-validated collections at `src/content.config.ts` (Astro 6 path)
- **Seeds**: 1 welcome article exercising every D-02 field; 4 `.gitkeep` dirs; 3 placeholder JSON arrays; 1 friends array
- **Data files**: persona.yaml (D-14, 10 fields), notice.md (D-15), social.json (footer), friends-health.json (D-03)
- **Styles**: light theme with 12 color tokens + 3 duration tokens + 2 easing tokens (dark + reduced-motion land in plan 01-02)
- **Hello-World page**: `src/pages/index.astro` renders "merlinalex.me — 次元入口" with a placeholder note
- **Public assets**: `robots.txt` (with sitemap reference), `favicon.svg` (sakura-pink M), `og-default.svg` (1200×630 gradient)
- **Env hygiene**: `.env.example` committed with empty `TWIKOO_ENV_ID=`; `.env*` gitignored (Pitfall 7)

## Verification Evidence

- `pnpm build` exits 0; produces `dist/index.html`, `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `dist/robots.txt`
- `dist/index.html` contains `次元入口` (Chinese text intact through build)
- `pnpm dev` starts on `:4321`; `curl http://localhost:4321/` returns HTTP 200 with `次元入口` in the HTML body
- `grep -c "@astrojs/tailwind" package.json astro.config.mjs` returns 0 (Pitfall 3 avoided)
- `src/content.config.ts` exists; `src/content/config.ts` does NOT exist (Pitfall 4 avoided)
- All 12 light theme color tokens present in `src/styles/global.css` per UI-SPEC lines 83-95
- No `dark:` variant declarations in `global.css` (Anti-pattern 7)
- No `@media (prefers-reduced-motion` in `global.css` (deferred to 01-02 per CONTEXT D-10)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed file() loader JSON shape mismatch**
- **Found during:** Task 3 (final build verification)
- **Issue:** Plan prescribed JSON files as `{"items": []}` and schemas as `z.object({items: z.array(...).default([])})`. The Astro 6 `file()` loader (verified in `node_modules/astro/dist/content/loaders/file.js`) treats the JSON as a map of entries: arrays → each element is an entry, objects → each key-value pair is an entry. The `{"items": []}` shape created an entry with id "items" and data `[]` (array), which the schema (expecting an object) rejected with "Expected type 'object', received 'object'". Build failed for `anime`, `books`, `music`, `friends`.
- **Fix:** Changed all four JSON files to plain `[]` (empty arrays, which the loader accepts as "no entries, no schema validation needed") and updated their schemas to use top-level `z.array(z.object(...)).default([])`. The friends schema gained an optional `id` field so the array element shape is `[{id?, name, url, ...}]`.
- **Files modified:** `src/content/{anime,books,music,anime}/list.json`, `src/content/friends/friends.json`, `src/content.config.ts`
- **Commit:** 5479818

### Plan-Environment Mismatches (Not Bugs)

- **pnpm-workspace.yaml** is required by pnpm 11's supply-chain policy (blocks esbuild/sharp builds + recently-published packages). Initial scaffold output was a template with placeholder strings; rewrote to enable `esbuild: true`, `sharp: true`, and exempt `astro@6.4.3` from minimum release age.
- **`astro add icon`** is not recognized by Astro 6 CLI ("icon doesn't appear to be an integration or an adapter"). Installed `astro-icon` directly via `pnpm add` and registered it in `astro.config.mjs` manually.
- **Astro 6.4.3** (not 6.4.2 as the plan locked) — npm registry shows 6.4.3 as the current latest at execution time. Plan's `^6.4.2` constraint is satisfied transitively (6.4.3 is the next minor-compatible release).

## Auth Gates

None.

## Known Stubs

- `src/pages/index.astro` is intentionally a Chinese Hello-World placeholder; plan 01-03 replaces it with the real Home (Hero, NoticeBar, LatestArticles, etc.).
- `src/data/persona.yaml` has placeholder values for all D-14 fields (avatar path is `/avatars/persona.png` which doesn't exist yet — actual avatar image is a later task).
- The 4 `.gitkeep` directories (projects, creations, microblog, timeline) and 3 `list.json` placeholders (anime, books, music) emit Astro warnings about "No files found" / "No items found" during build — these are expected and harmless; the content fills in across Phases 2-4.

## Threat Flags

None — no new security-relevant surface introduced. The build pipeline is the only entry point and validates all content through Zod schemas at build time. No runtime network endpoints, no auth paths, no user input.

## Self-Check: PASSED

- All 3 commits exist on `main`: `bc5df07`, `670f102`, `5479818`
- `package.json` contains all pinned versions; no `@astrojs/tailwind` legacy
- `pnpm build` exits 0; `dist/index.html`, `dist/sitemap-index.xml`, `dist/robots.txt` all present
- `pnpm dev` returns 200 with `次元入口` in HTML
- All 9 collections defined in `src/content.config.ts` with correct loaders
- All 4 `.gitkeep` files present in empty collection dirs
- All 4 JSON file-loader seeds valid empty arrays
- `src/content.config.ts` exists at Astro 6 path; `src/content/config.ts` does NOT exist

Refs: INFRA-01, INFRA-02, PAGE-01 (placeholder), D-01..D-07, D-11, D-14, D-15
