# Roadmap: merlinalex.me

## Overview

A 二次元 (anime/kawaii) personal website that ships in 6 vertical-slice phases. Each phase delivers an end-to-end user-visible capability rather than horizontal layers — by the end of Phase 1 a visitor can land on a styled home + about page on production; by Phase 6 the site is the full immersive kawaii experience (Live2D mascot, BGM, petals, custom right-click, easter eggs) with articles, works modules, microblog, anime tracking, search, RSS, comments, and a tested production build on Cloudflare Pages. Mode is **mvp**: ship → validate → iterate; no enterprise PM theater. Granularity is **coarse** (3-5 plans per phase). Architecture is **static-first Astro v6 + Tailwind v4 + islands** with external services (Twikoo, Bangumi, MetingJS) consumed at build time or via opt-in islands. Accessibility (`prefers-reduced-motion` + atmosphere intensity toggle) is wired in Phase 1 — not retrofitted — so the immersive features in Phase 5 can ship safely.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Astro + Tailwind v4 + Zod schemas + BaseLayout + FOUC-safe theme + a11y baseline + Cloudflare Pages deploy + Home & About pages live
- [ ] **Phase 2: Core Content** - Articles index + detail UX + RSS + SEO L2 + Twikoo comments + sticker pack
- [ ] **Phase 3: Works + Friend Links** - Works hub + Projects module + Creations module + Friend Links page
- [ ] **Phase 4: Community + Search** - Microblog + Bangumi-driven anime/book/music + Timeline + Pagefind search + home widgets
- [ ] **Phase 5: Atmosphere** - Live2D mascot + falling petals + BGM + custom right-click + easter eggs + intensity gating
- [ ] **Phase 6: Polish** - Custom 404 + JSON-LD + friend-link health-check Action + tests at 80% + build hardening

## Phase Details

### Phase 1: Foundation

**Goal**: Visitor can load Home and About on production, toggle light/dark theme without FOUC, and `prefers-reduced-motion` respects them — atmosphere intensity hook is wired but inert (atmosphere ships in Phase 5).
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: PAGE-01, PAGE-02, ATM-04, INFRA-01, INFRA-02, INFRA-03, INFRA-06 (custom domain + 404 stub), A11Y-01, A11Y-02, SEO-01
**Success Criteria** (what must be TRUE):

  1. Visitor can open `https://merlinalex.me/` and see a styled Home page with hero, intro slot, and notice/announcement bar; page loads <2s on broadband
  2. Visitor can navigate to `/about` and see the persona card (avatar, MBTI, zodiac, blood type, skill bars, favorite anime/character list, Q&A)
  3. Visitor can toggle light/dark theme from the header; the choice persists across reload with zero FOUC (verified by manual hard-refresh + Lighthouse no-FOUC check)
  4. Visitor with `prefers-reduced-motion: reduce` sees no motion on first load, and the atmosphere intensity toggle (Off / Subtle / Full) is reachable, persisted in `localStorage`, and read by every future atmosphere component
  5. `sitemap.xml`, `robots.txt`, OG/Twitter cards, and the site is reachable via custom domain with HTTPS on Cloudflare Pages

**Plans**: 3 plans
**UI hint**: yes
Plans:

- [x] 01-01: Project scaffold + Zod schemas (Astro v6.4.2 + TS strict + Tailwind v4 via `@tailwindcss/vite` + MDX + Node 22 + pnpm; `src/content.config.ts` with 9 Zod-validated collections: articles, projects, creations, microblog, timeline, friends, anime, books, music)
- [x] 01-02: BaseLayout + theme system + a11y gates (BaseLayout.astro, FOUC-safe pre-paint inline theme script in `<head>`, light/dark CSS tokens via `@theme`, A11Y-01 intensity toggle scaffold, A11Y-02 `prefers-reduced-motion` global CSS rule)
- [x] 01-03: Home + About pages + Cloudflare Pages deploy (PAGE-01 hero + notice bar slot + latest stubs, PAGE-02 persona card, SEO-01 `@astrojs/sitemap` + robots.txt + OG/Twitter, custom domain + HTTPS, basic 404 stub returning HTTP 404)

### Phase 2: Core Content

**Goal**: Reader can browse, filter, read, comment on, and subscribe to articles — the blog half of the site is functionally complete.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: PAGE-03, PAGE-04, DISC-01, INFRA-04, INFRA-07, SEO-02
**Success Criteria** (what must be TRUE):

  1. Reader can visit `/articles`, filter by tag (tech / life / review / notes / …), and click into any article
  2. Reader on an article page sees TOC, syntax-highlighted code with copy button, reading time, last-updated stamp, image lightbox, prev/next + related component, share buttons, sticky/pinned support, copyright footer, top button, and (optional) password-protected gating
  3. Reader can subscribe to `/feed.xml` (summary) or `/feed-full.xml` (full content); both validate in the W3C feed validator and are autodiscovered via `<link rel="alternate">` in `<head>`
  4. Reader can post a comment via Twikoo (anonymous OK), pick a Bilibili-style sticker from the emote pack, and see admin email notifications fire for the owner
  5. Every article has alt text on images and a "Related posts" component in the footer (SEO-02)

**Plans**: 4 plans
**UI hint**: yes
Plans:
**Wave 1**

- [ ] 02-01: Articles index + utilities + nav (PAGE-03 tag filter + chronological sort; reading-time, tag-extraction, related-posts utilities; TagChips, ArticleListItem, StickyBadge components; Nav enablement)
- [ ] 02-02: Article detail page + all components (PAGE-04 TOC, code highlight via Shiki, copy-code, reading time, image lightbox, prev/next, related posts, share buttons, copyright footer, top button; medium-zoom install; welcome.md enrichment)

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 02-03: RSS + SEO L2 (DISC-01 `@astrojs/rss` for `/feed.xml` + `/feed-full.xml` with CDATA escaping and `<link rel="alternate">` autodiscovery; SEO-02 Related component + alt-text enforcement)

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 02-04: Twikoo deployment + integration + stickers (INFRA-04 separate Vercel project + MongoDB Atlas M0 with `envId` wired, admin email notifications, third-party image host configured, NO Vercel Authentication; INFRA-07 sticker/emote pack)

### Phase 3: Works + Friend Links

**Goal**: Visitor can explore both works modules (open-source projects vs creative works) with their distinct visual treatments, and reach friend-circle sites with a category-sorted, health-aware listing.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: PAGE-05, PAGE-06, PAGE-07, PAGE-08, INFRA-08 (UI badge stub — Action ships in Phase 6)
**Success Criteria** (what must be TRUE):

  1. Visitor can visit `/works`, see a hub linking to two clearly distinct modules (Projects and Creations), and reach each
  2. Visitor on `/works/projects` sees a card grid of open-source projects with tech-stack tags and GitHub star counts fetched at build time
  3. Visitor on `/works/creations` sees a masonry gallery of illustrations / photos / crafts / videos; clicking any tile opens a lightbox with caption
  4. Visitor can browse `/friends`, see friend cards sorted by category, find a submission entry (GitHub Issue link), and see a dead-link badge UI for any friend marked offline

**Plans**: 3 plans
**UI hint**: yes

Plans:

- [ ] 03-01: Works hub + Projects module (PAGE-05 hub layout linking both modules; PAGE-06 card grid + tech-stack tags + GitHub-stars build-time fetch with cache file `src/data/github-stars.json`)
- [ ] 03-02: Creations module (PAGE-07 masonry layout with responsive breakpoints + lightbox with caption, alt text, and keyboard navigation)
- [ ] 03-03: Friend Links + submission flow (PAGE-08 category-sorted card list, submission entry pointing to GitHub Issue template, dead-link badge UI consuming `src/data/friends-health.json` — the producer Action lands in Phase 6)

### Phase 4: Community + Search

**Goal**: Visitor can experience the "alive" side of the site — microblog stream, anime/book/music lists driven by Bangumi, life timeline, full-text article search, and home-page widgets that make the landing feel inhabited.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: PAGE-09, PAGE-10, PAGE-11, DISC-02, DISC-03, INFRA-05
**Success Criteria** (what must be TRUE):

  1. Visitor can view `/microblog`, see paginated 说说 with image lightbox + Twikoo comments; Home page shows only the 5 latest entries; posts older than 180 days auto-archive into a yearly archive
  2. Visitor can visit `/anime` (and `/books`, `/music`), see Bangumi-style watching / watched / want lists with cover art, ratings, and per-episode progress; data is build-time-fetched with a 12h TTL and a manual override file
  3. Visitor can scroll `/timeline` and see year-by-year milestones in a vertical alternating-side layout
  4. Visitor can full-text search articles via a Pagefind-powered input; results render in <100ms client-side; microblog is excluded from the index (`data-pagefind-filter="exclude"`); CJK queries work
  5. Visitor on Home sees Hitokoto random quote, site-stats widget (site runtime + article count + total words + busuanzi visitors), and the notice/announcement bar; `/archive` exposes tag cloud + chronological archive with single-use tags hidden

**Plans**: 4 plans
**UI hint**: yes

Plans:

- [ ] 04-01: Microblog feed (PAGE-09 paginated stream, image lightbox, Twikoo comments per entry, home-page 5-latest cap, >180d auto-archive grouping)
- [ ] 04-02: Bangumi-driven lists (PAGE-10 anime / books / music; INFRA-05 Bangumi v0 `/v0/users/{username}/collections` build-time fetch → `src/data/bangumi.json` 12h TTL, prebuild refresh script, manual override file for per-episode progress)
- [ ] 04-03: Timeline (PAGE-11 vertical alternating-side milestone layout, year grouping, image + caption + link support)
- [ ] 04-04: Search + tag cloud + home widgets (DISC-02 Pagefind articles-only index with microblog filter exclude; DISC-03 tag cloud + chronological archive with 0/1-post tag hiding; Hitokoto, site-stats, notice bar widgets on Home)

### Phase 5: Atmosphere

**Goal**: Visitor experiences the full immersive 二次元 vibe — Live2D mascot greets them, petals fall, BGM plays on demand, right-click reveals a custom menu, and easter eggs reward exploration. Every effect is gated behind the intensity toggle from Phase 1 and respects `prefers-reduced-motion`.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: ATM-01, ATM-02, ATM-03, ATM-05, ATM-06, INFRA-06 (BGM portion via APlayer + MetingJS)
**Success Criteria** (what must be TRUE):

  1. Visitor on a capable device (`navigator.deviceMemory >= 4 && hardwareConcurrency >= 4`) sees a Live2D mascot hydrated `client:visible` after first paint, with model switcher and greeting; low-end devices and `Off` intensity get a static PNG fallback
  2. Visitor with `Subtle` or `Full` intensity sees falling petals (theme-linked color, ≤20 on mobile, 30 FPS cap, paused on `document.hidden`); `Off` intensity and `prefers-reduced-motion` disable them entirely
  3. Visitor pressing `Shift+right-click` (desktop) or long-pressing (mobile) sees a custom menu (terminal, home, sponsor, intensity selector) — the global `contextmenu` is never hijacked
  4. Visitor can play site-wide BGM (APlayer v1.10.1 + MetingJS v2.0.2, muted by default with an explicit unmute button, single-track + playlist modes, iOS `AudioContext.resume()` on touch); music resumes across navigation via Astro `transition:persist`
  5. Visitor entering the Konami code triggers a hidden easter egg (secret terminal); key events inside `input`, `textarea`, and `contenteditable` are ignored; atmosphere intensity toggle from Phase 1 visibly gates Live2D + petals + BGM

**Plans**: 5 plans
**UI hint**: yes

Plans:

- [ ] 05-01: Intensity gate wiring + date-based atmosphere tweaks (wire the Phase 1 intensity toggle into a runtime gate consumed by every atmosphere island; lightweight date-based color tweaks for 2-3 dates max — no full holiday variant work)
- [ ] 05-02: Falling petals + cursor trail (ATM-02 tsParticles with Astro wrapper, theme-linked color, ≤20 on mobile, 30 FPS throttle, `document.hidden` pause, reduced-motion + intensity gates)
- [ ] 05-03: BGM player (ATM-05 + INFRA-06 BGM: APlayer + MetingJS, muted-by-default + unmute button, single-track + playlist, iOS `AudioContext.resume()` in `click`/`touchend`, `transition:persist` across nav)
- [ ] 05-04: Live2D mascot (ATM-01 l2d-widget v0.1.0, device-capability gate, `client:visible` hydration, WebP/AVIF textures, static PNG fallback, model switcher with greeting; license + acquisition decision logged)
- [ ] 05-05: Right-click menu + easter eggs (ATM-03 `Shift+right-click` only + long-press toolbar fallback + intensity selector entry; ATM-06 Konami code + secret terminal + input-field guards)

### Phase 6: Polish

**Goal**: Site ships production-ready — custom kawaii 404 returning the correct status, JSON-LD structured data on every article, friend-link health-check Action running on cron, ≥80% Vitest + Playwright coverage on critical paths, build hardened for Cloudflare Pages.
**Mode:** mvp
**Depends on**: Phase 5
**Requirements**: INFRA-06 (404 polish + JSON-LD), INFRA-08 (GitHub Action cron implementation), TEST-01, GIT-01
**Success Criteria** (what must be TRUE):

  1. Visitor hitting any non-existent URL sees a custom 二次元-styled 404 page with `Astro.response.status = 404`; HTTP response is verified `HTTP/2 404` via `curl -I`
  2. Search engines crawling any article see `Article` + `Person` + `BreadcrumbList` JSON-LD blocks in `<head>`; validated in Google Rich Results Test
  3. Friend-link health-check GitHub Action runs daily on cron, sends a 5s-timeout HEAD request to each friend, publishes `friends-health.json` for the Phase 3 UI, and dead friends render with the offline badge automatically
  4. Critical paths — comment posting (Twikoo island), theme persistence, search index, Live2D fallback, BGM unmute, reduced-motion gate — have ≥80% combined Vitest + Playwright coverage; CI fails below threshold
  5. Production build succeeds on Cloudflare Pages with `NODE_OPTIONS=--max-old-space-size=4096` and Sharp output caching; full build completes inside the 500 builds/month free quota with margin

**Plans**: 3 plans
**UI hint**: yes

Plans:

- [ ] 06-01: Custom 404 + JSON-LD (INFRA-06 final: kawaii 404 page returning HTTP 404; `Article` + `Person` + `BreadcrumbList` JSON-LD via reusable Astro components; Rich Results Test validation)
- [ ] 06-02: Friend-link health-check Action (INFRA-08 GitHub Action cron, 5s HEAD timeout per friend, writes `friends-health.json` consumed by Phase 3 UI; failure thresholds; admin notification on >5 dead links)
- [ ] 06-03: Tests + build hardening (TEST-01 Vitest unit + Playwright E2E with ≥80% on critical paths and CI gate; GIT-01 `NODE_OPTIONS=--max-old-space-size=4096` + Sharp output cache in `wrangler.toml` / CF Pages env)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | yes |
| 2. Core Content | 0/4 | Planned | - |
| 3. Works + Friend Links | 0/3 | Not started | - |
| 4. Community + Search | 0/4 | Not started | - |
| 5. Atmosphere | 0/5 | Not started | - |
| 6. Polish | 0/3 | Not started | - |

**Totals:** 6 phases, 22 plans, 3/22 (14%) complete.

---

## Coverage Validation

Every v1 requirement maps to exactly one phase (compound requirements like INFRA-06 and INFRA-08 are noted with their sub-scope in parentheses to keep one-phase-per-requirement integrity).

| Phase | Requirements | Count |
|-------|--------------|-------|
| 1. Foundation | PAGE-01, PAGE-02, ATM-04, INFRA-01, INFRA-02, INFRA-03, INFRA-06 (domain + 404 stub), A11Y-01, A11Y-02, SEO-01 | 10 |
| 2. Core Content | PAGE-03, PAGE-04, DISC-01, INFRA-04, INFRA-07, SEO-02 | 6 |
| 3. Works + Friend Links | PAGE-05, PAGE-06, PAGE-07, PAGE-08, INFRA-08 (UI badge stub) | 5 |
| 4. Community + Search | PAGE-09, PAGE-10, PAGE-11, DISC-02, DISC-03, INFRA-05 | 6 |
| 5. Atmosphere | ATM-01, ATM-02, ATM-03, ATM-05, ATM-06, INFRA-06 (BGM portion) | 6 |
| 6. Polish | INFRA-06 (404 + JSON-LD), INFRA-08 (cron Action), TEST-01, GIT-01 | 3 |

**Coverage:** 36 requirement scopes mapped across 6 phases. No orphans. PAGE-12 (avatar generator) is deferred to v2 per REQUIREMENTS.md (Picrew link embed handled inline by Phase 2 article content authoring, not as a discrete requirement).

---

*Roadmap derived: 2026-06-02 from requirements + research synthesis*
*Mode: mvp · Granularity: coarse*
