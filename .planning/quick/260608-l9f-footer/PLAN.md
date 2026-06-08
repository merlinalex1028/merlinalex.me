---
status: complete
date: 2026-06-08
---

# Sticky Footer For Short Pages

Fix pages where the main content is shorter than the viewport so the footer sits at the bottom of the viewport instead of immediately after the content.

## Scope

- Make the page body a full-height vertical flex container.
- Let `main` grow to fill remaining vertical space.
- Keep footer in normal document flow so long pages still scroll naturally.
