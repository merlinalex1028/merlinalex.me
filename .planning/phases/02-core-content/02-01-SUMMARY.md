---
phase: 02-core-content
plan: 01
subsystem: ui
tags: [astro, articles, tag-filtering, reading-time, content-collections]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "BaseLayout, Nav, content collections, CSS design tokens, LatestArticles component"
provides:
  - Articles index page with tag-based static filtering
  - CJK-aware reading time calculator
  - Tag extraction utility for article collections
  - Related posts scoring algorithm
  - TagChips, ArticleListItem, StickyBadge components
  - Nav articles link enabled
affects: [02-02, 02-03]

# Tech tracking
tech-stack:
  added: [@astrojs/rss, markdown-it, sanitize-html]
  patterns: [getStaticPaths for tag filtering, CJK regex for reading time, tag-overlap scoring for related posts]

key-files:
  created:
    - src/utils/reading-time.ts
    - src/utils/tag-extraction.ts
    - src/utils/related-posts.ts
    - src/components/articles/TagChips.astro
    - src/components/articles/ArticleListItem.astro
    - src/components/articles/StickyBadge.astro
    - src/pages/articles/[...tag].astro
  modified:
    - src/components/core/Nav.astro

key-decisions:
  - "Used [...tag] rest parameter instead of [tag] + index.astro for cleaner single-file tag routing"
  - "Installed @astrojs/rss, markdown-it, sanitize-html early per PATTERNS.md dependency audit"

patterns-established:
  - "Tag filtering via getStaticPaths with rest parameter for static tag pages"
  - "Sticky-first then date-descending sort for article lists"
  - "Category pill with accent-subtle background pattern"

requirements-completed: [PAGE-03, PAGE-04]

# Metrics
duration: 6min
completed: 2026-06-03
---

# Phase 02 Plan 01: Articles Index + Utilities Summary

**Articles index page with tag-based filtering, CJK reading time calculator, tag extraction, and related posts scoring**

## Performance

- **Duration:** 6 min
- **Started:** 2026-06-03T08:28:45Z
- **Completed:** 2026-06-03T08:34:55Z
- **Tasks:** 2
- **Files created/modified:** 11

## Accomplishments
- Articles index page at /articles with tag chip filtering via static generation
- Three utility modules (reading-time, tag-extraction, related-posts) with 17 passing tests
- Sticky articles float to top of list, sorted by date within each group
- Nav "文章" link enabled for navigation

## Task Commits

Each task was committed atomically:

1. **Task 1: Utility Modules + Tests** - `1b9cd00` (test) + `98b56dc` (chore)
2. **Task 2: Articles Index Page + Components + Nav** - `90457d7` (feat)

## Files Created/Modified
- `src/utils/reading-time.ts` - CJK-aware reading time calculator (400 CJK chars/min, 200 words/min)
- `src/utils/tag-extraction.ts` - Unique sorted tag extraction from article collection
- `src/utils/related-posts.ts` - Tag-overlap scoring with recent-article fallback
- `src/utils/__tests__/reading-time.test.ts` - 7 tests for reading time
- `src/utils/__tests__/tag-extraction.test.ts` - 5 tests for tag extraction
- `src/utils/__tests__/related-posts.test.ts` - 5 tests for related posts
- `src/components/articles/TagChips.astro` - Horizontal scrollable tag filter bar
- `src/components/articles/ArticleListItem.astro` - Single-row article card with category pill
- `src/components/articles/StickyBadge.astro` - "置顶" pill for sticky articles
- `src/pages/articles/[...tag].astro` - Articles index with getStaticPaths tag routing
- `src/components/core/Nav.astro` - Enabled articles link (removed disabled: true)

## Decisions Made
- Used `[...tag]` rest parameter instead of separate `[tag].astro` + `index.astro` files for cleaner single-file tag routing
- Installed RSS dependencies (@astrojs/rss, markdown-it, sanitize-html) early per PATTERNS.md dependency audit

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Changed route file from index.astro to [...tag].astro**
- **Found during:** Task 2 (Articles index page)
- **Issue:** `getStaticPaths` in `index.astro` caused "Cannot read properties of undefined" error — Astro doesn't pass props to index routes via getStaticPaths
- **Fix:** Renamed to `[...tag].astro` using rest parameter pattern; `undefined` tag generates `/articles`, string tag generates `/articles/{tag}`
- **Files modified:** src/pages/articles/[...tag].astro
- **Verification:** Build succeeds, generates /articles/index.html and /articles/notes/index.html
- **Committed in:** 90457d7

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Fix necessary for correct static generation. No scope creep.

## Issues Encountered
None beyond the route file naming deviation above.

## Known Stubs
None — all components are fully wired with real data from content collections.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Utility modules ready for article detail page (Plan 02-02) to consume
- RSS dependencies installed for feed generation
- Articles index page establishes the pattern for other collection pages

## Self-Check: PASSED

All 7 created files verified present. All 3 task commits verified in git log.

---
*Phase: 02-core-content*
*Completed: 2026-06-03*
