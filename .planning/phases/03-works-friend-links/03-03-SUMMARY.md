---
phase: 03-works-friend-links
plan: 03
subsystem: friends
tags: [friends, health-badge, community]
dependency_graph:
  requires: []
  provides: [friend-links-page, health-badge-ui]
  affects: []
tech_stack:
  added: []
  patterns: [category-grouped-grid, health-badge-overlay]
key_files:
  created:
    - src/pages/friends.astro
    - src/components/friends/FriendCard.astro
    - src/components/friends/FriendSection.astro
    - src/components/friends/HealthBadge.astro
  modified:
    - src/content.config.ts
    - src/content/friends/friends.json
    - src/data/friends-health.json
decisions:
  - Fixed friends collection schema: removed z.array() wrapper that was masked by empty JSON array
metrics:
  duration_seconds: 337
  completed: "2026-06-03T11:45:00Z"
  tasks_completed: 2
  files_changed: 7
---

# Phase 03 Plan 03: Friend Links Summary

## What Was Built

**Friend Links page with category grouping, health-check badges, and submission flow.** Visitors can browse /friends and see friend cards grouped by category (技术 → 动漫 → 生活 → 其他), with featured friends sorted to top. Offline friends display a "已离线" badge. A submission CTA links to GitHub Issue template.

## Tasks Completed

### Task 1: Friends page + FriendCard + FriendSection + sample data + submission CTA
- Created `src/content/friends/friends.json` with 8 sample friends across all 4 categories
- Created `src/components/friends/FriendCard.astro` - horizontal card with avatar, name, description
- Created `src/components/friends/FriendSection.astro` - category section wrapper with responsive 2-col grid
- Created `src/pages/friends.astro` - page with category grouping and submission CTA
- **Commit:** `212330e` - feat(03-03): add friends page with category-grouped cards and submission CTA

### Task 2: HealthBadge + friends-health.json + badge integration
- Created `src/components/friends/HealthBadge.astro` - absolute-positioned overlay badge
- Updated `src/data/friends-health.json` with sample offline entry schema
- Updated `FriendCard.astro` to accept `isOffline` prop and render HealthBadge
- Updated `FriendSection.astro` to pass health data through to FriendCard
- Updated `friends.astro` to import and pass healthData
- **Commit:** `7dfd1c3` - feat(03-03): add health badge for offline friends

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed friends collection schema**
- **Found during:** Task 1 build verification
- **Issue:** Schema used `z.array(z.object({...}))` but `file()` loader creates one entry per array element. Each friend object was validated against the array schema, causing `Expected type "array", received "object"` error. Empty `[]` in friends.json masked this bug since there were no entries to validate.
- **Fix:** Removed `z.array()` wrapper from schema, now validates each friend object directly
- **Files modified:** `src/content.config.ts`
- **Commit:** `212330e` (included in Task 1 commit)

## Verification Evidence

- Build passes: `pnpm exec astro build` completes successfully
- `/friends` page generates at `dist/friends/index.html`
- "已离线" badge appears in output (1 occurrence for sample offline friend)
- Category order verified: tech → anime → life → other
- Grid responsive: 1 column mobile, 2 columns desktop (640px breakpoint)

## Key Decisions

1. **Schema fix (Rule 1):** Removed `z.array()` wrapper from friends collection schema. The `file()` loader with array JSON creates one entry per element; schema should validate each element, not the array wrapper.

2. **Health badge positioning:** Uses `position: absolute` with `top: 8px; right: 8px` relative to card container (which has `position: relative`).

3. **Submission CTA:** Links to `https://github.com/merlinalex/merlinalex.me/issues/new?template=friend-link.yml` (Issue template creation is out of Phase 3 scope).

## Known Stubs

- `friends-health.json` contains only a sample offline entry. Phase 6's GitHub Action will populate this file with real health check data.
- GitHub Issue template (`friend-link.yml`) does not exist yet — the CTA links to it but the template creation is deferred.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| (none) | — | All friend URLs validated by Zod `z.string().url()`; external links use `rel="noopener noreferrer"` |

## Self-Check: PASSED

- [x] All files created exist
- [x] Both commits exist in git log
- [x] Build passes
- [x] "已离线" badge renders in output
