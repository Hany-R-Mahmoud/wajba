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
| `bun run lint` | TypeScript check (`tsc --noEmit`) |
| `bun run test` | Node test runner (`tsx --test tests/*.test.ts`) |
| `bun run build` | Production build (`vite build && tsx scripts/prerender_seo.ts`) |

## Repo Map

| Path | Purpose |
|---|---|
| `src/main.tsx` | Browser entry point |
| `src/App.tsx` | Top-level state, navigation, and feature composition |
| `src/components/` | UI views and modals |
| `src/data/recipes.ts` | Runtime recipe catalog (`INITIAL_RECIPES`) |
| `src/data/substitutions.ts` | Curated pantry substitutions (`SUBSTITUTIONS`), variant map, scope, and tags |
| `src/data/seasons.ts` | Seasonal produce dataset (`PRODUCE`, 36 items from Mawsimha, Arabic verbatim, English draft), notes, and `getMonthList` |
| `src/utils/season.ts` | Cairo month, produce alias matcher, `isInSeason`/`isPeak`, recipe seasonal score, season ranges |
| `src/components/SeasonalView.tsx` | In Season view (`/dashboard/seasons`) |
| `src/lib/api.ts` | Fetch wrapper for `/api/*`: timeout, retry, typed `ApiError`, bilingual messages. Use it for every new API call |
| `src/components/AsyncState.tsx` | `LoadingState`, `ErrorState` (with retry), `ErrorBoundary` |
| `src/auth/SessionProvider.tsx` | Single session subscription; read with `useAppSession()` |
| `src/components/PublicSeasonsPage.tsx` | Public prerendered `/seasons` page |
| `neon/` | SQL migrations (`001` groups, `002`/`003` backups). Run on a Neon branch before production |
| `docs/SEO.md`, `docs/catalog-to-neon-plan.md` | SEO state and Search Console record; plan to move catalog data to Neon |
| `src/utils/storage.ts` | Browser persistence, seed plans, URL plan sharing |
| `src/utils/aggregator.ts` | Grocery-list aggregation, pantry coverage, and substitution resolver pass |
| `src/utils/sheets.ts` | CSV download and optional Apps Script POST |
| `tests/core.test.ts` | Core domain tests, aggregator rules, and substitution data invariants |
| `tests/seasons.test.ts` | Seasonal dataset invariants, ingredient matcher guards, and recipe seasonality |
| `docs/seasons-translation-review.md` | English draft table, dataset doubts, owner gates for the seasonal feature |
| `wajba_recipe_generator.py` | Recipe JSON generation and validation utility |

## Conventions

- Preserve Arabic/English pairs when changing user-facing content.
- Keep RTL/LTR behavior driven by the `Language` state in `App.tsx`.
- Keep recipe IDs stable; plans reference recipes by ID.
- Keep runtime recipe changes in `src/data/recipes.ts`; JSON artifacts are not imported by the app.
- Pantry substitutions: annotate-only on uncovered grocery rows; resolve in `aggregator.ts` via canonical keys and dietary breaks guard. S16 `تجريبي` attaches on any presence of substitute.
- Seasonal data: Arabic names, months, and hints in `src/data/seasons.ts` are copied verbatim from Mawsimha; do not edit them (raise doubts in `docs/seasons-translation-review.md`; a change needs a new `DATASET_VERSION`/`DATASET_DATE`). English strings are draft until `ENGLISH_IS_DRAFT` is set to false by the owner. Seasonal hints are view-only: never add them to `GroceryItem`, CSV, or backup state.
- API calls: go through `apiRequest` (timeout, typed errors) and show `LoadingState`/`ErrorState`; never print server text to users.
- SEO: public pages are prerendered in `scripts/prerender_seo.ts`; private routes stay `noindex` (header in `vercel.json`).
- Match existing functional React component and TypeScript style.

## Safety Rules

- Inspect relevant source and docs before editing.
- Preserve user changes and unrelated untracked files.
- Read `docs/team-decisions/` before durable architecture, API, workflow, or convention changes.
- Update docs when durable behavior changes.
- Do not invent commands, services, environment variables, APIs, or deployment facts.
- Report `Unknown / verify` instead of guessing.

## Verification

Run `bun run lint`, `bun run test`, and `bun run build`. All tests must pass locally (54 tests: 53 pass, 1 skipped OAuth callback test).

## Unknowns

- `Unknown / verify`: deployment target and CI requirements.
- `@google/genai`, `express`, `GEMINI_API_KEY`, and `APP_URL` were unused leftovers from the AI Studio template and have been removed.

## Apex Yard documentation

Read README.md and docs/portfolio.json before changing this project.
Keep portfolio facts source-backed, update the structured document when the repository changes, and write Unknown / verify instead of guessing.
