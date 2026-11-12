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
- [ ] Verification & Build / Lint / Test execution
- [ ] Self-review, audit, and handoff files (`REPORT.md`, `PROGRESS.md`, `AGENTS.md`, `DESIGN.md`)

## Appendix D — Deferred Blockers
None.
