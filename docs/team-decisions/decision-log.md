# Decision Log

No durable decisions recorded yet.

| 2026-07-25 | Accepted | Architecture | Keep Wajba local-first with browser storage; no database, backend, authentication, roles, or server runtime for the current scope. | Wajba team | `docs/architecture.md` |

For small decisions, add rows using:

| Date | Status | Area | Decision | Owner | Link |
|---|---|---|---|---|---|
| YYYY-MM-DD | Proposed | Area | Short decision | Owner | `decision-template.md` or related link |

| 2026-10-13 | Accepted | Product scope | Ship an MVP of weekly planner + auto grocery list + recipe discovery (+ Ramadan mode); hide leaderboard, visitor counter, monthly planner, and Apps Script sync behind flags in `src/config/features.ts` — code stays, flip a flag to re-enable. Supabase/user accounts deferred. | hany | `src/config/features.ts` |
| 2026-10-13 | Accepted | Content | Catalog grows 65 → 100: regenerate all recipe images in one locked Style B (45°, dark slate, dramatic side light, ≤150KB WebP) per `~/workspace/wajba-images/GENERATION_SCHEMA.md`; add 35 documented everyday Egyptian home dishes. Existing 65 recipe texts unchanged (already source-reviewed). | hany | `recipes_data.json`, `public/recipe-images/` |
