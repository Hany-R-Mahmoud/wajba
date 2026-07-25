# AGENTS.md

## Project Summary

Wajba is a Vite + React bilingual MENA meal planner. The browser owns UI state and persists plans, preferences, favorites, votes, custom recipes, grocery state, and timers in `localStorage`.

## Read First

1. `README.md`
2. `docs/overview.md`
3. `docs/architecture.md`
4. `docs/ai-agent-guide.md`
5. `docs/team-decisions/`

## Commands

| Command | Purpose |
|---|---|
| `bun install` | Install dependencies from `bun.lock` |
| `bun run dev` | Start local Vite server on port 3000 |
| `bun run lint` | TypeScript check |
| `bun run build` | Production build |

## Repo Map

| Path | Purpose |
|---|---|
| `src/main.tsx` | Browser entry point |
| `src/App.tsx` | Top-level state, navigation, and feature composition |
| `src/components/` | UI views and modals |
| `src/data/recipes.ts` | Runtime recipe catalog (`INITIAL_RECIPES`) |
| `src/utils/storage.ts` | Browser persistence, seed plans, URL plan sharing |
| `src/utils/aggregator.ts` | Grocery-list aggregation and unit normalization |
| `src/utils/sheets.ts` | CSV download and optional Apps Script POST |
| `wajba_recipe_generator.py` | Recipe JSON generation and validation utility |

## Conventions

- Preserve Arabic/English pairs when changing user-facing content.
- Keep RTL/LTR behavior driven by the `Language` state in `App.tsx`.
- Keep recipe IDs stable; plans reference recipes by ID.
- Keep runtime recipe changes in `src/data/recipes.ts`; JSON artifacts are not imported by the app.
- Match existing functional React component and TypeScript style.

## Safety Rules

- Inspect relevant source and docs before editing.
- Preserve user changes and unrelated untracked files.
- Read `docs/team-decisions/` before durable architecture, API, workflow, or convention changes.
- Update docs when durable behavior changes.
- Do not invent commands, services, environment variables, APIs, or deployment facts.
- Report `Unknown / verify` instead of guessing.

## Verification

Run the smallest relevant check, normally `bun run lint` and `bun run build`. No automated test script exists; report that explicitly when relevant.

## Unknowns

- `Unknown / verify`: deployment target and CI requirements.
- `Unknown / verify`: whether `@google/genai`, `express`, `GEMINI_API_KEY`, and `APP_URL` belong to a future server integration; no current app source imports or uses them.
