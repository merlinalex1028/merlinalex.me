---
status: complete
phase: 02-core-content
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md, 02-04-SUMMARY.md]
started: 2026-06-03T15:00:00.000Z
updated: 2026-06-03T15:45:00.000Z
---

## Current Test

[testing complete]

## Tests

### 1. Articles Index Page Load
expected: Visit /articles — page loads with a list of articles in single-column layout. Each article shows title, excerpt (2-line clamp), date, and category pill. Sticky articles appear at the top.
result: pass

### 2. Tag Chip Filtering
expected: Horizontal tag chips appear above the article list ("全部", "技术", "生活", "评测", "笔记"). Clicking a chip filters the list to show only articles with that tag. The active chip is highlighted with accent color. URL updates to /articles?tag=tech (or similar).
result: issue
reported: "没有高亮的感觉"
severity: cosmetic

### 3. Article Detail Page Load
expected: Click any article from the list. Article detail page loads with title, reading time, last-updated date, and full article content with prose styling.
result: pass

### 4. TOC Sidebar
expected: On desktop (>1024px), a sticky "目录" sidebar appears on the left showing h2/h3 headings. Clicking a heading scrolls to that section. As you scroll, the active heading is highlighted with an accent-colored left border.
result: pass

### 5. Code Block Copy Button
expected: Hover over any code block — a "复制" button appears in the top-right. Click it — button text changes to "已复制!" with accent color for 2 seconds, then reverts. Code is copied to clipboard.
result: pass

### 6. Image Lightbox
expected: Click any image in the article — a zoomed overlay opens with dark background. Press Escape or click outside the image to dismiss.
result: pass

### 7. Prev/Next Navigation
expected: At the bottom of an article, two cards show "上一篇" and "下一篇" with the previous and next article titles. Clicking navigates to that article.
result: pass

### 8. Related Posts Grid
expected: Below prev/next, a "相关文章" heading with 3 article cards. Cards show title and date. If fewer than 3 related articles exist, remaining slots filled with most recent articles.
result: pass

### 9. Share Buttons
expected: Share buttons row with copy-link, Twitter/X, and Weibo icons. Clicking copy-link shows "已复制链接!" feedback. Twitter/X and Weibo open in new tabs with pre-filled share URL.
result: pass

### 10. Copyright Footer
expected: Below share buttons, a copyright notice: "本文作者: merlinalex · 本文链接: {permalink} · 转载请注明出处". Permalink is a clickable link.
result: pass

### 11. Scroll-to-Top Button
expected: Scroll down past the first viewport — a floating pink circle button with up-arrow appears in bottom-right. Click it — page scrolls smoothly to top.
result: pass

### 12. RSS Feed Discovery
expected: Every page's <head> contains two <link rel="alternate" type="application/rss+xml"> tags pointing to /feed.xml and /feed-full.xml. Footer shows an RSS icon link.
result: pass

### 13. Summary RSS Feed
expected: Visit /feed.xml — valid RSS 2.0 XML loads. Each article has title, description/excerpt, published date, author, category. Draft articles are excluded.
result: pass

### 14. Full-Content RSS Feed
expected: Visit /feed-full.xml — valid RSS 2.0 XML loads. Each article has full HTML content (not just excerpt). Image URLs are absolute (https://merlinalex.me/...). Links are absolute.
result: pass

### 15. Twikoo Comment Section
expected: Scroll to the bottom of an article page — "评论" heading appears. Twikoo comment form loads (may require TWIKOO_ENV_ID to be set). Anonymous commenting with nickname field is available.
result: pass

### 16. Bilibili Sticker Picker
expected: In the Twikoo comment input area, clicking the emote/sticker button opens a picker showing Bilibili default emotes. Selecting an emote inserts it into the comment.
result: pass

### 17. Reading Time Display
expected: Below the article title, "{N} 分钟阅读" is displayed. If the article has an updatedAt field, "最后更新于 {date}" also appears.
result: pass

### 18. Nav Articles Link
expected: The header navigation includes an "文章" link. Clicking it navigates to /articles.
result: pass

## Summary

total: 18
passed: 17
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Active tag chip is highlighted with accent color"
  status: failed
  reason: "User reported: 没有高亮的感觉"
  severity: cosmetic
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
