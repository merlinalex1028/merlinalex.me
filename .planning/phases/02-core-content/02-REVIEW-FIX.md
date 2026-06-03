---
phase: 02-core-content
fixed_at: 2026-06-03T14:30:00Z
review_path: .planning/phases/02-core-content/02-REVIEW.md
iteration: 1
findings_in_scope: 7
fixed: 6
skipped: 0
status: all_fixed
---

# Phase 02: Code Review Fix Report

**Fixed at:** 2026-06-03T14:30:00Z
**Source review:** .planning/phases/02-core-content/02-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 7 (3 critical + 5 warnings, minus CR-01 which was a false alarm)
- Fixed: 6
- Skipped: 0

## Fixed Issues

### CR-02: In-place `.sort()` mutates content collection in articles index

**Files modified:** `src/pages/articles/index.astro`
**Commit:** d54e5e4
**Applied fix:** Changed `allArticles.sort(...)` to `[...allArticles].sort(...)` to prevent mutating the Astro content collection cache. Added stable tiebreaker via `a.id.localeCompare(b.id)` for deterministic ordering when articles have identical sticky and publishedAt values.

### CR-03: In-place `.sort()` mutates content collection in both feed files

**Files modified:** `src/pages/feed.xml.ts`, `src/pages/feed-full.xml.ts`
**Commit:** bef11a2
**Applied fix:** Changed `articles.sort(...)` to `[...articles].sort(...)` in both feed files. Replaced `context.site!` non-null assertions with explicit guards that return a clear 500 error response when site config is missing.

### WR-01: ShareButtons missing clipboard fallback for older browsers

**Files modified:** `src/components/articles/ShareButtons.astro`
**Commit:** 9bda905
**Applied fix:** Added `textarea` + `document.execCommand('copy')` fallback when `navigator.clipboard` is unavailable (HTTP contexts, older browsers). Matches the pattern already used in `CopyCodeButton.astro`.

### WR-02: Duplicate sticker data in `public/` and `src/data/`

**Files modified:** `src/data/stickers.json` (deleted)
**Commit:** 94c63fe
**Applied fix:** Removed `src/data/stickers.json` which was an exact duplicate of `public/stickers.json`. The Twikoo component references `/stickers.json` served from `public/`, making `src/data/` unused.

### WR-03: `toAbsoluteUrls` only handles `<img>` tags in full-content RSS

**Files modified:** `src/pages/feed-full.xml.ts` (included in CR-03 commit)
**Commit:** bef11a2
**Applied fix:** Updated the regex in `toAbsoluteUrls` to match both `src` and `href` attributes, and added `mailto:` and `#` prefix exclusions. RSS readers that render full content will now resolve relative `<a href>` links correctly.

### WR-04: ImageLightbox `initZoom` may leak medium-zoom instances

**Files modified:** `src/components/articles/ImageLightbox.astro`
**Commit:** e32079b
**Applied fix:** Added a `zoomInstance` variable to track the current medium-zoom instance. On `astro:after-swap`, the previous instance is detached before creating a new one, preventing overlay stacking and memory leaks.

### WR-05: ArticleTOC `initTOC` adds duplicate event listeners on View Transitions

**Files modified:** `src/components/articles/ArticleTOC.astro`
**Commit:** 3127b26
**Applied fix:** Added a `currentObserver` variable that is disconnected on re-init. Clone link nodes via `cloneNode(true)` before re-attaching click handlers to remove stale listeners. The `updateActiveLink` function now re-queries `.toc-link` elements from the DOM to work with cloned nodes.

## Skipped Issues

None -- all findings were successfully fixed.

---

_Fixed: 2026-06-03T14:30:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
