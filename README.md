# Wajba

Wajba is a bilingual Arabic/English MENA meal-planning web app. It combines a static recipe catalog with weekly and monthly planning, Ramadan mode, grocery aggregation, cooking timers, browser persistence, family URL sharing, CSV/JSON export, and optional Google Apps Script synchronization.

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
| `bun run preview` | Preview the production build |
| `python3 wajba_recipe_generator.py --help` | Show recipe generator options |

There is no test script or CI configuration in the repository.

## Documentation

- [Overview](docs/overview.md)
- [Architecture](docs/architecture.md)
- [Tech Stack](docs/tech-stack.md)
- [Project Structure](docs/project-structure.md)
- [Local Development](docs/local-development.md)
- [Key Flows](docs/key-flows.md)
- [Onboarding](docs/onboarding.md)
- [AI Agent Guide](docs/ai-agent-guide.md)
- [Team Decisions](docs/team-decisions/README.md)

## Documentation Status

- Deployment target, CI ownership, and the intended Gemini/Express runtime are `Unknown / verify`.
- Recipe JSON files are checked-in data artifacts; the running app imports `src/data/recipes.ts` directly.
