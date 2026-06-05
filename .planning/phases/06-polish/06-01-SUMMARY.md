---
phase: 06-polish
plan: 01
subsystem: seo
tags: [json-ld, structured-data, 404, css-art, astro]

# Dependency graph
requires: []
provides:
  - Kawaii 404 page with CSS art mascot and random messages
  - Reusable JsonLd.astro component for structured data
  - Article + Person + BreadcrumbList JSON-LD on article pages
affects: [seo, search-results, user-experience]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS art mascot using pure CSS (border-radius, box-shadow)"
    - "Random message pool with DOMContentLoaded script"
    - "Reusable JSON-LD component accepting schema arrays"

key-files:
  created:
    - src/components/seo/JsonLd.astro
  modified:
    - src/components/core/NotFound.astro
    - src/pages/articles/[id].astro

key-decisions:
  - "CSS art mascot instead of external image for instant load and theme-awareness"
  - "JSON-LD script tags in body (not head) - Google allows both, avoids BaseLayout slot complexity"
  - "Filter undefined fields from schemas to avoid empty values in JSON-LD output"

patterns-established:
  - "CSS art pattern: use border-radius and box-shadow for kawaii characters"
  - "Random message pattern: DOMContentLoaded listener with message pool array"
  - "JSON-LD pattern: reusable component accepting schemas array, rendering one script tag per schema"

requirements-completed: [INFRA-06]

# Metrics
duration: 3min
completed: 2026-06-05
---

# Phase 6 Plan 01: Custom 404 + JSON-LD Summary

**Kawaii 404 page with CSS art mascot (blush spots, dot eyes, wavy mouth) + reusable JsonLd component emitting Article/Person/BreadcrumbList structured data on article pages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-05T12:17:16Z
- **Completed:** 2026-06-05T12:20:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Kawaii 404 page with pure CSS art mascot (round head, blush spots, dot eyes, wavy mouth, tiny body)
- 8 random Chinese messages that rotate on each page load
- Two navigation buttons: "回到首页" CTA + "返回上一页" with history.back() fallback
- Reusable JsonLd.astro component that accepts schema arrays and filters undefined fields
- Article pages now emit Article + Person + BreadcrumbList JSON-LD for rich search results

## Task Commits

Each task was committed atomically:

1. **Task 1: Build kawaii 404 page with CSS art mascot and random messages** - `90db522` (feat)
2. **Task 2: Create reusable JsonLd component and wire into article pages** - `2e06bbe` (feat)

## Files Created/Modified

- `src/components/core/NotFound.astro` - Kawaii 404 component with CSS art mascot, random messages, navigation buttons
- `src/components/seo/JsonLd.astro` - Reusable JSON-LD component accepting schemas array
- `src/pages/articles/[id].astro` - Article detail page with Article + Person + BreadcrumbList schemas

## Decisions Made

- **CSS art mascot over external image:** Loads instantly, theme-aware via CSS variables, no additional HTTP request
- **JSON-LD in body not head:** Google allows JSON-LD anywhere in document; placing in body avoids adding a head slot to BaseLayout
- **Undefined field filtering:** JsonLd component filters out undefined values before JSON.stringify to keep output clean

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 404 page is production-ready with kawaii styling
- JSON-LD structured data will help articles appear as rich results in Google Search
- Reusable JsonLd component can be extended to other page types (projects, creations) if needed

---

*Phase: 06-polish*
*Completed: 2026-06-05*
