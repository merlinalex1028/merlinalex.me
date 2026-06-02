# Phase 1: Foundation — Discussion Log

**Date:** 2026-06-02
**Phase:** 1-Foundation
**Mode:** discuss (interactive, no flags)

## Areas Discussed

### 1. Schema Detail (gray area)

**Question:** Which collections get detailed Zod schemas in Phase 1, which stay as placeholders?

| Option | User Selected |
|---|---|
| Detail 6 (articles / projects / creations / microblog / friends / timeline); placeholder 3 (anime / books / music) | ✓ |
| Detail all 9 | |
| Detail only 2 (articles, friends) | |

**Rationale captured:** Avoid schema churn across phases; downstream phases refine without rewriting validation; data files can be authored immediately.

---

### 2. Theme + Intensity Gate Architecture (gray area)

**Question:** How is the theme persisted, the intensity gate stored, and consumed by future Phase 5 atmosphere components?

| Option | User Selected |
|---|---|
| Full architecture — CSS vars + `:root[data-theme]` + `localStorage["atmo:level"]` + pre-paint script + `window.__atmo__` global | ✓ |
| Pure Tailwind `dark:` variant | |
| Nanostores / external state lib | |

**Decisions captured:**
- D-08: Pre-paint inline script reads both `theme` and `atmo:level` synchronously; sets `data-*` attrs before style compute
- D-08: `window.__atmo__` global with `{ level, theme, set }` API for Phase 5 islands
- D-08: `prefers-reduced-motion: reduce` displays as "off" without mutating user's stored preference
- D-09: Theme key `localStorage.theme` with values `light | dark | system`; default `system`; cycles via header button
- D-10: Global CSS reduced-motion rule in `src/styles/global.css`; Phase 5 also gates JS loops

---

### 3. Cloudflare Pages Deploy (gray area)

**Question:** What deploy granularity?

| Option | User Selected |
|---|---|
| main → production, PR → preview, `pnpm build`, `dist/` | ✓ |
| Manual `wrangler` deploy | |
| Custom GitHub Actions | |

**Decisions captured:**
- D-11: `nodejs_compat` flag, custom domain `merlinalex.me` + `www` redirect, branch protection on `main`
- D-12: `NODE_OPTIONS=--max-old-space-size=4096` in CF build env; pnpm cache auto-detected

---

## Decisions Summary (16 captured)

| ID | Decision |
|---|---|
| D-01 | 6 detailed + 3 placeholder Zod schemas |
| D-02 | Article schema fields |
| D-03 | Friends schema fields |
| D-04 | Timeline schema fields |
| D-05 | Microblog schema fields (180d auto-archive at render layer) |
| D-06 | Projects schema fields + GitHub stars cache |
| D-07 | Creations schema fields |
| D-08 | Atmosphere intensity gate: `localStorage["atmo:level"]` + pre-paint + `window.__atmo__` |
| D-09 | Theme: 3-state (light/dark/system), default system |
| D-10 | prefers-reduced-motion global CSS rule (Phase 5 also gates JS) |
| D-11 | CF Pages: main→prod, PR→preview, `pnpm build`, `dist/`, `nodejs_compat`, custom domain with www redirect |
| D-12 | `NODE_OPTIONS=--max-old-space-size=4096` in CF build env |
| D-13 | pnpm + Node 22 LTS + TS strict + Vitest+Playwright scaffolds |
| D-14 | Persona card content lives in `src/data/persona.yaml` (not a collection) |
| D-15 | Home content slots (hero, notice, latest articles top 3, microblog placeholder) |
| D-16 | 404 stub: `Astro.response.status = 404`; Phase 6 polishes |

## Deferred Ideas

None — discussion stayed within Phase 1 scope.

## Claude's Discretion

Specific Zod field shapes, file organization, CSS variable names, Content Loader choice (`glob` for md, `file` for JSON), component naming, hero illustration.

## Next Step

`/gsd-plan-phase 1` (or `/gsd-ui-phase 1` for the UI design contract, recommended since `UI hint: yes`).
