---
type: quick
status: complete
created: 2026-06-06
---

# Update Fonts to Nunito and Alibaba PuHuiTi 3.0

## Goal
Change system fonts to Nunito (English) and Alibaba PuHuiTi 3.0 (Chinese).

## Changes

### Files Modified
- `src/layouts/BaseLayout.astro` — Added Google Fonts CDN links for Nunito, Alibaba PuHuiTi 3.0, JetBrains Mono
- `src/styles/global.css` — Updated font-family to use new fonts
- `package.json` — Removed old fontsource packages (@fontsource/jetbrains-mono, @fontsource/zen-maru-gothic)
- `pnpm-lock.yaml` — Updated lockfile
