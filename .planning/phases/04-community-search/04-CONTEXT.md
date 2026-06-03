# Phase 4: Community + Search - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the "alive" side of the site. Visitors can:

- View `/microblog` with paginated 说说 stream (card-based, image lightbox, mood emoji, tags), 10 per page with "load more" button, >180-day posts shown with "归档" tag and reduced opacity
- Browse `/anime`, `/books`, `/music` with Bangumi-driven card grids showing cover, title, rating, progress, status. Tab toggle for 在看/看过/想看. Build-time fetch with 12h TTL and manual override support.
- Scroll `/timeline` with year-grouped, alternating-side milestone layout showing date, title, description, optional image, optional link
- Search articles via Pagefind-powered input in the nav bar with highlighted excerpts in results
- Visit `/archive` for tag cloud + chronological article list (0/1-post tags hidden)
- See home page widgets: Hitokoto random quote, site stats (runtime + article count + total words + busuanzi visitors), latest 5 microblog posts

**Out of Phase 4 scope** (shipped later): Live2D/petals/BGM (Phase 5), JSON-LD (Phase 6), 80% tests (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Microblog Feed (D-01)
- **Layout:** Card-based — each post as a card with content, image thumbnails, mood emoji, tags, date. Similar to Weibo/Twitter style.
- **Pagination:** Page-based with "加载更多" button, 10 posts per page. Simple and reliable.
- **Auto-archive:** Posts >180 days shown with "归档" tag and slightly reduced opacity. NOT separated into a different section — they stay in the main feed.
- **Images:** Thumbnail grid (max 3 preview images), clicking opens lightbox reusing medium-zoom pattern from Phase 2.
- **Home page cap:** Only 5 latest microblog posts shown on home page, linking to full `/microblog` page.

### Bangumi Data Fetch (D-02)
- **Layout:** Card grid with cover image, title, rating, progress (e.g. 12/24 episodes), status tag.
- **Data fetch:** Build-time fetch via Bangumi API v0 (`api.bgm.tv/v0/`), cached to `src/data/bangumi.json` with 12h TTL. Prebuild refresh script updates cache before each build.
- **Status switch:** Tab toggle at top of each list page: 全部 / 在看 / 看过 / 想看. Default shows "在看".
- **Manual override:** `src/data/bangumi-override.json` merged at build time. Override entries take priority over API data. Supports per-episode progress correction.
- **Three separate pages:** `/anime`, `/books`, `/music` — each with its own Bangumi collection type.
- **Error handling:** Graceful fallback when Bangumi API unavailable — show cached data or empty state with friendly message.

### Timeline Layout (D-03)
- **Layout:** Vertical alternating-side — entries alternate left and right with a vertical center line connecting them. Classic timeline aesthetic.
- **Entry content:** Date + title + description + optional image + optional link — all visible, not collapsed.
- **Year grouping:** Year-grouped with year header (e.g. "2024"), visual separator between years. Most recent year first.

### Search (D-04)
- **UI:** Search input in the nav bar (search icon, click to expand input field). Results appear below in a dropdown/overlay.
- **Results display:** Title + highlighted excerpt + date + category tag for each result. Click navigates to article.
- **Scope:** Articles only (microblog excluded via `data-pagefind-filter="exclude"`). CJK queries supported.
- **Technology:** Pagefind — build-time indexer, zero infrastructure, client-side search.

### Home Page Widgets (D-05)
- **Hitokoto:** Random quote from hitokoto.cn API. Displayed prominently on home page. Client-side fetch for variety on each visit.
- **Site stats:** Runtime (days since launch), article count, total word count, busuanzi visitor count. Static + dynamic combination.
- **Latest microblog:** 5 most recent microblog posts, linking to full `/microblog` page.

### Tag Cloud + Archive (D-06)
- **Location:** Independent `/archive` page.
- **Tag cloud:** All tags with >1 post, sized by usage count. Click filters articles.
- **Chronological list:** All articles grouped by year, newest first.
- **Hidden tags:** Tags with 0 or 1 posts are hidden from the tag cloud.

### Claude's Discretion
- Specific Pagefind configuration and search UI styling
- Bangumi API error handling and retry logic
- Timeline CSS implementation (pseudo-elements vs dedicated components)
- Hitokoto API integration approach
- Busuanzi integration approach
- Specific Tailwind/CSS classes for all new components

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — REQ-IDs and traceability for Phase 4: PAGE-09, PAGE-10, PAGE-11, DISC-02, DISC-03, INFRA-05
- `.planning/ROADMAP.md` — Phase 4 success criteria, 4-plan breakdown
- `.planning/STATE.md` — Project state and accumulated context from Phases 1-3

### Prior Phase Context (patterns to follow)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Established patterns: content collection schemas, theme architecture, component organization
- `.planning/phases/02-core-content/02-CONTEXT.md` — Article UX patterns: TagChips, lightbox, CSS variables
- `.planning/phases/03-works-friend-links/03-CONTEXT.md` — Works/friends patterns: masonry, category chips, breadcrumb

### Phase 2 Implementation (code to build on)
- `src/content.config.ts` — Microblog schema already defined (publishedAt, content, images, mood, tags)
- `src/components/articles/TagChips.astro` — Reusable chip filtering pattern
- `src/components/articles/ImageLightbox.astro` — medium-zoom pattern for lightbox
- `src/layouts/BaseLayout.astro` — Theme gate, SEOMeta, Header/Footer

### Research
- `.planning/research/STACK.md` — Library versions
- `.planning/research/FEATURES.md` — Genre conventions, 二次元 aesthetic patterns
- `.planning/research/PITFALLS.md` — Relevant pitfalls

### External Specs
- Bangumi API v0: `api.bgm.tv/v0/` — collection endpoints, rate limits
- Pagefind: `pagefind.app` — static search indexer, CJK support
- Hitokoto API: `hitokoto.cn` — random quote endpoint
- Busuanzi: visitor counter script

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `TagChips.astro`: Horizontal chip filtering pattern — reuse for Bangumi status tabs and archive tag cloud
- `ImageLightbox.astro`: medium-zoom integration — reuse for microblog image lightbox
- `BaseLayout.astro`: Theme gate + SEOMeta — all new pages inherit this
- CSS variables (`--color-fg`, `--color-surface`, `--color-border`, `--color-accent`): consistent theming
- Content collections with Zod validation in `src/content.config.ts`

### Established Patterns
- `glob()` loader for markdown content, `file()` for JSON data
- Component organization: `src/components/{feature}/` directories
- Responsive breakpoints: 640px (mobile → desktop grid)
- Tag chip filtering with query params

### Integration Points
- `src/pages/microblog/` — microblog pages
- `src/pages/anime.astro`, `src/pages/books.astro`, `src/pages/music.astro` — Bangumi list pages
- `src/pages/timeline.astro` — timeline page
- `src/pages/archive.astro` — tag cloud + chronological archive
- `src/content.config.ts` — microblog schema already defined; anime/books/music placeholder schemas
- `src/data/bangumi.json` — new cache file for Bangumi data
- `src/data/bangumi-override.json` — new manual override file

</code_context>

<specifics>
## Specific Ideas

- Microblog should feel like a personal journal — cards with mood emoji add personality
- Bangumi lists should feel like a media shelf — covers are prominent, progress bars are motivating
- Timeline should tell a story — alternating layout creates visual rhythm, year headers provide structure
- Search should be instant and unobtrusive — nav bar placement keeps it accessible without dominating
- Home widgets should make the site feel lived-in — Hitokoto quotes change on each visit, stats grow over time

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within Phase 4 scope

</deferred>

---

*Phase: 4-Community + Search*
*Context gathered: 2026-06-03*
