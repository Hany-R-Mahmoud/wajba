# Overview

## Purpose

Wajba helps households discover Arabic and MENA recipes, assign meals to weekly or monthly plans, track pantry stock, generate a grocery list with pantry quantities subtracted, and run cooking timers. The interface supports Arabic and English plus RTL/LTR layout switching.

The bundled catalog contains 100 recipes: 65 source-reviewed recipes across Egypt, the Levant, the Gulf, the Maghreb, and shared regional dishes, plus 35 documented everyday Egyptian home dishes. See [Recipe Content Review](content-review.md) for provenance and remaining image-review limits.

## Main Use Cases

- Search recipes by title, description, ingredients, tags, region, difficulty, Ramadan status, or favorites.
- Filter recipes by curated informational dietary tags.
- Add recipes to weekly or monthly plans and change servings.
- Start with empty weekly and monthly schedules, choose which meal slots are visible, and clear assignments by the current week or displayed month.
- Toggle Ramadan mode to use suhoor, iftar, and dessert slots.
- Track pantry quantities and show needed, partially covered, and fully covered grocery items.
- Aggregate ingredients into grocery aisles, check items, and add custom extras.
- Save custom recipes, favorites, votes, and active timers locally in the browser.
- Edit/delete custom recipes with focused validation and one-step undo.
- Share a weekly plan through an encoded URL, export/restore a full JSON backup, export CSV, or optionally POST to a user-provided Google Apps Script URL.
- Create lasting family groups, invite by code or URL, and explicitly publish or apply a shared week with its custom recipes. Membership continues until leaving or owner removal; invitation expiry does not disconnect existing members.
- Use Settings to change language/theme and Standard/Ramadan planning mode, export or restore data, and clear local state.

## Runtime Components

- `src/main.tsx` mounts the React application.
- `src/App.tsx` owns top-level state and selects the `/` landing page or dashboard routes under `/dashboard`; `/dashboard` opens the schedule and recipes live at `/dashboard/recipes`.
- `src/components/` contains recipe, planner, grocery, leaderboard, timer, and family-sync views.
- `src/utils/` contains persistence, grocery aggregation, CSV, and sync behavior.

## Boundaries And Integrations

- Recipe content is bundled into the frontend from `src/data/recipes.ts`.
- User data is browser-local unless the user explicitly exports or syncs it.
- Optional Google sign-in and explicit cloud backup/restore now use app-hosted Better Auth at `/api/auth` and a Vercel API backed by the existing Neon Postgres accounts. Automatic synchronization is not implemented. Own Google OAuth client is published for all Google users; production runs at https://wajjba.vercel.app on Vercel.
- Google Apps Script is an optional user-owned external boundary.
- `Unknown / verify`: server-side Gemini behavior and any Express server are not defined by current source files.
