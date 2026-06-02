# Phase 1: Foundation - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a scaffolded Astro project on Cloudflare Pages with:
- 6 detailed Zod content collections + 3 placeholders
- FOUC-safe theme switcher (light/dark) + atmosphere-intensity gate (inert; consumed by Phase 5)
- Home (PAGE-01) + About (PAGE-02) pages rendering with hero, notice bar, persona card
- SEO baseline: `@astrojs/sitemap`, robots.txt, OG/Twitter cards
- Basic 404 stub returning HTTP 404

**Out of Phase 1 scope** (shipped later): atmosphere content (Phase 5), Twikoo comments (Phase 2), Bangumi fetch (Phase 4), RSS/feed (Phase 2), microblog + anime/book/music lists (Phase 4), search (Phase 4), Live2D/petals/BGM (Phase 5), JSON-LD structured data (Phase 6), 80% tests (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Content Collection Schema Scope (D-01)
- **Detailed Zod schemas in Phase 1** for 6 collections: `articles`, `projects`, `creations`, `microblog`, `friends`, `timeline`
- **Placeholder schemas** for 3 collections: `anime`, `books`, `music` (empty Zod object `z.object({})` or minimal field set) — detailed in Phase 4
- Rationale: avoids schema churn across phases; data files can be authored immediately; downstream phases refine without rewriting validation

### Article Schema (D-02)
Required: `title`, `publishedAt`, `tags[]`, `draft`
Optional: `description`, `updatedAt`, `cover`, `category` (string), `sticky` (bool), `password` (string — when set, gates content), `toc` (bool, default true)
- `category` is a freeform string ("tech" / "life" / "review" / "notes") — the tag array handles multi-label; category is the primary grouping
- `sticky` posts float to top of listing
- `password` triggers client-side masking (decoded at runtime via Twikoo not needed; simple symmetric key in frontmatter is fine for hobby use)

### Friends Schema (D-03)
Required: `name`, `url`
Optional: `avatar`, `description`, `category` (e.g. "tech", "anime", "life"), `featured` (bool)
- `featured` sorts to top of category
- Health-check status lives in `src/data/friends-health.json` (consumer-only in Phase 1, producer Action in Phase 6)

### Timeline Schema (D-04)
Required: `date` (ISO date), `title`
Optional: `description`, `image`, `link`, `side` ("left" | "right" | "auto" — for alternating layout)

### Microblog Schema (D-05)
Required: `publishedAt`, `content` (markdown short body)
Optional: `images[]`, `mood` (emoji), `tags[]`
- Auto-archive logic: posts older than 180 days get a derived `archived: true` flag in render layer (not stored)

### Projects Schema (D-06)
Required: `name`, `url`
Optional: `description`, `tags[]` (tech stack), `github` (string), `featured` (bool), `cover`
- GitHub stars fetched at build time into `src/data/github-stars.json` — `stars` field rendered from cache lookup (no per-page fetch)

### Creations Schema (D-07)
Required: `title`, `publishedAt`, `images[]`
Optional: `description`, `tags[]`, `cover`, `category` ("illustration" | "photography" | "craft" | "video")

### Theme + Atmosphere Architecture (D-08)
- **CSS variables** for theming (no `dark:` Tailwind variant for tokens); `:root[data-theme="light|dark"]` selector
- **Atmosphere intensity gate**: `localStorage` key `atmo:level` with values `"off" | "subtle" | "full"`, default `"full"`
- **Pre-paint script in `<head>`** (inline, blocking, synchronous): reads `localStorage.theme` + `localStorage["atmo:level"]` + `prefers-color-scheme` fallback, sets `document.documentElement.dataset.theme` and `document.documentElement.dataset.atmo` BEFORE any style computes
- **Global read API**: expose `window.__atmo__ = { level, theme, set }` for Phase 5 islands to subscribe to; `set` mutates `localStorage` and the `data-*` attrs in one call
- **Phase 1 wires the gate but nothing consumes it** — atmosphere components arrive in Phase 5 and check `window.__atmo__.level` on init
- `prefers-reduced-motion: reduce` forces `atmo:level` to `"off"` (display only — does NOT mutate the user's stored preference; a manual `Full` choice wins on the next page load)

### Theme Persistence Specifics (D-09)
- Theme key: `localStorage.theme` with values `"light" | "dark" | "system"`; "system" follows `prefers-color-scheme`
- Toggle in header: cycles `light → dark → system → light`
- Default for first visit: `"system"`

### Reduced-Motion Baseline (D-10)
- Global CSS rule in `src/styles/global.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
  ```
- Phase 5 atmosphere components MUST also gate their JS loops on `matchMedia('(prefers-reduced-motion: reduce)').matches`; this baseline just protects plain CSS animations

### Cloudflare Pages Deploy (D-11)
- **Production**: push to `main` → automatic production build + deploy
- **Preview**: every PR → automatic preview URL (Cloudflare Pages native)
- **Build command**: `pnpm build`
- **Output dir**: `dist/`
- **Compatibility flags**: `nodejs_compat` (Astro 6 needs it for some integrations)
- **Environment variables in Phase 1**: none required (Twikoo `envId` placeholder lives in `.env.example` only, not deployed)
- **Custom domain**: `merlinalex.me` + `www.merlinalex.me` (CNAME via Cloudflare); HTTPS auto via Cloudflare; canonical `merlinalex.me` with `www` → `301` redirect
- **Branch protection**: `main` requires PR; no force-push

### Build Hardening (D-12)
- `NODE_OPTIONS=--max-old-space-size=4096` set in Cloudflare Pages build env (free tier 1GB default risks OOM on large image sets)
- `pnpm` cache enabled in build (Cloudflare Pages auto-detects)
- Sharp output cache via `astro build` default

### Project Tooling (D-13)
- `pnpm` package manager (lockfile committed)
- Node 22 LTS pinned via `.nvmrc` and `engines.node` in `package.json`
- TypeScript strict mode
- Vitest + Playwright (scaffolded but no tests required until Phase 6)

### Persona Card Content (D-14)
- Fields displayed on About page: avatar, name (zh + romaji/pinyin), MBTI, zodiac (星座), blood type (血型), one-line bio, skill bars (3-5 with proficiency %), favorite anime (3-5), favorite characters (3-5), Q&A (3-5 questions with answers)
- All content lives in a single YAML file at `src/data/persona.yaml` (not a collection) — only one persona exists, no need for collection overhead

### Home Page Content Slots (D-15)
- Hero: name + tagline (one-line from persona.yaml)
- Notice/announcement bar: editable `src/data/notice.md` (markdown short)
- Latest articles slot: top 3 from `articles` collection, sorted by `publishedAt` desc, excluding `draft: true`
- Latest microblog slot: top 5 from `microblog` collection (Phase 4 fills this with real data; Phase 1 shows empty state)
- Hitokoto: added in Phase 4 (Phase 1 shows placeholder)
- Site stats: added in Phase 4

### 404 Stub (D-16)
- Custom 404.astro page with kawaii placeholder (mascot says "迷路了？")
- Returns HTTP 404 via `Astro.response.status = 404` in frontmatter
- Phase 6 polishes the design

### Claude's Discretion
- Specific Zod field shapes (e.g., string vs enum for `category`)
- File organization inside `src/content/` and `src/data/`
- Exact CSS variable names (e.g., `--color-bg`, `--color-fg`)
- Astro Content Loader choice (`glob` vs `file`) — recommend `glob` for markdown collections, `file` for JSON data
- Component naming conventions inside `src/components/`
- Hero illustration choice (Phase 1: simple CSS gradient; Phase 5 may add a static mascot PNG)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — REQ-IDs and traceability for Phase 1: PAGE-01, PAGE-02, ATM-04, INFRA-01, INFRA-02, INFRA-03, INFRA-06 (domain + 404 stub), A11Y-01, A11Y-02, SEO-01
- `.planning/ROADMAP.md` — Phase 1 success criteria, 3-plan breakdown
- `.planning/STATE.md` — Project state and pending concerns

### Research
- `.planning/research/STACK.md` — Library versions, Astro vs Hexo decision rationale, Tailwind v4 Vite plugin gotcha, l2d-widget v0.1.0
- `.planning/research/FEATURES.md` — Genre conventions, accessibility requirements
- `.planning/research/ARCHITECTURE.md` — Content collection schema-first design, layered atmosphere runtime
- `.planning/research/PITFALLS.md` §P-4 (FOUC), §P-6 (prefers-reduced-motion), §P-19 (build OOM) — directly addressed in Phase 1
- `.planning/research/SUMMARY.md` — 6-phase roadmap rationale

### External Specs
- Astro 6 Content Collections with Zod: https://docs.astro.build/en/guides/content-collections/ (verify in `/withastro/docs` via Context7)
- Tailwind v4 + Astro Vite plugin install: https://docs.astro.build/en/guides/styling/ (Tailwind section)
- Cloudflare Pages limits & env: https://developers.cloudflare.com/pages/platform/limits/

</canonical_refs>

<code_context>
## Existing Code Insights

Greenfield project. No prior code, no existing patterns, no reusable components. `.planning/` and `CLAUDE.md` exist; no source code in `src/`.

### Established Patterns
- None yet — Phase 1 establishes them. Recommend:
  - `src/content.config.ts` for collection schemas (single file)
  - `src/content/<collection>/` for markdown content
  - `src/data/` for non-content data files (persona.yaml, notice.md, friends.json initial seed)
  - `src/components/` organized by feature (`hero/`, `about/`, `theme/`, `atmosphere/`)
  - `src/layouts/BaseLayout.astro` as the single layout wrapper

### Integration Points
- Cloudflare Pages connects to the GitHub repo via OAuth; auto-detects pnpm + Astro
- Twikoo envId placeholder at `.env.example` (deployed empty in Phase 1; Phase 2 fills it)

</code_context>

<specifics>
## Specific Ideas

- Persona card: think of it as a character stat sheet (属性卡) from a JRPG — name, level, class, skills, equipment
- 404 page tone: mascot says "咦？这里什么都没有…" with a kawaii illustration placeholder
- Notice bar: subtle, top-of-page, dismissible (single `localStorage` flag per message id)
- Theme toggle: 3-state (light / dark / system) cycled via single header button; small icon for each state
- No specific reference sites — the user is open to standard Astro + Tailwind v4 patterns; "二次元" differentiation comes in Phase 5 atmosphere, not Phase 1 chrome

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 1 scope.

</deferred>

---

*Phase: 1-Foundation*
*Context gathered: 2026-06-02*
