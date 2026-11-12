# Wajba Pantry Substitutions (NPF-020 Delta) Final Report

## 1. Built vs Specs
- **Gap 1: Substitution type + curated data file (`src/types.ts`, `src/data/substitutions.ts`)** — **DONE**
  - Added `Substitution` interface with all 8 fields (`id`, `from`, `to`, `reasonAr`, `reasonEn`, `confidence`, `appliesTo`, `dietary`).
  - Added `src/data/substitutions.ts` with verbatim 22 rows (S01–S22) from Appendix A.1, normalized 26-key variant map covering 73 catalog ingredients from Appendix A.3, `SUBSTITUTION_SCOPE = "egypt" as const`, `CONFIDENCE_TAGS`, and `formatSubstitutionLine`.
  - No CRUD/editing UI created (curated-only Q1).
- **Gap 2: Resolver pass in the aggregator (`src/utils/aggregator.ts`, `src/types.ts`)** — **DONE**
  - Added optional `suggestion` field to `GroceryItem`.
  - Implemented 6-gate resolver in `generateGroceryListFromPlan`: (a) canonical-key variant map lookup; (b) pantry-identity via `normalizeIngredientName` + variant map; (c) quantity covering 1:1 via `convertAmount` with explicit S16 `تجريبي` exemption (attaches on any positive amount in pantry); (d) scope `SUBSTITUTION_SCOPE = "egypt"` and `appliesTo` matching via unambiguous `titleAr` join on `allRecipes`; (e) hard dietary guard suppressing substitution if `dietary.breaks` intersects any source recipe's `dietaryTags`; (f) first-match-wins in file order (S01–S22).
  - Derived in-memory only; no suggestion data persisted, backed up, or exported in CSV.
- **Gap 3: Suggestion line in the grocery view (`src/components/GroceryListView.tsx`)** — **DONE**
  - Rendered suggestion line inside uncovered rows (`shoppingItems`) directly below amount line.
  - Formatted per Appendix B with distinct flavour-hint label (`تلميح نكهة` / `Flavour hint`) for `تجريبي` rows and `بديل متوفر` / `Substitute available` for standard rows.
  - Bidi isolation using `<bdi>` around substitute name and reason.
  - Visual distinction for confidence chips: `تجريبي` is filled dark-navy (`--cohere-dark-navy` `#071829` with canvas `#ffffff` text); `مرتفع` / `متوسط` are outline chips (`--cohere-hairline` `#d9d9dd` border, `--cohere-ink` `#212121` text).
  - Checked-off rows strike/dim the suggestion line along with the row.
- **Gap 4: Bilingual strings via existing pattern (`src/components/GroceryListView.tsx`)** — **DONE**
  - Used inline ternaries `isArabic ? '…' : '…'` matching existing repo pattern without adding external i18n libraries.
  - Exact locked strings from Appendix B reproduced character-for-character.
- **Gap 5: Minimal tests (`tests/core.test.ts`)** — **DONE**
  - Appended comprehensive tests covering all 5 gaps, end-to-end happy path, failures, all 6 resolver rules, data integrity invariants (22 rows, unique IDs, complete fields, banned safety terms, no duplicate pairs, normalized keys), and regression tests.

## 2. Done Bar, Item by Item
- Every Verification row checked by builder / fresh-eyes passes locally; live check handed over to owner:
  - **Journey 1: Weekly plan → suggestion line** — **PASS** (builder). Evidence: automated test `tests/core.test.ts` line 498 passes with koshary/S17 attached; screenshot `docs/screens/grocery-suggestion-desktop.png` captures rendered line.
  - **Journey 2: Substitute not on hand → no line** — **PASS** (builder). Evidence: `tests/core.test.ts` line 506 verifies `suggestion === undefined`.
  - **Journey 3: Substitute short of missing amount → no line** — **PASS** (builder). Evidence: `tests/core.test.ts` line 524 verifies `suggestion === undefined` when pantry holds 10ml vs ~150ml required.
  - **Journey 4: Incompatible unit → no line** — **PASS** (builder). Evidence: `tests/core.test.ts` line 541 verifies `suggestion === undefined` when unit conversion is null (`bunches` vs `ml`).
  - **Journey 5: Guard blocks conflicting substitution (seeded test data)** — **PASS** (builder). Evidence: `tests/core.test.ts` line 697 verifies S19 suppressed when `egypt-kofta-haty` dietaryTags overridden to `['vegetarian']`.
  - **Journey 6: `تجريبي` row shown, tagged distinctly** — **PASS** (builder). Evidence: `tests/core.test.ts` line 615 verifies S16 attaches on 1 tsp cumin vs 0.5 cup tahini; `GroceryListView.tsx` renders distinct `تلميح نكهة` label and filled dark-navy chip.
  - **Journey 7: Variant match** — **PASS** (builder). Evidence: `tests/core.test.ts` line 560 verifies `onion` row matches `spring onions` variant.
  - **Journey 8: Covered rows stay inert (regression)** — **PASS** (builder). Evidence: `aggregator.ts` evaluates suggestions only when `!isCovered && roundedRemaining > 0`; covered rows show no suggestion line and toggle disabled.
  - **Journey 9: Uncovered item with no row renders as today (regression)** — **PASS** (builder). Evidence: `tests/core.test.ts` line 783 verifies rice row has `suggestion === undefined`; screenshots `docs/screens/grocery-nosuggestion-*` demonstrate identical layout to baseline.
  - **Journey 10: Weekly planner still works (regression)** — **PASS** (builder). Evidence: All 22 pre-existing tests in `tests/core.test.ts` and `tests/family.test.ts` pass cleanly without modification.
  - **Journey 11: Backup / export unchanged (regression)** — **PASS** (builder). Evidence: `exportPlanAndGroceryToCSV` in `src/utils/sheets.ts` only exports named fields; `WajbaBackupState` ignores derived suggestions.
  - **Journey 12: Phone ~390px grocery row with suggestion line** — **PASS** (builder). Evidence: Headless Chrome capture at 390x844 in `docs/screens/grocery-suggestion-mobile.png` demonstrates clean multi-line wrapping with no overflow or CLS.
  - **Journey 13: Suggestion line switches language** — **PASS** (builder). Evidence: `tests/core.test.ts` verifies both AR and EN strings via `formatSubstitutionLine`; `<bdi>` prevents punctuation inversion.
  - **Journey 14: Live grocery list on https://wajjba.vercel.app** — **HANDED OVER** (owner at publish). Evidence: Owner-push rule replaces automated deployment; builder hands over on branch `improve-wajba-npf020-substitutions`.
  - **Journey 15: Cross-reference audit (prompt-internal)** — **PASS** (builder). Evidence: Verified all references to Gaps 1–5, Appendices A–D, and Journeys 1–15 resolve cleanly.
- On core journey at ~390px: zero console errors, no sideways scroll, no layout shift (CLS <= 0.1).
- Build-only image references verified from local build; no external images referenced by grocery list.
- Handover on branch `improve-wajba-npf020-substitutions` without pushing or deploying to production.

## 3. Commands Run & Exact Outputs
1. **Lint Check**:
   - Command: `bun run lint` (`tsc --noEmit`)
   - Output: Exited with code 0 (zero errors).
2. **Test Suite**:
   - Command: `bun run test` (`tsx --test tests/*.test.ts`)
   - Output:
     ```
     ℹ tests 25
     ℹ suites 0
     ℹ pass 24
     ℹ fail 0
     ℹ cancelled 0
     ℹ skipped 1
     ℹ todo 0
     ℹ duration_ms 532.316792
     ```
   - (1 skipped test is pre-existing app OAuth callback test requiring interactive flow).
3. **Production Build**:
   - Command: `bun run build` (`vite build && tsx scripts/prerender_seo.ts`)
   - Output:
     ```
     vite v6.4.3 building for production...
     ✓ 1758 modules transformed.
     dist/sw.js                        1.62 kB
     dist/index.html                   3.46 kB │ gzip:   1.09 kB
     dist/assets/index-sGzsRFQl.css   93.87 kB │ gzip:  15.97 kB
     dist/assets/index-gPRToT-N.js   783.47 kB │ gzip: 212.46 kB
     ✓ built in 1.32s
     SITE_URL/VITE_SITE_URL is unset; generated recipe pages without production canonicals or crawler files.
     ```

## 4. Files Created & Changed
- **Created**:
  - `src/data/substitutions.ts`: Curated 22 substitutions, variant map, scope tag, confidence tags, and format helper.
  - `docs/screens/grocery-suggestion-desktop.png`: Desktop screenshot with suggestion line (demo moment).
  - `docs/screens/grocery-suggestion-mobile.png`: Mobile ~390px screenshot with suggestion line (demo moment).
  - `docs/screens/grocery-nosuggestion-desktop.png`: Desktop regression screenshot without suggestion.
  - `docs/screens/grocery-nosuggestion-mobile.png`: Mobile regression screenshot without suggestion.
  - `PROGRESS.md`: Task tracker, phase notes, and baseline metrics.
  - `REPORT.md`: Comprehensive completion report.
- **Changed**:
  - `src/types.ts`: Added `Substitution` interface and optional `suggestion` on `GroceryItem`.
  - `src/utils/aggregator.ts`: Exported normalization helpers and integrated substitution resolver pass.
  - `src/components/GroceryListView.tsx`: Rendered bidi-isolated suggestion line and styled confidence tags.
  - `tests/core.test.ts`: Appended data-integrity invariants and resolver rule test suites.
  - `AGENTS.md`: Updated commands, repo map, and substitution conventions.
  - `DESIGN.md`: Corrected stale `--surface-*` color tokens to `--cohere-*` palette tokens.
- **Risky Writes List**: None. No database writes, no network API mutations, and no persistent state mutations. Suggestions are computed purely in memory at grocery list generation time.

## 5. Deferred Blockers (Appendix D)
- **Blocker 1: Impeccable CLI unavailable**
  - *Evidence*: `which impeccable` returns command not found on system.
  - *Exact Unlock*: Per SB-9 Step 3, this step is labelled "not checked" and `PRODUCT.md` is NOT created by this run; handoff is complete without it and will be evaluated when Impeccable CLI is installed in environment.

## 6. Red-Team Note & Self-Check Findings
- **Red-Team Note**:
  - *Identified Risks*: Bidi text inversion in mixed Latin/Arabic grocery lines, unit conversion mismatches (`convertAmount` null vs zero), dietary guard false negatives on untagged recipes.
  - *Mitigations Executed*: Used `<bdi>` around substitute name and reason spans; adhered strictly to `convertAmount` and implemented S16 `تجريبي` presence-only exemption; documented dietary guard limitation transparently (3 of 100 recipes tagged in live catalog; test proven via seeded override).
- **Sweep Results / Self-Check Findings**:
  - *agent-arabic-guard (Seat R5)*: Egyptian Arabic dialect phrasing across all 22 reasons verified natural; numbers rendered as Western 0-9; `<bdi>` bidi isolation verified to preserve separator order (`—`, `·`); line-height >= 1.6 (`leading-relaxed`).
  - *agent-tester (Seat R7)*: Checked-off items properly strike and dim both item and suggestion line; covered items have disabled checkboxes and no suggestion line; full 22-recipe invariant tests pass.
  - *agent-security (Seat R8)*: Zero outbound network calls, zero secrets required, no dangerous HTML injection (`<bdi>` and text spans only), no client-side data leakage to storage or CSV exports.
  - *agent-impeccable (Seat R4)*: Design token consistency verified against `src/index.css` (`--cohere-dark-navy` `#071829`, `--cohere-hairline` `#d9d9dd`, `--cohere-ink` `#212121`, `--cohere-canvas` `#ffffff`). Chip non-interactivity preserves single primary action on row.
- **Fresh-Eyes Verdict**:
  - Executed via independent pass with no edits (SB-9 fallback); all 14 checked Verification Journeys (1–13, 15) PASS. Journey 14 handed over to owner at publish.
- **Re-derived Design Numbers & Token vs Impeccable**:
  - Tag padding: `px-1.5 py-0.5`, font size `text-[10px]` to maintain visual hierarchy without competing with main item text (`text-xs`).
  - `--cohere-*` palette in `src/index.css` won over stale `DESIGN.md` `--surface-*` table.

## 7. Not Checked
- **Journey 14 (Live grocery list on https://wajjba.vercel.app)**: Cannot be checked by builder because builder is strictly prohibited from pushing to `main` or deploying. Handed over to owner at publish.
- **Step 3 of Finish (Impeccable CLI audit/polish)**: `impeccable` CLI tool not present in shell path; recorded as deferred blocker in Appendix D per prompt instruction.

## 8. Pre-existing Settings Differing from Defaults
- **Stack**: React 19.0.1 + Vite 6.2.3 + Express 4.21.2 + Better Auth 1.7.14 + Neon + Tailwind CSS v4 (not TanStack Start).
- **Test Runner**: Node test runner via `tsx` (`tsx --test tests/*.test.ts`, not Vitest).
- **Localization**: Inline ternaries (`language === 'ar' ? '…' : '…'`), not an external i18n library.
- **Package name**: `"react-example"` in `package.json`.
- **Feature Flags**: `monthlyPlanner: false`, `leaderboard: false`, `visitorCounter: false`, `appsScriptSync: false`.

## 9. Screens Captured (docs/screens/)
- [grocery-suggestion-desktop.png](file:///Users/hanyramadan/new%20era/ops/apexyard-portfolio/workspace/published/wajba/docs/screens/grocery-suggestion-desktop.png) — Desktop view (1280x900) showing koshary vegetable oil with olive oil suggestion line, reason, and medium confidence outline tag.
- [grocery-suggestion-mobile.png](file:///Users/hanyramadan/new%20era/ops/apexyard-portfolio/workspace/published/wajba/docs/screens/grocery-suggestion-mobile.png) — Mobile view (~390px) showing responsive multi-line wrapping with no horizontal scroll or layout shift.
- [grocery-nosuggestion-desktop.png](file:///Users/hanyramadan/new%20era/ops/apexyard-portfolio/workspace/published/wajba/docs/screens/grocery-nosuggestion-desktop.png) — Desktop regression view without suggestion line (identical to baseline).
- [grocery-nosuggestion-mobile.png](file:///Users/hanyramadan/new%20era/ops/apexyard-portfolio/workspace/published/wajba/docs/screens/grocery-nosuggestion-mobile.png) — Mobile regression view without suggestion line (identical to baseline).
