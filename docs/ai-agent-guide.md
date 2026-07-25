# AI Agent Guide

## Read First

- `README.md`
- `docs/overview.md`
- `docs/architecture.md`
- `docs/project-structure.md`
- `docs/team-decisions/README.md`
- `AGENTS.md`

## Safe Edit Boundaries

- Prefer the smallest file-local change.
- Preserve user-owned untracked files, especially recipe JSON and generator outputs.
- Keep Arabic and English content aligned.
- Keep recipe IDs stable and preserve the `Recipe`, `WeeklyPlan`, `MonthlyPlan`, and `GroceryItem` shapes.
- Update docs when durable behavior, data contracts, workflows, or conventions change.

## Risky Areas

- `src/utils/storage.ts`: changing keys or serialized shapes can strand existing browser data.
- `src/data/recipes.ts`: plans reference recipe IDs and grocery output depends on ingredient names/units.
- `src/utils/aggregator.ts`: changes affect quantities, unit normalization, and checked-item identity.
- `src/utils/sheets.ts`: external POST behavior is user-configured and response visibility is limited by `no-cors`.
- Recipe generator outputs may contain image placeholders or audit warnings that need human review.

## Verification Commands

```bash
bun run lint
bun run build
python3 /Users/hanyramadan/.codex/skills/agent-repo-manager/scripts/docs_audit.py --repo .
```

## Rules

- Inspect relevant source, manifests, scripts, and docs before changing code or docs.
- Do not invent commands, env vars, services, APIs, or architecture.
- Read `docs/team-decisions/` before durable architecture/API/workflow changes.
- Report uncertainty as `Unknown / verify`.
- No test script exists; do not claim tests passed when only type-check/build ran.
