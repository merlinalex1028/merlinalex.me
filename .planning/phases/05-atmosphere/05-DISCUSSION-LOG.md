# Phase 5: Atmosphere - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 05-Atmosphere
**Areas discussed:** Live2D Mascot, Falling Petals + Effects, BGM Player, Right-click + Easter Eggs

---

## Live2D Mascot

### Q1: Loading approach

| Option | Description | Selected |
|--------|-------------|----------|
| CDN 加载 + 本地模型 | CDN 加载 Cubism SDK，模型文件放在 public/models/ | ✓ |
| 完全自托管 | Cubism SDK 和模型都在 public/ 目录 | |
| 你来决定 | 你来决定加载方式 | |

**User's choice:** CDN 加载 + 本地模型 (Recommended)

### Q2: Model source

| Option | Description | Selected |
|--------|-------------|----------|
| 开源示例模型 | 使用免费的 Cubism SDK 示例模型 | |
| Pixiv 免费模型 | 使用 Pixiv 上的免费二次创作模型 | ✓ |
| 稍后决定 | 先用占位模型 | |

**User's choice:** Pixiv 免费模型

### Q3: Device gate

| Option | Description | Selected |
|--------|-------------|----------|
| 内存 + CPU 门控 | deviceMemory >= 4 && hardwareConcurrency >= 4 | |
| 尝试加载 + 降级 | 所有设备尝试加载，失败时降级到静态 PNG | ✓ |
| 你来决定 | 你来决定门控策略 | |

**User's choice:** 尝试加载 + 降级

### Q4: Interaction features

| Option | Description | Selected |
|--------|-------------|----------|
| 问候 + 模型切换 | 问候语 + 模型切换按钮 | ✓ |
| 仅展示 | 只显示看板娘，无交互 | |
| 你来决定 | 你来决定交互方式 | |

**User's choice:** 问候 + 模型切换 (Recommended)

**Continuation:** User chose "Next area" after 4 questions.

---

## Falling Petals + Effects

### Q1: Effect type

| Option | Description | Selected |
|--------|-------------|----------|
| 樱花花瓣 | 樱花花瓣效果，粉色调 | ✓ |
| 雪花 | 雪花效果，白色/银色调 | |
| 季节切换 | 根据季节自动切换 | |
| 你来决定 | 你来决定效果类型 | |

**User's choice:** 樱花花瓣 (Recommended)

### Q2: Particle config

| Option | Description | Selected |
|--------|-------------|----------|
| 标准配置 | 桌面 30 个，移动端 15 个，30 FPS 节流 | ✓ |
| 密集配置 | 桌面 50 个，移动端 20 个 | |
| 你来决定 | 你来决定数量和性能 | |

**User's choice:** 标准配置 (Recommended)

### Q3: Cursor trail

| Option | Description | Selected |
|--------|-------------|----------|
| 添加 cursor trail | 鼠标移动时留下花瓣轨迹 | ✓ |
| 不做 cursor trail | 只做花瓣飘落 | |
| 你来决定 | 你来决定 | |

**User's choice:** 添加 cursor trail (Recommended)

**Continuation:** User chose "Next area" after 3 questions.

---

## BGM Player

### Q1: Music source

| Option | Description | Selected |
|--------|-------------|----------|
| 网易云音乐 | 使用网易云音乐播放列表 | ✓ |
| QQ 音乐 | 使用 QQ 音乐播放列表 | |
| 本地音频 | 使用本地音频文件 | |
| 你来决定 | 你来决定音乐源 | |

**User's choice:** 网易云音乐 (Recommended)

### Q2: Default behavior

| Option | Description | Selected |
|--------|-------------|----------|
| 默认静音 + 手动开启 | 默认静音，显示"打开音乐"按钮 | ✓ |
| 自动播放 | 默认低音量自动播放 | |
| 你来决定 | 你来决定播放行为 | |

**User's choice:** 默认静音 + 手动开启 (Recommended)

### Q3: Cross-page persistence

| Option | Description | Selected |
|--------|-------------|----------|
| transition:persist | 使用 Astro transition:persist 保持播放状态 | ✓ |
| 重新加载 | 每次页面切换重新加载播放器 | |
| 你来决定 | 你来决定持久化方式 | |

**User's choice:** transition:persist (Recommended)

**Continuation:** User chose "Next area" after 3 questions.

---

## Right-click + Easter Eggs

### Q1: Menu content

| Option | Description | Selected |
|--------|-------------|----------|
| 终端 + 首页 + 赞助 + 强度 | 终端、首页、赞助、强度选择器 | |
| 终端 + 首页 + 关于 + 设置 | 终端、首页、关于、设置 | |
| 你来决定 | 你来决定菜单内容 | ✓ |

**User's choice:** 你来决定 → Claude chose: Terminal, Home, Sponsor, Intensity selector

### Q2: Konami code trigger

| Option | Description | Selected |
|--------|-------------|----------|
| Konami code 终端 | 触发隐藏终端界面 | ✓ |
| 其他效果 | 触发其他效果 | |
| 你来决定 | 你来决定彩蛋内容 | |

**User's choice:** Konami code 终端 (Recommended)

### Q3: Mobile fallback

| Option | Description | Selected |
|--------|-------------|----------|
| 长按工具栏 | 移动端长按显示工具栏 | ✓ |
| 移动端不支持 | 移动端不支持自定义菜单 | |
| 你来决定 | 你来决定移动端方案 | |

**User's choice:** 长按工具栏 (Recommended)

**Continuation:** User chose "I'm ready for context" after 3 questions.

---

## Claude's Discretion

- Specific Live2D model files and licensing verification
- tsParticles configuration for petals
- APlayer theme customization
- Right-click menu CSS and animation
- Konami code terminal commands
- MetingJS playlist ID configuration

## Deferred Ideas

- Live2D dress-up feature (ATM-07-v2) — requires Cubism Editor subscription
- Holiday theme variants (ATM-08-v2) — full Christmas/NYE/Spring Festival sets
