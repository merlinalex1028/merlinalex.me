# Live2D Models

Place Live2D model files in this directory. Each model needs its own subdirectory.

## Required Structure

```
public/models/
├── fallback.svg        # Static fallback (already provided)
├── cat-black/
│   ├── model.json      # Cubism 2 model descriptor
│   └── textures/       # Model textures (WebP/AVIF preferred)
└── cat-white/
    ├── model.json
    └── textures/
```

## Model Sources

- Free models: https://www.live2d.com/en/learn/sample/
- Pixiv二次创作: Search "Live2D 素材" on Pixiv
- **License check required**: Verify the model license allows public website use

## Size Limit

Cloudflare Pages free tier: 25 MiB per asset. Compress textures to WebP/AVIF.

## Adding Models to Live2DIsland

Edit `src/components/atmosphere/Live2DIsland.astro` and update the `model` array in `createWidget()`:

```js
model: [
  { path: '/models/your-model/model.json' },
]
```
