# Overview

## Purpose

Wajba helps households discover Arabic and MENA recipes, assign meals to weekly or monthly plans, generate a combined grocery list, and run cooking timers. The interface supports Arabic and English plus RTL/LTR layout switching.

## Main Use Cases

- Search recipes by title, description, ingredients, tags, region, difficulty, Ramadan status, or favorites.
- Add recipes to weekly or monthly plans and change servings.
- Toggle Ramadan mode to use suhoor, iftar, and dessert slots.
- Aggregate ingredients into grocery aisles, check items, and add custom extras.
- Save custom recipes, favorites, votes, and active timers locally in the browser.
- Share a weekly plan through an encoded URL, export CSV/JSON, or optionally POST to a user-provided Google Apps Script URL.

## Runtime Components

- `src/main.tsx` mounts the React application.
- `src/App.tsx` owns top-level state and selects the landing page or dashboard.
- `src/components/` contains recipe, planner, grocery, leaderboard, timer, and family-sync views.
- `src/utils/` contains persistence, grocery aggregation, CSV, and sync behavior.

## Boundaries And Integrations

- Recipe content is bundled into the frontend from `src/data/recipes.ts`.
- User data is browser-local unless the user explicitly exports or syncs it.
- Google Apps Script is an optional user-owned external boundary.
- `Unknown / verify`: deployment host, server-side Gemini behavior, and any Express server are not defined by current source files.
