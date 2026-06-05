---
phase: 05-atmosphere
plan: 07
type: gap_closure
completed: 2026-06-05
tasks_completed: 2
tasks_total: 2
---

# Phase 05 Plan 07: Fix BGM Persistence + Context Menu

Fixed BGM cross-page persistence and context menu visibility issues from UAT.

## Fixes Applied

### Task 1: BGM cross-page persistence
- **Root cause:** `transition:persist` preserves DOM element but NOT APlayer JavaScript instance
- **Fix:** Added `astro:before-swap` listener to save playback state (currentTime, playing) to localStorage. Added `astro:after-swap` listener to re-initialize APlayer and restore playback position.

### Task 2: Context menu CSS visibility
- **Root cause:** HTML `hidden` attribute sets `display: none !important` which prevents CSS transitions from animating
- **Fix:** Replaced `hidden` attribute with `.atmo-context-menu--hidden` CSS class. Updated show/hide logic to use classList instead of hidden property. Added `visibility` to CSS transitions.

## Files Modified
- `src/components/atmosphere/BGMIsland.astro` — View Transition lifecycle hooks for state save/restore
- `src/components/atmosphere/ContextMenuIsland.astro` — CSS class visibility instead of hidden attribute

---
*Phase: 05-atmosphere (gap closure)*
*Completed: 2026-06-05*
