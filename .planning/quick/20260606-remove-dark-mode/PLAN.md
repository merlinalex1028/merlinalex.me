---
type: quick
status: complete
created: 2026-06-06
---

# Remove Dark Mode

## Goal
Remove light/dark theme switching, always use light mode.

## Changes

### Files Modified
- `src/styles/global.css` — Removed dark theme CSS variables, changed `:root[data-theme="light"]` to `:root`
- `src/layouts/BaseLayout.astro` — Removed `data-theme` attribute and pre-paint theme script
- `src/components/seo/SEOMeta.astro` — Removed dark theme-color meta tag
- `src/components/atmosphere/EasterEggIsland.astro` — Removed getTheme() function and theme command

### Files Deleted
- `src/lib/__tests__/atmosphere.test.ts` — Removed obsolete test file
