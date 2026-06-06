<!-- GSD:project-start source:PROJECT.md -->
## Project

**merlinalex.me — Personal Site (二次元可爱风)**

A 二次元 (anime) aesthetic personal website for merlinalex — a single-author site that doubles as a blog, portfolio, and small community hub for anime friends and tech-circle readers. The feel is **fully immersive kawaii** (Live2D mascot, falling petals, custom right-click, BGM, theme switching) but the content structure stays practical: mixed-genre articles sorted by tags, two distinct works modules (open-source projects vs creative works), and a tight set of community modules (friend links, RSS, anime/book/music lists, timeline).

**Core Value:** A personal space that **feels alive and uniquely mine** — visitors (mostly the owner + close circle) should feel they're stepping into a little world, not scrolling a generic blog.

### Constraints

- **Stack**: Static-site generator (Astro recommended) + free CDN hosting; no self-hosted database in v1
- **Cost**: $0/month — must run on free tiers only
- **Accounts**: No user accounts; comments via Twikoo (3rd-party)
- **Hosting**: Vercel / Cloudflare Pages (free, global CDN, auto HTTPS)
- **Style**: 沉浸二次元 — full anime atmosphere expected, not "tasteful minimalist"
- **Performance**: Static-rendered pages should load <2s on broadband; Live2D model must not block first paint
- **Browser support**: Latest Chrome / Safari / Edge; mobile responsive required
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## TL;DR Recommendation
## Astro vs Hexo vs Hugo — Decision Matrix
| Criterion | Astro v6.4.2 | Hexo v8.1.2 | Hugo v0.162.1 | Winner |
|-----------|--------------|-------------|---------------|--------|
| Build speed (small blog) | Fast (Vite) | Fast (Node) | Fastest (Go) | Hugo (marginal — all sub-second at this scope) |
| DX / TypeScript | Native TS, JSX-like `.astro` | EJS/Pug + Stylus | Go templates | **Astro** |
| Content modeling | Content Collections + Zod schema validation | YAML frontmatter, no schema | Front matter + page bundles, no schema | **Astro** |
| Multi-module content (works/projects/anime list as separate collections) | First-class via `defineCollection()` | Custom pages + plugins | Sections + taxonomies | **Astro** |
| Atmosphere ecosystem (Live2D/BGM/petals pre-wired) | None — DIY | Butterfly/Anzhiyu/Sakura pre-wire many of these | Almost none | **Hexo** |
| Custom JS island integration (Live2D, BGM player, particles) | First-class (`client:load`, `client:visible`) | Works but feels grafted into theme system | Works but layout system fights you | **Astro** |
| Theme lock-in risk | None (you build the design) | High — themes are tightly-coupled monoliths | Medium — themes use `partials` overrides | **Astro** |
| 中文 community / docs | Growing | Massive (most themes are CN-authored) | Limited | **Hexo** |
| Image optimization | Built-in `astro:assets` | Manual via plugins | Built-in (page resources) | Astro/Hugo tie |
| View transitions (SPA-like feel) | Built-in `astro:transitions` | Pjax via theme | Not built-in | **Astro** |
| Vercel/Cloudflare Pages support | Official adapters | Static output works fine | Static output works fine | Tie |
| Long-term maintenance | Active, well-funded (The Astro Tech Co.) | Active, community-maintained | Active, single-maintainer-heavy (bep) | Tie |
## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Astro** | `^6.4.2` | Static site generator + islands runtime | Content Collections with Zod schemas map exactly to PROJECT.md's multi-module structure (articles, projects, creations, anime/book/music lists, timeline). Islands architecture loads atmosphere JS (Live2D, BGM) without blocking first paint — satisfies ATM-01 constraint. View Transitions API built-in for SPA-feel navigation. Active development, current release was 5 days ago. **Confidence: HIGH** (verified via Context7 `/withastro/docs` + GitHub releases) |
| **Tailwind CSS** | `^4.3.0` | Utility-first CSS for kawaii design system | v4 is stable, ~5× faster build, simpler config (CSS-first via `@theme`). Installed as Vite plugin in Astro 5.2+, NOT via the legacy `@astrojs/tailwind` integration (which is Tailwind 3 only). Custom color palettes, animation utilities, and dark mode handle the theme-switching requirement (ATM-04) cleanly. **Confidence: HIGH** (verified via Tailwind GitHub + Astro styling docs) |
| **TypeScript** | `^5.5.x` | Type safety, content schema enforcement | Astro 6 ships with TS defaults; Zod schemas in content collections give compile-time validation of every blog post / project / anime entry. Reduces "frontmatter typo" failures common in Hexo/Hugo. |
| **MDX** (`@astrojs/mdx`) | `^4.x` | Rich markdown for articles | Lets PAGE-04 articles embed components (e.g., a Live2D vignette mid-article, charts, animated callouts). Astro's official integration. |
| **Node.js** | `^20 LTS` or `^22 LTS` | Runtime for build + dev | Astro 6 requires Node 18.20.8+ / 20.3.0+ / 22+. Use 22 LTS for longest support window. |
### Supporting Libraries — Atmosphere & Decorations
| Library | Version | Purpose | Use Case |
|---------|---------|---------|----------|
| **l2d-widget** | `^0.1.0` | Live2D mascot (ATM-01) | The 2026 rewrite of `oh-my-live2d`. Single-call `createWidget({ model })`. Auto-detects Cubism 2 vs Cubism 6 runtime. Zero framework deps, ~500 LOC, ESM + IIFE bundles. Built-in lip-sync, multi-model switcher, tip bubbles — directly satisfies "greeting, dress-up, model switcher" in ATM-01. Load behind `client:idle` so it never blocks first paint. **Confidence: HIGH** (verified via GitHub on 2026-06-02). |
| **tsParticles** | `^3.x` (latest) | Falling petals / snow / cursor-trail (ATM-02) | Has an official Astro wrapper. Snow preset built-in; petals via custom image shape (sakura petal PNG). Theme-linked: swap config when theme switcher fires. Lighter than the classic `particles.js` (which is unmaintained). |
| **APlayer** | `^1.10.1` | Site-wide BGM player (ATM-05) | De facto standard in CN dev-blog ecosystem. UI matches the kawaii aesthetic out of box. Pair with `localStorage` for resume-on-return. Latest release is 2018 — **stable but stagnant**, no known critical bugs for this use. |
| **MetingJS** | `^2.0.2` | Music playlist source for APlayer (ATM-05) | Released Sept 2025, still maintained. Drops `<meting-js server="netease" type="playlist" id="..."/>` into a layout and APlayer auto-loads tracks. Pin the playlist server (default Meting API is third-party and can go down — **plan for self-hosted fallback in Phase 4+**, see PITFALLS.md). |
### Supporting Libraries — Content & Discovery
| Library | Version | Purpose | Use Case |
|---------|---------|---------|----------|
| **`@astrojs/rss`** | `^4.x` | RSS feed generation (DISC-01) | Official Astro integration. Generates `/rss.xml` from any content collection. Pair with email subscription via Buttondown (free tier) or substack-style 3rd party. |
| **`@astrojs/sitemap`** | `^3.x` | Sitemap for SEO | Auto-generated. One-line install: `astro add sitemap`. |
| **Pagefind** | `^1.x` (via `astro-pagefind` integration) | Static search across articles / works (DISC-02) | Build-time indexer, zero infrastructure, no API costs, 100% client-side search. Better fit than Algolia/Meilisearch for $0/month constraint. Multilingual (handles CJK well). |
| **Twikoo** | `^1.7.4` | Comment system (INFRA-03) | Deploy via Vercel one-click + MongoDB Atlas free tier (M0 cluster = 512 MB, free forever). Embedded via `twikoo.min.js` + 5-line init script. Supports anonymous comments, replies, likes, email/WeChat notifications. **Note:** Twikoo's *frontend* lives on the blog (Cloudflare Pages); its *backend* lives on Vercel — splits the deployment story across two platforms. |
| **Shiki** | (bundled in Astro) | Code syntax highlighting (PAGE-04) | Astro ships Shiki by default. Theme-aware (light/dark via CSS variables). No runtime cost — highlights at build time. |
### Supporting Libraries — Integrations (External Services)
| Library/API | Auth | Purpose | Notes |
|-------------|------|---------|-------|
| **Bangumi API v0** | Optional access token (OAuth) for personal collection writes; public reads are free | Anime/book/music tracking (INFRA-04, PAGE-10) | Endpoints at `api.bgm.tv/v0/`. Read-only public endpoints (subject details, calendar) require no auth. Build-time fetch in Astro: pull your collection JSON at `npm run build`, no client-side API calls needed. Avoid rate-limit issues by caching responses to disk. **Set a custom User-Agent** — per bgm.tv policy. |
| **GitHub REST API** | Personal access token (free) | Pull star counts, latest commit dates for PAGE-06 Projects module | Build-time only. Rate limit 5,000 req/hour authenticated. |
### Development Tools
| Tool | Purpose | Notes |
|------|---------|-------|
| **pnpm** | Package manager | Faster than npm, deterministic lockfile. Cloudflare Pages auto-detects. |
| **Prettier** | Code formatting | `prettier-plugin-astro` for `.astro` files. |
| **ESLint** (optional) | Linting | Only worthwhile if codebase grows past ~30 files; skip for v1 MVP. |
| **Playwright** | E2E testing (per CLAUDE.md testing rules) | Test critical flows: theme switch persistence, BGM resume, Live2D loads behind first paint, search returns results. |
| **Vitest** | Unit testing | Utility functions only (e.g., reading-time calc, slug generation). Test coverage 80%+ per CLAUDE.md. |
| **Wrangler CLI** | Cloudflare Pages local preview & deploy | `wrangler pages dev dist` to preview build before deploy. |
## Hosting & Infrastructure
### Recommended: Cloudflare Pages (INFRA-02)
| Limit | Free Tier Value | Implication for This Project |
|-------|-----------------|------------------------------|
| Builds/month | 500 | ~16 deploys/day. Fine for a personal blog. |
| Build timeout | 20 min | Astro build for this size: <1 min. |
| Concurrent builds | 1 | Acceptable — solo dev. |
| Custom domains | 100 per project | `merlinalex.me` + previews. |
| Bandwidth | **Unlimited** | Critical advantage — Vercel Hobby has soft caps + commercial-use restrictions. |
| Files per site | 20,000 | Plenty (each blog post = ~5 files including images). |
| File size | 25 MiB / asset | Live2D models often >5 MiB — track this; offload textures to R2 (free tier 10 GB) if needed. |
| HTTPS | Auto, free | Satisfies INFRA-02. |
| Global CDN | All 320+ edges | Satisfies INFRA-02. |
### Twikoo Backend: Vercel + MongoDB Atlas
- **Vercel Hobby**: free, used *only* for the Twikoo API endpoint. Twikoo itself does ~5 KB of requests per comment, will never exhaust Hobby limits for personal-site traffic. Note Vercel's Hobby tier has a no-commercial-use clause — this site is non-commercial per PROJECT.md, so compliant.
- **MongoDB Atlas M0**: free 512 MB cluster, sufficient for tens of thousands of comments.
### Domain
- `merlinalex.me` registered (per PROJECT.md). Point at Cloudflare nameservers → automatic DNS + free SSL via Cloudflare Pages.
## Installation
# Core (Astro + Tailwind 4 + content)
# RSS, search
# Atmosphere libs
# Bangumi/GitHub at build time (use native fetch — no SDK needed)
# Deployment
# Twikoo backend (separate Vercel project)
# 1. Fork: https://github.com/twikoojs/twikoo
# 2. Vercel → New Project → import fork → Root Directory: src/server/vercel-min
# 3. Env var: MONGODB_URI=mongodb+srv://...
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Astro | **Hexo + Anzhiyu theme** | If you want to ship a working 二次元 blog in **1 weekend with no design work** AND accept the theme's visual identity as "good enough" rather than building a unique look. Anzhiyu (v1.7.1, Dec 2025, actively maintained) ships immersive status bar, music ball, custom right-click menu out of box — partially satisfies ATM-03/05/04. **Cost:** locked into theme conventions, EJS templating, harder to add multi-module content (Creations vs Projects requires plugin hacking). |
| Astro | **Hexo + Butterfly theme** | The "OG" 二次元 Hexo theme. Largest plugin ecosystem. Same trade-offs as Anzhiyu but more bare-bones, more configuration work. Choose only if you want a foundation other CN bloggers will recognize and you plan to fork heavily. |
| Tailwind v4 | **UnoCSS** | If team grows or you want atomic CSS with on-demand engine and presets. For solo dev v1, Tailwind has more tutorials and component libraries. |
| l2d-widget | **pixi-live2d-display** | If you need fine-grained programmatic control of Live2D parameters (e.g., for a future LLM-driven mascot per ATM-01 evolution). It's lower-level (raw PixiJS plugin). **Caveat:** last release Dec 2023, only targets PixiJS v6 (not 7/8) — possible long-term maintenance concern. |
| Pagefind | **Algolia DocSearch** | If site grows past 10k pages and you need typo tolerance + ranking tuning. Algolia is free for open-source/docs but personal blogs don't qualify. Sticking with Pagefind. |
| Pagefind | **FlexSearch / Lunr.js** | If you need search inside the JS bundle (no separate index files). Pagefind's separate-files approach is more bandwidth-efficient for typical use. |
| Twikoo | **Giscus (GitHub Discussions)** | If you want comments stored as GitHub Discussions threads and don't mind requiring visitors to have GitHub accounts. **Conflicts with the "anonymous comments" implication of having no user accounts** — visitors must log in via GitHub. Twikoo allows fully anonymous. |
| Twikoo | **Waline** | Similar to Twikoo, also Vercel-deployable. Roughly equivalent feature set. Twikoo's CN ecosystem (anime-blog integration patterns, themes) is denser. Either works; pick Twikoo for slightly better moderation UI. |
| Cloudflare Pages | **Vercel** | Vercel's image optimization is best-in-class. But Vercel Hobby has commercial-use restriction (not an issue here) and bandwidth fair-use limits. Cloudflare Pages' unlimited bandwidth wins for traffic spikes (e.g., Hacker News hug-of-death). |
| Cloudflare Pages | **GitHub Pages** | Slightly simpler if you already host repo on GitHub. **No build cache** and slower deploys; no edge functions if you ever need them. Cloudflare Pages strictly better. |
| MetingJS | **Self-hosted Meting API** | Required *eventually* if the default Meting endpoint goes down or rate-limits you. Self-host on a Cloudflare Worker (free 100k requests/day). Plan this for Phase 4+ but don't block v1. |
## What NOT to Use
| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **`@astrojs/tailwind`** (the integration) | Legacy — Tailwind 3 only. Astro 5.2+ recommends the Tailwind v4 Vite plugin via `astro add tailwind`. | `astro add tailwind` (installs `@tailwindcss/vite`) |
| **particles.js** (the original) | Unmaintained since 2017. No tree-shaking, 60kB+, security warnings. | tsParticles (modern fork by original community) |
| **Hugo** for this project | Go templating is painful for interactive islands; near-zero 二次元 theme ecosystem; Go module system adds friction for solo JS-native dev. | Astro |
| **Disqus** for comments | Ads, tracking scripts, GDPR pain, slow load. Conflicts with the "feels alive and uniquely mine" core value (Disqus looks generic). | Twikoo |
| **Algolia free tier** for search | Eligibility requires "developer-focused open-source" project; personal blog is borderline TOS. Index size limits trigger paid plan quickly. | Pagefind (no eligibility, no limits) |
| **Hexo `hexo-tag-aplayer` plugin pattern** if using Astro | It's a Hexo-specific plugin. In Astro, just drop `<aplayer-js>` directly. | Direct APlayer + MetingJS web components |
| **`oh-my-live2d`** (the old name) | Renamed/rewritten to `l2d-widget` May 2026. Old npm package may still install but won't get fixes. | `l2d-widget` v0.1.0+ |
| **`pixi-live2d-display` on PixiJS v7/v8** | Latest release (Dec 2023) targets PixiJS v6; using newer Pixi may break it. | Pin Pixi to v6 if using this library, or use l2d-widget instead |
| **Vercel for static hosting (this site)** | Bandwidth fair-use + commercial-use clause + slightly worse free tier than Cloudflare Pages for this use case. | Cloudflare Pages (only use Vercel for Twikoo backend) |
| **Self-hosted MongoDB** for Twikoo | Adds DevOps burden, violates "no self-hosted DB" constraint. | MongoDB Atlas M0 (free 512 MB) |
| **Custom-built BGM player** | Reinventing APlayer wastes weeks. APlayer already handles the 二次元 aesthetic conventions visitors expect. | APlayer + MetingJS |
| **Cubism 3 SDK direct integration** | Manual SDK juggling, license tracking, asset loading code. l2d-widget abstracts all of this. | l2d-widget (wraps Cubism 2 + Cubism 6 runtimes automatically) |
| **`hexo` if going Astro route** | Mixing both systems gives you two build pipelines, two content directories, two deploy flows. Pick one. | Single Astro pipeline |
## Stack Patterns by Variant
- Replace l2d-widget with a static `<picture>` element using a high-quality PNG mascot, animated via CSS keyframes
- Keep all other libs identical
- Saves ~500 KB on first Live2D-bearing page
- Switch to **Hexo v8.1.2 + Anzhiyu theme v1.7.1**
- Lose: Content Collections, View Transitions, modern TS DX, easy library integration
- Gain: Out-of-box music ball, immersive status bar, custom right-click menu, dark mode
- Still need to add: Live2D (via official Anzhiyu Live2D plugin or l2d-widget injection), falling petals (via theme config + custom JS), avatar generator (PAGE-12 is custom either way)
- **NB:** This is what PROJECT.md INFRA-01 calls "Hexo fallback for theme ecosystem" — keep as plan B
- Same Astro stack
- Add: Decap CMS (free, git-based, no DB) for non-technical contributors
- Add: Astro Studio or Turso for analytics-style runtime data (out of scope for v1)
- Cannot stay pure-static — add Astro SSR with Cloudflare Workers adapter
- Add: Clerk or Lucia for auth
- Not relevant to v1
## Version Compatibility
| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `astro@^6.4.2` | `node@>=18.20.8 \|\| >=20.3.0 \|\| >=22.0.0` | Node 22 LTS recommended for longest support |
| `astro@^6` | `@astrojs/mdx@^4`, `@astrojs/sitemap@^3`, `@astrojs/rss@^4` | All current major versions are Astro 6-compatible |
| `astro@>=5.2` | `@tailwindcss/vite` (via `astro add tailwind`) | **Do not** install `@astrojs/tailwind` — it's Tailwind 3 legacy |
| `tailwindcss@^4` | `@tailwindcss/vite` | v4 uses CSS-first config (`@theme` in CSS, not `tailwind.config.js`) |
| `aplayer@^1.10.1` | `metingjs@^2.0.2` | Officially-supported pairing; the only combination worth using |
| `metingjs@^2.0.2` | Custom-elements polyfill (only for IE11) | All modern browsers per PROJECT.md "Browser support: Latest Chrome/Safari/Edge" — no polyfill needed |
| `l2d-widget@^0.1.0` | Any framework or vanilla JS | Framework-agnostic. Use Astro `client:idle` directive to defer load |
| `twikoo@^1.7.4` | MongoDB Atlas M0 (free) | Pin Twikoo client JS version in CDN URL to avoid breaking changes |
| `pagefind@^1` + `astro-pagefind` | `astro@^4` and up | Indexer runs after Astro build; integration handles wiring |
## Confidence Assessment Per Recommendation
| Recommendation | Confidence | Evidence |
|----------------|------------|----------|
| Astro over Hexo/Hugo | HIGH | Direct comparison via Context7 docs + GitHub release data; matches project's "uniquely mine" core value where theme ecosystem advantage of Hexo is moot |
| Astro v6.4.2 as current | HIGH | GitHub releases verified 2026-06-02 |
| Hexo v8.1.2 as current | HIGH | GitHub releases verified 2026-06-02 |
| Hugo v0.162.1 as current | HIGH | GitHub releases verified 2026-06-02 |
| Tailwind v4 stable | HIGH | v4.3.0 latest, regular releases, official Astro support |
| l2d-widget (formerly oh-my-live2d) | HIGH | Confirmed rename + rewrite via GitHub README; v0.1.0 released May 25, 2026 |
| tsParticles for petals/snow | HIGH | Active project, official Astro wrapper, dedicated snow preset |
| APlayer + MetingJS | MEDIUM | APlayer hasn't released since 2018 — stable but stagnant. MetingJS v2.0.2 (Sept 2025) is actively maintained. No drop-in replacement of similar quality. Acceptable risk for this domain. |
| Twikoo for comments | HIGH | Direct verification via Context7 `/twikoojs/twikoo` + GitHub. Vercel + MongoDB Atlas deployment path well-documented. |
| Cloudflare Pages free tier | HIGH | Verified limits page 2026-06-02 |
| Vercel Hobby for Twikoo backend | MEDIUM | Free tier confirmed; commercial-use clause doesn't apply (non-commercial site per PROJECT.md). Watch for Vercel ToS changes. |
| Bangumi API for anime tracking | MEDIUM | API exists (`api.bgm.tv/v0/`) and is free/open. Could not fully verify rate limits from documentation source. Recommend build-time fetch + on-disk cache as defensive design. |
| Pagefind for search | HIGH | Active project, official Astro integration |
| pixi-live2d-display alternative | LOW | Last release Dec 2023, PixiJS v6 only — possible long-term staleness. Recommended only as fallback if l2d-widget proves insufficient. |
## Sources
- **Context7** `/withastro/docs` — Content Collections, RSS, MDX, Sitemap, Tailwind integration patterns (HIGH)
- **Context7** `/hexojs/site` — Hexo current version, migration notes (HIGH)
- **Context7** `/jerryc127/hexo-theme-butterfly` — Butterfly feature set (HIGH)
- **Context7** `/anzhiyu-c/hexo-theme-anzhiyu` — Anzhiyu feature comparison (HIGH)
- **Context7** `/xaoxuu/hexo-theme-stellar` — Stellar positioning (business/docs, ruled out) (HIGH)
- **Context7** `/twikoojs/twikoo` — Vercel deployment recipe, init script (HIGH)
- **Context7** `/hacxy/l2d-widget` — Live2D widget API, CDN install (HIGH)
- **Context7** `/oh-my-live2d/oh-my-live2d` — Confirmed rename to l2d-widget (HIGH)
- **Context7** `/pagefind/pagefind` — Static search architecture (HIGH)
- **Context7** `/tsparticles/tsparticles` — Particles ecosystem + framework wrappers (HIGH)
- **GitHub `withastro/astro/releases`** — Astro v6.4.2 verified 2026-05-28 (HIGH)
- **GitHub `hexojs/hexo/releases`** — Hexo v8.1.2 verified 2026-05-06 (HIGH)
- **GitHub `gohugoio/hugo/releases`** — Hugo v0.162.1 verified 2026-05-28 (HIGH)
- **GitHub `tailwindlabs/tailwindcss/releases`** — Tailwind v4.3.0 verified 2026-05-08 (HIGH)
- **GitHub `hacxy/l2d-widget`** — v0.1.0 rewrite of oh-my-live2d, Cubism 2 & 6 (HIGH)
- **GitHub `metowolf/MetingJS`** — v2.0.2 Sept 2025 verified active (HIGH)
- **GitHub `DIYgod/APlayer`** — v1.10.1 (2018) — stable but stagnant (HIGH)
- **GitHub `guansss/pixi-live2d-display`** — v0.5.0-beta Dec 2023, PixiJS v6 only (HIGH, but library is LOW maintenance signal)
- **Cloudflare Pages docs** `developers.cloudflare.com/pages/platform/limits/` — free tier limits (HIGH)
- **Vercel docs** `vercel.com/docs/pricing/manage-and-optimize-usage` — Hobby tier overview (MEDIUM — specific bandwidth caps not surfaced in docs but are well-known via community)
- **Astro docs** `docs.astro.build/en/guides/styling/#tailwind` — Tailwind v4 recommended via Vite plugin (HIGH)
- **Hexo themes directory** `hexo.io/themes/` — Confirmed Anzhiyu/Butterfly/Solitude/Stellar listings + identification of additional anime themes (Kira, Sakura, Arknights, Reimu, MiHoYo) (HIGH)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
