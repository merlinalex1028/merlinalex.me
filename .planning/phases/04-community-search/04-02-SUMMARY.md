---
phase: 04-community-search
plan: 02
subsystem: bangumi
tags: [bangumi, anime, books, music, content-collections, prebuild]
requires: []
provides: [bangumi-utility, bangumi-pages]
affects: [content.config.ts, package.json, .env.example]
tech_stack:
  added: []
  patterns: [bangumi-api-v0, prebuild-script, client-side-filtering]
key_files:
  created:
    - src/utils/bangumi.ts
    - src/utils/__tests__/bangumi.test.ts
    - src/scripts/fetch-bangumi.ts
    - src/components/bangumi/BangumiCard.astro
    - src/components/bangumi/BangumiStatusTabs.astro
    - src/pages/anime.astro
    - src/pages/books.astro
    - src/pages/music.astro
    - src/data/bangumi-override.json
  modified:
    - src/content.config.ts
    - .env.example
    - package.json
decisions:
  - "Bangumi API v0 used for collection data (anime=2, book=1, music=3 subject types)"
  - "12h TTL cache via file mtime — skip API fetch when fresh"
  - "Manual overrides merged by subjectId, override wins"
  - "Client-side tab filtering (no page reload) using data attributes"
  - "Prebuild script writes directly to content collection JSON files"
  - "Graceful fallback: empty arrays when BANGUMI_USERNAME not set or API fails"
metrics:
  duration_minutes: 8
  completed_date: "2026-06-04"
  tasks_completed: 2
  tasks_total: 2
  files_created: 9
  files_modified: 3
---

# Phase 04 Plan 02: Bangumi Lists Summary

Bangumi-driven anime/book/music lists with build-time API fetch, 12h cache, manual overrides, and client-side status filtering.

## Tasks Completed

### Task 1: Bangumi fetch utility with TDD + content schema + prebuild script [test / feat]

**TDD gates:**
- RED: 11 failing tests for fetchBangumiData, readCache, mergeOverrides, writeCollectionFiles, BANGUMI_TYPES
- GREEN: All 11 tests passing

**What was built:**
- `src/utils/bangumi.ts`: BangumiItem interface, BANGUMI_TYPES constant, fetchBangumiData (paginated API with User-Agent), readCache (12h staleness), mergeOverrides (subjectId merge), writeCollectionFiles
- `src/scripts/fetch-bangumi.ts`: Prebuild script that fetches data, merges overrides, writes to content collection JSON files
- `src/content.config.ts`: Updated anime/books/music schemas with bangumiItemSchema Zod validation
- `src/data/bangumi-override.json`: Empty override template
- `.env.example`: Added BANGUMI_USERNAME
- `package.json`: Added bangumi:refresh and prebuild scripts

**Commits:**
- `test(04-02): add failing tests for bangumi fetch utility` — 5130e6b
- `feat(04-02): implement bangumi fetch utility and prebuild script` — 6d7d84e

### Task 2: BangumiCard + StatusTabs + anime/books/music pages [auto]

**What was built:**
- `src/components/bangumi/BangumiCard.astro`: Card with cover image, title, score badge, progress text, status tag, hover effect
- `src/components/bangumi/BangumiStatusTabs.astro`: Tab filter with 全部/在看/看过/想看, client-side click handler
- `src/pages/anime.astro`: Card grid sorted by status, empty state, excluded from Pagefind
- `src/pages/books.astro`: Same pattern with 在读/读过/想读 labels
- `src/pages/music.astro`: Same pattern with 在听/听过/想听 labels

**Commit:**
- `feat(04-02): add BangumiCard, StatusTabs, and anime/books/music pages` — 532f1cd

## Verification

- Unit tests: 11/11 passing (src/utils/__tests__/bangumi.test.ts)
- Build verification: Blocked by permission — needs manual `pnpm exec astro build` check
- Output files: /anime, /books, /music pages created with responsive card grid

## Key Decisions

1. **Bangumi API v0**: Uses public collection endpoint, no auth needed for read-only
2. **12h cache TTL**: File mtime-based staleness check, skip API when fresh
3. **Override merge**: Manual overrides in bangumi-override.json take priority by subjectId
4. **Client-side filtering**: Pure CSS/JS tab filtering, no page reload, no framework
5. **Content collection bridge**: Prebuild script writes JSON files that file() loader reads
6. **Graceful degradation**: Empty arrays when API unavailable or BANGUMI_USERNAME not set

## Known Stubs

- Build verification not run (permission blocked) — needs manual `pnpm exec astro build`

## Deviations from Plan

None — plan executed as written.

## Auth Gates

None — Bangumi API public endpoints require no authentication.
