# Architecture

## Summary

Wajba is a client-rendered React application built and served by Vite. `App.tsx` composes the feature views, keeps shared state, and delegates persistence and derived grocery calculations to utility modules.

## Main Modules

| Module | Responsibility |
|---|---|
| `src/main.tsx` | Mount React under `#root` |
| `src/App.tsx` | URL-based landing/dashboard routing, shared state, navigation, and handlers |
| `src/components/` | User-facing views and modals |
| `src/pwa/` | Platform detection, install state, help/fallback flows, and service-worker source |
| `src/components/Pwa*.tsx` | In-flow install promotion, persistent recovery action, and installation help dialog |
| `src/data/recipes.ts` | Bundled runtime recipe catalog |
| `src/utils/storage.ts` | `localStorage`, seed data, shared-plan URL decoding/encoding, pantry and backup state |
| `src/utils/aggregator.ts` | Convert planned recipes into normalized grocery items and subtract compatible pantry quantities |
| `src/utils/sheets.ts` | CSV generation/download and optional remote POST |

## Data / Control Flow

1. `src/main.tsx` mounts `App`.
2. `/` renders the public landing page; `/dashboard` and its tab routes render the dashboard shell.
3. Dashboard navigation stays in the header on larger screens and uses a fixed mobile bottom bar with a secondary-destination menu on smaller screens.
4. `App` loads language, theme, plans, favorites, votes, custom recipes, grocery state, and timers from browser storage.
5. `App` combines custom recipes with `INITIAL_RECIPES` from `src/data/recipes.ts`.
6. Planner views update weekly/monthly plans; the aggregator derives grocery items from assigned recipe IDs and servings.
7. UI actions save updated state back to `localStorage`.
8. Family sync actions encode a weekly plan into a URL, download files, or send a JSON payload to a user-provided Apps Script URL.

## PWA Installation

`PwaProvider` registers the production service worker, captures Chromium's install prompt when available, detects standalone launches, and persists dismissal/recovery state. The UI keeps a transient in-flow promotion separate from a persistent install/recovery action in the landing header and dashboard navigation. Android WebViews receive an external-browser intent plus a copyable URL fallback; iOS WebViews receive Safari/Add to Home Screen guidance because the host controls whether an external browser can be opened.

The worker precaches the application shell and static PWA assets, uses network-first navigation fallback, and deliberately excludes recipe data, API/auth routes, downloads, and other user/data endpoints from caching.

## Diagram

```mermaid
flowchart TD
  Entry["src/main.tsx"] --> App["src/App.tsx"]
  Catalog["src/data/recipes.ts"] --> App
  App --> Views["components: recipes, planner, grocery, timer"]
  App --> Storage["utils/storage.ts"]
  App --> Grocery["utils/aggregator.ts"]
  Views --> Sheets["utils/sheets.ts"]
  Storage --> Browser["Browser localStorage / URL"]
  Sheets --> AppsScript["Optional user Apps Script URL"]
```

## External Services

- Google Apps Script Web App URL, optional and user-supplied.
- Unsplash/image URLs referenced by recipe data.
- Google Fonts loaded by `index.html`.
- `Unknown / verify`: current deployment platform and whether Gemini is used in a separate runtime.

## Risks / Coupling

- Plans store recipe IDs; changing IDs can orphan saved plans.
- Browser storage is origin-scoped and has no server backup unless the user exports/syncs data.
- Pantry stock is explicitly maintained by the user; checking a grocery item never consumes pantry stock.
- Backup restore validates before replacement and excludes transient active timers.
- Google Sheets sync uses `fetch` with `no-cors`, so the client cannot inspect the remote response.
- `recipes_data.json`, `public/recipes_data.json`, generated JSON, and `src/data/recipes.ts` can drift; the runtime currently reads only the TypeScript catalog.
