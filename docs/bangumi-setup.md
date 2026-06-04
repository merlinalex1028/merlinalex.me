# Bangumi 数据配置指南

本文档记录 Bangumi 动漫/书籍/音乐追踪数据的完整配置流程。

## 架构概览

```
Bangumi API (api.bgm.tv)  →  Prebuild Script  →  src/content/{type}/list.json  →  Astro Pages
```

- **数据源**: Bangumi API v0 (`api.bgm.tv/v0/users/{username}/collections`)
- **获取时机**: Build 时通过 prebuild 脚本自动获取
- **缓存策略**: 12 小时 TTL，文件 mtime 检查
- **手动覆盖**: `src/data/bangumi-override.json`

## 第一步：获取 Bangumi 用户名

1. 打开 https://bgm.tv，登录你的账号
2. 你的用户名在个人主页 URL 中：`bgm.tv/user/你的用户名`
3. 记下这个用户名

## 第二步：本地配置

在项目根目录的 `.env` 文件中添加：

```bash
BANGUMI_USERNAME=你的bangumi用户名
```

然后运行刷新脚本获取数据：

```bash
pnpm bangumi:refresh
```

这会从 Bangumi API 获取你的动漫/书籍/音乐收藏数据，写入：
- `src/content/anime/list.json`
- `src/content/books/list.json`
- `src/content/music/list.json`

之后正常启动开发服务器：

```bash
pnpm dev
```

## 第三步：Cloudflare Pages 配置

1. 打开 Cloudflare Dashboard → **Pages** → 你的项目
2. 进入 **Settings** → **Environment variables**
3. 添加：
   - **Variable name:** `BANGUMI_USERNAME`
   - **Value:** 你的 Bangumi 用户名
   - **Environment:** Production 和 Preview 都添加
4. 保存

由于 `package.json` 中配置了 `"prebuild"` 脚本，每次 `pnpm build` 时会自动运行 Bangumi 数据刷新。Cloudflare Pages 部署时会自动执行 build，所以数据会在每次部署时更新。

## 数据更新策略

- **本地：** 手动运行 `pnpm bangumi:refresh` 更新数据
- **Cloudflare：** 每次部署自动更新（通过 prebuild 脚本）
- **缓存：** 12 小时 TTL — 如果数据文件在 12 小时内已存在且未过期，脚本会跳过 API 请求
- **手动覆盖：** 编辑 `src/data/bangumi-override.json` 可以覆盖特定条目的数据

## 手动覆盖

编辑 `src/data/bangumi-override.json`，格式如下：

```json
{
  "anime": [
    {
      "id": 12345,
      "name": "某动漫",
      "nameCn": "某动漫",
      "image": "https://...",
      "rating": 8.5,
      "progress": "12/24",
      "status": 3,
      "url": "https://bgm.tv/subject/12345"
    }
  ],
  "books": [],
  "music": []
}
```

覆盖数据会与 API 数据合并，覆盖条目优先。

## 页面说明

配置完成后，以下页面会显示 Bangumi 数据：

- `/anime` — 动漫列表（Tab 切换：全部/在看/看过/想看）
- `/books` — 书籍列表
- `/music` — 音乐列表

## 常见问题

### 页面显示"暂无数据"

检查 `BANGUMI_USERNAME` 是否正确设置，以及 Bangumi 账号是否有公开的收藏数据。

### API 请求失败

Bangumi API 有请求频率限制。如果遇到 429 错误，等待一段时间后重试。

### 数据不是最新的

运行 `pnpm bangumi:refresh` 强制刷新缓存数据。
