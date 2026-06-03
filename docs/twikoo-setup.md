# Twikoo 评论系统配置指南

本文档记录 Twikoo 评论系统的完整部署和配置流程。

## 架构概览

```
Cloudflare Pages (前端)  →  Twikoo CDN (jsdelivr)  →  Vercel (后端 API)  →  MongoDB Atlas (数据库)
```

- **前端**: Cloudflare Pages 托管的 Astro 站点
- **后端**: Vercel 部署的 Twikoo 服务端
- **数据库**: MongoDB Atlas 免费 M0 集群

## 第一步：创建 MongoDB Atlas 数据库

1. 打开 https://www.mongodb.com/atlas，注册/登录
2. 创建一个免费的 **M0 集群**（512 MB，永久免费）
3. 在 **Database Access** 中创建一个数据库用户（记住用户名和密码）
4. 在 **Network Access** 中添加 `0.0.0.0/0`（允许所有 IP 访问）
5. 回到集群页面，点击 **Connect** → **Drivers**，复制连接字符串：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   把 `<username>` 和 `<password>` 替换为你创建的数据库用户信息

## 第二步：部署 Twikoo 到 Vercel

1. 打开 https://github.com/twikoojs/twikoo，Fork 该仓库
2. 打开 https://vercel.com，登录
3. 点击 **New Project** → 导入你 Fork 的 twikoo 仓库
4. **Root Directory** 设为 `src/server/vercel-min`
5. 在 **Environment Variables** 中添加：
   - Key: `MONGODB_URI`
   - Value: 上面复制的 MongoDB 连接字符串
6. 点击 **Deploy**，等待部署完成
7. 部署成功后，你会得到一个 URL，类似：`https://twikoo-xxx.vercel.app`

### 关闭 Vercel 身份验证（重要）

Vercel 默认开启 Deployment Protection，会阻止外部请求（导致 CORS + 401 错误）：

1. 进入 Vercel 项目 → **Settings** → **Deployment Protection**
2. 把 **Vercel Authentication** 关闭（或设为 "Only Preview Deployments"）
3. 保存

## 第三步：配置本地开发环境

在项目根目录创建 `.env` 文件：

```bash
TWIKOO_ENV_ID=https://twikoo-xxx.vercel.app
```

把 URL 替换为你 Vercel 实际部署的地址。注意必须包含 `https://` 前缀。

重启开发服务器：

```bash
pnpm dev
```

## 第四步：配置 Cloudflare Pages 生产环境

1. 打开 Cloudflare Dashboard → **Pages** → 你的项目
2. 进入 **Settings** → **Environment variables**
3. 添加：
   - **Variable name:** `TWIKOO_ENV_ID`
   - **Value:** `https://twikoo-xxx.vercel.app`
   - **Environment:** Production 和 Preview 都添加
4. 保存后触发一次重新部署

## 验证

1. 访问任意文章页面，滚动到底部
2. 看到 "评论" 标题和输入框即为配置成功
3. 尝试发表一条评论，能成功发送即为全部完成

## 常见问题

### Comment failed: 缺少 envId 配置

`.env` 文件中 `TWIKOO_ENV_ID` 缺少 `https://` 前缀。

### Comment failed: 0, network / CORS 错误 + 401

Vercel 开启了 Deployment Protection，需要在 Vercel Settings → Deployment Protection 中关闭 Vercel Authentication。

### 评论区显示"评论功能正在配置中"

`TWIKOO_ENV_ID` 环境变量未设置。检查 `.env` 文件（本地）或 Cloudflare Pages 环境变量（生产）。
