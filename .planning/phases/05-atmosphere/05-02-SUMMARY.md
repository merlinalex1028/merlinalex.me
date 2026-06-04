---
phase: 05-atmosphere
plan: 02
subsystem: atmosphere
tags: [atmosphere, tsparticles, petals, cursor-trail, sakura, astro]

# Dependency graph
requires:
  - phase: 05-atmosphere
    plan: 01
    provides: "src/lib/atmosphere.ts (isOff, isReducedMotion, isMobile, onAtmoChange), AtmosphereLayer.astro, global.css intensity gate"
provides:
  - "src/components/atmosphere/PetalsIsland.astro — tsParticles cherry blossom petals gated behind intensity toggle"
  - "src/components/atmosphere/CursorTrailIsland.astro — desktop-only vanilla DOM cursor trail"
  - "public/petals/sakura.svg — sakura petal SVG asset for tsParticles shape"
affects: [05-03, 05-04, 05-05]

# Tech tracking
tech-stack:
  added: ["@tsparticles/astro@^4.1.3", "@tsparticles/slim@^4.1.3", "@tsparticles/shape-image@^4.1.3"]
  patterns: ["tsParticles lazy init pattern: dynamic import + initParticlesEngine inside client script", "Cursor trail pattern: vanilla DOM + CSS keyframes, no particle engine dependency"]

key-files:
  created:
    - src/components/atmosphere/PetalsIsland.astro
    - src/components/atmosphere/CursorTrailIsland.astro
    - public/petals/sakura.svg
  modified:
    - package.json
    - src/layouts/BaseLayout.astro

key-decisions:
  - "Used SVG instead of PNG for sakura petal asset — smaller file, scales to any resolution, tsParticles image shape supports SVG"
  - "Cursor trail uses vanilla DOM + CSS animations instead of a second tsParticles instance — keeps bundle small"
  - "tsParticles initialized via dynamic imports (lazy) to avoid blocking first paint even with client:idle"
  - "Theme colors read from window.__atmo__.theme at init time — palette updates on theme change via onAtmoChange subscription"

patterns-established:
  - "tsParticles lazy init pattern: dynamic import @tsparticles/slim + @tsparticles/shape-image inside client <script>, guard against double init with promise cache"
  - "Cursor trail particle lifecycle: spawn with requestAnimationFrame-throttled mousemove, self-remove on animationend, enforce MAX_PARTICLES cap"

requirements-completed: [ATM-02]

# Metrics
duration: ~10min
completed: 2026-06-04
---

# Phase 05 Plan 02: Falling Petals + Cursor Trail Summary

**tsParticles cherry blossom petals (30 desktop / 15 mobile, 30 FPS, theme-linked colors) + desktop-only vanilla DOM cursor trail, both gated behind intensity toggle and prefers-reduced-motion**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-06-04T12:01:42Z
- **Completed:** 2026-06-04
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Created `PetalsIsland.astro` — tsParticles-powered falling cherry blossom petals with:
  - 30 particles on desktop, 15 on mobile (via `responsive` config at 768px breakpoint)
  - 30 FPS throttle (`fpsLimit: 30`)
  - Theme-linked colors: light pink palette in light mode, darker pink in dark mode
  - Image shape using sakura SVG petal
  - Full particle physics: gravity, wobble, rotation, opacity animation
  - `pauseOnBlur: true` for document.hidden pause
  - Intensity gating: destroys particles and hides container when off or reduced-motion
  - `pointer-events: none` on container to not block scroll (Pitfall 2 from RESEARCH)
- Created `CursorTrailIsland.astro` — lightweight vanilla DOM cursor trail with:
  - Desktop-only guard (`isMobile()` check)
  - 100ms spawn throttle, max 20 active particles
  - Theme-linked color via `--color-accent` CSS variable
  - CSS `@keyframes cursor-fall` animation (1s fade + fall + rotate)
  - Self-cleaning particles (remove on `animationend`)
  - Intensity gating: detaches listener and clears particles when off/reduced-motion
  - View Transition cleanup via `astro:before-swap` event
- Created `public/petals/sakura.svg` — 5-petal cherry blossom silhouette in pink with transparency
- Updated `package.json` with `@tsparticles/astro`, `@tsparticles/slim`, `@tsparticles/shape-image`
- Updated `BaseLayout.astro` to import and render both islands inside `<AtmosphereLayer>` with `client:idle`

## Task Commits

**BLOCKED: Bash permission was denied during execution. Commits could not be made.**

Manual commit steps required:
```bash
# Task 1
git add package.json public/petals/sakura.svg src/components/atmosphere/PetalsIsland.astro
git commit -m "feat(05-02): add tsParticles sakura petals with intensity gating

- Install @tsparticles/astro, @tsparticles/slim, @tsparticles/shape-image
- Create sakura.svg petal asset
- Create PetalsIsland with 30fps throttle, responsive mobile cap, theme colors
"

# Task 2
git add src/components/atmosphere/CursorTrailIsland.astro src/layouts/BaseLayout.astro
git commit -m "feat(05-02): add cursor trail and wire islands into BaseLayout

- Create CursorTrailIsland with vanilla DOM, 100ms throttle, max 20 particles
- Import both islands into BaseLayout inside AtmosphereLayer with client:idle
"
```

## Files Created/Modified

- `public/petals/sakura.svg` — 5-petal cherry blossom SVG (32x32, pink #FFB7C5)
- `src/components/atmosphere/PetalsIsland.astro` — tsParticles falling petals island
- `src/components/atmosphere/CursorTrailIsland.astro` — Vanilla DOM cursor trail island
- `package.json` — Added @tsparticles/astro, @tsparticles/slim, @tsparticles/shape-image
- `src/layouts/BaseLayout.astro` — Import + render both islands in AtmosphereLayer

## Decisions Made

- Used SVG over PNG for sakura petal — smaller, resolution-independent, tsParticles image shape supports it
- Cursor trail uses vanilla DOM + CSS keyframes instead of a second tsParticles instance — significantly smaller bundle footprint
- tsParticles engine loaded via dynamic import to stay lazy even with `client:idle` directive
- `getThemeColors()` reads `window.__atmo__.theme` at init time; palette refreshes via `onAtmoChange` subscription (destroy + re-init)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Used SVG instead of PNG for sakura petal**
- **Found during:** Task 1
- **Issue:** Cannot programmatically generate PNG without Bash (canvas script or image tool)
- **Fix:** Created sakura.svg instead — plan explicitly allows this: "If you cannot generate a PNG programmatically, create `public/petals/sakura.svg` instead"
- **Files modified:** `public/petals/sakura.svg`
- **Commit:** pending

**2. [Rule 3 - Blocking] Package installation deferred**
- **Found during:** Task 1
- **Issue:** Bash permission denied, cannot run `pnpm add @tsparticles/astro @tsparticles/slim @tsparticles/shape-image`
- **Fix:** Manually added packages to package.json dependencies. User must run `pnpm install` before build will succeed.
- **Files modified:** `package.json`
- **Commit:** pending

## Issues Encountered

- **Bash permission denied** — Could not run `pnpm install`, `pnpm build`, or `git commit`. All source files were created via Write/Edit tools. User must manually:
  1. Run `pnpm install` to install tsParticles packages
  2. Run `pnpm build` to verify build succeeds
  3. Run the git commit commands listed above

## User Setup Required

1. `pnpm install` — install the three new tsParticles packages
2. `pnpm build` — verify build passes
3. Manual git commits (commands provided above)

## Known Stubs

None — all implementations are functional, not stubbed.

## Self-Check

- `public/petals/sakura.svg` exists: FOUND
- `src/components/atmosphere/PetalsIsland.astro` exists with tsParticles config: FOUND
- `src/components/atmosphere/CursorTrailIsland.astro` exists with mousemove listener: FOUND
- `BaseLayout.astro` imports both islands: FOUND
- `BaseLayout.astro` renders both inside AtmosphereLayer with `client:idle`: FOUND
- `package.json` has @tsparticles/astro, @tsparticles/slim, @tsparticles/shape-image: FOUND
- `pnpm build` exits 0: **NOT VERIFIED** (Bash permission denied)
- Git commits exist: **NOT VERIFIED** (Bash permission denied)

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag:T-05-04-mitigated | CursorTrailIsland.astro | Cursor trail spawn rate throttled to 100ms, max 20 active particles — mitigates DoS per threat model |

## Next Phase Readiness

- Both islands are wired into BaseLayout and will render when `pnpm install` + `pnpm build` succeed
- The intensity toggle in the header immediately hides/shows petals and cursor trail
- `prefers-reduced-motion` disables all animations globally (CSS) and per-component (JS gate)
- Mobile visitors see 15 petals (vs 30 desktop) and no cursor trail

---
*Phase: 05-atmosphere*
*Completed: 2026-06-04*
