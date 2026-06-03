# Phase 2: Core Content - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 2-Core Content
**Areas discussed:** Articles index layout, Article detail UX, RSS + feed strategy, Twikoo integration

---

## Articles Index Layout

### Q1: How should the /articles index page be laid out?

| Option | Description | Selected |
|--------|-------------|----------|
| Card grid | 3-column responsive grid with card hover effects. Consistent with LatestArticles on Home. | |
| List / rows | Single-column list with left-aligned metadata. Traditional blog feel, denser information per screen. | ✓ |
| Magazine style | Mixed layout — featured/sticky as wide hero, rest in 2-column grid. More editorial. | |

**User's choice:** List / rows
**Notes:** Dense, scannable, traditional blog feel preferred.

### Q2: How should tag filtering work on the articles index?

| Option | Description | Selected |
|--------|-------------|----------|
| Horizontal chips | Horizontal scrollable chip bar at top. All/Tech/Life/Review/Notes as pill buttons. | ✓ |
| Tag cloud with counts | Tag cloud section above list showing all tags with post counts. | |
| Sidebar filter | Sidebar on desktop (sticky), collapsible drawer on mobile. | |

**User's choice:** Horizontal chips (Recommended)
**Notes:** Mobile-friendly, always visible, one-tap filter.

### Q3: What sorting options should be available on the articles index?

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky + newest only | Sticky posts first, then newest by publishedAt descending. Simple, predictable. | ✓ |
| Dropdown sort options | Small dropdown with: Newest / Oldest / By Category. | |
| Newest + year archive | Default newest-first + archive-by-year expandable sections below. | |

**User's choice:** Sticky + newest only (Recommended)
**Notes:** Simple is better for a personal blog.

### Q4: How should category be displayed on the articles index list items?

| Option | Description | Selected |
|--------|-------------|----------|
| Category pill on list | Show category as colored pill/badge on each list item. Tags secondary. | ✓ |
| Category + tags on list | Show both category AND up to 2-3 tags as small pills. | |
| Minimal — detail only | Only title, excerpt, date on list. Category/tags on detail page only. | |

**User's choice:** Category pill on list (Recommended)
**Notes:** Categories become primary visual grouping on the index.

---

## Article Detail UX

### Q1: How should the Table of Contents be displayed on article pages?

| Option | Description | Selected |
|--------|-------------|----------|
| Sidebar + mobile drawer | Sticky left sidebar on desktop (>1024px), collapsible drawer on mobile. | ✓ |
| Floating button overlay | Floating TOC button in bottom-right corner. Tap to expand overlay. | |
| Inline collapsible | Inline TOC at top of article, collapsible. Simple, no sidebar complexity. | |

**User's choice:** Sidebar + mobile drawer (Recommended)
**Notes:** Standard for 二次元 blogs. Highlights current heading on scroll.

### Q2: How should code blocks be styled on article pages?

| Option | Description | Selected |
|--------|-------------|----------|
| Shiki + line numbers + copy | Shiki syntax highlighting (theme-aware), line numbers, copy-code button top-right. | ✓ |
| Shiki + copy, no line numbers | Shiki highlighting + copy button, no line numbers. Cleaner look. | |
| Full — with language badge | Shiki + line numbers + copy + language label badge. Maximum info density. | |

**User's choice:** Shiki + line numbers + copy (Recommended)
**Notes:** Standard dev blog pattern. Already bundled with Astro.

### Q3: How should article navigation (prev/next) and related posts be displayed?

| Option | Description | Selected |
|--------|-------------|----------|
| Arrow nav + related grid | Prev/next as left/right arrow cards. Related posts as 3-card grid below, matched by tags. | ✓ |
| Minimal text links | Prev/next as minimal text links. Related posts as simple list. | |
| Prev/next only | Prev/next only, no related posts section. | |

**User's choice:** Arrow nav + related grid (Recommended)
**Notes:** Related posts matched by shared tags (most shared = highest relevance).

### Q4: How should password-protected articles work?

| Option | Description | Selected |
|--------|-------------|----------|
| Prompt dialog + session memory | Simple prompt dialog, password in frontmatter, content masked until correct. | |
| Inline form with preview | Inline password form embedded in article page with preview above form. | |
| Skip for now | Schema field exists but no UI gating in v1. | ✓ |

**User's choice:** Skip for now
**Notes:** Password field exists in schema but UI gating deferred to v1.1+.

---

## RSS + Feed Strategy

### Q1: What feed content should RSS provide?

| Option | Description | Selected |
|--------|-------------|----------|
| Both summary + full | Two feeds: /feed.xml (summary) and /feed-full.xml (full content). | ✓ |
| Full content only | Single full-content feed at /feed.xml. | |
| Summary only | Single summary feed at /feed.xml. Drives traffic back to site. | |

**User's choice:** Both summary + full (Recommended)
**Notes:** Readers choose which to subscribe to. Catches both casual and deep readers.

### Q2: How should RSS feed discovery work for visitors?

| Option | Description | Selected |
|--------|-------------|----------|
| Footer icon + autodiscovery | RSS icon in footer (global) + `<link rel="alternate">` in `<head>`. | ✓ |
| Header nav icon | RSS icon in header nav bar next to theme switcher. | |
| Page-level subscribe banner | Small banner on /articles page: "Subscribe via RSS" with icon. | |

**User's choice:** Footer icon + autodiscovery (Recommended)
**Notes:** Standard pattern, no intrusive prompts.

### Q3: What metadata should each RSS feed entry include?

| Option | Description | Selected |
|--------|-------------|----------|
| Standard fields + cover | Title, description, published date, author, category, cover image. | ✓ |
| Minimal fields only | Title, description, date, author. No images. | |
| Full metadata + tags as categories | Everything including tags as RSS categories. | |

**User's choice:** Standard fields + cover (Recommended)
**Notes:** Standard RSS 2.0 fields. Tags NOT included as RSS categories (site-internal).

---

## Twikoo Integration

### Q1: Where should the Twikoo comment section be placed on article pages?

| Option | Description | Selected |
|--------|-------------|----------|
| Below article, above nav | Comments section below content, above prev/next nav. Always visible. | ✓ |
| Collapsible section | "查看评论 (N)" button that expands comment area. | |
| Side panel | Comments in floating tab/panel on right side. | |

**User's choice:** Below article, above nav (Recommended)
**Notes:** Standard blog pattern. Comments are part of the reading experience.

### Q2: What sticker/emote pack should Twikoo comments use?

| Option | Description | Selected |
|--------|-------------|----------|
| Bilibili default emotes | Use Bilibili's default emote set. Well-known, no design work needed. | ✓ |
| Custom kawaii emotes | Custom emote set matching site's kawaii aesthetic. | |
| Bilibili base + custom additions | Bilibili emotes as base + a few custom site-specific emotes. | |

**User's choice:** Bilibili default emotes (Recommended)
**Notes:** Immediately recognizable to the CN二次元 community.

### Q3: What commenting identity model should Twikoo use?

| Option | Description | Selected |
|--------|-------------|----------|
| Anonymous with nickname | Fully anonymous — nickname + optional email/URL. No login required. | ✓ |
| Anonymous + optional Gravatar | Anonymous but with optional Gravatar support if email provided. | |
| Fully anonymous, no email | Anonymous only, no email field at all. Maximum privacy. | |

**User's choice:** Anonymous with nickname (Recommended)
**Notes:** Matches the "no accounts" constraint. Admin identified by email match.

### Q4: How should comment notifications work for the site admin?

| Option | Description | Selected |
|--------|-------------|----------|
| Email on new comment | Email notifications to admin on every new comment. Reply notifications to commenters with email. | ✓ |
| Manual check only | No notifications. Check comments via Twikoo admin panel. | |
| Email + WeChat | Email + WeChat notification via Twikoo's WeCom/ServerChan integration. | |

**User's choice:** Email on new comment (Recommended)
**Notes:** Standard Twikoo feature. Reply notifications to commenters who leave email.

---

## Claude's Discretion

- Specific Tailwind/CSS classes for list layout, chip styling, card designs
- Shiki theme selection (recommend `github-light` + `github-dark`)
- IntersectionObserver thresholds for TOC highlight
- Image lightbox library choice (recommend `medium-zoom` or custom)
- Twikoo CSS customization depth (recommend overriding `--twikoo-*` CSS variables)
- Reading time calculation constants (chars-per-minute for CJK vs Latin)
- File organization for new components

## Deferred Ideas

- Password-protected posts — schema field exists, UI gating deferred to v1.1+
- Custom kawaii emote set — could complement Bilibili defaults in a future phase
- Email subscription (DISC-04-v1.x) — deferred per REQUIREMENTS.md until RSS subscribers >50
