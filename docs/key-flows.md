# Key Flows

## Flow: App Startup And Persistence

1. `src/main.tsx` mounts `App`.
2. `App` loads browser-stored language, theme, plans, favorites, votes, custom recipes, grocery state, and timers.
3. Missing weekly/monthly plans receive seeded examples.
4. State changes write back to `localStorage`.

## Flow: Plan To Grocery List

1. User assigns recipe IDs and servings in weekly or monthly planner views.
2. `App` selects the active plan and calls `generateGroceryListFromPlan`.
3. `src/utils/aggregator.ts` resolves recipe IDs, scales ingredients, merges matching names, normalizes units, subtracts compatible pantry quantities, and appends custom extras.
4. `GroceryListView` shows needed, partially covered, and fully covered items; checking an item does not consume pantry stock.

## Flow: Family Sharing And Export

1. The family-sync modal encodes a weekly plan into a `plan` URL query parameter.
2. A recipient opening that URL decodes and stores the plan, then the app removes the query parameter from browser history.
3. The same modal can download CSV or a full JSON backup; Settings can restore a validated backup after confirmation.
4. Optional Google Apps Script sync sends the weekly plan and grocery list in a POST payload.

Google Apps Script uses `no-cors`; the UI reports that the request was sent but cannot verify remote completion.

## Flow: Local Data Recovery

1. Settings exports preferences, plans, custom recipes, grocery state, votes, favorites, and pantry items.
2. Import validates the versioned backup shape before changing local storage.
3. A confirmed import replaces supported durable state and reloads the app.
4. Clear local data removes user state and allows the seeded experience to initialize again.

## Flow: Recipe Catalog Maintenance

1. Runtime recipes are imported from `src/data/recipes.ts`.
2. `recipes_data.json` can be used as generator input.
3. `wajba_recipe_generator.py` validates the schema and writes enriched data/audit reports.
4. Any generated data intended for the app must be deliberately reconciled into the runtime TypeScript catalog.

## Background Work

- No worker, queue, scheduled job, or server route is present.
- The recipe generator may perform optional Wikimedia requests unless `--offline` is supplied.

## External Boundaries

- Browser `localStorage`, URL query parameters, downloads, and clipboard.
- User-provided Google Apps Script Web App URL.
- Remote image and font URLs.

## Unknowns

- `Unknown / verify`: deployment and CI workflow.
