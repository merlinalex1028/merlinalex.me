---
type: quick
status: complete
created: 2026-06-06
---

# Remove Global Search

## Goal
Remove the global search functionality (Pagefind).

## Changes

### Files Deleted
- `src/components/search/SearchBar.astro` — Search bar component

### Files Modified
- `src/components/core/Header.astro` — Removed SearchBar import and usage
- `astro.config.mjs` — Removed pagefind integration and l2d-widget exclude
- `package.json` — Removed astro-pagefind dependency
- `pnpm-lock.yaml` — Updated lockfile
