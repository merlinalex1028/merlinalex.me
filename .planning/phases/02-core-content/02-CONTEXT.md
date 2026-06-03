# Phase 2: Core Content - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the blog half of the site — articles are browsable, filterable, readable, and subscribable. Visitors can:

- Browse `/articles` with tag filtering and chronological listing
- Read article detail pages with TOC, syntax-highlighted code, navigation, and related posts
- Subscribe via RSS (summary + full-content feeds)
- Post anonymous comments via Twikoo with Bilibili-style stickers
- Every article has alt text on images and a "Related posts" component (SEO-02)

**Out of Phase 2 scope** (shipped later): works modules (Phase 3), microblog (Phase 4), Bangumi lists (Phase 4), search (Phase 4), Live2D/petals/BGM (Phase 5), JSON-LD (Phase 6), 80% tests (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Articles Index Layout (D-01)
- **Layout:** Single-column list/rows — title, excerpt, date, category pill. Dense, scannable, traditional blog feel.
- **Tag filter:** Horizontal scrollable chip bar at top — `全部` / `技术` / `生活` / `评测` / `笔记` + any additional tags. Pill buttons, one-tap filter, mobile-friendly.
- **Sorting:** Sticky posts float to top, then newest by `publishedAt` descending. No sort dropdown — simple is better.
- **Category display:** Category as a colored pill/badge on each list item. Tags are secondary (visible on detail page only).
- **Tag source for chips:** Extract unique tags from all non-draft articles at build time. Category values (`tech`, `life`, `review`, `notes`) get dedicated chips; additional tags appear as secondary options if >1 post uses them.

### Article Detail UX (D-02)
- **TOC:** Sticky left sidebar on desktop (>1024px), collapsible drawer/accordion on mobile. Highlights current heading on scroll via IntersectionObserver.
- **Code blocks:** Shiki syntax highlighting (theme-aware light/dark via CSS variables), line numbers, copy-code button in top-right corner. Standard Astro Shiki config.
- **Navigation:** Prev/next as left/right arrow cards at bottom of article. Related posts as a 3-card grid below that, matched by shared tags (most shared tags = highest relevance).
- **Password protection:** Skipped for v1. The `password` field exists in the schema but no UI gating will be implemented in Phase 2. Can be added later.
- **Image lightbox:** Click-to-expand on article images. Use a lightweight client-side solution (no heavy library). Keyboard dismiss (Escape) required.
- **Reading time:** Calculate from word count at build time. Display next to last-updated stamp. Assume ~400 CJK chars/min or ~200 EN words/min.
- **Copy-code button:** Clipboard API with visual "Copied!" feedback (2s timeout). Fallback for older browsers.
- **Share buttons:** Simple icon links (copy link, Twitter/X, Weibo). No heavy social SDK loading.
- **Copyright footer:** "本文作者: merlinalex · 本文链接: [permalink] · 转载请注明出处" — standard CN blog pattern.
- **Top button:** Floating scroll-to-top button, appears after scrolling past first viewport.

### RSS Feed Strategy (D-03)
- **Two feeds:** `/feed.xml` (summary — title + excerpt + metadata) and `/feed-full.xml` (full article content). Readers choose which to subscribe to.
- **Autodiscovery:** `<link rel="alternate" type="application/rss+xml">` in `<head>` for both feeds. RSS icon in the Footer component (global, always visible).
- **Entry metadata:** Title, description/excerpt, published date, author name, category, cover image (if set). Standard RSS 2.0 fields. Tags NOT included as RSS categories (tags are site-internal).
- **CDATA escaping:** All HTML content wrapped in CDATA sections per W3C feed validator requirements.
- **Feed validation:** Both feeds must pass W3C Feed Validation Service (https://validator.w3.org/feed/).
- **Draft exclusion:** `draft: true` articles excluded from both feeds.

### Twikoo Comment Integration (D-04)
- **Placement:** Comment section below article content, above prev/next navigation. Always visible, no collapsible wrapper.
- **Identity model:** Fully anonymous — nickname + optional email/URL. No login required. Admin (merlinalex) identified by email match in Twikoo config.
- **Sticker pack:** Bilibili default emote set. Well-known in CN二次元 community, immediately recognizable, no custom illustration work needed.
- **Admin notifications:** Email notifications on every new comment. Reply notifications to commenters who leave an email address.
- **Backend:** Separate Vercel project (Twikoo serverless) + MongoDB Atlas M0. `envId` configured via environment variable. No Vercel Authentication enabled. Third-party image host configured for sticker hosting.
- **Styling:** Twikoo comment area styled to match site theme — light/dark aware, consistent with site's rounded-corner kawaii aesthetic.

### SEO-02: Related Posts + Alt Text (D-05)
- **Related posts:** 3-card grid below article, matched by shared tags. Algorithm: count shared tags between current article and all other non-draft articles, sort by count descending, take top 3. If <3 matches, fill with most recent articles.
- **Alt text enforcement:** All images in articles must have alt text. Planner should consider a build-time check or lint rule (e.g., markdown lint `no-alt-text` rule).
- **Internal linking:** Related posts component serves as the internal linking mechanism per SEO-02.

### Claude's Discretion
- Specific Tailwind/CSS classes for the list layout, chip styling, and card designs
- Shiki theme selection (recommend `github-light` + `github-dark` or `min-light` + `min-dark`)
- IntersectionObserver thresholds for TOC highlight
- Image lightbox library choice (recommend `medium-zoom` or custom — lightweight, keyboard-friendly)
- Twikoo CSS customization depth (recommend overriding `--twikoo-*` CSS variables)
- Reading time calculation constants (chars-per-minute for CJK vs Latin)
- File organization for new components (recommend `src/components/articles/` and `src/components/rss/`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — REQ-IDs and traceability for Phase 2: PAGE-03, PAGE-04, DISC-01, INFRA-04, INFRA-07, SEO-02
- `.planning/ROADMAP.md` — Phase 2 success criteria, 3-plan breakdown
- `.planning/STATE.md` — Project state and accumulated context from Phase 1

### Phase 1 Context (patterns to follow)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Established patterns: content collection schemas, theme architecture, component organization, BaseLayout

### Phase 1 Implementation (code to build on)
- `src/content.config.ts` — Article schema (D-02) with `glob()` loader; fields: title, publishedAt, tags, draft, description, updatedAt, cover, category, sticky, password, toc
- `src/layouts/BaseLayout.astro` — Theme + atmo gate, SEOMeta, Header/Footer
- `src/components/home/LatestArticles.astro` — Existing article card pattern (reusable for related posts)
- `src/components/seo/SEOMeta.astro` — SEO meta component (extend for article-specific OG)
- `src/components/core/Footer.astro` — RSS icon placement target
- `src/content/articles/welcome.md` — Example article with frontmatter

### Research
- `.planning/research/STACK.md` — Library versions, Astro RSS integration, Shiki config
- `.planning/research/FEATURES.md` — Genre conventions, article UX patterns
- `.planning/research/PITFALLS.md` — Relevant pitfalls for Phase 2

### External Specs
- Astro RSS integration: `@astrojs/rss` — https://docs.astro.build/en/guides/rss/
- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- Twikoo docs: https://twikoo.js.org/ — init script, envId config, sticker setup, email notification
- W3C Feed Validator: https://validator.w3.org/feed/

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LatestArticles.astro`: Card layout pattern with hover effects, CSS variables, responsive grid — adapt for related posts grid
- `BaseLayout.astro`: Theme gate (`data-theme` + `data-atmo`), SEOMeta integration, skip-link — all article pages inherit this
- `SEOMeta.astro`: OG/Twitter card generation — extend for article-specific metadata (published time, author, tags)
- `Footer.astro`: Global footer — add RSS icon link here
- `Header.astro`: Global header with nav — articles link likely already exists

### Established Patterns
- CSS variables for theming (`--color-fg`, `--color-surface`, `--color-border`, `--color-accent`)
- Component organization: `src/components/{feature}/` directories
- Content collections with Zod validation in `src/content.config.ts`
- `glob()` loader for markdown content, `file()` for JSON data
- Responsive breakpoints: 640px (mobile → desktop grid)

### Integration Points
- `src/pages/` — new `articles/index.astro` and `articles/[id].astro` routes
- `src/content.config.ts` — article schema already defined, no changes needed
- `src/components/core/Footer.astro` — RSS icon addition
- `src/components/seo/SEOMeta.astro` — article-specific OG tags
- `.env.example` — Twikoo `envId` placeholder (Phase 1 created this)

</code_context>

<specifics>
## Specific Ideas

- List layout preference: dense, scannable, traditional blog feel — NOT card grid or magazine style
- Tag chips: horizontal scrollable, always visible at top of list — NOT sidebar or dropdown
- TOC: sidebar on desktop is the standard for 二次元 blogs — drawer on mobile for accessibility
- Sticker pack: Bilibili default emotes are the community standard — immediately recognizable to the target audience
- Comments: always visible below article — no collapsible wrapper, comments are part of the reading experience
- RSS: both summary and full feeds — serve both casual and deep readers

</specifics>

<deferred>
## Deferred Ideas

- Password-protected posts — schema field exists but UI gating deferred to a later phase (v1.1+)
- Custom kawaii emote set — could complement Bilibili defaults in a future phase
- Email subscription (DISC-04-v1.x) — deferred per REQUIREMENTS.md until RSS subscribers >50

</deferred>

---

*Phase: 2-Core Content*
*Context gathered: 2026-06-03*
