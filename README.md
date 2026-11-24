# Wajba

Wajba is a local-first bilingual Arabic/English MENA meal-planning web app. It combines a static recipe catalog with weekly and monthly planning, Ramadan mode, dietary filters, pantry quantity matching, grocery aggregation, cooking timers, browser persistence, family URL sharing, CSV/full JSON backup export and restore, and optional Google Apps Script synchronization.

## Quick Start

The landing page uses a food-menu orbit carousel adapted from the supplied `food-menu-scroll-carousel.md` reference. Five existing Egyptian recipes (koshary, macarona béchamel, molokhia, stuffed vegetables, and fatteh) keep their public recipe links and real preparation times, servings, and ingredients. Photos swing around an overhead orbit against a changing pastel arc and the reference's locally stored kitchen backdrop. The original recipe, Ramadan, planning, grocery, final action, and footer sections remain below it.

Scrolling advances through a finite pinned stage on desktop viewports at least 1101px wide and 700px tall and phones at least 360px wide and 780px tall. Tablets and smaller/shorter screens use normal page flow with animated thumbnails and horizontal swipes, so content stays reachable. Visible previous/next arrows, the numeric counter, and the autoplay toggle are omitted at all sizes. Recipes start cycling automatically every five seconds without moving the page, wrapping after the last recipe. Cycling pauses during pointer interaction or keyboard focus, while the page is hidden or the stage is mostly offscreen, and under reduced-motion preferences. Arrow keys work when the carousel itself has focus and follow the page's RTL/LTR direction. Reduced-motion mode removes pinning and animation while preserving manual navigation. Both the hero and final action offer Google sign-in through the existing Better Auth client or immediate guest entry to `/dashboard`. Vite alone cannot complete the server-hosted OAuth flow; connection failures show a retry/guest message.

The repository tracks `bun.lock`, so Bun is the intended package manager.

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Main Commands

| Command | Purpose |
|---|---|
| `bun run dev` | Start Vite on port 3000 and all interfaces |
| `bun run lint` | Run TypeScript checking with `tsc --noEmit` |
| `bun run build` | Create the Vite production build in `dist/` |
| `bun run test` | Run core Node test-runner checks through `tsx` |
| `bun run pwa:check` | Run focused PWA platform and fallback tests |
| `bun run preview` | Preview the production build |
| `python3 wajba_recipe_generator.py --help` | Show recipe generator options |

There is no CI configuration in the repository. The test script covers core aggregation, pantry subtraction, substitutions, seasonal dataset invariants and ingredient matching, dietary filtering, backup validation, API credential rejection, and family-plan import safety. Browser-local use remains available. Optional Google sign-in through app-hosted Better Auth and explicit per-account cloud backup/restore through a Vercel API are deployed at https://wajjba.vercel.app. Wajba’s own Google OAuth client is connected and published for all Google users. Family groups support lasting membership, invitation codes and URLs, and explicit shared-week publishing and import. Apply `neon/001_family_groups.sql` before deploying group APIs; `tests/family-groups.sql` checks membership rules on an isolated database branch and rolls back its fixtures.

Google uses callback `https://wajjba.vercel.app/api/auth/callback/google`. Configure server-only `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in the ignored `.env.local` and Vercel production environment. Existing Neon user IDs, backups, and family memberships are retained; users must sign in again. Never commit these values or expose them through `VITE_` variables.

**In Season (`/dashboard/seasons`)**: a bilingual guide to Egyptian produce by month, built from the Mawsimha dataset (`src/data/seasons.ts`, version `mawsimha-v1-2026-11-02`, 36 items, 223 month entries). It opens on the Cairo month (`Africa/Cairo`), filters by type, shows a peak-season badge in words, a cook hint, recipes that use the item (opening the normal recipe view), and an "add to grocery list" button that uses the existing custom-extra mechanism. Uncovered fresh-produce grocery rows show a small "in season now" line, and the recipe list has a "Seasonal this month" filter that ranks recipes by in-season produce. Matching is by Arabic ingredient name on produce-aisle lines (`src/utils/season.ts`). It is a seasonal guide, not a price list. The English wording is a draft: see [Seasons translation review](docs/seasons-translation-review.md).

Public `/seasons` is a prerendered Arabic month-by-month produce guide (indexed). `/dashboard/*` and `/api/*` are `noindex` by header. Cloud calls use `src/lib/api.ts` (10 s timeout, one retry for reads, typed errors) with loading and error states and a root plus per-view error boundary. Apply `neon/002_wajba_backups.sql` and `neon/003_wajba_backups_user_fk.sql` on a Neon branch first; `003` is not yet applied to production.

When `VITE_SITE_URL` or `SITE_URL` is set to the real production origin, the build also generates crawlable `/recipes/<id>/` pages, `sitemap.xml`, `robots.txt`, and a curated `llms.txt`. Keep it unset for local builds until the production domain is known.

## Documentation

- [Overview](docs/overview.md)
- [Architecture](docs/architecture.md)
- [Tech Stack](docs/tech-stack.md)
- [Project Structure](docs/project-structure.md)
- [Local Development](docs/local-development.md)
- [Key Flows](docs/key-flows.md)
- [Recipe Content Review](docs/content-review.md)
- [Seasons translation and dataset review](docs/seasons-translation-review.md)
- [SEO and Search Console](docs/SEO.md)
- [Plan: catalog data to Neon](docs/catalog-to-neon-plan.md)
- [NotebookLM Recipe Expansion](docs/notebooklm-recipe-expansion.md)
- [Onboarding](docs/onboarding.md)
- [AI Agent Guide](docs/ai-agent-guide.md)
- [Team Decisions](docs/team-decisions/README.md)

## Documentation Status

- Deployment target, CI ownership, and the intended Gemini/Express runtime are `Unknown / verify`.
- Recipe JSON files are checked-in data artifacts; the running app imports `src/data/recipes.ts` directly.

## Apex Yard portfolio snapshot

- Status: showcase
- Category: Web
- Source of truth: [docs/portfolio.json](docs/portfolio.json)

This section is maintained from repository evidence and should be updated with docs/portfolio.json when the project changes.
