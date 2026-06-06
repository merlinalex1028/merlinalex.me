---
type: quick
status: complete
created: 2026-06-06
---

# Remove Atmosphere Switching and Effects

## Goal
Remove atmosphere switching mechanism, petals, cursor trail, and BGM. Keep context menu and easter egg terminal at full level.

## Changes

### Files Deleted
- `src/components/core/ThemeSwitcher.astro` — theme cycle button
- `src/components/core/IntensityBadge.astro` — atmosphere intensity badge
- `src/components/atmosphere/PetalsIsland.astro` — falling petals
- `src/components/atmosphere/CursorTrailIsland.astro` — cursor trail
- `src/components/atmosphere/BGMIsland.astro` — background music
- `src/components/atmosphere/AtmosphereLayer.astro` — atmosphere wrapper
- `src/lib/atmosphere.ts` — atmosphere utility library

### Files Modified
- `src/components/atmosphere/ContextMenuIsland.astro` — removed intensity submenu
- `src/components/atmosphere/EasterEggIsland.astro` — removed atmo command
- `src/components/core/Header.astro` — removed ThemeSwitcher and IntensityBadge
- `src/layouts/BaseLayout.astro` — removed atmosphere scripts, imports, data-atmo
- `src/styles/global.css` — removed atmosphere CSS gate
- `package.json` — removed tsParticles dependencies
- `pnpm-lock.yaml` — updated lockfile
