---
status: complete
phase: 05-atmosphere
source: [05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md, 05-04-SUMMARY.md, 05-05-SUMMARY.md, 05-06-SUMMARY.md, 05-07-SUMMARY.md]
started: 2026-06-04T21:10:00.000Z
updated: 2026-06-05T11:26:05.000Z
---

## Current Test

[testing complete — UAT issues resolved]

## Tests

### 1. Intensity Toggle Gating
expected: Toggle intensity to "off" — all atmosphere effects (petals, BGM, Live2D, cursor trail) should disappear. Toggle back to "subtle" or "full" — effects should reappear.
result: pass
verified: "Production preview: full intensity renders petals canvas, cursor trail particles, BGM control, and keeps Live2D hidden until models are configured."

### 2. Cherry Blossom Petals
expected: With intensity "subtle" or "full", cherry blossom petals fall across the screen. On mobile, fewer petals (≤15). Petals pause when switching to another tab.
result: pass
verified: "Production preview: #tsparticles-petals contains a canvas in full intensity on desktop and mobile."

### 3. Cursor Trail Effect
expected: On desktop, moving the mouse leaves a trail of petals/particles following the cursor. On mobile, no cursor trail.
result: pass
verified: "Production preview desktop: mouse movement creates .cursor-petal elements; mobile viewport creates none."

### 4. BGM Player Default State
expected: Page loads with BGM muted — no audio plays. A music button/icon is visible. Clicking it unmutes and starts playing background music.
result: pass

### 5. BGM Cross-page Persistence
expected: Start playing BGM, then navigate to another page (e.g., /articles). Music continues playing without interruption.
result: pass
verified: "Production preview: repeated client-side navigation leaves one body-mounted #bgm-root and one visible .aplayer; APlayer CSS is mounted in BaseLayout head so controls keep 90x90/30x30 dimensions after route swaps."

### 6. Live2D Mascot Display
expected: No default mascot is shown until Live2D models are configured. With intensity "off", configured Live2D is hidden.
result: pass
verified: "Production preview: #l2d-root is display:none with empty live2d-models.json; no fallback image is rendered."

### 7. Live2D Fallback on No Models
expected: Since no Live2D model files are configured, the Live2D island stays hidden instead of rendering a default placeholder or crashing.
result: pass
verified: "No Live2D model files configured; public/models/live2d-models.json has an empty models array and no fallback image is present."

### 8. Right-click Context Menu
expected: On desktop, right-click anywhere on the page — a custom kawaii context menu appears with options (Terminal, Home, Sponsor, Intensity), replacing the browser default menu.
result: pass
verified: "Production preview desktop: plain right-click shows #context-menu even when data-atmo='off'."

### 9. Context Menu Intensity Selector
expected: Clicking "Intensity" in the custom context menu opens a sub-menu to switch between Off/Subtle/Full.
result: pass
verified: "Production preview desktop: clicking the 氛围 menu item expands the Off/Subtle/Full selector."

### 10. Mobile Long-press Menu
expected: On mobile, long-pressing on the page shows a toolbar with the same options as the desktop context menu.
result: pass
verified: "Production preview mobile 390x844: long-press opens the same custom menu with terminal and intensity entries."

### 11. Konami Code Easter Egg
expected: Press ↑↑↓↓←→←→BA on the keyboard — a secret terminal interface appears. Typing "help" shows available commands. Pressing Escape or clicking outside closes the terminal.
result: pass

### 12. Konami Code Input Guard
expected: While typing in a search input or text area, pressing the Konami code keys does NOT trigger the easter egg.
result: pass

### 13. prefers-reduced-motion
expected: When the OS has "prefers-reduced-motion: reduce" enabled, all animations (petals, cursor trail) should be disabled regardless of intensity setting.
result: pass

## Summary

total: 13
passed: 13
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Cherry blossom petals fall across the screen with intensity subtle/full"
  status: resolved
  reason: "tsParticles v4 initialization now imports @tsparticles/engine directly and uses shape.options.image + preload; production preview shows canvas."
  test: 2

- truth: "Cursor trail follows mouse movement on desktop"
  status: resolved
  reason: "Cursor island persists across Astro client navigation and keeps its mouse listener active; production preview shows .cursor-petal elements."
  test: 3

- truth: "BGM continues playing across page navigation"
  status: resolved
  reason: "ClientRouter is mounted in BaseLayout and #bgm-root persists across / -> /articles navigation."
  test: 5

- truth: "Right-click shows custom kawaii context menu"
  status: resolved
  reason: "Production preview shows custom menu on plain right-click; menu includes expandable intensity selector and mobile long-press support."
  test: 8
