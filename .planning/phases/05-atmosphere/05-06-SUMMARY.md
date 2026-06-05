---
phase: 05-atmosphere
plan: 06
type: gap_closure
completed: 2026-06-05
tasks_completed: 2
tasks_total: 2
---

# Phase 05 Plan 06: Fix Petals + Cursor Trail

Fixed cherry blossom petals and cursor trail effects that were not visible during UAT.

## Fixes Applied

### Task 1: PetalsIsland container target
- **Root cause:** tsParticles.load() targeted a `<canvas>` element; tsParticles expects a container `<div>` and creates its own canvas
- **Fix:** Replaced `<canvas id="tsparticles-petals">` with `<div id="tsparticles-petals">`

### Task 2: CursorTrailIsland atmo race guard
- **Root cause:** `isOff()` returns `true` when `window.__atmo__` is not yet set (race condition between inline pre-paint script and module script)
- **Fix:** Added `waitForAtmo()` guard that polls for `window.__atmo__` before checking intensity gate

## Files Modified
- `src/components/atmosphere/PetalsIsland.astro` — canvas → div container
- `src/components/atmosphere/CursorTrailIsland.astro` — added waitForAtmo guard

---
*Phase: 05-atmosphere (gap closure)*
*Completed: 2026-06-05*
