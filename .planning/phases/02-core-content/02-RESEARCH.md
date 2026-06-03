# Phase 2: Core Content - Research

**Researched:** 2026-06-03
**Domain:** Blog content pages, RSS feeds, Twikoo comments, SEO enhancements
**Confidence:** HIGH

## Summary

Phase 2 delivers the blog half of the site: articles index with tag filtering, article detail pages with full UX (TOC, code highlighting, lightbox, navigation), RSS feeds (summary + full-content), Twikoo comment integration with Bilibili-style stickers, and SEO enhancements (related posts, alt text enforcement).

The article schema is already defined in `src/content.config.ts` with all required fields (title, publishedAt, updatedAt, tags, draft, description, cover, category, sticky, password, toc). The existing `LatestArticles.astro` component provides a reusable card pattern. The `BaseLayout.astro` with its FOUC-safe theme gate and `SEOMeta.astro` component are ready to extend.

**Primary recommendation:** Build on existing patterns. Use `@astrojs/rss` for feeds (official, well-documented), `medium-zoom` for image lightbox (lightweight, keyboard-friendly), and Twikoo CDN for comments (proven, OwO-compatible sticker format).

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Articles Index Layout (D-01):** Single-column list/rows with title, excerpt, date, category pill. Dense, scannable, traditional blog feel. Horizontal scrollable chip bar for tag filtering. Sticky posts float to top, then newest by `publishedAt` descending. No sort dropdown.
- **Article Detail UX (D-02):** Sticky left sidebar TOC on desktop (>1024px), collapsible drawer on mobile. Shiki syntax highlighting (theme-aware). Prev/next as arrow cards. Related posts as 3-card grid matched by shared tags. Password protection skipped for v1 (schema field exists, no UI gating). Image lightbox with keyboard dismiss. Reading time from word count. Share buttons as simple icon links. Copyright footer with standard CN blog pattern. Floating scroll-to-top button.
- **RSS Feed Strategy (D-03):** Two feeds: `/feed.xml` (summary) and `/feed-full.xml` (full content). Autodiscovery via `<link rel="alternate">`. Entry metadata: title, description, published date, author, category, cover image. Tags NOT included as RSS categories. CDATA escaping. Both feeds must pass W3C Feed Validation Service. Draft exclusion.
- **Twikoo Comment Integration (D-04):** Comment section below article content, always visible. Fully anonymous identity model. Bilibili default emote set. Admin email notifications. Separate Vercel project + MongoDB Atlas M0. `envId` via environment variable. No Vercel Authentication. Third-party image host for sticker hosting. Styled to match site theme.
- **SEO-02: Related Posts + Alt Text (D-05):** 3-card grid below article, matched by shared tags. Algorithm: count shared tags, sort by count descending, take top 3. Fill with most recent if <3 matches. All images must have alt text. Build-time check or lint rule for alt text enforcement.

### Claude's Discretion
- Specific Tailwind/CSS classes for the list layout, chip styling, and card designs
- Shiki theme selection (recommend `github-light` + `github-dark` or `min-light` + `min-dark`)
- IntersectionObserver thresholds for TOC highlight
- Image lightbox library choice (recommend `medium-zoom` — lightweight, keyboard-friendly)
- Twikoo CSS customization depth (recommend overriding `--twikoo-*` CSS variables)
- Reading time calculation constants (chars-per-minute for CJK vs Latin)
- File organization for new components (recommend `src/components/articles/` and `src/components/rss/`)

### Deferred Ideas (OUT OF SCOPE)
- Password-protected posts — schema field exists but UI gating deferred to v1.1+
- Custom kawaii emote set — could complement Bilibili defaults in a future phase
- Email subscription (DISC-04-v1.x) — deferred until RSS subscribers >50

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAGE-03 | Articles index with tag-based filtering | Astro Content Collections `getCollection()` with tag extraction; horizontal chip bar pattern |
| PAGE-04 | Article detail with TOC, code highlight, reading time, last-updated, share buttons, copy-code, image lightbox, prev/next + related, sticky, copyright footer, top button, password-protected posts | Shiki (bundled in Astro), medium-zoom for lightbox, IntersectionObserver for TOC, tag-based related posts algorithm |
| DISC-01 | RSS feed with CDATA escaping, W3C validation, autodiscovery | `@astrojs/rss` v4.0.18 — official integration, supports summary + full-content feeds |
| INFRA-04 | Twikoo comments on Vercel + MongoDB Atlas | Twikoo v1.7.11 CDN integration, OwO-format sticker packs, Vercel deployment with MONGODB_URI |
| INFRA-07 | Sticker/emote pack for Twikoo | OwO JSON format — categories with type (emoticon/emoji/image) + container array |
| SEO-02 | Related posts + alt text enforcement | Tag-overlap algorithm, markdown lint `no-alt-text` rule or build-time check |

## Architectural Responsibility Map

> Each module has an assigned tier: **Core** (directly satisfies a requirement), **Supporting** (enables a Core module), or **Infrastructure** (cross-cutting concern).

| Module | Tier | Requirement(s) | Files |
|--------|------|----------------|-------|
| Articles index page | Core | PAGE-03 | `src/pages/articles/index.astro` |
| Tag filtering (static paths) | Core | PAGE-03 | `src/pages/articles/index.astro` |
| Tag extraction utility | Supporting | PAGE-03 | `src/utils/tag-extraction.ts` |
| TagChips component | Core | PAGE-03 | `src/components/articles/TagChips.astro` |
| ArticleListItem component | Core | PAGE-03 | `src/components/articles/ArticleListItem.astro` |
| StickyBadge component | Supporting | PAGE-03 | `src/components/articles/StickyBadge.astro` |
| Article detail page | Core | PAGE-04 | `src/pages/articles/[id].astro` |
| ArticleTOC component | Core | PAGE-04 | `src/components/articles/ArticleTOC.astro` |
| CopyCodeButton component | Core | PAGE-04 | `src/components/articles/CopyCodeButton.astro` |
| ImageLightbox component | Core | PAGE-04 | `src/components/articles/ImageLightbox.astro` |
| ArticleNav component | Core | PAGE-04 | `src/components/articles/ArticleNav.astro` |
| RelatedPosts component | Core | PAGE-04, SEO-02 | `src/components/articles/RelatedPosts.astro` |
| ShareButtons component | Core | PAGE-04 | `src/components/articles/ShareButtons.astro` |
| CopyrightFooter component | Core | PAGE-04 | `src/components/articles/CopyrightFooter.astro` |
| TopButton component | Core | PAGE-04 | `src/components/articles/TopButton.astro` |
| ReadingMeta component | Core | PAGE-04 | `src/components/articles/ReadingMeta.astro` |
| Reading time utility | Supporting | PAGE-04 | `src/utils/reading-time.ts` |
| Related posts utility | Supporting | PAGE-04, SEO-02 | `src/utils/related-posts.ts` |
| RSS summary feed | Core | DISC-01 | `src/pages/feed.xml.ts` |
| RSS full-content feed | Core | DISC-01 | `src/pages/feed-full.xml.ts` |
| RSSLink component | Supporting | DISC-01 | `src/components/rss/RSSLink.astro` |
| Twikoo comment component | Core | INFRA-04 | `src/components/comments/TwikooComments.astro` |
| Sticker pack | Core | INFRA-07 | `src/data/stickers.json` |
| Nav enablement | Supporting | PAGE-03 | `src/components/core/Nav.astro` (modified) |
| SEOMeta extension | Infrastructure | DISC-01 | `src/components/seo/SEOMeta.astro` (modified) |
| Footer RSS link | Infrastructure | DISC-01 | `src/components/core/Footer.astro` (modified) |

**Tier validation:**
- All Core modules map to exactly one requirement ID (or two when the module directly satisfies both, e.g., RelatedPosts for PAGE-04 + SEO-02)
- All Supporting modules enable exactly one Core module
- Infrastructure modules are cross-cutting (modified existing files)

## Codebase Patterns

### Existing code to reuse

| File | Reuse for | Pattern |
|------|-----------|---------|
| `src/components/home/LatestArticles.astro` | RelatedPosts, ArticleListItem | Card layout, hover effects, responsive grid |
| `src/layouts/BaseLayout.astro` | Both pages | Theme gate, SEOMeta, Header/Footer |
| `src/components/seo/SEOMeta.astro` | RSS autodiscovery | Extend `<head>` with additional `<link>` |
| `src/components/core/Footer.astro` | RSSLink | Add icon link to social links row |
| `src/components/core/Nav.astro` | Enable articles link | Remove `disabled: true` |
| `src/pages/index.astro` | Both pages | `getCollection()` + filter + sort + BaseLayout |
| `src/content.config.ts` | Both pages | Article schema fields for filtering and display |

### Code to avoid / replace

| Current Pattern | Why Avoid | Replacement |
|-----------------|-----------|-------------|
| `src/pages/index.astro` grid layout | D-01 requires single-column list | `display: flex` or full-width block |
| No tag filtering in existing pages | New feature | `getStaticPaths` with tag paths |
| No client-side JS in existing pages | TOC + copy + lightbox need JS | `client:idle`, `client:load`, `client:visible` directives |

### Integration points

| Point | How to Connect | Risk |
|-------|---------------|------|
| `src/content.config.ts` → article pages | `getCollection('articles')` + `render()` | `render()` is new API in Astro 5 — verify it works |
| `SEOMeta.astro` → RSS feeds | Add `<link rel="alternate">` | May need to pass feed URLs as props |
| `Footer.astro` → RSSLink | Import component | Simple — no risk |
| `Nav.astro` → articles | Remove `disabled: true` | Simple — no risk |
| `BaseLayout.astro` → article pages | Pass `type="article"` for OG | Already supports this prop |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build | ✓ | 22.x | — |
| pnpm | Package manager | ✓ | — | — |
| Twikoo CDN | Comments | ✓ | 1.7.11 | Self-host if CDN fails |
| MongoDB Atlas | Twikoo backend | ✓ | M0 free tier | — |
| Vercel | Twikoo backend | ✓ | Hobby tier | — |

**Missing dependencies with no fallback:**
- None — all dependencies are available

**Missing dependencies with fallback:**
- None

## Validation Architecture

> `workflow.nyquist_validation` is explicitly set to `false` in config. Skipping detailed test mapping.

**Test framework:** Vitest (unit) + Playwright (E2E) — already configured in Phase 1.

**Phase 2 test considerations:**
- Unit tests for `reading-time.ts`, `tag-extraction.ts`, `related-posts.ts`
- E2E tests for: tag filtering navigation, article detail page loads, Twikoo comments render, RSS feed validates
- Skip: medium-zoom behavior (visual), TOC scroll highlighting (timing-dependent)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No user accounts; Twikoo is anonymous |
| V3 Session Management | No | No sessions; state is localStorage only |
| V4 Access Control | No | All content is public |
| V5 Input Validation | Yes | Twikoo comment input sanitized by Twikoo; RSS content sanitized by `sanitize-html` |
| V6 Cryptography | No | No encryption needed |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via Twikoo comments | Tampering | Twikoo sanitizes input; `sanitize-html` for RSS |
| RSS feed injection | Tampering | `@astrojs/rss` handles escaping; `sanitize-html` for content |
| Image URL injection | Information Disclosure | Validate image URLs in frontmatter; use `astro:assets` for optimization |

## Sources

### Primary (HIGH confidence)
- Astro RSS docs: https://docs.astro.build/en/guides/rss/
- Twikoo frontend docs: https://twikoo.js.org/frontend.html
- Twikoo backend docs: https://twikoo.js.org/backend.html
- Twikoo FAQ: https://twikoo.js.org/faq.html
- OwO format demo: https://cdn.jsdelivr.net/npm/owo@1.0.2/demo/OwO.json
- npm registry: `@astrojs/rss@4.0.18`, `medium-zoom@1.1.0`, `twikoo@1.7.11`

### Secondary (MEDIUM confidence)
- Phase 1 research: `.planning/research/STACK.md`, `.planning/research/FEATURES.md`, `.planning/research/PITFALLS.md`
- Phase 1 context: `.planning/phases/01-foundation/01-CONTEXT.md`, `.planning/phases/01-foundation/01-PATTERNS.md`

### Tertiary (LOW confidence)
- Twikoo sticker pack URLs — exact Bilibili emote CDN URLs not verified against official source

## Open Questions (RESOLVED)

1. **Twikoo sticker pack source** (RESOLVED)
   - What we know: OwO format is supported, Bilibili default emotes are the target
   - What's unclear: Exact CDN URLs for Bilibili emote images
   - Resolution: Use Bilibili's public CDN URLs (`https://i0.hdslb.com/bfs/emote/{hash}.png`) for the standard emote set. If exact hashes are unavailable, use placeholder URLs with a note for the owner to replace them. The sticker pack structure (OwO JSON format) is well-documented.

2. **Full-content RSS image handling** (RESOLVED)
   - What we know: Relative URLs in RSS content need to be absolute
   - What's unclear: Whether `markdown-it` automatically resolves relative image paths
   - Resolution: `markdown-it` does NOT resolve relative URLs. Post-process rendered HTML to convert relative image URLs to absolute using `new URL(path, context.site).toString()`. This is specified in Plan 02-03 Task 1.

3. **TOC heading depth** (RESOLVED)
   - What we know: TOC should show headings from articles
   - What's unclear: Which heading levels to include (h2-h3? h2-h4?)
   - Resolution: Include h2 and h3 only (per D-02). This is specified in Plan 02-02 Task 1 (ArticleTOC component).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified via npm registry, Astro docs, and Twikoo docs
- Architecture: HIGH — follows established Astro patterns from Phase 1
- Pitfalls: HIGH — based on official documentation and Phase 1 research

**Research date:** 2026-06-03
**Valid until:** 2026-07-03 (30 days — stable stack, no major version changes expected)
