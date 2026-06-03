# Phase 4: Community + Search - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 04-Community + Search
**Areas discussed:** Microblog Feed Layout, Bangumi Data Fetch, Timeline Layout, Search + Home Widgets

---

## Microblog Feed Layout

### Q1: Feed layout style

| Option | Description | Selected |
|--------|-------------|----------|
| 卡片式 | 每条说说一张卡片，显示内容、图片缩略图、心情 emoji、标签、日期 | ✓ |
| 无边框流 | 说说内容直接排列，无卡片边框 | |
| 你来决定 | 你来决定布局 | |

**User's choice:** 卡片式 (Recommended)

### Q2: Pagination

| Option | Description | Selected |
|--------|-------------|----------|
| 分页按钮 | 每次加载 10 条，底部"加载更多"按钮 | ✓ |
| 无限滚动 | 滚动到底部自动加载下一页 | |
| 你来决定 | 你来决定分页方式 | |

**User's choice:** 分页按钮 (Recommended)

### Q3: Auto-archive display

| Option | Description | Selected |
|--------|-------------|----------|
| 显示 + 归档标签 | 归档说说仍显示在列表中，但有"归档"标签和稍微降低的透明度 | ✓ |
| 分离归档区 | 归档说说移到单独的"归档"区域，按年份分组 | |
| 你来决定 | 你来决定归档展示方式 | |

**User's choice:** 显示 + 归档标签 (Recommended)

### Q4: Image display

| Option | Description | Selected |
|--------|-------------|----------|
| 缩略图网格 + Lightbox | 图片以缩略图网格显示（最多 3 张预览），点击打开 lightbox | ✓ |
| 单图预览 | 图片只显示第一张，其余折叠 | |
| 你来决定 | 你来决定图片展示 | |

**User's choice:** 缩略图网格 + Lightbox (Recommended)

**Continuation:** User chose "Next area" after 4 questions.

---

## Bangumi Data Fetch

### Q1: List layout

| Option | Description | Selected |
|--------|-------------|----------|
| 卡片网格 | 每个条目一张卡片，显示封面、标题、评分、进度、状态标签 | ✓ |
| 紧凑列表 | 紧凑列表，每行显示封面缩略图 + 标题 + 评分 + 进度 | |
| 你来决定 | 你来决定布局 | |

**User's choice:** 卡片网格 (Recommended)

### Q2: Data fetch approach

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time fetch + JSON 缓存 | Build 时通过 Bangumi API 获取数据，缓存到 src/data/bangumi.json | ✓ |
| 客户端 fetch | 在页面加载时通过客户端 JS 获取 Bangumi API | |
| 你来决定 | 你来决定数据获取方式 | |

**User's choice:** Build-time fetch + JSON 缓存 (Recommended)

### Q3: Status switch

| Option | Description | Selected |
|--------|-------------|----------|
| Tab 切换 | 顶部 Tab 切换：全部 / 在看 / 看过 / 想看 | ✓ |
| 标签筛选 | 所有状态混排，通过标签筛选 | |
| 你来决定 | 你来决定状态切换方式 | |

**User's choice:** Tab 切换 (Recommended)

### Q4: Manual override

| Option | Description | Selected |
|--------|-------------|----------|
| JSON 覆盖文件 | src/data/bangumi-override.json 中手动配置覆盖项 | ✓ |
| 不支持覆盖 | 完全依赖 Bangumi API | |
| 你来决定 | 你来决定覆盖方式 | |

**User's choice:** JSON 覆盖文件 (Recommended)

**Continuation:** User chose "Next area" after 4 questions.

---

## Timeline Layout

### Q1: Layout style

| Option | Description | Selected |
|--------|-------------|----------|
| 左右交替 | 年份大标题，下方条目左右交替排列，中间垂直线连接 | ✓ |
| 单侧排列 | 所有条目统一在一侧 | |
| 你来决定 | 你来决定布局 | |

**User's choice:** 左右交替 (Recommended)

### Q2: Entry content

| Option | Description | Selected |
|--------|-------------|----------|
| 完整信息 | 日期 + 标题 + 描述 + 可选图片 + 可选链接，全部可见 | ✓ |
| 折叠式 | 只显示日期和标题，点击展开 | |
| 你来决定 | 你来决定条目内容 | |

**User's choice:** 完整信息 (Recommended)

### Q3: Year grouping

| Option | Description | Selected |
|--------|-------------|----------|
| 年份分组 + 标题 | 每个年份一个大标题，下方是该年条目 | ✓ |
| 无分组 | 所有条目按时间倒序排列 | |
| 你来决定 | 你来决定年份分组方式 | |

**User's choice:** 年份分组 + 标题 (Recommended)

**Continuation:** User chose "Next area" after 3 questions (no 4th needed).

---

## Search + Home Widgets

### Q1: Search UI location

| Option | Description | Selected |
|--------|-------------|----------|
| 导航栏搜索框 | 导航栏搜索图标，点击展开搜索框 | ✓ |
| 独立搜索页面 | 独立的 /search 页面 | |
| 你来决定 | 你来决定搜索 UI | |

**User's choice:** 导航栏搜索框 (Recommended)

### Q2: Search results display

| Option | Description | Selected |
|--------|-------------|----------|
| 标题 + 高亮摘要 + 日期 | 每个结果显示标题、摘要（搜索词高亮）、日期、分类标签 | ✓ |
| 标题 + 日期 | 只显示标题和日期 | |
| 你来决定 | 你来决定结果展示 | |

**User's choice:** 标题 + 高亮摘要 + 日期 (Recommended)

### Q3: Home widgets

| Option | Description | Selected |
|--------|-------------|----------|
| Hitokoto 一言 | 随机显示一句话，来自 hitokoto.cn API | ✓ |
| 站点统计 | 显示站点运行时间、文章数、总字数、busuanzi 访客数 | ✓ |
| 公告栏 | 显示最新的 1-2 条公告 | |
| 最新说说 | 显示最新的 5 条说说 | ✓ |

**User's choices:** Hitokoto 一言, 站点统计, 最新说说

### Q4: Tag cloud + archive

| Option | Description | Selected |
|--------|-------------|----------|
| 独立 /archive 页面 | 标签云 + 按年份排列的文章列表，0/1-post 标签隐藏 | ✓ |
| 首页标签云 | 首页底部显示标签云 | |
| 你来决定 | 你来决定标签云位置 | |

**User's choice:** 独立 /archive 页面 (Recommended)

**Continuation:** User chose "I'm ready for context" after 4 questions.

---

## Claude's Discretion

- Pagefind configuration and search UI styling
- Bangumi API error handling and retry logic
- Timeline CSS implementation
- Hitokoto API integration approach
- Busuanzi integration approach
- Specific Tailwind/CSS classes for all new components

## Deferred Ideas

- None — discussion stayed within Phase 4 scope
