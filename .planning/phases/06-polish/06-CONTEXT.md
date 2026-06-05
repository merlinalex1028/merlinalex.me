# Phase 6: Polish - Context

**Gathered:** 2026-06-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship the site production-ready with these deliverables:

- **Custom 404 page** — kawaii-styled with lost mascot CSS art, random messages from a pool, home + back navigation, returns HTTP 404
- **JSON-LD structured data** — Article + Person + BreadcrumbList schemas on article pages via reusable Astro component, validated with Google Rich Results Test
- **Friend-link health-check GitHub Action** — daily cron, 5s HEAD timeout, publishes `friends-health.json` consumed by Phase 3 UI
- **Test coverage ≥80%** — Vitest unit tests + Playwright E2E on 6 critical paths, GitHub Actions CI gate
- **Build hardening** — NODE_OPTIONS=--max-old-space-size=4096 + Sharp output cache via Cloudflare Pages env vars, <2 minute build budget

</domain>

<decisions>
## Implementation Decisions

### Custom 404 Page (D-01)
- **Vibe:** Lost mascot — confused/lost mascot illustration with fun message like "咦？这里什么都没有…"
- **Interactivity:** Random messages from a pool (lightweight JS, no framework). Each visit shows a different fun message (e.g., "迷路了？" / "走丢了？" / "这里什么都没有哦~")
- **Mascot:** CSS art implementation — no external image, loads instantly, theme-aware colors via CSS variables
- **Navigation:** "回到首页" button + browser back button. Simple, covers common cases.
- **HTTP status:** Already implemented (`Astro.response.status = 404` in `src/pages/404.astro`)

### JSON-LD Structured Data (D-02)
- **Scope:** Articles only — Article + Person + BreadcrumbList schemas on article pages
- **Person schema:** Basic profile — name, avatar URL, sameAs (GitHub, Twitter if available)
- **BreadcrumbList:** 3-level — Home > Articles > Article Title
- **Article fields:** Standard fields — headline, description, author, datePublished, dateModified, image, url
- **Implementation:** Reusable Astro `<JsonLd>` component that accepts schema objects as props
- **Validation:** Build-time unit test that JSON-LD output matches expected schema + manual validation in Google Rich Results Test after deploy

### Friend-link Health-check Action (D-03)
- **Schedule:** Daily cron (GitHub Actions)
- **Check method:** 5-second timeout HEAD request to each friend URL
- **Output:** Writes `src/data/friends-health.json` consumed by Phase 3 UI
- **Failure thresholds:** Mark offline after consecutive failures
- **Notification:** Admin notification when >5 dead links detected

### Test Strategy (D-04)
- **Coverage target:** ≥80% combined Vitest + Playwright coverage on critical paths
- **Approach:** Critical paths first — focus on the 6 paths from ROADMAP
- **Balance:** 70% unit tests (Vitest) / 30% E2E tests (Playwright)
- **Critical paths for E2E:**
  1. Comment posting (Twikoo island)
  2. Theme persistence (light/dark toggle + reload)
  3. Search index (Pagefind returns results)
  4. Live2D fallback (static PNG on low-end devices)
  5. BGM unmute (APlayer interaction)
  6. Reduced-motion gate (prefers-reduced-motion disables effects)
- **CI integration:** GitHub Actions on push/PR, fail if coverage drops below 80%

### Build Hardening (D-05)
- **NODE_OPTIONS:** Set `NODE_OPTIONS=--max-old-space-size=4096` in Cloudflare Pages project settings
- **Sharp cache:** Configure Sharp output caching via Cloudflare Pages environment variables
- **Build time budget:** <2 minutes for full build (leaves margin within Cloudflare's 20-min timeout)
- **No code changes:** All optimizations via Cloudflare Pages env vars, not wrangler.toml or build scripts

### Claude's Discretion
- Specific CSS art design for the 404 mascot
- Random message pool content and count
- JSON-LD component API design
- GitHub Action workflow YAML structure
- Playwright test setup and browser configuration
- Vitest configuration and coverage reporting
- Specific unit test cases for utilities and components

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — REQ-IDs and traceability for Phase 6: INFRA-06 (404 + JSON-LD), INFRA-08 (cron Action), TEST-01, GIT-01
- `.planning/ROADMAP.md` — Phase 6 success criteria, 3-plan breakdown
- `.planning/STATE.md` — Project state and accumulated context from Phases 1-5

### Prior Phase Context (patterns to follow)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Theme architecture, intensity toggle, prefers-reduced-motion, BaseLayout patterns
- `.planning/phases/02-core-content/02-CONTEXT.md` — Article UX patterns, Twikoo integration, component organization
- `.planning/phases/03-works-friend-links/03-CONTEXT.md` — Friends page structure, health-check badge UI consuming `friends-health.json`
- `.planning/phases/05-atmosphere/05-CONTEXT.md` — Live2D, BGM, atmosphere gating patterns

### Existing Implementation (code to build on)
- `src/pages/404.astro` — Current 404 page with HTTP 404 status
- `src/components/core/NotFound.astro` — Current 404 component (basic placeholder)
- `src/data/friends-health.json` — Placeholder health data consumed by Phase 3 UI
- `src/content.config.ts` — Content collection schemas with Zod validation
- `package.json` — Already has `vitest` and `@playwright/test` dependencies

### Research
- `.planning/research/STACK.md` — Library versions
- `.planning/research/PITFALLS.md` — Relevant pitfalls for build and testing

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/core/NotFound.astro` — Current 404 component, can be enhanced with CSS art mascot
- `src/pages/404.astro` — Already sets `Astro.response.status = 404`, just needs content upgrade
- `src/data/friends-health.json` — Consumer already exists in Phase 3 UI, just needs producer (GitHub Action)
- `package.json` — Vitest and Playwright already installed as dev dependencies

### Established Patterns
- `client:idle` directive for deferred hydration (use for 404 random message JS)
- CSS variables for theming (`--color-accent`, `--color-fg`, etc.)
- Component organization: `src/components/{feature}/` directories
- Content collections with Zod validation in `src/content.config.ts`

### Integration Points
- `src/pages/404.astro` — Enhance with new NotFound component
- `src/components/core/NotFound.astro` — Replace with kawaii CSS art version
- `src/data/friends-health.json` — GitHub Action writes here, Phase 3 UI reads
- `.github/workflows/` — New directory for health-check and test CI workflows
- `src/components/article/ArticleLayout.astro` — Add JSON-LD component here

</code_context>

<specifics>
## Specific Ideas

- 404 page should feel like a fun discovery — random messages keep it fresh on repeat visits
- CSS art mascot should be recognizable and kawaii — not just a gradient box
- JSON-LD should be invisible to users but valuable for search engines
- Friend-link health check should be reliable — 5s timeout prevents hanging on slow sites
- Tests should catch real regressions — focus on user-facing behavior, not implementation details
- Build should be fast and reliable — <2 minutes leaves margin for growth

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within Phase 6 scope

</deferred>

---

*Phase: 6-Polish*
*Context gathered: 2026-06-05*
