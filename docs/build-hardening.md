# Build Hardening

## Cloudflare Pages Environment Variables

Set these in Cloudflare Pages dashboard → Settings → Environment variables:

### NODE_OPTIONS
- **Variable:** `NODE_OPTIONS`
- **Value:** `--max-old-space-size=4096`
- **Purpose:** Increases Node.js heap size to prevent OOM during Astro build
- **Scope:** Production + Preview

### Sharp Cache
- **Variable:** `SHARP_IGNORE_GLOBAL_LIBVIPS`
- **Value:** `1`
- **Purpose:** Forces Sharp to use its bundled libvips, avoiding version conflicts
- **Scope:** Production + Preview

## Build Time Budget

Target: <2 minutes for full build (leaves margin within Cloudflare's 20-min timeout).

Monitor build times in Cloudflare Pages dashboard → Deployments → Build duration.

## Verification

After setting env vars, trigger a manual deploy and verify:
1. Build completes without OOM errors
2. Build time is <2 minutes
3. All pages render correctly
