# Quick Task 260608-qnt: Article Detail Visual Fixes

## Intent

Fix the remaining article detail page visual mismatches reported from the latest screenshot:

- Move the Twikoo message board content into the expected card flow and prevent field overlap.
- Force prose heading icons to use `切图 13.svg`.
- Resize the top title card to a 300px desktop height with centered right artwork and better left text fitting.
- Align the active TOC dot with the selected pill.

## Scope

- `src/pages/articles/[id].astro`
- `src/components/comments/TwikooComments.astro`
- `src/components/articles/ArticleTOC.astro`
- `public/images/article-heading-icon.svg`

## Verification

- `pnpm exec astro build`
- Local preview inspection at desktop and mobile widths.
