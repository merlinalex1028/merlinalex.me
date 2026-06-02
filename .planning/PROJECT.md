# merlinalex.me — Personal Site (二次元可爱风)

## What This Is

A 二次元 (anime) aesthetic personal website for merlinalex — a single-author site that doubles as a blog, portfolio, and small community hub for anime friends and tech-circle readers. The feel is **fully immersive kawaii** (Live2D mascot, falling petals, custom right-click, BGM, theme switching) but the content structure stays practical: mixed-genre articles sorted by tags, two distinct works modules (open-source projects vs creative works), and a tight set of community modules (friend links, RSS, microblog, anime/book/music lists, timeline).

## Core Value

A personal space that **feels alive and uniquely mine** — visitors (mostly the owner + close circle) should feel they're stepping into a little world, not scrolling a generic blog.

## Requirements

### Validated

(None yet — ship to validate)

### Active

#### Pages & Navigation
- [ ] **PAGE-01**: Home / landing page with intro, latest articles, recent microblog posts
- [ ] **PAGE-02**: About page with second-anime persona card + bio
- [ ] **PAGE-03**: Articles index with tag-based filtering (tags: tech, life, review, notes…)
- [ ] **PAGE-04**: Article detail page with code highlighting, TOC, reading time
- [ ] **PAGE-05**: Works hub linking to two modules
- [ ] **PAGE-06**: Works → Projects module (open-source, tools, websites) with tech-stack tags
- [ ] **PAGE-07**: Works → Creations module (illustrations, photos, crafts, videos)
- [ ] **PAGE-08**: Friend Links page with submission entry
- [ ] **PAGE-09**: Microblog (说说 / 碎碎念) feed
- [ ] **PAGE-10**: Anime / Book / Music list pages (Bangumi-style: watching / watched / want)
- [ ] **PAGE-11**: Timeline / Journey page (year-by-year milestones)
- [ ] **PAGE-12**: Avatar generator (lets visitors generate a kawaii avatar in the site's style)

#### Atmosphere & Decorations
- [ ] **ATM-01**: Live2D / static mascot (kanban girl) — interactive: greeting, dress-up, model switcher
- [ ] **ATM-02**: Falling-petal / snow / cursor-trail effects, theme-linked
- [ ] **ATM-03**: Custom right-click menu (terminal, home, sponsor…)
- [ ] **ATM-04**: Theme switcher (light / dark / holiday variants) with persistence
- [ ] **ATM-05**: Site-wide BGM player with playlist, single-track mode, resume-on-return
- [ ] **ATM-06**: Hidden easter eggs (Konami code, etc.)

#### Discovery & Growth
- [ ] **DISC-01**: RSS feed + email subscription
- [ ] **DISC-02**: Site-wide search across articles / works / microblog
- [ ] **DISC-03**: Tag cloud + chronological archive

#### Infrastructure
- [ ] **INFRA-01**: Static site generation (Astro recommended; Hexo fallback for theme ecosystem)
- [ ] **INFRA-02**: Free hosting on Vercel / Cloudflare Pages with global CDN + auto HTTPS
- [ ] **INFRA-03**: Comment system via Twikoo (third-party, no self-built accounts)
- [ ] **INFRA-04**: Bangumi API integration for anime tracking
- [ ] **INFRA-05**: APlayer + MetingJS for music playlist
- [ ] **INFRA-06**: Custom domain + 404 page

### Out of Scope

- [ ] User accounts / login / profile pages — Visitor accounts not needed; comments are anonymous via 3rd party
- [ ] Real-time chat / danmaku — Defer to v2; high complexity
- [ ] Video posts / podcast hosting — Bandwidth/storage too costly for v1
- [ ] E-commerce / shop — Out of scope entirely
- [ ] Lottery / gashapon interactive games — Defer to v2
- [ ] Site statistics / visitor analytics dashboard — Not core to "alive" feel
- [ ] Guestbook (separate from comments) — Comments sufficient for v1
- [ ] Random-image / random-quote widget — Defer; low value

## Context

- **Owner**: merlinalex — single author, dual audience (anime friends + tech circle)
- **Site purpose**: personal expression first, content distribution second, no monetization
- **Inspiration**: classic 二次元博客 (Sakura, Yun, Butterfly themes), modern dev blogs (Astro/Next personal sites)
- **Technical environment**: macOS, zsh, prefers free-tier + 3rd-party services over self-hosting
- **Domain**: merlinalex.me (assumed registered; final TBD)

## Constraints

- **Stack**: Static-site generator (Astro recommended) + free CDN hosting; no self-hosted database in v1
- **Cost**: $0/month — must run on free tiers only
- **Accounts**: No user accounts; comments via Twikoo (3rd-party)
- **Hosting**: Vercel / Cloudflare Pages (free, global CDN, auto HTTPS)
- **Style**: 沉浸二次元 — full anime atmosphere expected, not "tasteful minimalist"
- **Performance**: Static-rendered pages should load <2s on broadband; Live2D model must not block first paint
- **Browser support**: Latest Chrome / Safari / Edge; mobile responsive required

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static site over SPA | v1 has no accounts, no real-time data; static is faster, cheaper, simpler | — Pending |
| Astro over Hexo | Modern build, better DX, more flexibility; Hexo is fallback for theme ecosystem | — Pending |
| Twikoo for comments | Free, Vercel-deployable, no DB setup; supports anonymous + admin | — Pending |
| Mixed-genre articles with tag system | Avoid splitting "tech blog" and "life blog" into two sites; tags give flexibility | — Pending |
| Two distinct works modules (Projects + Creations) | Different audiences and visual treatments; mixing confuses the layout | — Pending |
| Live2D mascot in v1 | Core to "沉浸二次元" promise; load-deferred to not block first paint | — Pending |
| No accounts / no self-hosted DB | Constraint from owner; simplifies hosting, defers moderation complexity | — Pending |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-02 after initialization*
