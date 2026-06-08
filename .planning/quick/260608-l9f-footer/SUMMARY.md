---
status: complete
date: 2026-06-08
---

# Sticky Footer For Short Pages Summary

Updated global layout CSS so `body` is a full-height flex column and `main` expands to fill available space. This keeps the footer pinned to the bottom on short pages without making it fixed-position.

Verification:

- `pnpm exec astro build`
- Playwright measurement on `/articles`: footer bottom equals viewport bottom at 1400x900.
