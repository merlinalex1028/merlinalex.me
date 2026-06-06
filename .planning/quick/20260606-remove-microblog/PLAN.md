---
type: quick
status: complete
created: 2026-06-06
---

# Remove Microblog Feature

## Goal
Remove the "说说" (microblog) feature from the entire system.

## Changes

### Files Deleted
- `src/pages/microblog/index.astro` — Feed page
- `src/pages/microblog/[id].astro` — Detail page
- `src/pages/microblog/data.json.ts` — JSON API endpoint
- `src/components/microblog/MicroblogCard.astro` — Card component
- `src/components/home/LatestMicroblog.astro` — Home page widget
- `src/content/microblog/hello-world.md` — Sample content
- `src/content/microblog/.gitkeep` — Placeholder

### Files Modified
- `src/content.config.ts` — Removed microblog collection schema and export
- `src/pages/index.astro` — Removed LatestMicroblog import, data fetching, and component usage
- `src/components/core/Nav.astro` — Removed "说说" navigation link
- `CLAUDE.md` — Removed microblog references from project description and stack table
- `AGENTS.md` — Same changes as CLAUDE.md
