# Feature Research

**Domain:** 二次元 (anime/kawaii) personal blog + portfolio + small community hub
**Researched:** 2026-06-02
**Confidence:** HIGH for theme conventions and SSG features (verified via Butterfly/Yun/Valaxy/Astro docs + Waline/Twikoo/APlayer/Picrew); MEDIUM for "what differentiators actually matter" (genre-specific, judgment call from owner)

---

## Executive Verdict on the v1 Plan in PROJECT.md

**Validated as table stakes for the genre (keep as-is):** PAGE-01 to PAGE-04, PAGE-08, PAGE-09, ATM-04, INFRA-01 to INFRA-03, INFRA-06, DISC-01 (RSS portion), DISC-02 (articles portion), DISC-03.

**Validated as core differentiators (keep, but tighten scope):** PAGE-05/06/07 (dual works modules), PAGE-10 (Bangumi-style lists), PAGE-11 (timeline), PAGE-02 (persona card), ATM-01 (Live2D), ATM-02 (petals), ATM-03 (right-click), ATM-05 (BGM), ATM-06 (easter eggs).

**Flagged as scope risk — recommend trimming for v1:** PAGE-12 (avatar generator — HIGH cost, marginal value), ATM-01 "dress-up + model switcher" sub-features, ATM-04 "holiday variants," DISC-01 email subscription, DISC-02 "across works + microblog" cross-collection search.

**Critical gaps to add to v1:** article-level UX (copy code, image lightbox, prev/next, lightbox), home-page widgets (Hitokoto, runtime, visitor counter, notice bar), prefers-reduced-motion / atmosphere disable toggle (accessibility, not optional), sticker/emote packs for comments, social OG/Twitter cards + sitemap, Pagefind for search, 加密文章 (password-protected posts), book + game tracking inside PAGE-10.

**One conflict in PROJECT.md to resolve:** "random-image / random-quote widget" is listed in Out of Scope, but Hitokoto-style random quotes are table stakes in the 二次元 genre. Recommend re-classifying Hitokoto as in-scope.

---

## Feature Landscape

### Table Stakes (Users Expect These)

These are non-negotiable for the genre. A 二次元 blog without them feels broken or "off-brand." All major themes in this space (Butterfly, Yun/Valaxy, Sakura, Stellar) ship these.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Home with hero + latest articles + latest 说说** | Standard landing pattern across all 二次元 themes | LOW | Already PAGE-01 ✓ |
| **Article list with tag filtering** | Mixed-genre site requires tag-based discovery | LOW | Already PAGE-03 ✓ (Astro content collections natively support tag pages) |
| **Article TOC + code highlight + reading time** | Tech-circle audience expects this baseline | LOW | Partially PAGE-04 ✓ — extend to include copy-code button, code-language label |
| **Image lightbox / zoom in articles** | Anime/illustration content is image-heavy; readers want to view full-size | LOW | **MISSING** — add medium-zoom or photoswipe |
| **Prev/next post navigation + related posts** | Standard blog UX; visitors expect a reading path | LOW | **MISSING** — Astro can pre-compute via frontmatter or tag overlap |
| **Last-updated + published date display** | Tech articles especially need "is this stale?" signal | LOW | **MISSING** — must distinguish published vs updated |
| **Article share buttons + OG cards** | "Share to weibo/twitter/wechat" + rich link previews | LOW | **MISSING** — needs explicit OG/Twitter meta + share widget |
| **Sticky / pinned articles 置顶** | 二次元 themes universally support post pinning for featured content | LOW | **MISSING** — frontmatter `pinned: true` + sort logic |
| **About page with persona card** | Genre baseline — visitors expect a "who is this person" page | MEDIUM | PAGE-02 ✓ — see Differentiators for persona card depth |
| **Friend links page** | Friend-link culture (互访/互推) is core to Chinese blogosphere identity | LOW | PAGE-08 ✓ |
| **Comment system on articles + microblog** | Engagement signal; without it the site feels dead | LOW | INFRA-03 Twikoo ✓ — confirm coverage extends to PAGE-09 microblog posts |
| **Comment emoji / sticker packs** | 二次元 readers expect bilibili-style 表情包 in comments | LOW | **MISSING** — Twikoo + Waline both support custom emoji JSON; ship at least 1 sticker pack |
| **Comment avatars (Gravatar/QQ avatar fallback)** | Identity affordance for anonymous commenters | LOW | Built into Twikoo — verify enabled |
| **Search across articles** | Discovery for a long-running mixed-genre archive | MEDIUM | DISC-02 ✓ — recommend **Pagefind** (static index, ~3KB runtime, native to Astro) |
| **Tag cloud + chronological archive** | Standard discovery scaffolding | LOW | DISC-03 ✓ |
| **RSS feed** | Tech-circle audience subscribes via RSS readers | LOW | DISC-01 ✓ — Astro `@astrojs/rss` is one file |
| **Sitemap.xml + robots.txt** | SEO baseline; required for search engine indexing | LOW | **MISSING** — `@astrojs/sitemap` is one line |
| **404 page (custom-styled)** | INFRA-06 ✓ — should match site aesthetic, not generic | LOW | Already planned ✓ |
| **Theme switcher (light / dark) with persistence** | Universal expectation in 2026 | LOW | ATM-04 ✓ — but trim "holiday variants" sub-scope (see Anti-Features) |
| **Mobile responsive** | Most 二次元 readers browse from phones | MEDIUM | Constraint already noted ✓ — but Live2D + petals + BGM all need mobile-specific handling |
| **prefers-reduced-motion respect + "disable effects" toggle** | Accessibility + some users find petals/Live2D distracting | LOW | **MISSING — CRITICAL** — without this, atmosphere becomes hostile UX |
| **BGM player with autoplay-policy compliance + persistence** | Genre expectation; APlayer + MetingJS is the standard | MEDIUM | ATM-05 ✓ — confirm: muted by default (browsers block audio autoplay), state persists across page nav |
| **Live2D mascot (deferred load, no blocking first paint)** | Defining feature of 沉浸二次元 aesthetic | MEDIUM | ATM-01 ✓ — recommend **l2d-widget** (rewrite of oh-my-live2d, ~500 LOC, zero deps) |
| **Falling petals / particle effects, theme-linked** | Genre signature | LOW | ATM-02 ✓ — use existing libs (sakura.js, particles.js) |
| **Custom right-click menu** | 二次元 theme convention — verified in Butterfly, Sakura, Yun | LOW | ATM-03 ✓ |
| **Top-button (return to top) + back-to-bottom on long posts** | UX baseline for any article-heavy site | LOW | **MISSING** — Butterfly ships this in the right-side button cluster |
| **HTTPS + custom domain** | Trust + identity baseline | LOW | INFRA-02 + INFRA-06 ✓ |

### Differentiators (Competitive Advantage)

Features that make this site feel "uniquely mine" instead of "another Hexo template." These align with the Core Value: *a personal space that feels alive and uniquely mine*.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Dual works modules (Projects + Creations)** | Avoids the common mistake of mashing dev work + illustrations into one ugly grid | MEDIUM | PAGE-05/06/07 ✓ — distinct visual treatments (Projects = card grid with tech-stack tags + GitHub stars; Creations = masonry/Pinterest-style with lightbox) |
| **Microblog (说说 / 碎碎念) with image attachments** | Lower-effort outlet than full articles; keeps site feeling alive between posts | MEDIUM | PAGE-09 ✓ — recommend storing as Astro content collection (markdown files in `_microblog/`) for git-friendly workflow; consider **Memos** integration if owner wants WeChat-like posting UX |
| **Anime / Book / Music / Game lists (watching/watched/want)** | Genre-defining: visitors expect to see what you're consuming | MEDIUM | PAGE-10 — extend INFRA-04 from anime-only to: Bangumi (anime + manga + game + book), 豆瓣 RSS as backup. Each item: cover, rating, status, optional short review |
| **Timeline / Journey (year-by-year)** | "Story of me" page — strong identity signal | LOW | PAGE-11 ✓ — frontmatter-driven from `_timeline/` collection; visually a vertical alternating-side layout |
| **Persona card with depth** | "About" pages are usually shallow; 二次元 owners differentiate with rich self-presentation | MEDIUM | PAGE-02 ✓ — recommend: avatar + name pronunciation + MBTI/zodiac/blood-type (genre convention) + skill bars + favorite anime/character list + "Q&A about me" + optional second-anime persona |
| **Site-wide BGM with playlist + single-track + resume on return** | Most blogs have a player; few have it well-tuned. Resume-on-navigate is the differentiator. | MEDIUM | ATM-05 ✓ — APlayer fixed-bottom mode + sessionStorage for track/position |
| **Easter eggs (Konami, secret terminal in right-click)** | Owner personality signal; tech-circle audience appreciates these | LOW-MED | ATM-06 ✓ — pair with ATM-03 (terminal entry in right-click is itself an easter egg) |
| **Hitokoto / 一言 random quote on home banner** | Genre staple — bilibili-style atmosphere | LOW | **MISSING — recommend adding** (free API at hitokoto.cn; replaces the "random-quote widget" currently in Out of Scope, which I'd reclassify) |
| **Site stats widget (运行时间 + 文章总数 + 总字数 + 访客数)** | 二次元 sidebar convention; "your blog has been alive for 247 days" is a flex | LOW | **MISSING** — use 不蒜子 (busuanzi) for visitor counter + build-time computed stats for articles/words/runtime |
| **Notice / announcement bar** | Owner control over "what to highlight right now" — common in 二次元 themes (Valaxy supports `hideInPages` per notice) | LOW | **MISSING** — small frontmatter-driven banner, dismissible with localStorage |
| **Friend-link health check + latest-post aggregation** | Friend-link culture rewards reciprocity; broken links erode trust | MEDIUM | PAGE-08 extension — periodic GitHub Action to ping links + optionally pull friend RSS feeds for a "what friends are posting" widget |
| **Password-protected / 加密文章** | Genre staple for diary-style posts; lets owner mix public and semi-private content | LOW | **MISSING** — Astro plugin or simple client-side AES (good enough for casual privacy) |
| **Article copyright / license footer** | Tech-circle expectation; CC-BY-NC-SA is genre default | LOW | **MISSING** — frontmatter-driven, render at article bottom |
| **Holiday / event seasonal hooks (NOT full themes)** | Lightweight festive nods (snow on Lunar NY, sakura petal density boost in spring) feel alive without maintenance burden | LOW | Trim ATM-04 from "holiday theme variants" → "date-based atmosphere tweaks"; ship 2-3 dates max |
| **Avatar generator (PAGE-12)** | Genuinely unique differentiator if owner has assets, but cost is high | **HIGH** | See Anti-Features section — recommend deferring unless owner has illustration assets in hand or links to external Picrew |

### Anti-Features (Commonly Requested, Often Problematic)

Features that look good on paper but hurt the v1.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Avatar generator (PAGE-12 as currently scoped)** | "Visitors generate a kawaii avatar in the site's style" sounds delightful | Requires 50-200 layered illustration assets (hair/eyes/clothes/accessories) the owner does not yet have; otherwise it's a Picrew clone with no soul. Implementation is ~2 weeks of build for marginal traffic value. | **Defer to v2.** For v1, embed a curated Picrew link in the right-click menu OR ship a "pick one of 5 pre-drawn avatars" lightweight version. |
| **Live2D "dress-up" sub-feature (inside ATM-01)** | Outfit-switching mascot feels deeply 二次元 | Each outfit requires modeling work (Cubism is a paid tool, $90+/yr); without custom modeling, "dress-up" reduces to "switch which prebuilt model is showing," which is just ATM-01 model switcher in disguise. | Keep ATM-01 = static + greetings + model switcher. Drop "dress-up" as a distinct feature; revisit if owner gets a Cubism subscription. |
| **Holiday theme variants (sub-scope of ATM-04)** | Christmas/Lunar NY themes feel festive | Requires designing N variant palettes + asset packs + maintaining them year-round; half-implemented holiday themes look worse than none. | Replace with "date-based atmosphere tweaks" — boost petal density on specific dates, swap mascot greeting on holidays, change accent color. Cheap, maintainable. |
| **Email subscription (DISC-01 email portion)** | "Newsletter feel" alongside RSS | Requires a mailing-list backend (Buttondown/Mailchimp/Resend), opens up GDPR/CAN-SPAM surface, owner must compose newsletters. Target audience (anime friends + tech circle) skews RSS-native. | **Ship RSS only.** Add email subscription post-launch only if RSS subscriber count exceeds ~50 and someone actually requests email. |
| **Cross-collection site search (DISC-02 "across articles/works/microblog")** | "Search everything" sounds clean | Pagefind can index multiple collections, but ranking + result-type differentiation in the UI is non-trivial. Risk: results feel muddled. | Ship article search first (DISC-02 narrowed). Add works + microblog search in v1.1 after measuring whether users actually search across types. |
| **Real-time chat / danmaku** | "Bilibili-style danmaku across the site" feels immersive | Requires WebSocket backend → violates $0/month + no-self-hosted-DB constraint. | Out of Scope ✓ (already correct in PROJECT.md) |
| **User accounts / profiles** | "Let visitors customize their experience" | Violates no-accounts constraint; comments via Twikoo already give pseudonymous identity. | Out of Scope ✓ |
| **E-commerce / shop / lottery / gashapon** | Monetization, engagement | Out of scope for personal expression site; legal/payment complexity. | Out of Scope ✓ |
| **Site statistics / analytics dashboard** | "See your visitor data" | Owner doesn't need a dashboard — 不蒜子 widget shows totals in sidebar (which IS a differentiator), full analytics belongs in Cloudflare/Vercel admin panel. | Visitor counter widget = yes. Analytics dashboard page = no. |
| **Guestbook (separate from comments)** | "Sign my guestbook" nostalgia | Comments already serve this need; dedicated guestbook page = unused page. | Out of Scope ✓ |
| **Visible "粉丝群/QQ群" join CTA on every page** | Community-building | Overwhelms small-circle audience; better in a single contact section on About | Mention in About + right-click "sponsor/contact" entry only |
| **Auto-playing BGM with no mute** | "Full immersion" | Browsers block autoplay; even if it worked, it's user-hostile + reduces page sharing | ATM-05 ✓ — BGM must be muted by default with prominent unmute affordance |
| **Random-image / random-quote widget** *(currently in Out of Scope)* | Currently flagged as "defer; low value" | **This is incorrect classification for the 二次元 genre — Hitokoto is table stakes.** | **Reclassify Hitokoto as in-scope** (Differentiator tier). Keep random-image-widget out (different feature). |

---

## Feature Dependencies

```
Comment System (INFRA-03 Twikoo)
    ├── Article comments (PAGE-04)
    ├── Microblog comments (PAGE-09)
    ├── Friend-link page submissions/comments (PAGE-08)
    └── Sticker/emote pack (subfeature)

Tag System (PAGE-03)
    ├── Article filtering
    ├── Related posts (tag overlap)
    └── Tag cloud (DISC-03)

Content Collections (INFRA-01 Astro)
    ├── Articles (PAGE-03/04)
    ├── Microblog (PAGE-09)
    ├── Projects (PAGE-06)
    ├── Creations (PAGE-07)
    ├── Timeline (PAGE-11)
    ├── Friend links (PAGE-08)
    ├── Bangumi/Books/Music/Game lists (PAGE-10)
    └── Notice/announcement bar

Theme Switcher (ATM-04)
    ├── Falling-petal color (ATM-02) ──linked──
    ├── Live2D model variant (ATM-01) ──optional link──
    └── prefers-color-scheme detection

Atmosphere Disable Toggle (NEW — CRITICAL)
    ├── disables Live2D (ATM-01)
    ├── disables petals (ATM-02)
    ├── mutes BGM (ATM-05)
    └── respects prefers-reduced-motion

BGM Player (ATM-05) ──conflicts with──> Video posts (Out of Scope)
    (two audio sources fighting is awful UX)

Bangumi/lists (PAGE-10)
    └── requires Bangumi API (INFRA-04) + optionally 豆瓣 RSS

Music player widget (ATM-05)
    └── requires APlayer + MetingJS (INFRA-05) — netease/QQ playlist source

Search (DISC-02)
    └── requires build-step indexing (Pagefind recommended for Astro)

RSS (DISC-01)
    └── requires Astro @astrojs/rss + article/microblog content collections

Friend-link health check (NEW)
    └── requires GitHub Actions cron + curl checks (no runtime cost)
```

### Dependency Notes

- **Atmosphere Disable Toggle is a meta-dependency:** all atmosphere features (ATM-01/02/05) must check this toggle on init. Easiest if built at the *same time* as ATM-01, not retrofitted.
- **Content collections come first:** every page that lists or filters content (PAGE-03/06/07/09/10/11) depends on the collection schema. Lock schemas before building UI.
- **Theme switcher → atmosphere link:** if ATM-04 toggles dark mode, petals (ATM-02) and Live2D backdrop (ATM-01) must respond. Build atmosphere features *aware of theme context* from day one.
- **BGM persistence requires SPA-like navigation or sessionStorage:** Astro is MPA by default; resume-on-return needs sessionStorage + autoplay-on-next-page (still subject to autoplay policy). Recommend View Transitions API (Astro built-in) so BGM survives navigation without remount.
- **Microblog ↔ Memos integration is optional:** if owner wants WeChat-style mobile posting, route through self-hosted Memos + pull at build. If owner is fine with markdown-in-git workflow, skip Memos.

---

## MVP Definition

### Launch With (v1) — Ruthlessly Scoped

Minimum viable site that satisfies the Core Value (*"feels alive and uniquely mine"*).

**Pages (8 — trimmed from 12):**
- [ ] PAGE-01 Home (latest articles + latest 说说 + hero with Hitokoto)
- [ ] PAGE-02 About + persona card
- [ ] PAGE-03 Articles index + tag filter
- [ ] PAGE-04 Article detail (TOC, code highlight, copy-code, prev/next, copyright, share, image lightbox, last-updated)
- [ ] PAGE-05/06/07 Works hub + Projects + Creations (count as one PAGE — both modules share works hub)
- [ ] PAGE-08 Friend links (with submission entry + health-check link)
- [ ] PAGE-09 Microblog feed with image lightbox + comments
- [ ] PAGE-10 Bangumi lists (anime/manga/book — defer game/music to v1.x)
- [ ] PAGE-11 Timeline
- [ ] 404 page (INFRA-06)

**Atmosphere (5 — trimmed scope):**
- [ ] ATM-01 Live2D mascot (static + greeting + model-switcher; **no dress-up**)
- [ ] ATM-02 Falling petals, theme-linked, respects prefers-reduced-motion
- [ ] ATM-03 Custom right-click menu (home / terminal-easter-egg / sponsor / source)
- [ ] ATM-04 Theme switcher (light/dark only; defer holiday variants)
- [ ] ATM-05 BGM player (APlayer + MetingJS, muted by default, View Transitions for persistence)
- [ ] **NEW: Atmosphere disable toggle in settings panel** (CRITICAL accessibility)

**Discovery:**
- [ ] DISC-01 RSS feed (articles + microblog as separate feeds)
- [ ] DISC-02 Site search via Pagefind (articles only — works/microblog v1.1)
- [ ] DISC-03 Tag cloud + chronological archive
- [ ] **NEW: Hitokoto on home banner**
- [ ] **NEW: Site stats widget (runtime + total articles + total words + busuanzi visitors)**
- [ ] **NEW: Notice/announcement bar**

**Infrastructure:**
- [ ] INFRA-01 Astro 4.x with content collections, View Transitions, @astrojs/rss, @astrojs/sitemap, Pagefind
- [ ] INFRA-02 Cloudflare Pages or Vercel (whichever has better China-mainland latency for the owner's audience)
- [ ] INFRA-03 Twikoo comments + custom emoji pack
- [ ] INFRA-04 Bangumi API integration (anime + manga + book)
- [ ] INFRA-05 APlayer + MetingJS
- [ ] INFRA-06 Custom domain + HTTPS
- [ ] **NEW: OG/Twitter cards + sitemap + robots.txt + structured data**
- [ ] **NEW: Friend-link health check (GitHub Action cron)**

**Article-level extras (folded into PAGE-04 but worth listing):**
- [ ] Copy-code button + language label
- [ ] Image lightbox/zoom (medium-zoom)
- [ ] Prev/next + related posts (tag overlap)
- [ ] Last-updated vs published timestamp
- [ ] Share buttons (weibo / X / copy-link)
- [ ] Sticky/pinned posts
- [ ] Article copyright footer (CC-BY-NC-SA default)
- [ ] Top button
- [ ] Password-protected posts (client-side AES, good enough for casual privacy)

### Add After Validation (v1.x)

Features to add once core is stable and owner sees usage patterns.

- [ ] Game tracking in PAGE-10 (extend Bangumi integration) — trigger: owner starts tracking games
- [ ] Music list in PAGE-10 (separate from BGM player) — trigger: owner wants a "favorite albums" showcase
- [ ] Cross-collection search (works + microblog) — trigger: search analytics show users hitting empty article results
- [ ] Friend-link RSS aggregator widget — trigger: friend-link list grows past ~20 entries
- [ ] ATM-06 hidden easter eggs (Konami, secret pages) — low priority, add as inspiration strikes
- [ ] Holiday/date-based atmosphere tweaks (replaces the trimmed ATM-04 holiday variants) — trigger: first major holiday after launch
- [ ] Memos self-hosted integration for mobile-first microblog posting — trigger: owner finds git-based posting too slow
- [ ] PWA / service worker for offline reading — trigger: owner travels and wants offline access
- [ ] Year-in-review auto-summary page — trigger: end of first full year

### Future Consideration (v2+)

- [ ] **Avatar generator (PAGE-12)** — defer until owner has illustration assets (50+ layered components) or wants to commission them. Embed external Picrew link for v1.
- [ ] **Live2D dress-up** — defer until owner has Cubism modeling capacity.
- [ ] Email subscription — defer until RSS subscribers exceed 50 and someone requests it.
- [ ] Multi-language (CN/EN) — defer; current audience is Chinese-primary. Add only if international friend-link reciprocity demands it.
- [ ] Lottery / gashapon mini-game (currently Out of Scope) — v2 if owner wants a community engagement layer.
- [ ] Real-time danmaku (currently Out of Scope) — v3+, requires WebSocket backend.

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Home + article list + article detail (PAGE-01/03/04) | HIGH | LOW | **P0** |
| Astro infra + content collections (INFRA-01) | HIGH | LOW | **P0** |
| Hosting + HTTPS + domain (INFRA-02/06) | HIGH | LOW | **P0** |
| Twikoo comments (INFRA-03) | HIGH | LOW | **P0** |
| RSS (DISC-01) | HIGH | LOW | **P0** |
| Article-level UX (copy code, lightbox, prev/next, last-updated, share, copyright) | HIGH | LOW-MED | **P0** |
| Tag cloud + archive (DISC-03) | HIGH | LOW | **P0** |
| Sitemap + OG/Twitter cards + robots.txt | MEDIUM-HIGH | LOW | **P0** (SEO baseline) |
| About + persona card (PAGE-02) | HIGH | MEDIUM | **P1** |
| Works hub + Projects + Creations (PAGE-05/06/07) | HIGH | MEDIUM | **P1** |
| Microblog (PAGE-09) | HIGH | MEDIUM | **P1** |
| Friend links (PAGE-08) | HIGH | LOW | **P1** |
| Theme switcher (ATM-04 light/dark) | HIGH | LOW | **P1** |
| Atmosphere disable toggle (NEW) | HIGH | LOW | **P1** (a11y critical) |
| Live2D mascot, static + greetings + switcher (ATM-01 trimmed) | HIGH | MEDIUM | **P1** (genre-defining) |
| Falling petals (ATM-02) | MEDIUM-HIGH | LOW | **P1** |
| Custom right-click (ATM-03) | MEDIUM-HIGH | LOW | **P1** |
| BGM player (ATM-05) | MEDIUM-HIGH | MEDIUM | **P1** |
| Bangumi lists (PAGE-10 anime+manga+book) | HIGH | MEDIUM | **P1** |
| Timeline (PAGE-11) | MEDIUM | LOW | **P1** |
| Site search via Pagefind (DISC-02 articles only) | HIGH | LOW | **P1** |
| Hitokoto banner (NEW) | MEDIUM-HIGH | LOW | **P1** |
| Site stats widget (NEW) | MEDIUM-HIGH | LOW | **P1** |
| Notice bar (NEW) | MEDIUM | LOW | **P1** |
| Sticker pack for comments (NEW) | MEDIUM-HIGH | LOW | **P1** |
| Password-protected posts (NEW) | MEDIUM | LOW | **P1** |
| Friend-link health check (NEW) | MEDIUM | LOW | **P2** |
| Easter eggs (ATM-06) | MEDIUM | LOW-MED | **P2** |
| Game tracking in PAGE-10 | LOW-MED | MEDIUM | **P2** |
| Music list page in PAGE-10 | LOW-MED | MEDIUM | **P2** |
| Cross-collection search | MEDIUM | MEDIUM | **P2** |
| Date-based atmosphere tweaks | LOW-MED | LOW | **P2** |
| Holiday theme variants (ATM-04 full holiday scope) | LOW | HIGH | **P3** (cut) |
| Email subscription (DISC-01 email) | LOW | MEDIUM | **P3** (cut) |
| **Avatar generator (PAGE-12)** | MEDIUM | **HIGH** | **P3** (defer) |
| **Live2D dress-up** | LOW | HIGH | **P3** (cut) |

**Priority key:**
- **P0:** Must ship in first deployable build; site is broken without it
- **P1:** Must ship in v1.0 launch; defines the 沉浸二次元 experience
- **P2:** Ship in v1.x post-launch; nice-to-have refinements
- **P3:** Defer to v2+ or cut entirely

---

## Genre Convention Audit (二次元 Theme Comparison)

Verified against the four dominant 二次元 Hexo/Astro themes. ✓ = theme ships this; ✗ = does not; ~ = available as plugin/optional.

| Feature | Butterfly | Yun/Valaxy | Sakura | Stellar | merlinalex v1 plan |
|---------|-----------|------------|--------|---------|--------------------|
| Article cards with cover | ✓ | ✓ | ✓ | ✓ | (implicit) |
| Sidebar widgets (author/tags/recent/comments) | ✓ | ✓ | ✓ | ✓ | partial — need explicit |
| Aplayer fixed-bottom BGM | ✓ | ~ | ✓ | ~ | ✓ ATM-05 |
| Live2D | ~ (plugin) | ~ | ~ | ~ | ✓ ATM-01 |
| Falling petals | ~ | ~ | ✓ | ~ | ✓ ATM-02 |
| Custom right-click | ~ | ✓ | ✓ | ~ | ✓ ATM-03 |
| Light/dark theme | ✓ | ✓ | ✓ | ✓ | ✓ ATM-04 |
| Hitokoto random quote | ~ | ✓ | ✓ | ~ | ✗ **GAP** |
| Notice banner | ✓ | ✓ | ✓ | ✓ | ✗ **GAP** |
| Visitor counter (busuanzi) | ✓ | ✓ | ✓ | ✓ | ✗ **GAP** |
| Site runtime widget | ✓ | ✓ | ✓ | ~ | ✗ **GAP** |
| Microblog 说说 | ~ | ✓ | ✓ | ~ (memos) | ✓ PAGE-09 |
| Bangumi page | ~ | ~ | ✓ | ~ | ✓ PAGE-10 |
| Friend links | ✓ | ✓ | ✓ | ✓ | ✓ PAGE-08 |
| Timeline | ~ | ~ | ✓ | ✓ | ✓ PAGE-11 |
| Gallery (illustrations) | ✓ | ~ | ✓ | ~ | ✓ PAGE-07 |
| Comments (Twikoo/Waline) | ✓ | ✓ | ✓ | ✓ | ✓ INFRA-03 |
| Custom emoji in comments | ~ | ~ | ~ | ~ | ✗ **GAP** |
| Article TOC | ✓ | ✓ | ✓ | ✓ | ✓ PAGE-04 |
| Article copy-code | ✓ | ✓ | ✓ | ✓ | ✗ **GAP** (PAGE-04 mentions code highlight but not copy) |
| Image lightbox | ✓ | ✓ | ✓ | ✓ | ✗ **GAP** |
| Prev/next + related | ✓ | ✓ | ✓ | ✓ | ✗ **GAP** |
| Sticky posts | ✓ | ✓ | ✓ | ✓ | ✗ **GAP** |
| Password-protected posts | ✓ | ~ | ~ | ~ | ✗ **GAP** |
| Article copyright footer | ✓ | ✓ | ~ | ✓ | ✗ **GAP** |
| Share buttons | ✓ | ✓ | ✓ | ✓ | ✗ **GAP** |
| Reading time | ✓ | ✓ | ~ | ✓ | ✓ PAGE-04 |
| Sitemap.xml | ✓ | ✓ | ✓ | ✓ | ✗ **GAP** |
| OG/Twitter cards | ✓ | ✓ | ✓ | ✓ | ✗ **GAP** |
| Easter eggs / Konami | ~ | ✓ | ✓ | ~ | ✓ ATM-06 |
| Avatar generator | ✗ | ✗ | ✗ | ✗ | ✓ PAGE-12 (**unique but very rare — overkill signal**) |

**Pattern:** The avatar generator is one of two things in the v1 plan that no major theme ships — confirming it's genuinely novel (good differentiator!) but also that there's no off-the-shelf solution to lean on (high cost!). The other novel thing is the depth of dual works modules; that's a stronger differentiator with lower cost.

---

## Sources

- **Butterfly Hexo theme docs** (verified feature list): https://butterfly.js.org/posts/21cfbf15/ and https://butterfly.js.org/posts/4aa8abbe/ — HIGH confidence
- **Valaxy + theme Yun docs** (configurable features verified): https://valaxy.site/themes/yun — HIGH confidence
- **Hexo theme Yun (legacy)**: https://yun.yunyoujun.cn/ — HIGH confidence (now superseded by Valaxy)
- **Stellar theme docs**: https://xaoxuu.com/wiki/stellar/ — HIGH confidence on listed modules
- **Twikoo comment system**: https://twikoo.js.org/ — HIGH confidence
- **Waline comment system**: https://waline.js.org/ — HIGH confidence (alternative to Twikoo if Twikoo issues arise)
- **APlayer music player**: https://github.com/DIYgod/APlayer — MEDIUM confidence (only listed playlist + lyrics on README; full fixed-bottom + persistence behavior verified via Butterfly integration docs)
- **oh-my-live2d → l2d-widget**: https://github.com/oh-my-live2d/oh-my-live2d — HIGH confidence (official rename + rewrite, ~500 LOC, zero deps, Cubism 2 + 6 runtime)
- **Astro RSS + content collections**: Context7 `/websites/astro_build_en` (4289 snippets, verified June 2026) — HIGH confidence
- **Picrew (reference for avatar generator scope)**: https://picrew.me/en — HIGH confidence (confirms 50+ layered assets needed)
- **Bangumi API**: referenced via training data + multiple theme integration patterns — MEDIUM confidence on exact endpoints (worth phase-level verification before INFRA-04)
- **不蒜子 (busuanzi) visitor counter**: industry-standard JS snippet — HIGH confidence
- **Hitokoto API**: hitokoto.cn free API, used universally in 二次元 themes — HIGH confidence
- **Pagefind**: Astro-recommended static search (verified via Astro docs integration list) — HIGH confidence

---
*Feature research for: 二次元 personal blog + portfolio site (merlinalex.me)*
*Researched: 2026-06-02*
