# Phase 3: Works + Friend Links - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the works and friend-links half of the site. Visitors can:

- Visit `/works` and see a hub with two equal-width cards linking to Projects and Creations
- Browse `/works/projects` with rich cards (cover + name + description + tech tags + GitHub badge), featured-first sorting
- Browse `/works/creations` with a masonry gallery, category tag filtering, and lightbox viewing
- Browse `/friends` with category-grouped horizontal cards, a submission button linking to GitHub Issue, and health-check badge UI for offline friends

**Out of Phase 3 scope** (shipped later): microblog (Phase 4), Bangumi lists (Phase 4), search (Phase 4), Live2D/petals/BGM (Phase 5), JSON-LD (Phase 6), friend-link health-check GitHub Action producer (Phase 6), 80% tests (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Works Hub Layout (D-01)
- **Hub style:** Dual-card entry — two large cards linking to `/works/projects` and `/works/creations`
- **Card content:** Title + one-line description + icon. Minimal and clean.
- **Navigation:** Breadcrumb on sub-pages (`Works > Projects`), clicking Works returns to hub
- **Layout ratio:** Equal width (50/50), stacked vertically on mobile

### Project Card Design (D-02)
- **Card density:** Rich card — cover image + project name + description + tech-stack tags + GitHub stars badge
- **Tech tags:** Horizontal chips below description, same pattern as article TagChips component
- **GitHub stars:** GitHub icon + stars count badge, clickable link to repo. Data fetched at build time via GitHub API, cached to `src/data/github-stars.json`
- **Sorting:** Featured projects first, then by date descending. No tag filtering (unlike articles).

### Creations Gallery Style (D-03)
- **Layout:** Masonry (Pinterest-style) with responsive breakpoints. Different-height images交错排列.
- **Filtering:** Horizontal tag chips at top — `全部` / `插画` / `摄影` / `手工` / `视频`. Same chip pattern as articles.
- **Card content:** Cover image + title only. Category label appears on hover.
- **Lightbox:** Standard lightbox — dark overlay + large image + title/description at bottom. Arrow navigation between images in same creation. Escape to close. Reuse or extend the medium-zoom pattern from Phase 2.

### Friend Links Organization (D-04)
- **Sorting:** Category-grouped sections. Category order: 技术 → 动漫 → 生活 → 其他. Within each category, `featured: true` friends sort to top.
- **Card layout:** Horizontal — avatar + site name + one-line description. Compact, high-density.
- **Submission entry:** Bottom of page, prominent "申请友链" button linking to GitHub Issue template. Not a card, just a clear CTA.
- **Health-check badge:** Red/gray "已离线" badge in top-right corner of offline friend cards. Cards remain visible and clickable. GitHub Action cron producer ships in Phase 6; Phase 3 only builds the UI consumer reading `src/data/friends-health.json`.

### Claude's Discretion
- Specific masonry CSS implementation (CSS columns vs JS library)
- Breadcrumb component design and placement
- GitHub stars API fetch implementation (build-time script vs Astro integration)
- Lightbox library choice (extend medium-zoom vs new solution for multi-image galleries)
- Friends health-check JSON schema design
- Specific Tailwind/CSS classes for all new components

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — REQ-IDs and traceability for Phase 3: PAGE-05, PAGE-06, PAGE-07, PAGE-08, INFRA-08 (UI badge stub)
- `.planning/ROADMAP.md` — Phase 3 success criteria, 3-plan breakdown
- `.planning/STATE.md` — Project state and accumulated context from Phases 1-2

### Phase 1 Context (patterns to follow)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Established patterns: content collection schemas, theme architecture, component organization, BaseLayout

### Phase 2 Context (patterns to follow)
- `.planning/phases/02-core-content/02-CONTEXT.md` — Article UX patterns: TagChips, lightbox, CSS variables, component organization

### Phase 2 Implementation (code to build on)
- `src/content.config.ts` — Projects, Creations, Friends schemas already defined with Zod validation
- `src/content/friends/friends.json` — Friends data file (currently empty array)
- `src/components/articles/TagChips.astro` — Reusable chip filtering pattern for Creations category filter
- `src/components/articles/ImageLightbox.astro` — medium-zoom pattern, extend for Creations gallery
- `src/layouts/BaseLayout.astro` — Theme gate, SEOMeta, Header/Footer
- `src/components/core/Footer.astro` — Global footer

### Research
- `.planning/research/STACK.md` — Library versions
- `.planning/research/FEATURES.md` — Genre conventions, 二次元 aesthetic patterns
- `.planning/research/PITFALLS.md` — Relevant pitfalls

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TagChips.astro`: Horizontal chip filtering pattern — reuse for Creations category filter
- `ImageLightbox.astro`: medium-zoom integration — extend or replace for multi-image gallery lightbox
- `BaseLayout.astro`: Theme gate + SEOMeta — all new pages inherit this
- `LatestArticles.astro`: Card layout pattern with hover effects — adapt for Works hub cards
- CSS variables (`--color-fg`, `--color-surface`, `--color-border`, `--color-accent`): consistent theming across all new components

### Established Patterns
- Content collections with Zod validation in `src/content.config.ts`
- `glob()` loader for markdown content, `file()` for JSON data
- Component organization: `src/components/{feature}/` directories
- Responsive breakpoints: 640px (mobile → desktop grid)
- Tag chip filtering with query params (`?tag=tech`)

### Integration Points
- `src/pages/works/` — new hub + projects + creations routes
- `src/pages/friends.astro` — friend links page
- `src/content.config.ts` — Projects, Creations, Friends schemas already defined
- `src/data/github-stars.json` — new cache file for GitHub stars (build-time fetch)
- `src/data/friends-health.json` — new data file consumed from Phase 6 Action

</code_context>

<specifics>
## Specific Ideas

- Works hub should feel like a portal — two large, visually distinct cards that immediately communicate "Projects" vs "Creations"
- Project cards should feel professional/technical — cover image gives personality, GitHub badge adds credibility
- Creations gallery should feel artistic — masonry layout lets images breathe, lightbox for immersive viewing
- Friend links page should feel warm/community — horizontal cards are scannable, category grouping helps discovery
- Health-check badge should be informative, not alarming — "已离线" is neutral, not "BROKEN" or "DEAD"

</specifics>

<deferred>
## Deferred Ideas

- Friend-link submission form (self-service via GitHub Issue) — the button links to Issue template, but the actual Issue template creation is out of Phase 3 scope
- Friend-link health-check GitHub Action producer — Phase 6 builds the cron job; Phase 3 only builds the UI consumer

</deferred>

---

*Phase: 3-Works + Friend Links*
*Context gathered: 2026-06-03*
