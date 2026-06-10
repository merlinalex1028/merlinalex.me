---
status: complete
date: 2026-06-08
slug: articles-page-redesign-auto-1400px
---

# Articles Page Redesign

## Goal

Redesign the articles list page and article detail page to match the provided reference images, using a 1400px content region as the desktop baseline.

## Scope

- Rebuild `/articles` around the supplied article list reference:
  - hero copy plus fixed `切图 8.svg` header artwork
  - category filter bar
  - fixed featured article artwork from `切图 10@2x.png`
  - right-side search, statistics, and tag cards with `切图 11@2x.png`
- Rebuild `/articles/[id]` around the supplied detail reference:
  - title card uses fixed `切图 12@2x.png`
  - right-side TOC and comment cards use `切图 11@2x.png`
- Keep article content sourced from Astro content collections.
- Verify build and responsive layout.

## Verification

- `pnpm exec astro build`
- Playwright visual/layout checks for `/articles` and `/articles/welcome` at desktop and mobile widths.
