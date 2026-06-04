---
phase: 04-community-search
plan: 04
subsystem: community-search
tags: [search, archive, hitokoto, site-stats, pagefind]
depends_on: [04-01]
provides: [search-bar, tag-cloud, archive-page, hitokoto-widget, site-stats-widget, word-count-utility]
affects: [header, home-page, archive-page]
tech_stack:
  added: [astro-pagefind]
  patterns: [pagefind-web-component, client-side-api-fetch, busuanzi-visitor-count, cjk-word-count]
key_files:
  created:
    - src/components/search/SearchBar.astro
    - src/components/archive/TagCloud.astro
    - src/components/archive/ArchiveList.astro
    - src/pages/archive.astro
    - src/utils/word-count.ts
  modified:
    - astro.config.mjs
    - src/components/core/Header.astro
    - src/components/home/Hitokoto.astro
    - src/components/home/SiteStats.astro
    - src/pages/index.astro
    - package.json
decisions:
  - "Use textContent (never innerHTML) for Hitokoto API response to prevent XSS"
  - "Defer Hitokoto fetch via requestIdleCallback to not block first paint"
  - "Filter tags with count <= 1 from tag cloud per D-06 design decision"
  - "Busuanzi CDN loaded async for visitor count"
metrics:
  duration: ~5m
  completed: "2026-06-04T05:25:00Z"
  tasks: 2
  files: 12
---

# Phase 04 Plan 04: Search + Tag Cloud + Home Widgets Summary

Pagefind-powered article search in header, tag cloud archive with chronological list, Hitokoto random quote, site stats with busuanzi visitors, and CJK-aware word count utility.

## Tasks Completed

### Task 1: Pagefind search + tag cloud + archive page
**Commit:** `67032ed`

- Installed `astro-pagefind` (added to package.json; requires `pnpm install`)
- Configured Pagefind integration in `astro.config.mjs`
- Created `SearchBar.astro` with `<pagefind-searchbox>` web component, `/` keyboard shortcut, themed CSS
- Created `TagCloud.astro` with percentile-based font scaling (14-28px), tags with count <= 1 filtered out
- Created `ArchiveList.astro` with year-grouped chronological article list
- Created `/archive` page combining TagCloud and ArchiveList
- Wired SearchBar into Header before ThemeSwitcher

### Task 2: Hitokoto + SiteStats home widget upgrades + word count utility
**Commit:** `5e4714b`

- Upgraded Hitokoto to fetch from `v1.hitokoto.cn` API client-side
- Used `textContent` (never innerHTML) for API response insertion (T-04-04-01 mitigation)
- Added `requestIdleCallback` to defer fetch after first paint
- Silent failure keeps placeholder text if API unavailable (T-04-04-03 mitigation)
- Created `word-count.ts` with CJK-aware counting (individual CJK chars + whitespace split)
- Upgraded SiteStats: runtime days since 2026-06-01, busuanzi visitor count, 4-col responsive grid
- Wired `totalWords` computation in `index.astro` from all article bodies

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] pnpm install blocked**
- **Found during:** Task 1 verification
- **Issue:** Could not run `pnpm add astro-pagefind` or `pnpm install` due to bash permission restrictions
- **Fix:** Manually added `astro-pagefind: ^2.0.0` to package.json dependencies
- **User action required:** Run `pnpm install` to install the package before building
- **Files modified:** package.json

**2. [Rule 3 - Blocking] Build verification skipped**
- **Found during:** Task 1 verification
- **Issue:** Cannot run `pnpm exec astro build` without installed dependencies
- **User action required:** Run `pnpm install && pnpm exec astro build` to verify the build succeeds

## Known Stubs

None — all widgets are fully wired with data sources.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| T-04-04-01 mitigated | Hitokoto.astro | External API response inserted via textContent (not innerHTML) |
| T-04-04-02 accepted | SiteStats.astro | Busuanzi CDN script loaded async, HTTPS URL |
| T-04-04-03 mitigated | Hitokoto.astro | try/catch with silent fallback to placeholder text |

## Verification Checklist

- [ ] `pnpm install` succeeds (user must run manually)
- [ ] `pnpm exec astro build` succeeds (user must run manually)
- [ ] Pagefind index generated in `dist/pagefind/`
- [ ] `/archive/index.html` exists in dist
- [ ] Hitokoto API fetch present in rendered HTML
- [ ] Busuanzi script tag present in rendered HTML
- [ ] Search input visible in header
- [ ] Tag cloud renders with sized tags

## Self-Check: PARTIAL

- CREATED: src/components/search/SearchBar.astro
- CREATED: src/components/archive/TagCloud.astro
- CREATED: src/components/archive/ArchiveList.astro
- CREATED: src/pages/archive.astro
- CREATED: src/utils/word-count.ts
- MODIFIED: astro.config.mjs (pagefind integration)
- MODIFIED: src/components/core/Header.astro (SearchBar wired)
- MODIFIED: src/components/home/Hitokoto.astro (API fetch)
- MODIFIED: src/components/home/SiteStats.astro (runtime + busuanzi)
- MODIFIED: src/pages/index.astro (totalWords computation)
- MODIFIED: package.json (astro-pagefind dependency)
- COMMIT 67032ed: FOUND
- COMMIT 5e4714b: FOUND
- BLOCKED: Build verification requires `pnpm install` first
