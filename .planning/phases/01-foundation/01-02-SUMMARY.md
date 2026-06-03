---
phase: 01-foundation
plan: 02
subsystem: theme-system
tags: [theme, atmo, a11y, seo, fouc, base-layout]
requires: [01-01]
provides: [BaseLayout, theme-system, atmo-gate, seo-meta, layout-chrome]
affects: [01-03, 02-01, 03-01, 04-01, 05-01, 06-01]
tech-stack:
  added: []
  patterns: [pre-paint-iiife, window-global-api, is-inline-scripts, css-custom-properties-theming, reduced-motion-baseline]
key-files:
  created:
    - src/layouts/BaseLayout.astro
    - src/components/seo/SEOMeta.astro
    - src/components/core/Header.astro
    - src/components/core/Nav.astro
    - src/components/core/Footer.astro
    - src/components/core/ThemeSwitcher.astro
    - src/components/core/IntensityBadge.astro
    - src/components/core/NoticeBar.astro
    - src/components/core/NotFound.astro
  modified:
    - src/styles/global.css
decisions:
  - Used `:root[data-theme="..."]` selector pattern with CSS custom properties (no Tailwind `dark:` variant) for theme tokens — matches CONTEXT D-08
  - Pre-paint `<script is:inline>` IIFE wrapped in `try/catch`; safe defaults on localStorage failure
  - ThemeSwitcher + IntensityBadge read `storedTheme`/`storedLevel` (raw stored value) not `theme`/`level` (resolved display value) so click cycles through actual stored value
  - NoticeBar parses frontmatter with a small regex instead of installing gray-matter (avoids new dep)
  - IntensityBadge displays `data-atmo="off"` when `prefers-reduced-motion: reduce` is on, but does NOT mutate `localStorage["atmo:level"]` (display-only override per D-08)
  - `window.__atmo__` global API exposed with `set`/`subscribe`/`_listeners` for Phase 5 atmosphere islands
  - Two `theme-color` meta tags (light + dark media queries) for browser chrome adaptation
  - `data-atmo="off"` selector hooks Phase 5 `.atmo-petals`/`.atmo-cursor-trail`/`.atmo-live2d` classes
  - Reduced-motion baseline uses `0.001ms !important` (NOT `0`) per CONTEXT D-10 — keeps animations observable to AT
metrics:
  duration: "~4 min"
  completed: 2026-06-03
  tasks: 3
  files: 10
requirements-completed: [ATM-04, A11Y-01, A11Y-02, SEO-01]
---

# Phase 1 Plan 02: BaseLayout + FOUC-safe Theme + A11y Baseline

## One-liner

Built the FOUC-safe pre-paint theme + atmosphere intensity system, exposing `window.__atmo__` for Phase 5 atmosphere islands, with light/dark tokens via CSS custom properties, `prefers-reduced-motion` global rule, and full SEO meta on every page.

## What was built

### Theme + Atmosphere Architecture

- **`src/styles/global.css`** — extended with dark theme tokens (12 color tokens), `data-atmo="off"` selector gate for Phase 5 hooks (`.atmo-petals`, `.atmo-cursor-trail`, `.atmo-live2d`), and the exact CONTEXT D-10 reduced-motion baseline (`0.001ms !important` on `*, *::before, *::after`).
- **`src/layouts/BaseLayout.astro`** — HTML shell with the FOUC-safe pre-paint `<script is:inline>` IIFE (resolves `theme` + `atmo` from `localStorage` + `matchMedia`, sets `data-theme`/`data-atmo` on `<html>`, populates `window.__atmo__`), skip-link as first focusable, Header + `<main id="main">` + Footer.

### Cross-Cutting Components

- **`Header.astro`** — sticky 56px header with logo, Nav, ThemeSwitcher, IntensityBadge.
- **`Nav.astro`** — 6 links; Articles/Works/Friends/Timeline marked `aria-disabled="true"` + `tabindex="-1"` (those land in later phases).
- **`Footer.astro`** — imports `social.json` for friend links + exact UI-SPEC copy "© 2026 merlinalex · 由 Astro 驱动".
- **`ThemeSwitcher.astro`** — cycles `light → dark → system`, reads `window.__atmo__.storedTheme` (raw), writes via `window.__atmo__.set({ theme })`.
- **`IntensityBadge.astro`** — cycles `off → subtle → full`, reads `window.__atmo__.storedLevel`, writes via `window.__atmo__.set({ atmo })`.
- **`NoticeBar.astro`** — reads `src/data/notice.md` frontmatter, dismisses via `localStorage["notice:dismissed:<id>"]`; rendered only when body is non-empty.
- **`NotFound.astro`** — 404 stub with kawaii mascot placeholder + "咦？这里什么都没有…" copy + `aria-label="迷路的吉祥物"`.
- **`SEOMeta.astro`** — full meta stack: `<title>`, `description`, canonical, 7 OG tags, 4 Twitter tags, 2 `theme-color` (per color-scheme), RSS alternate link.

## Key Invariants (Verified)

1. **Pre-paint runs first in `<head>`** — `dist/theme-test/index.html` (the verification build) places the `<script is:inline>` IIFE immediately after `<meta charset>` + `<meta name="viewport">` and BEFORE any `<link rel="stylesheet">` or `<style>` block. Confirmed via `grep -n` on built output.
2. **`window.__atmo__` exposed** with `{ level, storedLevel, theme, storedTheme, reducedMotion, set, subscribe, _listeners }`.
3. **Display-only reduce-motion override** — `prefers-reduced-motion: reduce` forces `data-atmo="off"` display, but the `set()` function never writes `localStorage["atmo:level"]` when only `reduceMotion` is on. The user's stored choice persists across sessions.
4. **No Tailwind `dark:` variant** for color tokens — anti-pattern 7 from RESEARCH avoided.
5. **Reduced-motion baseline is character-exact** to CONTEXT D-10 (selectors, properties, values, `!important` flags all match).
6. **ThemeSwitcher reads `storedTheme`, not `theme`** — so the cycle always advances the user's stored preference, not the resolved (system) value.
7. **Build exits 0** — `pnpm build` produces `dist/index.html`, `dist/theme-test/index.html` (during verification), `dist/sitemap-index.xml`, `dist/robots.txt`.
8. **Dev server smoke test** — `curl http://localhost:4321/theme-test` returns HTTP 200 with `window.__atmo__` (9 occurrences in dev output), `og:title`, `canonical`, and pre-paint script at start of head.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Package install] Avoided `gray-matter` dependency**
- **Found during:** Task 2 (NoticeBar implementation)
- **Issue:** Plan called for `import matter from 'gray-matter'` to parse `src/data/notice.md` frontmatter, but `gray-matter` was not in `package.json` from plan 01-01. Per deviation Rule 3's package-install exclusion, I did NOT auto-install it.
- **Fix:** Replaced with a small in-place regex parser that extracts `id:` from the simple `---` / `---` frontmatter. `notice.md` has a flat single-key frontmatter so the parser is 4 lines and avoids the dep entirely.
- **Files modified:** `src/components/core/NoticeBar.astro`
- **Commit:** `d576517`

**2. [Rule 1 - Build] Renamed test page to drop `_` prefix**
- **Found during:** Task 3 (verification build)
- **Issue:** Astro treats `_*` as private and excludes from routing, so `_theme-test.astro` produced no page (only `/index.html` in build). The plan's intent was a routable verification page; the underscore was likely a typo (the plan body calls it "temporary" not "private").
- **Fix:** `mv _theme-test.astro theme-test.astro` for the verification build, then deleted before commit. Final working tree has no test page.
- **Files modified:** `src/pages/theme-test.astro` (deleted before final commit)

### Other Notes

- **No auth gates** occurred in this plan.
- **No `worktree_branch_check`** needed — this is sequential execution on main, not a worktree.
- The commit count differs from the plan's "single final commit" (Task 3 step 14) because the atomic commit protocol was followed: Task 1 commit (global.css), Task 2 commit (9 components). Task 3's deliverable was cleanup only — the test page was created in a temp file and deleted before the build verification; no third commit was needed.

## Threat Model Notes

- T-02-01 (Tampering, pre-paint script): IIFE wrapped in `try/catch`; safe defaults on `localStorage` failure (private mode, SSR bots).
- T-02-02 (Spoofing, `window.__atmo__` consumer): `set()` wraps each listener in `try/catch` so a misbehaving Phase 5 listener cannot break the pre-paint contract.
- T-02-04 (Repudiation, theme/atmo state): `set()` writes both `localStorage` AND `data-*` attribute in a single call; listeners notified after both writes — consumers cannot observe a state where they disagree.

## File Summary

| File | Lines | Purpose |
|------|-------|---------|
| `src/styles/global.css` | 80 | Tailwind v4 + light/dark tokens + atmo gate + reduced-motion baseline |
| `src/layouts/BaseLayout.astro` | 106 | HTML shell + pre-paint IIFE + Header + Footer + skip-link |
| `src/components/seo/SEOMeta.astro` | 26 | Title, description, canonical, OG, Twitter, theme-color, RSS alternate |
| `src/components/core/Header.astro` | 51 | Sticky 56px header: logo + nav + actions |
| `src/components/core/Nav.astro` | 67 | 6 nav links; 4 disabled for future phases |
| `src/components/core/Footer.astro` | 50 | Copyright + social links |
| `src/components/core/ThemeSwitcher.astro` | 78 | light/dark/system cycle via `window.__atmo__` |
| `src/components/core/IntensityBadge.astro` | 74 | off/subtle/full cycle via `window.__atmo__` |
| `src/components/core/NoticeBar.astro` | 69 | Dismissable top-of-page banner from `src/data/notice.md` |
| `src/components/core/NotFound.astro` | 47 | 404 stub with kawaii mascot + copy |

## Self-Check

- All 9 component files exist and contain required content
- 2 commits on `main` for this plan (f954978, d576517)
- `dist/index.html` and `dist/sitemap-index.xml` built
- `src/pages/_theme-test.astro` and `src/pages/theme-test.astro` both absent
- Pre-paint script confirmed first in `<head>` of theme-test build output

## Self-Check: PASSED
