---
status: complete
phase: 01-foundation
source: [01-VERIFICATION.md]
started: 2026-06-03
updated: 2026-06-03
---

# Phase 1: Human Verification (UAT)

Phase 1 (Foundation) automated checks all passed. The 9 items below require owner action — they cannot be automated from the local CLI because they involve Cloudflare Pages dashboard interactions, DNS configuration, and live-deploy behavior verification.

## Tests

### 1. Connect Cloudflare account to GitHub and create Pages project
expected: Pages project created with framework preset Astro
result: pass

### 2. Configure build command, output dir, and env vars in CF Pages dashboard
expected: Build command = pnpm build, output = dist, NODE_VERSION=22, NODE_OPTIONS=--max-old-space-size=4096
result: pass

### 3. Add custom domain merlinalex.me and www.merlinalex.me (with www→apex 301 toggle)
expected: merlinalex.me serves the built site; www.merlinalex.me 301-redirects to apex
result: skipped
reason: 暂时没有域名，后续购买后再配置

### 4. Trigger production build by pushing to main (or manual deploy)
expected: Production deploy completes, site live at https://merlinalex.me/
result: pass

### 5. Hard refresh https://merlinalex.me/ in browser; verify no FOUC on first paint
expected: Light/dark theme appears immediately based on localStorage + prefers-color-scheme; no flash of wrong color
result: pass

### 6. Click theme switcher in header 3 times (light → dark → system → light); verify cycle works and persists across reload
expected: data-theme attribute updates, localStorage.theme updates, choice survives hard refresh
result: pass

### 7. Click intensity badge 3 times (off → subtle → full); verify data-atmo updates and localStorage["atmo:level"] persists
expected: Badge cycles; reduced-motion forces off display without mutating storage
result: pass

### 8. Visit https://merlinalex.me/nonexistent-path-12345; verify HTTP 404 + kawaii copy renders
expected: curl -I returns HTTP/2 404; body contains 咦？这里什么都没有… and 回到首页 link
result: pass

### 9. Run Lighthouse on the deployed Home page; verify no FOUC warning
expected: Lighthouse no-FOUC check passes; first paint shows correct theme
result: pass

## Summary

total: 9
passed: 8
issues: 0
pending: 0
skipped: 1
blocked: 0

## Gaps

None — all Phase 1 must-haves are verified in the codebase (17/17 truths, 10/10 requirements). Remaining items are owner-side deploy steps, not code gaps.

## Next Steps

- Mark each test `[pass]` or `[fail]` as you complete it
- Re-run `/gsd-verify-work 01` if any test fails
- Once all 9 tests pass, the phase auto-closes via `/gsd-progress` or `/gsd-audit-uat`
