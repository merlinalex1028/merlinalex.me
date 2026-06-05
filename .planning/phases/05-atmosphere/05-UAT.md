---
status: complete
phase: 05-atmosphere
source: [05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md, 05-04-SUMMARY.md, 05-05-SUMMARY.md, 05-06-SUMMARY.md, 05-07-SUMMARY.md]
started: 2026-06-04T21:10:00.000Z
updated: 2026-06-05T10:55:00.000Z
---

## Current Test

[testing complete — gap closure failed]

## Tests

### 1. Intensity Toggle Gating
expected: Toggle intensity to "off" — all atmosphere effects (petals, BGM, Live2D, cursor trail) should disappear. Toggle back to "subtle" or "full" — effects should reappear.
result: issue
reported: "满的时候还是只有网易云bgm (when set to full, only NetEase BGM is visible)"
severity: major

### 2. Cherry Blossom Petals
expected: With intensity "subtle" or "full", cherry blossom petals fall across the screen. On mobile, fewer petals (≤15). Petals pause when switching to another tab.
result: issue
reported: "没有看到花瓣 (no petals visible) — gap closure fix did not resolve"
severity: major

### 3. Cursor Trail Effect
expected: On desktop, moving the mouse leaves a trail of petals/particles following the cursor. On mobile, no cursor trail.
result: issue
reported: "没有光标轨迹 (no cursor trail visible) — gap closure fix did not resolve"
severity: major

### 4. BGM Player Default State
expected: Page loads with BGM muted — no audio plays. A music button/icon is visible. Clicking it unmutes and starts playing background music.
result: pass

### 5. BGM Cross-page Persistence
expected: Start playing BGM, then navigate to another page (e.g., /articles). Music continues playing without interruption.
result: issue
reported: "依然还是中断 (still stops after navigation) — gap closure fix did not resolve"
severity: major

### 6. Live2D Mascot Display
expected: A mascot image (static fallback SVG) appears in the bottom-right corner of the page. With intensity "off", the mascot is hidden.
result: issue
reported: "只有一个显示失败的图片效果并显示文字：站点吉祥物 (shows a failed image with text)"
severity: minor

### 7. Live2D Fallback on No Models
expected: Since no Live2D model files are configured, the static kawaii cat SVG fallback is displayed instead of crashing.
result: issue
reported: "只有一个显示失败的图片效果并显示文字：站点吉祥物 (SVG fallback rendering poorly)"
severity: minor

### 8. Shift+Right-click Context Menu
expected: On desktop, hold Shift and right-click anywhere on the page — a custom kawaii context menu appears with options (Terminal, Home, Sponsor, Intensity). Normal right-click (without Shift) shows the browser's default menu.
result: issue
reported: "还是浏览器默认右键菜单 (still shows browser default menu) — gap closure fix did not resolve"
severity: major

### 9. Context Menu Intensity Selector
expected: Clicking "Intensity" in the custom context menu opens a sub-menu to switch between Off/Subtle/Full.
result: blocked
blocked_by: prior-phase
reason: "Context menu not working (Test 8 failed)"

### 10. Mobile Long-press Menu
expected: On mobile, long-pressing on the page shows a toolbar with the same options as the desktop context menu.
result: skipped
reason: "Testing on desktop, not mobile"

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
passed: 4
issues: 6
pending: 0
skipped: 1
blocked: 1

## Gaps

- truth: "Cherry blossom petals fall across the screen with intensity subtle/full"
  status: failed
  reason: "User reported: 没有看到花瓣 — gap closure fix (canvas→div) did not resolve"
  severity: major
  test: 2

- truth: "Cursor trail follows mouse movement on desktop"
  status: failed
  reason: "User reported: 没有光标轨迹 — gap closure fix (waitForAtmo guard) did not resolve"
  severity: major
  test: 3

- truth: "BGM continues playing across page navigation"
  status: failed
  reason: "User reported: 依然还是中断 — gap closure fix (astro:before-swap/after-swap hooks) did not resolve"
  severity: major
  test: 5

- truth: "Shift+right-click shows custom kawaii context menu"
  status: failed
  reason: "User reported: 还是浏览器默认右键菜单 — gap closure fix (CSS class visibility) did not resolve"
  severity: major
  test: 8
