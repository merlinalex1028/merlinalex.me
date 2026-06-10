---
status: complete
date: 2026-06-08
---

# Summary

Completed the article list and article detail redesign.

## Changes

- Rebuilt `/articles` with a 1400px baseline layout, reference hero art, category chips, featured article card, all-articles section, and right sidebar cards.
- Rebuilt `/articles/welcome` detail layout with a fixed title illustration, wide content card, right-side TOC, and comment board cards.
- Restyled `TagChips`, `ArticleListItem`, `ArticleTOC`, and `TwikooComments` to match the new kawaii card system.
- Added article page assets under `src/assets/articles/`.
- Added `public/images/welcome-hero.png` so the sample article image loads instead of showing a broken image.

## Verification

- `pnpm exec astro build` passed.
- Playwright checks passed with no horizontal overflow on:
  - `/articles` at 1400x1100 and 390x844
  - `/articles/welcome` at 1400x1100 and 390x844
- Verified `/articles/welcome` content image loads successfully on desktop and mobile.
