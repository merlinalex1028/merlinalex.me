---
type: quick
status: complete
created: 2026-06-06
---

# Remove Archive Page and Live2D

## Goal
Remove the archive page and Live2D feature from the system.

## Changes

### Files Deleted
- `src/pages/archive.astro` — Archive page
- `src/components/archive/ArchiveList.astro` — Archive list component
- `src/components/archive/TagCloud.astro` — Tag cloud component
- `src/components/atmosphere/Live2DIsland.astro` — Live2D island component

### Files Modified
- `src/components/core/Nav.astro` — Removed 归档 navigation link
- `src/layouts/BaseLayout.astro` — Removed Live2DIsland import and usage
- `package.json` — Removed l2d-widget dependency
- `pnpm-lock.yaml` — Updated lockfile
