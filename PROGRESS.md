# Wajba NPF-020 Substitution Plan & Progress

## Baseline (Captured before any changes)
- Branch created: `improve-wajba-npf020-substitutions` from `main` @ `4d7ab3771fc6dd45a8d58b70ce675c7732efbee0`
- Tests: `bun run test` (tsx --test tests/*.test.ts)
  - 23 tests: 22 pass, 0 fail, 1 skipped (OAuth test requiring callback)
  - Duration: ~928ms
- Lint: `bun run lint` (tsc --noEmit)
  - Exited with code 0 (clean)
- Build: `bun run build` (vite build && tsx scripts/prerender_seo.ts)
  - Built successfully in 1.29s
- CSV Export Baseline:
  - Headers AR: `['القسم', 'اسم الصنف', 'الكمية', 'الوحدة', 'الوصفات التابعة']`
  - Headers EN: `['Aisle Category', 'Item Name', 'Quantity', 'Unit', 'Recipe Sources']`
  - Rows: `[item.aisle, name, item.amount, unit, item.recipeSources.join(' | ')]`
- Grocery List Row Layout Baseline:
  - Row outer container: `flex items-center justify-between p-2.5 rounded-xl`
  - Left column: Checkbox button, Item title (`text-xs font-bold`), Recipe sources (`text-[10px] text-stone-400`), Pantry coverage note (`text-[10px] font-bold text-emerald-600` or `text-amber-700`)
  - Right column: Amount + unit (`text-xs font-bold font-mono text-amber-900 dark:text-amber-300`), Delete button if custom extra

## Red-Team Plan Review
- **Failure Mode 1: Text scrambling in RTL/LTR mixed text.**
  - Risk: Arabic reason text mixed with Latin recipe/ingredient names or separators (`—`, `·`) could render backwards or misplace the tag.
  - Mitigation: Wrap each substitute name and reason in its own `<bdi>` tag. Verify rendering order across AR/EN.
- **Failure Mode 2: Overly aggressive or leaking quantity matching.**
  - Risk: 1:1 conversion using `convertAmount` could fail or give wrong results if unit dimensions don't match.
  - Mitigation: Adhere strictly to aggregator's `convertAmount` and `normalizeIngredientName`. Respect the S16 `تجريبي` exemption where any positive amount of cumin attaches the hint without `convertAmount`.
- **Failure Mode 3: Dietary guard regression.**
  - Risk: Missing or ambiguous title resolution causing false positives or negatives.
  - Mitigation: Resolves `titleAr` against `allRecipes`. If ambiguous or missing, matches nothing. Tests with test-seeded `allRecipes` overriding `egypt-kofta-haty` dietaryTags to `['vegetarian']` to prove S19 suppression.
- **Failure Mode 4: Persistence / Export pollution.**
  - Risk: Adding `suggestion` to GroceryItem leaking into CSV export or backup.
  - Mitigation: Keep CSV export mapping explicit; verify backup JSON generation remains unchanged.

## Tasks
- [x] Create local branch `improve-wajba-npf020-substitutions` from `main`
- [x] Baseline capture (tests, lint, build, CSV, row layout)
- [x] Gap 1: Add `Substitution` type to `src/types.ts` & create `src/data/substitutions.ts` verbatim
- [x] Gap 2: Resolver pass in `src/utils/aggregator.ts` & `suggestion` field on `GroceryItem`
- [x] Gap 3: Render suggestion line in `src/components/GroceryListView.tsx`
- [x] Gap 4: Bilingual strings via inline ternaries & locked Appendix B strings
- [x] Gap 5: Tests in `tests/core.test.ts` (TDD order per gap)
- [x] Verification & Build / Lint / Test execution
- [x] Self-review, audit, and handoff files (`REPORT.md`, `PROGRESS.md`, `AGENTS.md`, `DESIGN.md`)

## Appendix D — Deferred Blockers
- **Blocker 1: Impeccable CLI unavailable**
  - *Evidence*: `which impeccable` returns command not found on system.
  - *Exact Unlock*: Per SB-9 Step 3, this step is labelled "not checked" and `PRODUCT.md` is NOT created by this run; handoff is complete without it and will be evaluated when Impeccable CLI is installed in environment.

---

# Seasonal produce (Mawsimha merge)

Branch: `claude/wajba-seasons-46a76c`, cut from `improve-wajba-npf020-substitutions` (not merged to main).

## Tasks
- [x] `src/data/seasons.ts`: 36 rows verbatim from Mawsimha, plus draft English names, hints, notes
- [x] `src/utils/season.ts`: Cairo month, alias matcher with exclusions, `isInSeason`, `isPeak`, recipe score, season ranges
- [x] `tests/seasons.test.ts`: dataset invariants, matcher guards, real-recipe checks
- [x] In Season view, Navbar and MobileBottomNav entries, route `/dashboard/seasons`
- [x] Grocery row hint and RecipeExplorer "Seasonal this month" filter
- [x] `docs/seasons-translation-review.md`, README, AGENTS.md, architecture, decision log
- [ ] Owner: approve English wording, dataset source, answer dataset doubts

## Decisions
- Recipe "seasonal this month" = uses at least one limited-season item in season and no known produce out of season. Year-round items (tomato, onion, garlic, potato, herbs, banana) never count as seasonal.
- Matching uses the Arabic ingredient name on produce-aisle lines only; processed or different products are excluded by phrase; ambiguous words (bare فلفل, فاصوليا, تمر) match nothing.
- Hints are computed in the view; `GroceryItem`, CSV export and backup state are unchanged.
- No Mawsimha images ported: its assets are screenshots, no real use in Wajba.

## Verification
See the final report: `bun run lint`, `bun run test`, `bun run build`, and browser checks at 390px and desktop in Arabic and English.

## Foundation and SEO pass (2026-11-24)
- [x] `src/lib/api.ts` with tests, `AsyncState`, `SessionProvider`, `AccountPanel` and `FamilyGroups` moved onto them
- [x] `neon/002`, `neon/003` validated on branch `validate-backups-fk-20261124` (left in place, not deleted)
- [x] Live check on the owner's signed-in account: Google sign-in 200, `GET /api/groups` 200, backup save `PUT` 200, restore `GET` 200
- [x] `/seasons` public page, noindex headers, JSON-LD cleanup, robots and sitemap, `docs/SEO.md`
- [ ] Owner: apply `neon/003` to production, merge and deploy, then verify the Search Console property
- [ ] Not tested: joining a family group from a second account (only one user exists in production)
- [ ] Catalog to Neon: see `docs/catalog-to-neon-plan.md`
