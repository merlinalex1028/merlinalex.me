# Cloudflare Pages 部署指南

本文档记录将 Astro 站点部署到 Cloudflare Pages 的完整流程。

## 前置条件

- GitHub/GitLab 仓库已推送代码
- Cloudflare 账号（免费注册）
- 域名 `merlinalex.me` 已注册

## 第一步：连接代码仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单选择 **Workers & Pages**
3. 点击 **Create application** → **Pages** → **Connect to Git**
4. 选择 **GitHub** 或 **GitLab**，授权 Cloudflare 访问你的仓库
5. 选择 `merlinalex.me` 仓库，点击 **Begin setup**

## 第二步：配置构建设置

### 构建配置

| 设置项 | 值 |
|--------|-----|
| **Production branch** | `main` |
| **Framework preset** | `Astro` |
| **Build command** | `pnpm build` |
| **Build output directory** | `dist` |
| **Node.js version** | `22` (在 Environment Variables 中设置) |

### 环境变量

在 **Environment variables** 部分添加：

| Variable name | Value | Environment |
|---------------|-------|-------------|
| `NODE_VERSION` | `22` | Production & Preview |
| `TWIKOO_ENV_ID` | `https://your-twikoo-url.vercel.app` | Production & Preview |

> **注意**: `TWIKOO_ENV_ID` 的值需要在部署 Twikoo 后获取，参考 [Twikoo 配置指南](./twikoo-setup.md)。

### 高级设置（可选）

- **Build caching**: 启用（加速后续构建）
- **Node.js version**: 通过环境变量 `NODE_VERSION` 设置更可靠

## 第三步：触发首次部署

1. 点击 **Save and Deploy**
2. Cloudflare 会自动：
   - 拉取代码
   - 安装依赖 (`pnpm install`)
   - 执行构建 (`pnpm build`)
   - 部署到全球 CDN
3. 等待 2-3 分钟，部署完成后会显示 **Success**

### 部署产物

部署成功后，你会得到一个预览 URL：
- Production: `https://merlinalex.pages.dev`
- Preview (PR): `https://<hash>.merlinalex.pages.dev`

## 第四步：配置自定义域名

### 添加域名

1. 在 Pages 项目中，进入 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入 `merlinalex.me`，点击 **Continue**
4. Cloudflare 会自动检测 DNS 配置

### DNS 配置

如果域名在 Cloudflare 管理（推荐）：
- 自动添加 CNAME 记录，无需手动配置

如果域名在其他注册商：
1. 添加 CNAME 记录：
   ```
   merlinalex.me  →  merlinalex.pages.dev
   ```
2. 或者添加 `www` 子域名：
   ```
   www.merlinalex.me  →  merlinalex.pages.dev
   ```

### SSL/TLS

Cloudflare 自动提供免费 SSL 证书，无需额外配置。

## 第五步：验证部署

1. 访问 https://merlinalex.me
2. 检查以下功能：
   - [ ] 页面正常加载
   - [ ] 样式正确显示
   - [ ] 主题切换工作
   - [ ] 评论区显示（如果已配置 Twikoo）
   - [ ] Live2D 看板娘加载
   - [ ] BGM 播放器工作

## 自动部署

配置完成后，每次推送到 `main` 分支会自动触发 Production 部署。

PR 会自动创建 Preview 部署，方便测试。

## 环境变量管理

### 本地开发

在项目根目录创建 `.env` 文件：

```bash
TWIKOO_ENV_ID=https://your-twikoo-url.vercel.app
```

### 生产环境

在 Cloudflare Pages → Settings → Environment variables 中管理。

## 构建优化

### 启用构建缓存

Cloudflare Pages 默认启用构建缓存，可显著加速后续构建。

### 构建时间优化

- 使用 `pnpm` 而非 `npm`（更快的依赖安装）
- 保持依赖精简
- 使用 `.cfignore` 排除不需要的文件

创建 `.cfignore` 文件：
```
node_modules
.git
.env
*.log
```

## 常见问题

### 构建失败：Node.js 版本错误

确保环境变量中设置了 `NODE_VERSION=22`。

### 构建失败：pnpm 找不到

Cloudflare Pages 默认使用 npm。如果要用 pnpm，在 Build command 中使用：
```bash
corepack enable && pnpm build
```

或在环境变量中设置：
```
NODE_VERSION=22
```
（Node.js 22 自带 corepack）

### 部署成功但页面空白

检查 Build output directory 是否为 `dist`（Astro 默认输出目录）。

### 自定义域名 SSL 错误

等待几分钟让 SSL 证书生效。如果持续报错，检查 DNS 配置是否正确。

### 预览部署正常，生产部署异常

检查生产环境的环境变量是否与预览环境一致。

## Cloudflare Pages 免费套餐限制

| 资源 | 限制 | 说明 |
|------|------|------|
| 构建次数 | 500 次/月 | ~16 次/天，足够个人博客 |
| 构建时间 | 20 分钟/次 | Astro 构建通常 <1 分钟 |
| 并发构建 | 1 个 | 个人项目可接受 |
| 自定义域名 | 100 个 | 充足 |
| 带宽 | **无限** | 核心优势 |
| 站点文件数 | 20,000 | 足够 |
| 单文件大小 | 25 MiB | Live2D 模型可能较大，注意 |

## 高级配置

### 分支部署

可以为不同分支部署不同环境：
- `main` → Production
- `staging` → Staging 环境
- `dev` → 开发环境

### 预览部署

每个 PR 会自动创建预览部署，URL 格式：
```
https://<commit-hash>-merlinalex.pages.dev
```

### 回滚

在 Pages 项目 → Deployments 中，可以一键回滚到任意历史版本。

## 相关文档

- [Twikoo 评论系统配置](./twikoo-setup.md)
- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
