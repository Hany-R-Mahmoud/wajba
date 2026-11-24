# Plan: move recipes, substitutions, and seasonal produce to Neon

Status: **plan only, not started.** Decision (2026-11-24): keep the bundled data as a local fallback, foundation first.

## Already done (foundation)

- `src/lib/api.ts`: timeout, one retry for reads and idempotent writes, typed errors, bilingual messages.
- `src/components/AsyncState.tsx`: `LoadingState`, `ErrorState` with retry, `ErrorBoundary` (root and per view).
- `src/auth/SessionProvider.tsx`: one session subscription, token shared with `/api/*` calls.
- `neon/002_wajba_backups.sql` documents the existing table. `neon/003_wajba_backups_user_fk.sql` fixes `user_id` (text without a key) to uuid with a foreign key and `ON DELETE CASCADE`. Validated on Neon branch `validate-backups-fk-20261124` (orphans removed, real row kept). **Not applied to production.**

## Target

| Table | Content |
|---|---|
| `wajba_recipes` | `id text PK`, `data jsonb` (full recipe), indexed `region`, `is_ramadan`, `updated_at` |
| `wajba_substitutions` | rows from `src/data/substitutions.ts` |
| `wajba_produce` | rows from `src/data/seasons.ts` (`season_months int[]`, `peak_months int[]`) |
| `wajba_dataset_versions` | `name`, `version`, `date`, `source_note` |

All read-only to the public: `REVOKE ALL FROM PUBLIC`, read through one server endpoint.

## Steps

1. SQL `004_catalog.sql` and a seed script reading the current `src/data/*.ts`. Run on a Neon branch first.
2. `api/catalog.ts`: `GET /api/catalog?set=recipes|produce|substitutions`, `Cache-Control: public, s-maxage=3600, stale-while-revalidate`, ETag from the dataset version. No auth, no user data.
3. Client loader with `apiRequest`, an in-memory plus `localStorage` cache keyed by dataset version, and the bundled files as the fallback when the request fails or times out. Show `LoadingState` only when there is no cache and no fallback ready; show a quiet "offline copy" note on fallback.
4. Replace direct imports: `aggregator.ts` (`INITIAL_RECIPES`), `season.ts` (`PRODUCE`), `App.tsx` (`handleVote` mutates `INITIAL_RECIPES` in memory, so move votes to state), `prerender_seo.ts`.
5. `prerender_seo.ts` keeps reading the bundled files (or a snapshot written at build) so SEO pages never depend on a live query.
6. Tests: handler tests for `api/catalog` like `groups-api.test.ts`, a parity test that the seeded rows equal `src/data/*.ts`, and a fallback test.

## Open decisions

- Who edits the data later (SQL, admin screen, or still the repo).
- Whether the PWA service worker should cache `/api/catalog` responses.
