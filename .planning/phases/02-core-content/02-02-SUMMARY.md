---
phase: 02-core-content
plan: 02
subsystem: ui
tags: [astro, medium-zoom, intersection-observer, clipboard-api, prose-styling]

requires:
  - phase: 01-foundation
    provides: BaseLayout, CSS variables, theme system, content collections
  - phase: 02-core-content
    provides: reading-time util, related-posts util, articles collection schema

provides:
  - Article detail page with full reading experience
  - TOC sidebar with scroll-highlight via IntersectionObserver
  - Code block copy button with clipboard API
  - Image lightbox via medium-zoom
  - Prev/next navigation cards
  - Related posts grid by tag overlap
  - Share buttons (copy link, Twitter/X, Weibo)
  - Copyright footer with permalink
  - Scroll-to-top floating button
  - Reading time + last-updated metadata display

affects: [02-core-content, 05-atmosphere, 06-polish]

tech-stack:
  added: [medium-zoom]
  patterns: [IntersectionObserver for TOC, Clipboard API for code copy, medium-zoom for lightbox, rAF scroll throttling]

key-files:
  created:
    - src/pages/articles/[id].astro
    - src/components/articles/ArticleTOC.astro
    - src/components/articles/CopyCodeButton.astro
    - src/components/articles/ImageLightbox.astro
    - src/components/articles/ArticleNav.astro
    - src/components/articles/RelatedPosts.astro
    - src/components/articles/ShareButtons.astro
    - src/components/articles/CopyrightFooter.astro
    - src/components/articles/TopButton.astro
    - src/components/articles/ReadingMeta.astro
    - src/pages/articles/index.astro
  modified:
    - src/components/articles/TagChips.astro
    - src/content/articles/welcome.md
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "Removed client:load/client:idle from Astro components — these directives only work on framework components (React/Vue/Svelte), not .astro files. Used <script is:inline> and bare <script> tags instead."
  - "Converted catch-all [...tag].astro to index.astro with query param filtering to avoid routing conflict with [id].astro detail page."

patterns-established:
  - "Astro interactive components use <script is:inline> for client JS, NOT client:* directives"
  - "Article routing: index.astro (list) + [id].astro (detail) with query param tag filtering"
  - "View Transition re-init pattern: document.addEventListener('astro:after-swap', initFn)"

requirements-completed: [PAGE-03, PAGE-04]

duration: 8min
completed: 2026-06-03
---

# Phase 02 Plan 02: Article Detail Page Summary

**Full article reading experience with TOC sidebar, code copy, image lightbox, prev/next nav, related posts, share buttons, and scroll-to-top**

## Performance

- **Duration:** 8 min
- **Started:** 2026-06-03T08:38:32Z
- **Completed:** 2026-06-03T08:47:02Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments
- Article detail page with two-column layout (TOC sidebar + article body) on desktop, single column on mobile
- 9 new components: ArticleTOC, CopyCodeButton, ImageLightbox, ArticleNav, RelatedPosts, ShareButtons, CopyrightFooter, TopButton, ReadingMeta
- Enriched sample article with headings, code blocks, and images for testing all features
- medium-zoom integration for image lightbox with Escape dismiss

## Task Commits

1. **Task 1: Article Detail Page + All Components** - `116ef65` (feat)
2. **Task 2: Enrich Sample Article for Testing** - `e0e8771` (docs)

## Files Created/Modified
- `src/pages/articles/[id].astro` - Article detail page with getStaticPaths, prose styling, two-column layout
- `src/pages/articles/index.astro` - Articles index (replaced catch-all [...tag].astro)
- `src/components/articles/ArticleTOC.astro` - Sticky sidebar TOC with IntersectionObserver scroll highlight
- `src/components/articles/CopyCodeButton.astro` - Clipboard copy on code blocks with "已复制!" feedback
- `src/components/articles/ImageLightbox.astro` - medium-zoom wrapper for article images
- `src/components/articles/ArticleNav.astro` - Prev/next navigation cards
- `src/components/articles/RelatedPosts.astro` - Tag-overlap related posts grid
- `src/components/articles/ShareButtons.astro` - Copy link, Twitter/X, Weibo share buttons
- `src/components/articles/CopyrightFooter.astro` - Author + permalink copyright notice
- `src/components/articles/TopButton.astro` - Floating scroll-to-top button
- `src/components/articles/ReadingMeta.astro` - Reading time + last-updated display
- `src/components/articles/TagChips.astro` - Updated to use query param filtering
- `src/content/articles/welcome.md` - Enriched with headings, code blocks, images
- `package.json` - Added medium-zoom dependency
- `pnpm-lock.yaml` - Updated lockfile

## Decisions Made
- Removed `client:load`/`client:idle` from Astro components — these directives only work on framework components. Used `<script is:inline>` and bare `<script>` tags instead.
- Converted catch-all `[...tag].astro` to `index.astro` with query param filtering to avoid routing conflict with `[id].astro`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Routing conflict: catch-all vs detail page**
- **Found during:** Task 1 (Article Detail Page implementation)
- **Issue:** Existing `[...tag].astro` catch-all route would match `/articles/welcome` and conflict with new `[id].astro` detail page — Astro cannot disambiguate two dynamic routes at the same path level
- **Fix:** Converted `[...tag].astro` to `index.astro` with query param filtering (`/articles?tag=tech` instead of `/articles/tech`). Updated TagChips to generate `?tag=` links.
- **Files modified:** src/pages/articles/[...tag].astro (deleted), src/pages/articles/index.astro (created), src/components/articles/TagChips.astro
- **Verification:** Build completes without errors, articles index renders with tag filtering
- **Committed in:** 116ef65 (Task 1 commit)

**2. [Rule 1 - Bug] client:load/client:idle on Astro components**
- **Found during:** Task 1 (build verification)
- **Issue:** `client:load` and `client:idle` directives on `.astro` components produced warnings — these only work on framework components (React, Vue, Svelte)
- **Fix:** Removed `client:load` from CopyCodeButton and `client:idle` from ImageLightbox. Both components already use `<script>` tags for client-side behavior.
- **Files modified:** src/pages/articles/[id].astro
- **Verification:** Build completes without warnings about client directives
- **Committed in:** 116ef65 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking routing conflict, 1 bug fix)
**Impact on plan:** Both fixes were necessary for correct operation. Tag filtering URL scheme changed from path-based to query-param-based — functionally equivalent, slightly simpler routing.

## Issues Encountered
None beyond the deviations documented above.

## Known Stubs
- Related posts section does not render when only one article exists (expected — needs multiple articles with shared tags to populate)

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Article detail page complete with all UX features
- Ready for remaining Phase 2 plans: RSS feeds, Twikoo comments, articles index refinement
- Tag filtering works via query params; future plans should use `/articles?tag=X` pattern

## Self-Check: PASSED

- All 11 created files verified present
- Commits 116ef65 and e0e8771 verified in git log
- Build completes without errors

---
*Phase: 02-core-content*
*Completed: 2026-06-03*
