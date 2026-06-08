---
status: complete
date: 2026-06-08
---

# Home UI Reference Alignment Summary

Adjusted the desktop homepage alignment to better match the provided 1400px-wide reference direction.

- Centered the header navigation on the full header axis while keeping the logo left and GitHub action right.
- Added a hero bottom fade into `#ecebfb` so the image-to-page transition is softer.
- Matched 最新文章 and 最近在追 panels to the stats capsule width.
- Moved 最新文章 and 最近在追 headings inside their glass panels.
- Switched 最近在追 homepage covers to local fixed images so the cards stay visually filled even when external Bangumi covers fail.
- Widened 关于 and 时间线 into equal columns whose combined span matches the stats capsule.

Verification:

- `pnpm exec astro build`
- Playwright layout check at 1400px: nav center delta 0, stats/latest/watch widths equal, no horizontal overflow.
- Follow-up Playwright check at 1400px: stats/watch/mini-grid widths equal, mini-card pair span 1260px, all watch cover images loaded.
