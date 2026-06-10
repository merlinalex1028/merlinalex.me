---
status: complete
date: 2026-06-08
slug: article-detail-polish-auto-twikoo-13
---

# Article Detail Polish

## Goal

Refine the article detail page after visual review:

- Make the title card feel more coordinated with the reference UI.
- Override Twikoo's real rendered comment DOM so the message board matches the page design.
- Replace prose heading icons with `切图 13.svg`.

## Scope

- Copy `切图 13.svg` into the article assets directory.
- Update article detail title card layout from a hard split grid to an integrated art layer.
- Use the new heading icon in article body headings.
- Add Twikoo `#twikoo` overrides for form fields, buttons, comments, avatars, replies, and placeholders.

## Verification

- `pnpm exec astro build`
- Playwright screenshot and layout checks for `/articles/welcome`.
