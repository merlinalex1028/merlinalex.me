---
phase: 05-atmosphere
plan: 01
subsystem: atmosphere
tags: [atmosphere, intensity-gate, css-custom-properties, seasonal-themes, astro]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "window.__atmo__ global API, data-atmo/data-theme attributes, intensity toggle, pre-paint script"
provides:
  - "src/lib/atmosphere.ts — shared gate API consumed by all Phase 5 islands (isOff, isSubtle, isFull, isReducedMotion, isMobile, onAtmoChange, getLevel)"
  - "src/components/atmosphere/AtmosphereLayer.astro — fixed-position wrapper for atmosphere islands"
  - "Date-based CSS tweaks (Valentine, Christmas, Sakura) applied via inline script"
affects: [05-02, 05-03, 05-04, 05-05]

# Tech tracking
tech-stack:
  added: []
  patterns: ["atmosphere gate pattern: shared utility wraps window.__atmo__ with typed helpers and safe defaults", "date-based CSS class injection via inline <script is:inline> in <head>"]

key-files:
  created:
    - src/lib/atmosphere.ts
    - src/components/atmosphere/AtmosphereLayer.astro
  modified:
    - src/layouts/BaseLayout.astro
    - src/styles/global.css

key-decisions:
  - "AtmosphereLayer uses pointer-events: none on container, child islands set pointer-events: auto on interactive elements"
  - "Date-based tweaks override only --color-accent and --color-accent-subtle — no layout or spacing changes"

patterns-established:
  - "Atmosphere gate pattern: all Phase 5 islands import from src/lib/atmosphere.ts instead of reading window.__atmo__ directly"
  - "Seasonal CSS class pattern: inline script in <head> applies .atmo-date-* class to <html> before first paint"

requirements-completed: [ATM-04, A11Y-01, A11Y-02]

# Metrics
duration: 3min
completed: 2026-06-04
---

# Phase 05 Plan 01: Atmosphere Gate Infrastructure Summary

**Shared atmosphere gate API (isOff/isSubtle/isFull/isReducedMotion/isMobile/onAtmoChange/getLevel) wrapping window.__atmo__, AtmosphereLayer fixed-position wrapper, and date-based seasonal CSS tweaks (Valentine/Christmas/Sakura)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-04T10:11:08Z
- **Completed:** 2026-06-04T10:14:08Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created `src/lib/atmosphere.ts` — typed wrapper around `window.__atmo__` with 7 exported functions, all guarding against undefined (SSR safety / pre-paint script failure)
- Created `AtmosphereLayer.astro` — fixed-position, pointer-events:none wrapper that hides when `data-atmo="off"`
- Wired AtmosphereLayer into BaseLayout before closing `</body>`
- Added date-based seasonal CSS tweaks (Valentine Feb14+Mar14, Christmas Dec20-25, Sakura Mar25-Apr10) with inline detection script

## Task Commits

Each task was committed atomically:

1. **Task 1: Create atmosphere gate utility + AtmosphereLayer wrapper** - `eb20857` (feat)
2. **Task 2: Add date-based atmosphere CSS tweaks** - `6ed4f15` (feat)

## Files Created/Modified
- `src/lib/atmosphere.ts` — Shared atmosphere gate API (isOff, isSubtle, isFull, isReducedMotion, isMobile, onAtmoChange, getLevel)
- `src/components/atmosphere/AtmosphereLayer.astro` — Fixed-position wrapper with pointer-events:none, z-index:50
- `src/layouts/BaseLayout.astro` — Import AtmosphereLayer, render before </body>, add date-detection inline script
- `src/styles/global.css` — Add .atmo-layer to intensity gate, add .atmo-date-valentine/christmas/sakura accent overrides

## Decisions Made
- AtmosphereLayer uses `pointer-events: none` on container so it doesn't block page interactions; child islands set `pointer-events: auto` on their interactive elements
- Date-based tweaks only override `--color-accent` and `--color-accent-subtle` — they don't touch layout, spacing, or other tokens
- `onAtmoChange` unsubscribe splices the listener from `window.__atmo__._listeners` array (not just no-op) to prevent listener leaks

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered
- `pnpm build` fails on the Bangumi prebuild script (missing `.env` file in worktree) — this is a pre-existing issue unrelated to this plan. Verified with `npx astro build` directly which succeeds.

## User Setup Required
None — no external service configuration required.

## Known Stubs
None — all implementations are functional, not stubbed.

## Self-Check

- `src/lib/atmosphere.ts` exists and exports all 7 functions: FOUND
- `src/components/atmosphere/AtmosphereLayer.astro` exists with `class="atmo-layer"`: FOUND
- BaseLayout.astro imports and renders AtmosphereLayer: FOUND
- `src/styles/global.css` has `.atmo-layer` in intensity gate: FOUND
- `src/styles/global.css` has `.atmo-date-valentine`, `.atmo-date-christmas`, `.atmo-date-sakura`: FOUND
- BaseLayout.astro has date-detection inline script: FOUND
- Commit eb20857 exists: FOUND
- Commit 6ed4f15 exists: FOUND

## Next Phase Readiness
- All Phase 5 plans (05-02 through 05-05) can now import from `src/lib/atmosphere.ts` and render inside `AtmosphereLayer`
- The intensity toggle in the header immediately hides/shows the atmosphere layer
- Date-based tweaks apply on the correct calendar dates without JavaScript runtime cost

---
*Phase: 05-atmosphere*
*Completed: 2026-06-04*
