---
phase: 05-atmosphere
plan: 05
subsystem: atmosphere
tags: [atmosphere, context-menu, easter-egg, konami-code, terminal]
depends_on:
  requires: [05-01]
  provides: [context-menu, easter-egg-terminal]
  affects: [BaseLayout, atmosphere.ts]
tech_stack:
  added: []
  patterns: [custom-event-bridge, input-field-guard, long-press-detection]
key_files:
  created:
    - src/components/atmosphere/ContextMenuIsland.astro
    - src/components/atmosphere/EasterEggIsland.astro
  modified:
    - src/lib/atmosphere.ts
    - src/layouts/BaseLayout.astro
decisions:
  - "Added setLevel() export to atmosphere.ts for clean intensity selector API"
  - "ContextMenuIsland dispatches 'open-secret-terminal' custom event for cross-island communication"
  - "Konami code input guard uses event.target.tagName + isContentEditable check"
metrics:
  duration: ~10m
  completed: "2026-06-04"
  tasks: 2
  files: 4
---

# Phase 05 Plan 05: Context Menu & Easter Egg Summary

One-liner: Shift+right-click kawaii context menu with mobile long-press fallback + Konami code easter egg with interactive secret terminal

## Tasks Completed

### Task 1: Create ContextMenuIsland + add setLevel to atmosphere.ts

- Added `setLevel(level)` export to `src/lib/atmosphere.ts` for clean API access
- Created `src/components/atmosphere/ContextMenuIsland.astro` with:
  - Desktop: Shift+right-click triggers custom menu; plain right-click untouched (ATM-03)
  - Mobile: long-press (500ms) with 10px move threshold opens menu
  - Menu items: Terminal (dispatches custom event), Home, Sponsor (placeholder), Intensity selector (off/subtle/full)
  - Viewport boundary-aware positioning
  - Dismiss on click-outside, Escape key, or after action
  - Intensity highlight synced via `onAtmoChange` subscription
  - Gated behind `isOff()` — no menu when atmosphere is disabled
  - Scoped styles with entrance animation (opacity + scale)
- **Commit:** `feat(05-05): add ContextMenuIsland with Shift+right-click and long-press`

### Task 2: Create EasterEggIsland + update BaseLayout

- Created `src/components/atmosphere/EasterEggIsland.astro` with:
  - Konami code detection (ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight KeyB KeyA)
  - Input guard: skips detection when focus is on INPUT, TEXTAREA, or contentEditable (ATM-06, Pitfall 5)
  - Secret terminal with commands: help, whoami, secret, theme, atmo, date, neko (ASCII cat), clear, exit
  - Terminal entrance animation (opacity + translateY)
  - Listens for `open-secret-terminal` custom event from ContextMenuIsland
  - Escape key closes terminal
  - `e.stopPropagation()` on terminal input prevents Konami re-trigger while typing
- Updated `src/layouts/BaseLayout.astro`:
  - Imported ContextMenuIsland and EasterEggIsland
  - Added both inside `<AtmosphereLayer>` with `client:idle`
  - All 6 atmosphere islands now rendered: Petals, CursorTrail, BGM, Live2D, ContextMenu, EasterEgg
- **Commit:** `feat(05-05): add EasterEggIsland with Konami code and secret terminal`

## Decisions Made

1. **Added `setLevel()` to atmosphere.ts** — The plan suggested either importing `window.__atmo__` directly or adding a `setLevel` export. Chose the export for cleaner API surface.
2. **Custom event bridge** — ContextMenuIsland dispatches `open-secret-terminal` on `document` rather than importing EasterEggIsland directly. This keeps the islands decoupled.
3. **Input field guard uses tagName + isContentEditable** — Matches the plan's Pitfall 5 requirement exactly. The guard runs before the Konami code index check.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

| Stub | File | Line | Reason | Future Plan |
|------|------|------|--------|-------------|
| Sponsor placeholder | ContextMenuIsland.astro | ~74 | `alert('赞赏功能即将上线~')` — no actual sponsor flow yet | TBD |

## Threat Flags

No new security-relevant surface beyond what the plan's threat model already covers.

## Self-Check: PASSED

- [x] `src/components/atmosphere/ContextMenuIsland.astro` exists
- [x] `src/components/atmosphere/EasterEggIsland.astro` exists
- [x] `src/lib/atmosphere.ts` exports `setLevel`
- [x] `src/layouts/BaseLayout.astro` imports both islands (2 matches each)
- [x] `shiftKey` guard present in ContextMenuIsland
- [x] `ArrowUp` Konami code detection present in EasterEggIsland
- [x] Commit `85eabf4` exists (Task 1)
- [x] Commit `844d6a3` exists (Task 2)
- [x] Commit `cb180d1` exists (docs)
