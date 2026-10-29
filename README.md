# Wajba

Wajba is a local-first bilingual Arabic/English MENA meal-planning web app. It combines a static recipe catalog with weekly and monthly planning, Ramadan mode, dietary filters, pantry quantity matching, grocery aggregation, cooking timers, browser persistence, family URL sharing, CSV/full JSON backup export and restore, and optional Google Apps Script synchronization.

## Quick Start

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

There is no CI configuration in the repository. The test script covers core aggregation, pantry subtraction, dietary filtering, backup validation, API credential rejection, and family-plan import safety. Browser-local use remains available. Optional Google sign-in through app-hosted Better Auth and explicit per-account cloud backup/restore through a Vercel API are deployed at https://wajjba.vercel.app. Wajba’s own Google OAuth client is connected and published for all Google users. Family groups support lasting membership, invitation codes and URLs, and explicit shared-week publishing and import. Apply `neon/001_family_groups.sql` before deploying group APIs; `tests/family-groups.sql` checks membership rules on an isolated database branch and rolls back its fixtures.

Google uses callback `https://wajjba.vercel.app/api/auth/callback/google`. Configure server-only `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` in the ignored `.env.local` and Vercel production environment. Existing Neon user IDs, backups, and family memberships are retained; users must sign in again. Never commit these values or expose them through `VITE_` variables.

When `VITE_SITE_URL` or `SITE_URL` is set to the real production origin, the build also generates crawlable `/recipes/<id>/` pages, `sitemap.xml`, `robots.txt`, and a curated `llms.txt`. Keep it unset for local builds until the production domain is known.

## Documentation

- [Overview](docs/overview.md)
- [Architecture](docs/architecture.md)
- [Tech Stack](docs/tech-stack.md)
- [Project Structure](docs/project-structure.md)
- [Local Development](docs/local-development.md)
- [Key Flows](docs/key-flows.md)
- [Recipe Content Review](docs/content-review.md)
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
