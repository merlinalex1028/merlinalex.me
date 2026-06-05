# Live2D Models

No default mascot is shown. Live2D only loads after you add model files and edit
`public/models/live2d-models.json`.

## Directory Structure

```text
public/models/
├── live2d-models.json
├── live2d-models.example.json
└── your-model/
    ├── model.json
    └── textures/
```

## Configuration

Edit `live2d-models.json`:

```json
{
  "models": [
    { "path": "/models/your-model/model.json" }
  ],
  "tips": {
    "welcome": "欢迎回来~",
    "touch": "别戳我啦~"
  }
}
```

Multiple models are supported:

```json
{
  "models": [
    { "path": "/models/cat-black/model.json" },
    { "path": "/models/cat-white/model.json" }
  ]
}
```

## Model Sources

- Live2D sample models: https://www.live2d.com/en/learn/sample/
- Other public model packs are OK only when the license allows public website use.

## Size Notes

Cloudflare Pages free tier has a 25 MiB per-file limit. Keep textures compressed
and avoid committing very large model assets.
