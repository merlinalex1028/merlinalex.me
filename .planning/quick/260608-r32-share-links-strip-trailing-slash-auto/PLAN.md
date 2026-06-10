# Quick Task 260608-r32: Share Links Strip Trailing Slash

## Intent

Remove the final trailing slash from article URLs used by sharing-related UI.

## Scope

- `src/pages/articles/[id].astro`

## Verification

- `pnpm exec astro build`
- Inspect generated article HTML for copy/share/copyright URLs.
- `git diff --check`
