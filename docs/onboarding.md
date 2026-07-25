# Onboarding

## First-Day Reading Path

1. `README.md`
2. `docs/overview.md`
3. `docs/project-structure.md`
4. `docs/local-development.md`
5. `docs/key-flows.md`
6. `docs/team-decisions/README.md`

## First Local Run

```bash
bun install
bun run dev
```

Open `http://localhost:3000`, enter the dashboard, switch language/theme, inspect recipes, and verify planner-to-grocery behavior.

## Safe First Change

Update a translated label in the component that owns it, preserving the Arabic/English pair, then run `bun run lint` and `bun run build`.

## Common Pitfalls

- Recipe IDs are persisted inside plans; do not rename IDs casually.
- `src/data/recipes.ts` is the runtime catalog. The JSON files are not dynamically imported.
- Browser storage is local to the current origin and is not a shared account database.
- Google Apps Script sync is optional, user-configured, and uses `no-cors`.
- No automated test suite is configured.

## Team Decisions

Durable agreements live in `docs/team-decisions/`. Record architecture, API, workflow, convention, and migration decisions there.
