---
phase: 02-core-content
plan: 03
subsystem: rss
tags: [rss, astrojs/rss, markdown-it, sanitize-html, seo, autodiscovery]

requires:
  - phase: 01-foundation
    provides: BaseLayout, SEOMeta, Footer, content collections, astro.config.mjs site URL
  - phase: 02-core-content/01
    provides: article schema, welcome.md content
  - phase: 02-core-content/02
    provides: article detail page, RelatedPosts component

provides:
  - Summary RSS feed at /feed.xml (RSS 2.0, draft-excluded)
  - Full-content RSS feed at /feed-full.xml (sanitized HTML via sanitize-html)
  - RSS autodiscovery via <link rel="alternate"> in every page head
  - RSS icon link in Footer with dual feed links
  - Absolute URL conversion for images in full-content feed

affects: [03-works, 04-community, 06-polish]

tech-stack:
  added: []
  patterns: [rss-endpoint-pattern, sanitize-html-content-rendering]

key-files:
  created:
    - src/pages/feed.xml.ts
    - src/pages/feed-full.xml.ts
    - src/components/rss/RSSLink.astro
  modified:
    - src/components/seo/SEOMeta.astro
    - src/components/core/Footer.astro

key-decisions:
  - "RSS feeds use @astrojs/rss official integration (proven, well-documented)"
  - "Full-content feed uses markdown-it + sanitize-html for safe HTML rendering"
  - "Tags excluded from RSS categories per D-03 (tags are site-internal); only category field used"
  - "Relative image URLs converted to absolute in full-content feed for feed reader compatibility"

patterns-established:
  - "RSS endpoint pattern: GET function with getCollection + sort + rss() call"
  - "Content sanitization: sanitize-html with allowedTags concat for img elements"
  - "Absolute URL conversion: regex replacement on rendered HTML for feed consumers"

requirements-completed: [DISC-01, SEO-02]

duration: 3min
completed: 2026-06-03
---

# Phase 2 Plan 03: RSS Feeds + Autodiscovery Summary

**Summary + full-content RSS feeds with autodiscovery, sanitized HTML rendering, and footer RSS link**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-03T08:50:01Z
- **Completed:** 2026-06-03T08:53:32Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Created two RSS feed endpoints: summary (`/feed.xml`) and full-content (`/feed-full.xml`)
- Full-content feed renders article markdown to sanitized HTML with absolute image URLs
- RSS autodiscovery links added to every page's `<head>` via SEOMeta
- RSS icon link component added to Footer with dual feed links
- Draft articles excluded from both feeds

## Task Commits

Each task was committed atomically:

1. **Task 1: RSS Feeds with Autodiscovery** - `a1140ab` (feat)
2. **Task 2: RSS Validation + Alt Text Enforcement** - verification-only, no code changes needed

**Plan metadata:** (docs commit pending)

## Files Created/Modified
- `src/pages/feed.xml.ts` - Summary RSS feed endpoint using @astrojs/rss
- `src/pages/feed-full.xml.ts` - Full-content RSS feed with markdown-it + sanitize-html
- `src/components/rss/RSSLink.astro` - RSS icon link component with dual feed links
- `src/components/seo/SEOMeta.astro` - Added full-content feed autodiscovery link
- `src/components/core/Footer.astro` - Added RSSLink component import and usage

## Decisions Made
- Used @astrojs/rss official integration (proven, well-documented, handles CDATA escaping)
- Tags excluded from RSS categories per D-03 decision (tags are site-internal, only category field used)
- Relative image URLs converted to absolute via regex replacement in full-content feed
- sanitize-html configured with `allowedTags.concat(['img'])` to preserve images in full content

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all RSS functionality is fully wired.

## Next Phase Readiness
- RSS feeds ready for production use
- Feed validation can be done at https://validator.w3.org/feed/ during development
- Next plans can reference RSS feeds for cross-linking

---
*Phase: 02-core-content*
*Completed: 2026-06-03*
