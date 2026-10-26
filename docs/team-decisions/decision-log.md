# Decision Log

| 2026-10-26 | Accepted | Accounts | User requested Neon and Google sign-in, superseding account deferral. Preserve browser-local use and add explicit per-account cloud backup/restore. Own Google OAuth client connected, published for all users with owner approval, and deployed to Vercel. | hany | `docs/architecture.md` |
| 2026-10-26 | Accepted | Family groups | User requested lasting family membership like Yalla Nakol, with invitation codes and URLs. Invitation expiry/rotation preserves membership. Publishing and applying shared plans remain explicit to protect device data; use revision checks for conflicting publishes. | hany | `api/groups.ts`, `src/components/FamilyGroups.tsx` |

No durable decisions recorded yet.

| 2026-07-25 | Accepted | Architecture | Keep Wajba local-first with browser storage; no database, backend, authentication, roles, or server runtime for the current scope. | Wajba team | `docs/architecture.md` |

For small decisions, add rows using:

| Date | Status | Area | Decision | Owner | Link |
|---|---|---|---|---|---|
| YYYY-MM-DD | Proposed | Area | Short decision | Owner | `decision-template.md` or related link |

| 2026-10-13 | Accepted | Product scope | Ship an MVP of weekly planner + auto grocery list + recipe discovery (+ Ramadan mode); hide leaderboard, visitor counter, monthly planner, and Apps Script sync behind flags in `src/config/features.ts` — code stays, flip a flag to re-enable. Supabase/user accounts deferred. | hany | `src/config/features.ts` |
| 2026-10-13 | Accepted | Content | Catalog grows 65 → 100: regenerate all recipe images in one locked Style B (45°, dark slate, dramatic side light, ≤150KB WebP) per `~/workspace/wajba-images/GENERATION_SCHEMA.md`; add 35 documented everyday Egyptian home dishes. Existing 65 recipe texts unchanged (already source-reviewed). | hany | `recipes_data.json`, `public/recipe-images/` |
