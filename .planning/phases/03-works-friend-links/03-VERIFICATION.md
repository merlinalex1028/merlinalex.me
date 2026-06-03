---
phase: 03-works-friend-links
verified: 2026-06-03T12:00:00Z
status: human_needed
score: 20/20 must-haves verified
overrides_applied: 0
re_verification: false
human_verification:
  - test: "Visit /works and verify two equal-width cards appear side-by-side on desktop, stacked on mobile"
    expected: "Two cards with icons (mdi:code-braces, mdi:palette), titles, descriptions, and hover animation"
    why_human: "Visual layout, responsive breakpoints, and hover animation require browser rendering"
  - test: "Visit /works/projects and verify project card shows cover image, name, description, tech tags, and GitHub stars badge"
    expected: "Rich card with all elements visible; GitHub stars shows number or dash fallback"
    why_human: "Visual card layout, image rendering, and badge styling require browser rendering"
  - test: "Visit /works/creations and verify masonry gallery renders 3 columns on desktop, 2 on tablet, 1 on mobile"
    expected: "Three sample creations in masonry layout with title overlay and hover category badge"
    why_human: "CSS columns masonry behavior and responsive breakpoints require visual verification"
  - test: "Click a creation card and verify lightbox opens with dark overlay, large image, title, description, and counter"
    expected: "Full-screen overlay with image, navigation arrows, and info panel at bottom"
    why_human: "Lightbox overlay behavior, z-index stacking, and visual presentation require browser interaction"
  - test: "In lightbox, press ArrowLeft/ArrowRight to navigate between images, Escape to close"
    expected: "Image changes on arrow press; lightbox closes on Escape"
    why_human: "Keyboard event handling requires interactive testing"
  - test: "Visit /friends and verify friend cards grouped by category in order: tech, anime, life, other"
    expected: "Four section headings: 技术, 动漫, 生活, 其他; cards sorted featured-first within each"
    why_human: "Visual layout and category grouping require browser rendering"
  - test: "Verify the offline friend (离线博客示例) shows a gray '已离线' badge in the top-right corner"
    expected: "Small rounded badge overlaying the card, not blocking click-through"
    why_human: "Badge positioning relative to card requires visual verification"
  - test: "Click the '申请友链' button at the bottom of /friends"
    expected: "Opens GitHub Issue template page in a new tab"
    why_human: "External link behavior requires browser interaction"
  - test: "Verify breadcrumb on /works/projects shows 'Works > Projects' with Works as a clickable link back to /works"
    expected: "Breadcrumb renders with separator, current page has aria-current='page'"
    why_human: "Navigation flow and accessibility attributes require browser verification"
---

# Phase 03: Works + Friend Links Verification Report

**Phase Goal:** Visitor can explore both works modules (open-source projects vs creative works) with their distinct visual treatments, and reach friend-circle sites with a category-sorted, health-aware listing.
**Verified:** 2026-06-03T12:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor can visit /works and see two cards linking to Projects and Creations | VERIFIED | `dist/works/index.html` contains 2 `hub-card` elements; links to `/works/projects` and `/works/creations` |
| 2 | Visitor on /works/projects sees project cards with cover, name, description, tech tags, and GitHub stars | VERIFIED | `ProjectCard.astro` renders cover img, h3 name, description, tag chips, and github-badge with stars count |
| 3 | GitHub stars are fetched at build time and cached; graceful degradation when API unavailable | VERIFIED | `fetch-github-stars.ts` reads project files, extracts github URLs, fetches API, writes JSON; on failure writes `{}` and shows "—" |
| 4 | Breadcrumb on sub-pages allows navigation back to Works hub | VERIFIED | Both `/works/projects` and `/works/creations` pages import Breadcrumb with `href: '/works'` link; `aria-label="面包屑"` present in built output |
| 5 | Projects with featured: true sort before non-featured; within same tier, alphabetical | VERIFIED | `projects/index.astro` sort logic: `if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1` then `localeCompare` |
| 6 | Visitor on /works/creations sees a masonry gallery of creation cards | VERIFIED | `dist/works/creations/index.html` contains 3 `creation-card` elements; CSS `columns: 3 280px` with responsive breakpoints |
| 7 | Visitor can filter creations by category using horizontal tag chips | VERIFIED | `CategoryChips.astro` renders chip links with `?category=` query params; page reads `Astro.url.searchParams.get('category')` and filters |
| 8 | Clicking a creation card opens a lightbox with large image, title, and description | VERIFIED | `CreationLightbox.astro` has click handler on `.creation-card`, reads `data-images/title/description`, shows overlay with image + info |
| 9 | Lightbox supports arrow key navigation and Escape to close | VERIFIED | `handleKeydown` function handles `Escape` (close), `ArrowLeft` (prev), `ArrowRight` (next); guarded by `state.isOpen` |
| 10 | Masonry layout is responsive: 1 column mobile, 2 tablet, 3 desktop | VERIFIED | CSS: `columns: 3 280px` default, `@media (max-width: 1024px) { columns: 2 }`, `@media (max-width: 640px) { columns: 1 }` |
| 11 | Visitor can browse /friends and see friend cards grouped by category | VERIFIED | Built output shows 4 sections with headings 技术, 动漫, 生活, 其他; 8 friend cards rendered |
| 12 | Category order is: tech, anime, life, other | VERIFIED | `categoryOrder = ['tech', 'anime', 'life', 'other']` in friends.astro; built output headings: 技术 → 动漫 → 生活 → 其他 |
| 13 | Within each category, featured friends sort to top | VERIFIED | Sort logic: `if (a.featured && !b.featured) return -1` then `localeCompare` by name |
| 14 | Each friend card shows avatar, site name, and one-line description | VERIFIED | `FriendCard.astro` renders avatar img (48x48, rounded), h3 name, p description with text-overflow ellipsis |
| 15 | Offline friends show a red/gray '已离线' badge in top-right corner | VERIFIED | `HealthBadge.astro` renders `<span class="health-badge">已离线</span>` with `position: absolute; top: 8px; right: 8px`; 1 occurrence in built output |
| 16 | Prominent '申请友链' button at bottom links to GitHub Issue template | VERIFIED | Built output contains `github.com/merlinalex/merlinalex.me/issues/new?template=friend-link.yml` |
| 17 | Cards remain visible and clickable even when friend is offline | VERIFIED | `FriendCard.astro` is an `<a>` tag wrapping entire card; HealthBadge is informational overlay only |
| 18 | Nav shows both "作品" and "友人" links as clickable (not disabled) | VERIFIED | `Nav.astro` has `{ label: '作品', href: '/works' }` and `{ label: '友人', href: '/friends' }` without `disabled: true` |
| 19 | Creations page has Breadcrumb navigation | VERIFIED | `creations/index.astro` imports Breadcrumb with items `[{ label: 'Works', href: '/works' }, { label: 'Creations' }]` |
| 20 | Health data flows from friends-health.json through page to badge | VERIFIED | `friends.astro` imports `healthData`, passes to `FriendSection`, which computes `isOffline` per friend, passes to `FriendCard`, which renders `HealthBadge` |

**Score:** 20/20 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/works/index.astro` | Works hub page with two cards | VERIFIED | 52 lines, substantive with grid layout and responsive CSS |
| `src/pages/works/projects/index.astro` | Projects listing page | VERIFIED | 103 lines, imports getCollection + github-stars, sort + grid |
| `src/pages/works/creations/index.astro` | Creations gallery page | VERIFIED | 110 lines, masonry grid, category filter, lightbox import |
| `src/pages/friends.astro` | Friend links page | VERIFIED | 115 lines, category grouping, health data import, CTA |
| `src/components/works/WorksHubCard.astro` | Hub card component | VERIFIED | 67 lines, icon + title + description + hover animation |
| `src/components/works/ProjectCard.astro` | Project card with stars | VERIFIED | 146 lines, cover + name + desc + tags + github badge |
| `src/components/works/CreationCard.astro` | Masonry gallery item | VERIFIED | 104 lines, data-attrs for lightbox, hover category badge |
| `src/components/works/CreationLightbox.astro` | Lightbox overlay | VERIFIED | 273 lines, full keyboard nav, View Transitions re-init |
| `src/components/works/Breadcrumb.astro` | Breadcrumb nav | VERIFIED | 69 lines, aria-label, current page indicator |
| `src/components/works/CategoryChips.astro` | Category filter chips | VERIFIED | 85 lines, active chip styling, scrollable wrapper |
| `src/components/friends/FriendCard.astro` | Horizontal friend card | VERIFIED | 116 lines, avatar fallback, HealthBadge integration |
| `src/components/friends/FriendSection.astro` | Category section | VERIFIED | 74 lines, responsive 2-col grid, health data pass-through |
| `src/components/friends/HealthBadge.astro` | Offline badge | VERIFIED | 28 lines, absolute positioned, conditional render |
| `src/scripts/fetch-github-stars.ts` | Build-time fetch script | VERIFIED | 112 lines, cache check, graceful degradation, exports |
| `src/data/github-stars.json` | Cached star counts | VERIFIED | `{}` initial value; populated at build time |
| `src/data/friends-health.json` | Health check data | VERIFIED | Contains sample offline entry matching friends.json |
| `src/content/friends/friends.json` | Friend entries | VERIFIED | 8 friends across 4 categories, 1 offline entry |
| `src/content/projects/sample-project.mdx` | Sample project | VERIFIED | Valid frontmatter with name, url, tags, github, featured |
| `src/content/creations/sample-creation-{1,2,3}.mdx` | Sample creations | VERIFIED | 3 entries: illustration, photography, craft categories |
| `src/components/core/Nav.astro` | Enabled nav links | VERIFIED | Works and Friends items have no `disabled` property |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `works/projects/index.astro` | `github-stars.json` | import at build time | WIRED | `import githubStars from '../../../data/github-stars.json'` |
| `ProjectCard.astro` | `github-stars.json` | stars prop from page | WIRED | `stars={getStars(project.data.github)}` passed as prop |
| `works/index.astro` | `/works/projects` | WorksHubCard href | WIRED | `<WorksHubCard href="/works/projects" .../>` |
| `works/index.astro` | `/works/creations` | WorksHubCard href | WIRED | `<WorksHubCard href="/works/creations" .../>` |
| `creations/index.astro` | `CreationLightbox.astro` | component import | WIRED | `<CreationLightbox />` rendered in page |
| `CreationLightbox.astro` | creation card images | click event delegation | WIRED | `document.addEventListener('click', handleCardClick)` with `.closest('.creation-card')` |
| `friends.astro` | `friends-health.json` | import at build time | WIRED | `import healthData from '../data/friends-health.json'` |
| `FriendCard.astro` | `HealthBadge.astro` | conditional render | WIRED | `<HealthBadge isOffline={isOffline} />` inside card |
| `friends.astro` | GitHub Issue template | submission button href | WIRED | `href="https://github.com/merlinalex/merlinalex.me/issues/new?template=friend-link.yml"` |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|-------------------|--------|
| `projects/index.astro` | `githubStars` | `src/data/github-stars.json` | Yes (API-fetched at build time) | FLOWING |
| `friends.astro` | `healthData` | `src/data/friends-health.json` | Yes (sample offline entry) | FLOWING |
| `FriendSection.astro` | `isOffline` | `healthData[friend.url]?.status === 'offline'` | Yes (conditional per friend URL) | FLOWING |
| `creations/index.astro` | `filtered` | `getCollection('creations')` + category filter | Yes (3 sample entries) | FLOWING |
| `CreationLightbox.astro` | images/title/desc | `data-*` attributes from CreationCard | Yes (populated from collection data) | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build succeeds | `pnpm exec astro build` | 9 pages built in 1.43s | PASS |
| Works hub has 2 cards | `grep 'class="hub-card"' dist/works/index.html` | 2 matches | PASS |
| Projects page has cards | `grep 'class="project-card"' dist/works/projects/index.html` | 1 match | PASS |
| Creations page has 3 cards | `grep 'class="creation-card"' dist/works/creations/index.html` | 3 matches | PASS |
| Friends page has 8 cards | `grep 'class="friend-card"' dist/friends/index.html` | 8 matches | PASS |
| Health badge renders | `grep '已离线' dist/friends/index.html` | 1 match | PASS |
| Submission CTA present | `grep 'github.com.*issues.*new' dist/friends/index.html` | 1 match | PASS |
| Category order correct | Built headings: 技术, 动漫, 生活, 其他 | Correct order | PASS |
| Breadcrumb on sub-pages | `aria-label="面包屑"` in projects + creations output | Both present | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-----------|-------------|--------|----------|
| PAGE-05 | 03-01 | Works hub page linking to two sub-modules | SATISFIED | `/works` renders two WorksHubCard instances linking to Projects and Creations |
| PAGE-06 | 03-01 | Works → Projects module with card grid, tech-stack tags, GitHub stars | SATISFIED | `/works/projects` renders ProjectCard grid with tags and stars badge |
| PAGE-07 | 03-02 | Works → Creations module with masonry + lightbox gallery | SATISFIED | `/works/creations` renders masonry gallery with CreationLightbox |
| PAGE-08 | 03-03 | Friend Links page with submission entry, health-check badge, category sort | SATISFIED | `/friends` renders category-grouped cards, health badge, submission CTA |
| INFRA-08 | 03-03 | Friend-link health check UI badge stub (Action ships in Phase 6) | SATISFIED | HealthBadge.astro consumes friends-health.json; Phase 6 Action is the producer |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/scripts/fetch-github-stars.ts` | 73, 105 | `console.log` | Info | Build-time informational logs (cache status, write count). Appropriate for a build script. Not a stub. |

No debt markers (TBD/FIXME/XXX), placeholder text, or empty implementations found in any phase file.

### Human Verification Required

### 1. Visual Layout: Works Hub

**Test:** Visit `/works` in browser. Verify two cards appear side-by-side on desktop (>=640px), stacked on mobile. Cards should show icon, title, description with hover animation (translateY + box-shadow).
**Expected:** Two equal-width cards with accent-colored icons, centered text, smooth hover lift effect.
**Why human:** Responsive grid behavior and hover animations require visual rendering.

### 2. Visual Layout: Projects Cards

**Test:** Visit `/works/projects`. Verify project card shows cover image (if present), name as link, description, tech tag chips, and GitHub stars badge.
**Expected:** Rich card with cover image at top, content below, tag chips in horizontal row, github icon + star count (or "—").
**Why human:** Card layout, image rendering, and badge styling require browser verification.

### 3. Masonry Gallery + Lightbox Interaction

**Test:** Visit `/works/creations`. Verify 3 creation cards in masonry layout (3 columns desktop, 2 tablet, 1 mobile). Click a card to open lightbox. Verify dark overlay, large image, title, description, counter. Press ArrowLeft/ArrowRight, Escape.
**Expected:** Masonry columns with varying image heights; lightbox overlays full-screen; keyboard navigation works.
**Why human:** Masonry CSS behavior, lightbox overlay stacking, and keyboard interaction require browser testing.

### 4. Friends Page: Category Grouping + Health Badge

**Test:** Visit `/friends`. Verify 4 category sections (技术, 动漫, 生活, 其他) with friend cards. Verify "离线博客示例" has a gray "已离线" badge in top-right. Verify "申请友链" button opens GitHub Issue template in new tab.
**Expected:** Category sections with correct order; featured friends first in each group; offline badge visible but non-blocking; CTA opens external link.
**Why human:** Visual layout, badge positioning, and external link behavior require browser interaction.

### 5. Breadcrumb Navigation

**Test:** Visit `/works/projects` and `/works/creations`. Verify breadcrumb shows "Works > Projects" / "Works > Creations". Click "Works" to return to hub.
**Expected:** Breadcrumb renders with "/" separator; "Works" link navigates back to `/works`.
**Why human:** Navigation flow and breadcrumb rendering require browser verification.

### Gaps Summary

No gaps found. All 20 must-have truths are verified against the built codebase. All 5 requirement IDs (PAGE-05, PAGE-06, PAGE-07, PAGE-08, INFRA-08) are satisfied. All key links are wired. All data flows produce real data.

Two minor execution deviations from the plan (not impacting goal achievement):
1. Breadcrumb labels on creations page use English ("Works", "Creations") instead of Chinese ("作品", "项目") — functional but inconsistent with the projects page breadcrumb.
2. CreationLightbox uses inline `<script>` tag instead of plan's specified `client:idle` directive — script is lightweight (event listeners only), so no performance impact, but deviates from Astro island pattern.

These deviations do not affect goal achievement and are not classified as gaps.

---

*Verified: 2026-06-03T12:00:00Z*
*Verifier: Claude (gsd-verifier)*
