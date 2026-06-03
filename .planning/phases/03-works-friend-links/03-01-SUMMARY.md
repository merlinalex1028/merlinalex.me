---
phase: 03-works-friend-links
plan: 01
subsystem: ui
tags: [astro, works, projects, github-api, breadcrumb, vitest]

requires:
  - phase: 01-foundation
    provides: BaseLayout, content collection schemas, CSS variables, astro-icon
  - phase: 02-core-content
    provides: TagChips pattern, ArticleListItem card pattern, lightbox pattern

provides:
  - Works hub page with two equal-width cards (Projects + Creations)
  - Projects listing page with rich cards (cover, name, description, tech tags, GitHub stars)
  - Build-time GitHub stars fetch script with graceful degradation
  - Breadcrumb navigation component
  - Enabled nav links for Works and Friends

affects: [03-02-creations, 03-03-friends]

tech-stack:
  added: [vitest, @astrojs/check]
  patterns: [build-time API fetch with cache, TDD for utility scripts]

key-files:
  created:
    - src/pages/works/index.astro
    - src/pages/works/projects/index.astro
    - src/components/works/WorksHubCard.astro
    - src/components/works/ProjectCard.astro
    - src/components/works/Breadcrumb.astro
    - src/scripts/fetch-github-stars.ts
    - src/data/github-stars.json
    - src/content/projects/sample-project.mdx
    - src/scripts/__tests__/fetch-github-stars.test.ts
    - vitest.config.ts
  modified:
    - src/components/core/Nav.astro

key-decisions:
  - "Used CSS columns for masonry (deferred to Plan 03-02)"
  - "GitHub stars cached to JSON with 24h freshness check"
  - "TDD for fetchGitHubStars utility; component tests deferred"

patterns-established:
  - "Build-time API fetch: read content files, extract URLs, fetch, write JSON cache"
  - "Breadcrumb component: reusable nav with aria-label and current page indicator"
  - "Project card pattern: cover + name + description + tags + badge"

requirements-completed: [PAGE-05, PAGE-06]

duration: 4min
completed: 2026-06-03
---

# Phase 03 Plan 01: Works Hub + Projects Summary

**Works hub landing page with two portal cards and Projects module with build-time GitHub stars caching via TDD-tested fetch script**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-03T11:40:20Z
- **Completed:** 2026-06-03T11:44:45Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Works hub page with two equal-width cards linking to Projects and Creations
- Projects listing page with rich cards showing cover, description, tech tags, and GitHub stars badge
- Build-time GitHub stars fetch script with 24h cache and graceful degradation
- Breadcrumb navigation component with aria accessibility
- Enabled "作品" and "友人" nav links

## Task Commits

Each task was committed atomically:

1. **Task 1: Works hub page + Breadcrumb + WorksHubCard + Nav + sample content** - `2ddca98` (feat)
2. **Task 2: Projects page + ProjectCard + GitHub stars fetch script** - `e1bbcc7` (test, RED) + `acd473d` (feat, GREEN)

**Plan metadata:** [pending] (docs: complete plan)

## Files Created/Modified
- `src/pages/works/index.astro` - Works hub page with two portal cards
- `src/pages/works/projects/index.astro` - Projects listing with responsive grid
- `src/components/works/WorksHubCard.astro` - Hub card with icon, title, description, hover animation
- `src/components/works/ProjectCard.astro` - Rich project card with cover, tags, GitHub stars badge
- `src/components/works/Breadcrumb.astro` - Reusable breadcrumb navigation
- `src/scripts/fetch-github-stars.ts` - Build-time GitHub API fetch with cache
- `src/scripts/__tests__/fetch-github-stars.test.ts` - TDD tests for fetch script
- `src/data/github-stars.json` - Empty initial cache file
- `src/content/projects/sample-project.mdx` - Sample project content
- `src/components/core/Nav.astro` - Enabled works and friends nav links
- `vitest.config.ts` - Vitest configuration

## Decisions Made
- GitHub stars cached to JSON with 24h freshness check to avoid rate limits
- TDD approach for fetchGitHubStars utility (8 tests covering extraction, fetch, degradation)
- Component tests deferred to Phase 6 polish (Astro components harder to unit test)
- Breadcrumb uses semantic `<nav aria-label="面包屑">` for accessibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- `@astrojs/check` was not installed; added as dev dependency during verification
- Pre-existing type errors in `persona.yaml` imports and `feed-full.xml.ts` URL type (not from this plan's changes)

## Known Stubs

None - all implemented functionality is wired and functional.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| T-03-01 mitigated | src/scripts/fetch-github-stars.ts | GITHUB_TOKEN read from process.env only, never written to JSON or client bundle |
| T-03-02 mitigated | src/components/works/ProjectCard.astro | All external links use target="_blank" rel="noopener noreferrer" |

## User Setup Required

None - no external service configuration required. GitHub stars fetch works without GITHUB_TOKEN (unauthenticated, <60 repos limit).

## Next Phase Readiness
- Works hub and Projects module complete
- Ready for Plan 03-02 (Creations gallery) and Plan 03-03 (Friend links)
- Breadcrumb component available for reuse on sub-pages

---
*Phase: 03-works-friend-links*
*Completed: 2026-06-03*

## Self-Check: PASSED

- All 10 created files verified present
- All 3 task commits verified in git log
