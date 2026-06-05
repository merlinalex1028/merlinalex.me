---
phase: 06-polish
plan: 03
subsystem: testing
tags: [vitest, playwright, ci, coverage, e2e]
depends_on: [06-01, 06-02]
requires: [TEST-01, GIT-01]
provides: [test-infrastructure, ci-gate]
tech_stack:
  added: ["@vitest/coverage-v8@4.1.8"]
  patterns: ["v8 coverage", "chromium-only e2e"]
key_files:
  created:
    - vitest.config.ts
    - playwright.config.ts
    - .github/workflows/test.yml
    - docs/build-hardening.md
    - src/utils/__tests__/word-count.test.ts
    - src/lib/__tests__/atmosphere.test.ts
    - src/lib/__tests__/json-ld.test.ts
    - src/lib/json-ld.ts
    - e2e/theme-persistence.spec.ts
    - e2e/search.spec.ts
    - e2e/reduced-motion.spec.ts
    - e2e/live2d-fallback.spec.ts
    - e2e/bgm.spec.ts
    - e2e/comments.spec.ts
  modified:
    - package.json
decisions:
  - "v8 coverage provider with text + lcov reporters"
  - "80% threshold on branches, functions, statements, lines"
  - "chromium-only Playwright per CLAUDE.md browser support"
  - "CI workflow with separate test and e2e jobs"
metrics:
  duration: "10m"
  completed: "2026-06-05"
  tasks: 3
  files: 14
---

# Phase 6 Plan 3: Tests + Build Hardening Summary

Vitest coverage (v8, 80% threshold) + Playwright E2E (6 critical paths) + GitHub Actions CI gate with build hardening docs for Cloudflare Pages.

## Tasks Completed

### Task 1: Vitest config + unit tests
- Updated `vitest.config.ts` with v8 coverage provider, text + lcov reporters, 80% thresholds
- Created `src/utils/__tests__/word-count.test.ts` (6 tests: CJK, English, mixed, empty, whitespace)
- Created `src/lib/__tests__/atmosphere.test.ts` (21 tests: isOff, isSubtle, isFull, getLevel, setLevel, isMobile, isReducedMotion, onAtmoChange)
- Created `src/lib/json-ld.ts` with articleSchema, personSchema, breadcrumbSchema generators
- Created `src/lib/__tests__/json-ld.test.ts` (9 tests: Article, Person, BreadcrumbList schemas)
- Installed `@vitest/coverage-v8` dependency

### Task 2: Playwright config + E2E tests
- Created `playwright.config.ts` with chromium-only project, webServer on port 4321
- Added `test`, `test:coverage`, `test:e2e`, `test:e2e:ui` scripts to package.json
- Created 6 E2E test files in `e2e/`: theme-persistence, search, reduced-motion, live2d-fallback, bgm, comments

### Task 3: CI workflow + build hardening docs
- Created `.github/workflows/test.yml` with test + e2e jobs on push/PR to main
- Created `docs/build-hardening.md` documenting NODE_OPTIONS and Sharp cache env vars for Cloudflare Pages

## Coverage Results

```
Statements   : 96.18% ( 126/131 )
Branches     : 84.05% ( 58/69 )
Functions    : 94.11% ( 32/34 )
Lines        : 97.16% ( 103/106 )
```

## Decisions Made

1. **v8 coverage provider** — native Vite integration, fast, accurate
2. **80% threshold on all metrics** — per CLAUDE.md testing requirements
3. **chromium-only Playwright** — per CLAUDE.md browser support (Latest Chrome/Safari/Edge)
4. **Separate CI jobs** — test and e2e run independently for faster feedback
5. **JSON-LD utility module** — extracted schema generation from component for testability

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed word-count test expected value**
- **Found during:** Task 1
- **Issue:** Mixed Chinese/English test expected 4 words but actual count is 5 (2 CJK + 1 English + 2 CJK)
- **Fix:** Corrected expected value from 4 to 5
- **Files modified:** src/utils/__tests__/word-count.test.ts
- **Commit:** f4285de

**2. [Rule 2 - Missing] Created json-ld utility module**
- **Found during:** Task 1
- **Issue:** Plan expected json-ld utility from 06-01 but it didn't exist
- **Fix:** Created src/lib/json-ld.ts with articleSchema, personSchema, breadcrumbSchema generators
- **Files modified:** src/lib/json-ld.ts, src/lib/__tests__/json-ld.test.ts
- **Commit:** f4285de

**3. [Rule 1 - Bug] Fixed atmosphere test for matchMedia behavior**
- **Found during:** Task 1
- **Issue:** matchMedia returns true in test environment, causing isReducedMotion test to fail
- **Fix:** Mocked matchMedia to return false for the specific test case
- **Files modified:** src/lib/__tests__/atmosphere.test.ts
- **Commit:** f4285de

## Self-Check: PASSED

- vitest.config.ts: FOUND
- playwright.config.ts: FOUND
- .github/workflows/test.yml: FOUND
- docs/build-hardening.md: FOUND
- All E2E test files: FOUND
- All unit test files: FOUND
- All commits exist in git log: FOUND
