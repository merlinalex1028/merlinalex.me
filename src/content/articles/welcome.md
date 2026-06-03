---
title: "欢迎来到次元入口"
publishedAt: 2026-06-01
updatedAt: 2026-06-02
tags: ["notes"]
draft: false
description: "站点第一篇文章，介绍这个二次元个人站的功能与技术栈"
category: "notes"
sticky: true
toc: true
---

这是一篇用来验证文章详情页功能的示例文章。如果你能看到这篇文章，说明站点的内容系统已经正常运行了。

## 关于这个站点

这是一个以 **二次元可爱风** 为核心的个人站点，使用 Astro + Tailwind CSS 构建。站点的设计理念是打造一个沉浸式的二次元空间，让访客感受到独特的氛围。

站点的主要功能包括：

- 文章系统：支持标签筛选、目录导航、代码高亮
- 作品展示：开源项目与创意作品分区展示
- 社区功能：友链、时间线、番剧追踪
- 氛围系统：Live2D 看板娘、花瓣飘落、BGM 播放器

### 技术栈选择

选择 Astro 作为静态站点生成器，主要因为它的 Content Collections 提供了类型安全的内容管理，以及 Islands Architecture 能够按需加载交互组件。

```typescript
// 文章内容集合的 Zod schema 定义
const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    toc: z.boolean().default(true),
  }),
});
```

上面的代码展示了文章集合的 schema 定义，使用 Zod 进行运行时类型验证。

## 文章详情页功能

文章详情页是站点的核心阅读体验，集成了多个交互组件。

### 目录导航

桌面端会显示一个固定在侧边的目录栏，通过 IntersectionObserver 实现滚动高亮。移动端则显示为一个可折叠的手风琴组件，节省屏幕空间。

### 代码块增强

所有代码块都支持语法高亮（由 Shiki 提供）和一键复制功能。复制按钮默认隐藏，鼠标悬停时显示，点击后会显示"已复制!"的反馈。

```javascript
// 一键复制功能示例
async function copyCode(text) {
  await navigator.clipboard.writeText(text);
  showFeedback('已复制!');
  setTimeout(() => hideFeedback(), 2000);
}
```

### 图片灯箱

文章中的图片支持点击放大查看，使用 medium-zoom 库实现。按 Escape 键可以关闭放大的图片。

![示例图片：站点架构图](/images/welcome-hero.png)

上图展示了站点的整体架构，从内容管理到部署上线的完整流程。

## 开发计划

站点的开发分为多个阶段：

1. **基础框架**：Astro + Tailwind 脚手架、内容集合、基础布局
2. **核心内容**：文章系统、RSS 订阅、评论系统
3. **作品展示**：开源项目、创意作品、友链系统
4. **社区互动**：搜索、番剧追踪、书影音清单
5. **氛围系统**：Live2D、花瓣特效、BGM 播放器
6. **优化打磨**：性能优化、测试覆盖、SEO 增强

### 当前进度

目前正处于第二阶段，正在构建文章系统的完整功能。这一阶段完成后，站点将具备完整的文章阅读体验。

## 写在最后

感谢你访问这个站点。如果你对站点有任何建议或想法，欢迎在文章下方留言交流。

这个站点会持续更新，记录技术学习和二次元生活的点点滴滴。希望这里能成为一个温暖的小角落，给每一位访客带来愉快的体验。
