# Tech Stack

| Area | Tooling |
|---|---|
| Language | TypeScript, JSX, Python utility |
| Runtime | Browser; Python 3 for the recipe utility |
| Framework | React 19 |
| Package manager | Bun (`bun.lock` is tracked) |
| Build | Vite 6 with React and Tailwind CSS Vite plugins |
| Type check | TypeScript `tsc --noEmit` via `bun run lint` |
| Test | Node built-in test runner through the existing `tsx` dev dependency |
| Lint / Format | No dedicated linter or formatter script found |

## Important Libraries

- `@tailwindcss/vite`, `tailwindcss`: utility-first styling.
- `framer-motion`, `motion`: UI motion and animation.
- `lucide-react`: icons.
- `canvas-confetti`: celebration effects.
- `clsx`, `tailwind-merge`: class-name composition.
- `@google/genai`, `express`: installed dependencies with no current app-source imports; intended use is `Unknown / verify`.

## Recipe Utility

`wajba_recipe_generator.py` uses Python standard-library modules. It validates recipe schema, can discover an existing `recipes_data.json`, optionally looks up Wikimedia images, and writes `recipes_enriched.json` plus `recipes_audit.json` by default.

## Unknowns

- Exact supported Bun and Python versions are `Unknown / verify`.
- Production hosting, CI, and server-side runtime are `Unknown / verify`.
- Current scope is local-first: no database, backend, authentication, roles, or server runtime is used.
