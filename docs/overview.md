# Overview

## Purpose

Wajba helps households discover Arabic and MENA recipes, assign meals to weekly or monthly plans, track pantry stock, generate a grocery list with pantry quantities subtracted, and run cooking timers. The interface supports Arabic and English plus RTL/LTR layout switching.

The bundled catalog contains 65 source-reviewed recipes across Egypt, the Levant, the Gulf, the Maghreb, and shared regional dishes. See [Recipe Content Review](content-review.md) for provenance and remaining image-review limits.

## Main Use Cases

- Search recipes by title, description, ingredients, tags, region, difficulty, Ramadan status, or favorites.
- Filter recipes by curated informational dietary tags.
- Add recipes to weekly or monthly plans and change servings.
- Toggle Ramadan mode to use suhoor, iftar, and dessert slots.
- Track pantry quantities and show needed, partially covered, and fully covered grocery items.
- Aggregate ingredients into grocery aisles, check items, and add custom extras.
- Save custom recipes, favorites, votes, and active timers locally in the browser.
- Edit/delete custom recipes with focused validation and one-step undo.
- Share a weekly plan through an encoded URL, export/restore a full JSON backup, export CSV, or optionally POST to a user-provided Google Apps Script URL.
- Use Settings to change language/theme and Standard/Ramadan planning mode, export or restore data, and clear local state.

## Runtime Components

- `src/main.tsx` mounts the React application.
- `src/App.tsx` owns top-level state and selects the `/` landing page or dashboard routes under `/dashboard`; `/dashboard` opens the schedule and recipes live at `/dashboard/recipes`.
- `src/components/` contains recipe, planner, grocery, leaderboard, timer, and family-sync views.
- `src/utils/` contains persistence, grocery aggregation, CSV, and sync behavior.

## Boundaries And Integrations

- Recipe content is bundled into the frontend from `src/data/recipes.ts`.
- User data is browser-local unless the user explicitly exports or syncs it.
- No database, backend, authentication, roles, or server-side synchronization is implemented by agreement.
- Google Apps Script is an optional user-owned external boundary.
- `Unknown / verify`: deployment host, server-side Gemini behavior, and any Express server are not defined by current source files.
