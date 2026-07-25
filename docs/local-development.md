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

There is no repository test command.

## Environment

`.env.example` lists `GEMINI_API_KEY` and `APP_URL` for the AI Studio/Cloud Run setup. Current frontend source does not reference either variable; actual deployment requirements are `Unknown / verify`.

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
