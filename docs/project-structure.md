# Project Structure

```txt
wajba/
  src/
    main.tsx                 React entry point
    App.tsx                  Shared state and feature composition
    components/              Feature views, modals, and UI components
    data/recipes.ts          Runtime recipe catalog
    utils/storage.ts         Browser persistence and plan sharing
    utils/aggregator.ts      Grocery aggregation
    utils/sheets.ts          CSV and optional Apps Script sync
    types.ts                 Shared domain types
  public/                    Static assets and recipe JSON copy
  recipes_data.json          Recipe database artifact/input
  wajba_recipe_generator.py  Recipe generation and validation utility
  index.html                 HTML shell, metadata, fonts, favicon
  package.json               Scripts and dependencies
  bun.lock                   Locked dependency graph
  vite.config.ts             Vite and Tailwind configuration
  .env.example               Documented environment placeholders
```

## Important Paths

| Path | Purpose |
|---|---|
| `src/components/RecipeExplorer.tsx` | Search and recipe filters |
| `src/components/WeeklyPlannerView.tsx` | Seven-day planner |
| `src/components/MonthlyCalendarView.tsx` | Month calendar planner |
| `src/components/GroceryListView.tsx` | Aggregated grocery list |
| `src/components/FamilySyncModal.tsx` | URL share, export, optional sync |
| `src/components/RecipeDetailModal.tsx` | Details, timers, planner/grocery actions |
| `src/index.css` | Global styles and theme rules |
| `metadata.json` | AI Studio/project metadata |

## Entry Points

- `src/main.tsx`: browser application entry.
- `wajba_recipe_generator.py`: standalone recipe-data utility entry.

## Ignore As Source

- `node_modules/`: installed dependencies.
- `dist/`: Vite build output.
- `recipes_enriched.json` and `recipes_audit.json`: generator outputs when present; inspect their status before editing or committing.
