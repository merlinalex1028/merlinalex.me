# Quick Task 260608-qzv: Article Detail Title And Twikoo Input Fix

## Intent

Fix two remaining article detail page issues from visual review:

- Twikoo should not auto-fill a remembered email address on refresh.
- The title card text must never be covered by the right-side artwork; overflowing title text may truncate with an ellipsis.

## Scope

- `src/components/comments/TwikooComments.astro`
- `src/pages/articles/[id].astro`

## Verification

- `pnpm exec astro build`
- `git diff --check`
