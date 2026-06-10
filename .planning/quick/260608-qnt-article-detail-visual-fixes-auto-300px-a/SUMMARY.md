# Quick Task 260608-qnt Summary

## Completed

- Set the article detail title card to 300px on desktop, with the right artwork vertically centered and left text constrained with two-line clamping.
- Switched prose heading markers to `/images/article-heading-icon.svg`, copied from `11111111111/切图 13.svg`.
- Reworked Twikoo layout overrides so the message board uses the card width cleanly, hides the submit avatar column, and avoids mobile action overlap.
- Adjusted the TOC active marker position so the dot sits naturally inside the selected pill.

## Verification

- `pnpm exec astro build` passed.
- Preview inspection confirmed the title card height, heading icon URL, Twikoo single-column input area, and TOC active marker alignment.
