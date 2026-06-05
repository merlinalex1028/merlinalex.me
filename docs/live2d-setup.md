# Live2D 模型获取与配置指南

> 项目使用 `l2d-widget` 加载 Live2D 角色。模型配置入口为 `public/models/live2d-models.json`。

## 一、获取模型的途径

### 1. npm 免费模型包（推荐，最稳定）

社区维护了一批 npm 模型包，通过 jsdelivr CDN 分发，国内访问稳定：

```bash
# 安装你需要的模型包到项目
pnpm add live2d-widget-model-wanko       # 柴犬
pnpm add live2d-widget-model-hijiki      # 黑猫
pnpm add live2d-widget-model-tororo      # 白猫
pnpm add live2d-widget-model-shizuku     # 少女
pnpm add live2d-widget-model-koharu      # 萝莉
pnpm add live2d-widget-model-haruto      # 少年
pnpm add live2d-widget-model-izumi       # 泳装少女
pnpm add live2d-widget-model-nico        # 猫娘
pnpm add live2d-widget-model-nipsilon    # 兔娘
pnpm add live2d-widget-model-ni-jiki     # 猫耳女仆
pnpm add live2d-widget-model-tsumiki     # 萝莉2
pnpm add live2d-widget-model-unitychan   # Unity娘
pnpm add live2d-widget-model-chitose     # 萝莉3
```

安装后模型文件在 `node_modules/live2d-widget-model-xxx/assets/` 下。

**配置方式**（直接引用 npm 包的 CDN 路径）：

```json
{
  "models": [
    {
      "path": "https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json"
    }
  ],
  "tips": {
    "welcome": "汪！欢迎回来~",
    "touch": "呜呜，别摸我耳朵~"
  }
}
```

可用的 CDN 路径列表：

| 模型 | CDN 路径 |
|------|----------|
| 柴犬 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json` |
| 黑猫 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json` |
| 白猫 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json` |
| 少女 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json` |
| 萝莉 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json` |
| 少年 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-haruto@1.0.5/assets/haruto.model.json` |
| 泳装少女 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-izumi@1.0.5/assets/izumi.model.json` |
| 猫娘 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-nico@1.0.5/assets/nico.model.json` |
| 兔娘 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-nipsilon@1.0.5/assets/nipsilon.model.json` |
| 猫耳女仆 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-ni-jiki@1.0.5/assets/ni-jiki.model.json` |
| 萝莉2 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-tsumiki@1.0.5/assets/tsumiki.model.json` |
| Unity娘 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-unitychan@1.0.5/assets/unitychan.model.json` |
| 萝莉3 | `https://cdn.jsdelivr.net/npm/live2d-widget-model-chitose@1.0.5/assets/chitose.model.json` |

### 2. 本地模型（下载到 public/models/）

如果 npm 包的模型不够用，或者你想用 Pixiv/Booth 上的自定义模型：

#### 步骤

1. **下载模型文件**（来源见下方"模型来源"章节）
2. **放入项目**：

```bash
# 假设下载的模型文件夹叫 "my-model"
cp -r ~/Downloads/my-model public/models/my-model
```

3. **确认文件结构**：

```
public/models/my-model/
├── model3.json          ← 入口文件（Cubism 4 格式）
├── model.moc3           ← 核心模型数据
├── model.physics3.json  ← 物理模拟（头发/衣服摆动）
├── textures/
│   └── texture_00.png   ← 贴图
├── motions/             ← 动作文件（可选）
│   ├── idle.motion3.json
│   └── tap.motion3.json
└── expressions/         ← 表情文件（可选）
    ├── happy.exp3.json
    └── angry.exp3.json
```

> **注意**：Cubism 2 格式的入口文件是 `.model.json`（不是 `model3.json`），两种格式 l2d-widget 都支持。

4. **配置路径**：

```json
{
  "models": [
    {
      "path": "/models/my-model/model3.json"
    }
  ],
  "tips": {
    "welcome": "你好呀~",
    "touch": "诶嘿~"
  }
}
```

### 3. 远程 CDN 模型（model.hacxy.cn）

l2d-widget 作者提供的模型 CDN：

```json
{
  "models": [
    { "path": "https://model.hacxy.cn/cat-black/model.json" },
    { "path": "https://model.hacxy.cn/cat-white/model.json" }
  ]
}
```

> **⚠️ 已知问题**：该 CDN 在部分地区可能返回 504 超时。如果遇到此问题，请使用方案 1（npm CDN）或方案 2（本地模型）。

---

## 二、模型来源

### 免费模型下载

| 来源 | 说明 | 链接 |
|------|------|------|
| Live2D 官方示例 | Haru、Hiyori 等，Cubism 4 格式 | [live2d.com/en/download/sample-data](https://www.live2d.com/en/download/sample-data/) |
| CubismWebSamples | 官方 SDK 附带模型 | [github.com/Live2D/CubismWebSamples](https://github.com/Live2D/CubismWebSamples) |
| Booth.pm 免费专区 | 搜 `Live2D 無料`，大量二次元模型 | [booth.pm](https://booth.pm/) |
| Pixiv | 搜 `Live2D` / `ライブ2D`，创作者通常在描述放下载链接 | [pixiv.net](https://www.pixiv.net/tags/Live2D/illustrations) |
| GitHub 社区仓库 | 搜 `live2d model3.json` | [github.com/topics/live2d](https://github.com/topics/live2d) |

### Pixiv 模型获取流程

1. 去 Pixiv 搜索 `Live2D 素材` 或 `ライブ2D モデル`
2. 找到喜欢的作品，查看描述中的下载链接（通常指向 Booth.pm、Google Drive、或 GitHub）
3. 下载后解压，放入 `public/models/` 目录
4. 配置 `live2d-models.json`

---

## 三、配置详解

### 基础配置

`public/models/live2d-models.json`：

```json
{
  "models": [
    {
      "path": "/models/cat-girl/model3.json"
    }
  ],
  "tips": {
    "welcome": "欢迎来到我的二次元小世界~",
    "touch": "呜呜，别戳我嘛~"
  }
}
```

### 多模型配置（自动显示切换按钮）

```json
{
  "models": [
    {
      "path": "/models/cat-girl/model3.json"
    },
    {
      "path": "/models/bunny-girl/model3.json"
    }
  ],
  "tips": {
    "welcome": "欢迎回来~",
    "touch": "诶嘿~"
  }
}
```

### 使用 npm CDN + 多模型混合

```json
{
  "models": [
    {
      "path": "https://cdn.jsdelivr.net/npm/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json"
    },
    {
      "path": "https://cdn.jsdelivr.net/npm/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json"
    }
  ],
  "tips": {
    "welcome": "喵~ 欢迎光临！",
    "touch": "喵呜！"
  }
}
```

---

## 四、组件工作原理

Live2D 加载逻辑在 `src/components/atmosphere/Live2DIsland.astro`：

1. 页面加载时，组件先读取 `/models/live2d-models.json`
2. 如果 `models` 数组为空 → 组件不渲染（隐藏）
3. 如果有模型 → 在浏览器空闲时（`requestIdleCallback`）动态 `import('l2d-widget')` 加载
4. 受氛围开关控制：`data-atmo="off"` 时隐藏，支持 sleep/wake

**不需要修改任何代码**，只需编辑 `live2d-models.json` 即可启用/禁用/切换模型。

---

## 五、常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 504 错误 | model.hacxy.cn CDN 超时 | 改用 npm CDN 路径或本地模型 |
| 模型不显示 | `models` 数组为空 | 确认 `live2d-models.json` 里有有效路径 |
| 模型显示白块 | 贴图路径引用错误 | 检查 `model3.json` 里 `FileReferences.Textures` 的路径 |
| Cubism 2 模型不工作 | 入口文件格式不同 | Cubism 2 用 `.model.json`，Cubism 4 用 `model3.json` |
| 模型加载慢 | moc3 + 贴图文件太大 | 组件已用 `requestIdleCallback` 延迟加载，不影响首屏 |
