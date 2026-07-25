# Local Development

## Requirements

- Bun, because `bun.lock` is tracked.
- A modern browser.
- Python 3 only for the optional recipe generator.

Exact supported versions: `Unknown / verify`.

## Setup

```bash
bun install
```

## Run

```bash
bun run dev
```

Vite listens on port `3000` and binds to `0.0.0.0`.

## Verify

```bash
bun run lint
bun run build
```

The build prerenders public recipe pages into `dist/recipes/<id>/`. Set the real production origin when generating production crawler files:

```bash
VITE_SITE_URL=https://your-real-domain.example bun run build
```

Without `VITE_SITE_URL` or `SITE_URL`, the build omits production canonicals, `sitemap.xml`, `robots.txt`, and `llms.txt`.

Deploy `dist/recipes/<id>/index.html` as real public paths and serve `dist/404.html` for missing paths. Do not rewrite every `/recipes/*` request to the home shell before checking for the generated file.

## Environment

`.env.example` lists `GEMINI_API_KEY` and `APP_URL` for the AI Studio/Cloud Run setup. Current frontend source does not reference either variable; actual deployment requirements are `Unknown / verify`.

`VITE_SITE_URL` is used only for production SEO output: canonical URLs, Open Graph URLs, sitemap, robots, and `llms.txt`.

The Vite config also recognizes `DISABLE_HMR=true` to disable HMR and file watching during local edits.

## Recipe Data Utility

```bash
python3 wajba_recipe_generator.py --help
python3 wajba_recipe_generator.py --offline --output recipes_enriched.json --audit-output recipes_audit.json
```

The second command writes files in the repository root. Review generated image placeholders and audit warnings before using output in production. Do not run it over user-owned data without checking the input/output paths first.

## Troubleshooting

- If Bun is unavailable, install Bun or confirm an npm fallback with the project owner; npm compatibility is not formally documented by the repository.
- If recipe edits do not appear, update `src/data/recipes.ts`; the frontend does not load `recipes_data.json` at runtime.
- If plans appear empty or reset, check browser origin storage and whether local storage was cleared.
