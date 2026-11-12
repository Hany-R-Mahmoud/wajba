import test from 'node:test';
import assert from 'node:assert/strict';
import { generateGroceryListFromPlan, normalizeUnit } from '../src/utils/aggregator';
import { DIETARY_TAGS, GroceryItem, MonthlyPlan, PantryItem, Recipe, WeeklyPlan } from '../src/types';
import { clearMonthlyAssignmentsForDates, clearPersistedMonthlyAssignmentsForDates, clearWeeklyPlanAssignments, createCurrentWajbaBackup, createEmptyMonthlyPlan, createEmptyWeeklyPlan, createWajbaBackup, deleteCustomRecipe, detectStorageIssues, getCurrentWeekDateKeys, loadCustomRecipes, parseWajbaBackup, replaceWajbaState, saveCustomRecipe, saveMonthlyPlan, saveWeeklyPlan, STORAGE_KEYS } from '../src/utils/storage';
import { filterRecipesByDietaryTag } from '../src/utils/recipes';

const recipe: Recipe = {
  id: 'test-recipe',
  titleAr: 'وصفة اختبار',
  titleEn: 'Test Recipe',
  descriptionAr: '',
  descriptionEn: '',
  region: 'general',
  mealType: ['dinner'],
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  servings: 2,
  difficulty: 'easy',
  tags: [],
  dietaryTags: ['vegetarian'],
  image: '',
  ingredients: [
    {
      id: 'flour',
      nameAr: 'دقيق',
      nameEn: 'Flour',
      amount: 500,
      unitAr: 'جرام',
      unitEn: 'g',
      aisle: 'pantry',
    },
  ],
  instructionsAr: [],
  instructionsEn: [],
  votesCount: { likes: 0, dislikes: 0 },
  rating: 0,
};

const plan: WeeklyPlan = {
  id: 'test-plan',
  name: 'Test',
  isRamadanMode: false,
  updatedAt: '2026-01-01T00:00:00.000Z',
  days: [
    {
      dayId: 'sat',
      dayNameAr: 'السبت',
      dayNameEn: 'Saturday',
      slots: { dinner: { recipeId: recipe.id, servings: 2 } },
    },
  ],
};

test('normalizeUnit converts 1000 grams to one kilogram', () => {
  assert.deepEqual(normalizeUnit(1000, 'g'), { amount: 1, unitAr: 'كجم', unitEn: 'kg' });
});

test('grocery aggregation subtracts compatible pantry quantities', () => {
  const list = generateGroceryListFromPlan(plan, [recipe], [], [], [
    {
      id: 'pantry-flour',
      nameAr: 'دقيق',
      nameEn: 'Flour',
      amount: 0.25,
      unitAr: 'كجم',
      unitEn: 'kg',
      aisle: 'pantry',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ]);

  assert.equal(list[0]?.amount, 250);
  assert.equal(list[0]?.pantryAmount, 250);
  assert.equal(list[0]?.requiredAmount, 500);
  assert.equal(list[0]?.isCovered, false);
});

test('grocery aggregation keeps normalized units when subtracting pantry quantities', () => {
  const list = generateGroceryListFromPlan(
    plan,
    [{ ...recipe, ingredients: [{ ...recipe.ingredients[0], amount: 1000 }] }],
    [],
    [],
    [{
      id: 'pantry-flour',
      nameAr: 'دقيق',
      nameEn: 'Flour',
      amount: 0.5,
      unitAr: 'كجم',
      unitEn: 'kg',
      aisle: 'pantry',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }]
  );

  assert.equal(list[0]?.amount, 0.5);
  assert.equal(list[0]?.unitEn, 'kg');
  assert.equal(list[0]?.pantryAmount, 0.5);
  assert.equal(list[0]?.requiredAmount, 1);
});

test('grocery aggregation does not subtract incompatible units', () => {
  const list = generateGroceryListFromPlan(plan, [recipe], [], [], [
    {
      id: 'pantry-flour',
      nameAr: 'دقيق',
      nameEn: 'Flour',
      amount: 2,
      unitAr: 'ملعقة كبيرة',
      unitEn: 'tbsp',
      aisle: 'pantry',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ]);

  assert.equal(list[0]?.amount, 500);
  assert.equal(list[0]?.pantryAmount, 0);
});

test('backup parser accepts the exported backup shape and rejects malformed data', () => {
  const backup = createWajbaBackup({
    language: 'en',
    theme: 'dark',
    favorites: [],
    votes: {},
    customRecipes: [recipe],
    weeklyPlan: plan,
    monthlyPlans: [],
    groceryCheckedIds: [],
    groceryExtras: [],
    pantryItems: [],
  });

  assert.deepEqual(parseWajbaBackup(backup), backup);
  assert.equal(parseWajbaBackup({ version: 2 }), null);
  assert.equal(
    parseWajbaBackup(createWajbaBackup({
      ...backup.state,
      weeklyPlan: {
        ...plan,
        days: [{ ...plan.days[0], slots: { dinner: { recipeId: recipe.id, servings: 0 } } }],
      },
    })),
    null
  );
  assert.equal(DIETARY_TAGS.length, 6);
});

test('backup parser rejects malformed recipe, monthly, grocery, and pantry records', () => {
  const base = createWajbaBackup({
    language: 'en',
    theme: 'dark',
    favorites: [],
    votes: {},
    customRecipes: [recipe],
    weeklyPlan: plan,
    monthlyPlans: [],
    groceryCheckedIds: [],
    groceryExtras: [],
    pantryItems: [],
  }).state;
  const malformedMonthlyPlan: MonthlyPlan = {
    id: 'monthly_bad',
    year: 2026,
    month: 0,
    isRamadanMode: false,
    days: { '2026-01-01': { slots: { dinner: { recipeId: recipe.id, servings: 0 } } } },
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
  const malformedGroceryItem: GroceryItem = {
    id: 'bad-grocery', nameAr: 'سيئ', nameEn: 'Bad', amount: -1, unitAr: 'جرام', unitEn: 'g', aisle: 'pantry', isChecked: false, recipeSources: [],
  };
  const malformedPantryItem: PantryItem = {
    id: 'bad-pantry', nameAr: 'سيئ', nameEn: 'Bad', amount: 0, unitAr: 'جرام', unitEn: 'g', aisle: 'pantry', updatedAt: '2026-01-01T00:00:00.000Z',
  };

  assert.equal(parseWajbaBackup(createWajbaBackup({ ...base, customRecipes: [{ ...recipe, ingredients: [{ ...recipe.ingredients[0], amount: 0 }] }] })), null);
  assert.equal(parseWajbaBackup(createWajbaBackup({ ...base, monthlyPlans: [malformedMonthlyPlan] })), null);
  assert.equal(parseWajbaBackup(createWajbaBackup({ ...base, groceryExtras: [malformedGroceryItem] })), null);
  assert.equal(parseWajbaBackup(createWajbaBackup({ ...base, pantryItems: [malformedPantryItem] })), null);
});

test('dietary filtering returns only recipes with the selected informational tag', () => {
  assert.deepEqual(filterRecipesByDietaryTag([recipe], 'vegetarian'), [recipe]);
  assert.deepEqual(filterRecipesByDietaryTag([recipe], 'vegan'), []);
});

test('custom recipe persistence edits by stable ID and deletes safely', () => {
  globalThis.localStorage = new MemoryStorage();
  saveCustomRecipe(recipe);
  saveCustomRecipe({ ...recipe, titleEn: 'Edited Test Recipe' });
  assert.equal(loadCustomRecipes().length, 1);
  assert.equal(loadCustomRecipes()[0]?.titleEn, 'Edited Test Recipe');
  deleteCustomRecipe(recipe.id);
  assert.deepEqual(loadCustomRecipes(), []);
});

test('schedule clearing is scoped to the current week and preserves unrelated monthly entries', () => {
  globalThis.localStorage = new MemoryStorage();
  const weeklyPlan = createEmptyWeeklyPlan();
  const monthlyPlan = createEmptyMonthlyPlan(2026, 7);
  const otherMonthlyPlan = createEmptyMonthlyPlan(2026, 8);
  const weekDateKeys = getCurrentWeekDateKeys(new Date(2026, 7, 5));

  assert.equal(weeklyPlan.days.every((day) => Object.keys(day.slots).length === 0), true);
  assert.equal(Object.values(monthlyPlan.days).every((day) => Object.keys(day.slots).length === 0), true);
  assert.deepEqual(weekDateKeys, ['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07']);

  monthlyPlan.days['2026-08-02'].slots = { lunch: { recipeId: recipe.id, servings: 2 } };
  monthlyPlan.days['2026-08-10'].slots = { dinner: { recipeId: recipe.id, servings: 2 } };
  otherMonthlyPlan.days['2026-09-01'].slots = { breakfast: { recipeId: recipe.id, servings: 2 } };

  saveWeeklyPlan(weeklyPlan);
  saveMonthlyPlan(monthlyPlan);
  saveMonthlyPlan(otherMonthlyPlan);
  clearPersistedMonthlyAssignmentsForDates(weekDateKeys);

  const clearedMonthlyPlan = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.MONTHLY_PLAN}_2026_7`) || '{}') as MonthlyPlan;
  const preservedMonthlyPlan = JSON.parse(localStorage.getItem(`${STORAGE_KEYS.MONTHLY_PLAN}_2026_8`) || '{}') as MonthlyPlan;
  assert.deepEqual(clearedMonthlyPlan.days['2026-08-02']?.slots, {});
  assert.equal(clearedMonthlyPlan.days['2026-08-10']?.slots.dinner?.recipeId, recipe.id);
  assert.equal(preservedMonthlyPlan.days['2026-09-01']?.slots.breakfast?.recipeId, recipe.id);
  assert.equal(clearWeeklyPlanAssignments({ ...weeklyPlan, days: [{ ...weeklyPlan.days[0], slots: { lunch: { recipeId: recipe.id, servings: 2 } } }] }).days[0]?.slots.lunch, undefined);
  assert.deepEqual(clearMonthlyAssignmentsForDates(monthlyPlan, ['2026-08-10']).days['2026-08-10']?.slots, {});
});

test('current week calculation crosses month boundaries using Saturday start', () => {
  assert.deepEqual(getCurrentWeekDateKeys(new Date(2026, 7, 30)), [
    '2026-08-29',
    '2026-08-30',
    '2026-08-31',
    '2026-09-01',
    '2026-09-02',
    '2026-09-03',
    '2026-09-04',
  ]);
});

test('storage fallback reports corrupted JSON without throwing', () => {
  const storage = new MemoryStorage();
  storage.setItem('wajba_custom_recipes', '{bad json');
  globalThis.localStorage = storage;
  assert.equal(detectStorageIssues(), 'wajba_custom_recipes');
});

test('storage diagnostics ignore corrupted third-party localStorage values', () => {
  const storage = new MemoryStorage();
  storage.setItem('__vercel_toolbar_injector', '{bad json');
  globalThis.localStorage = storage;
  assert.equal(detectStorageIssues(), null);
});

test('backup replacement rolls back when a localStorage write fails once', () => {
  const storage = new MemoryStorage();
  globalThis.localStorage = storage;
  saveCustomRecipe(recipe);
  const currentState = createCurrentWajbaBackup().state;
  storage.failNextSetForKey = STORAGE_KEYS.WEEKLY_PLAN;

  assert.throws(
    () => replaceWajbaState({ ...currentState, customRecipes: [{ ...recipe, titleEn: 'Should Roll Back' }] }),
    /forced storage failure/
  );
  assert.equal(loadCustomRecipes()[0]?.titleEn, 'Test Recipe');
});

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  failNextSetForKey: string | null = null;

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    if (this.failNextSetForKey === key) {
      this.failNextSetForKey = null;
      throw new Error('forced storage failure');
    }
    this.values.set(key, value);
  }
}

import {
  SUBSTITUTIONS,
  SUBSTITUTION_VARIANT_MAP,
  SUBSTITUTION_SCOPE,
  CONFIDENCE_TAGS,
  formatSubstitutionLine,
} from '../src/data/substitutions';
import { normalizeIngredientName } from '../src/utils/aggregator';
import { INITIAL_RECIPES } from '../src/data/recipes';

test('Gap 1: substitutions data integrity and invariant checks', () => {
  assert.equal(SUBSTITUTION_SCOPE, 'egypt');
  assert.equal(SUBSTITUTIONS.length, 22);

  // Collect all catalog normalized names
  const catalogNames = new Set<string>();
  const catalogRecipeIds = new Set<string>();
  for (const r of INITIAL_RECIPES) {
    catalogRecipeIds.add(r.id);
    for (const ing of r.ingredients) {
      catalogNames.add(normalizeIngredientName(ing.nameEn));
    }
  }

  const seenIds = new Set<string>();
  const seenPairs = new Set<string>();
  const bannedTerms = ['allergy', 'allergies', 'safe', 'safety', 'حساسية', 'آمن'];

  for (let i = 0; i < 22; i++) {
    const expectedId = `S${String(i + 1).padStart(2, '0')}`;
    const row = SUBSTITUTIONS[i];
    assert.equal(row.id, expectedId);
    assert.equal(seenIds.has(row.id), false);
    seenIds.add(row.id);

    // All 8 fields complete
    assert.ok(row.id);
    assert.ok(row.from);
    assert.ok(row.to);
    assert.ok(row.reasonAr);
    assert.ok(row.reasonEn);
    assert.ok(row.confidence);
    assert.ok(row.appliesTo && row.appliesTo.length > 0);
    assert.ok(row.dietary && Array.isArray(row.dietary.preserves) && Array.isArray(row.dietary.breaks));

    // No duplicate (from, to)
    const pair = `${row.from}->${row.to}`;
    assert.equal(seenPairs.has(pair), false, `duplicate pair: ${pair}`);
    seenPairs.add(pair);

    // from and to are exact catalog normalized nameEn
    assert.ok(catalogNames.has(normalizeIngredientName(row.from)), `from key not in catalog: ${row.from}`);
    assert.ok(catalogNames.has(normalizeIngredientName(row.to)), `to key not in catalog: ${row.to}`);

    // reason lengths 1-180 chars
    assert.ok(row.reasonAr.length >= 1 && row.reasonAr.length <= 180, `reasonAr length out of bounds for ${row.id}`);
    assert.ok(row.reasonEn.length >= 1 && row.reasonEn.length <= 180, `reasonEn length out of bounds for ${row.id}`);

    // Banned terms in reasons
    for (const term of bannedTerms) {
      assert.equal(row.reasonAr.toLowerCase().includes(term), false, `banned term '${term}' found in reasonAr of ${row.id}`);
      assert.equal(row.reasonEn.toLowerCase().includes(term), false, `banned term '${term}' found in reasonEn of ${row.id}`);
    }

    // appliesTo all egypt- and exist in catalog
    for (const recipeId of row.appliesTo) {
      assert.ok(recipeId.startsWith('egypt-'), `non-egypt recipeId in ${row.id}: ${recipeId}`);
      assert.ok(catalogRecipeIds.has(recipeId), `appliesTo recipeId not in catalog: ${recipeId}`);
    }
  }

  // Variant map invariants
  assert.equal(Object.keys(SUBSTITUTION_VARIANT_MAP).length, 26);
  const coveredVariantNames = new Map<string, string>(); // variant -> canonicalKey

  for (const [canonicalKey, variants] of Object.entries(SUBSTITUTION_VARIANT_MAP)) {
    assert.equal(canonicalKey, normalizeIngredientName(canonicalKey));
    for (const variant of variants) {
      const normVariant = normalizeIngredientName(variant);
      assert.equal(variant, normVariant, `variant must be normalized: ${variant}`);
      assert.ok(catalogNames.has(normVariant), `variant not in catalog: ${variant}`);
      assert.equal(
        coveredVariantNames.has(normVariant),
        false,
        `variant ${normVariant} under multiple keys (${coveredVariantNames.get(normVariant)} and ${canonicalKey})`
      );
      coveredVariantNames.set(normVariant, canonicalKey);
    }
  }

  // Confidence tags matching Appendix B
  assert.deepEqual(CONFIDENCE_TAGS['مرتفع'], { ar: 'ثقة مرتفعة', en: 'High confidence' });
  assert.deepEqual(CONFIDENCE_TAGS['متوسط'], { ar: 'ثقة متوسطة', en: 'Medium confidence' });
  assert.deepEqual(CONFIDENCE_TAGS['تجريبي'], { ar: 'تجريبي — جرّب بحذر', en: 'Experimental — try with care' });

  // formatSubstitutionLine character-for-character
  const standardLineAr = formatSubstitutionLine(
    {
      substituteNameAr: 'زيت طعام',
      substituteNameEn: 'Vegetable Oil',
      reasonAr: 'الزيت يقلي ويشوح زي السمنة بالظبط في الطبخ، والطعم قريب من غير ما يغير الطبق.',
      reasonEn: 'Oil fries and sautés just like ghee for cooking, with a close flavour that leaves the dish unchanged.',
      confidence: 'مرتفع',
    },
    'ar'
  );
  assert.equal(
    standardLineAr,
    'بديل متوفر: زيت طعام — الزيت يقلي ويشوح زي السمنة بالظبط في الطبخ، والطعم قريب من غير ما يغير الطبق. · ثقة مرتفعة'
  );

  const standardLineEn = formatSubstitutionLine(
    {
      substituteNameAr: 'زيت طعام',
      substituteNameEn: 'Vegetable Oil',
      reasonAr: 'الزيت يقلي ويشوح زي السمنة بالظبط في الطبخ، والطعم قريب من غير ما يغير الطبق.',
      reasonEn: 'Oil fries and sautés just like ghee for cooking, with a close flavour that leaves the dish unchanged.',
      confidence: 'متوسط',
    },
    'en'
  );
  assert.equal(
    standardLineEn,
    'Substitute available: Vegetable Oil — Oil fries and sautés just like ghee for cooking, with a close flavour that leaves the dish unchanged. · Medium confidence'
  );

  const experimentalLineAr = formatSubstitutionLine(
    {
      substituteNameAr: 'كمون',
      substituteNameEn: 'Cumin',
      reasonAr: 'الكمون يدي نكهة بس، مش بديل لقوام الطحينة ولا للصوص.',
      reasonEn: "Cumin gives flavour only; it does not replace tahini's body or the sauce.",
      confidence: 'تجريبي',
    },
    'ar'
  );
  assert.equal(
    experimentalLineAr,
    'تلميح نكهة: كمون — الكمون يدي نكهة بس، مش بديل لقوام الطحينة ولا للصوص. · تجريبي — جرّب بحذر'
  );

  const experimentalLineEn = formatSubstitutionLine(
    {
      substituteNameAr: 'كمون',
      substituteNameEn: 'Cumin',
      reasonAr: 'الكمون يدي نكهة بس، مش بديل لقوام الطحينة ولا للصوص.',
      reasonEn: "Cumin gives flavour only; it does not replace tahini's body or the sauce.",
      confidence: 'تجريبي',
    },
    'en'
  );
  assert.equal(
    experimentalLineEn,
    "Flavour hint: Cumin — Cumin gives flavour only; it does not replace tahini's body or the sauce. · Experimental — try with care"
  );
});

test('Gap 2: resolver rules and suggestion generation in aggregator', () => {
  const koshary = INITIAL_RECIPES.find((r) => r.id === 'egypt-koshary')!;
  const bessara = INITIAL_RECIPES.find((r) => r.id === 'egypt-bessara')!;
  const feseekh = INITIAL_RECIPES.find((r) => r.id === 'egypt-feseekh')!;
  const feteer = INITIAL_RECIPES.find((r) => r.id === 'egypt-feteer-meshaltet')!;
  const kofta = INITIAL_RECIPES.find((r) => r.id === 'egypt-kofta-haty')!;

  // 1. Happy path: egypt-koshary needs vegetable oil, olive oil in pantry covering quantity
  const kosharyPlan: WeeklyPlan = {
    id: 'koshary-plan',
    name: 'Koshary Week',
    isRamadanMode: false,
    updatedAt: '2026-01-01T00:00:00.000Z',
    days: [
      {
        dayId: 'sat',
        dayNameAr: 'السبت',
        dayNameEn: 'Saturday',
        slots: { dinner: { recipeId: 'egypt-koshary', servings: 4 } },
      },
    ],
  };

  const oliveOilPantry: PantryItem[] = [
    {
      id: 'pantry-olive-oil',
      nameAr: 'زيت زيتون',
      nameEn: 'Olive Oil',
      amount: 200,
      unitAr: 'مل',
      unitEn: 'ml',
      aisle: 'pantry',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  const listHappy = generateGroceryListFromPlan(kosharyPlan, INITIAL_RECIPES, [], [], oliveOilPantry);
  const vegOilItemHappy = listHappy.find((i) => i.nameEn.toLowerCase() === 'vegetable oil');
  assert.ok(vegOilItemHappy, 'Vegetable oil item should be in grocery list');
  assert.equal(vegOilItemHappy?.isCovered, false);
  assert.ok(vegOilItemHappy?.suggestion, 'Suggestion should be attached');
  assert.equal(vegOilItemHappy?.suggestion?.rowId, 'S17');
  assert.equal(vegOilItemHappy?.suggestion?.confidence, 'متوسط');
  assert.equal(vegOilItemHappy?.suggestion?.substituteNameEn, 'Olive oil');
  assert.equal('amount' in (vegOilItemHappy?.suggestion || {}), false, 'No substitute quantity stated');

  // 2. Failure: Substitute not on hand -> no line
  const listNoPantry = generateGroceryListFromPlan(kosharyPlan, INITIAL_RECIPES, [], [], []);
  const vegOilItemNoPantry = listNoPantry.find((i) => i.nameEn.toLowerCase() === 'vegetable oil');
  assert.equal(vegOilItemNoPantry?.suggestion, undefined, 'No suggestion when substitute not in pantry');

  // 3. Insufficient quantity -> no line
  const oliveOilShortPantry: PantryItem[] = [
    {
      id: 'pantry-olive-oil-short',
      nameAr: 'زيت زيتون',
      nameEn: 'Olive Oil',
      amount: 10, // far less than required ~150ml
      unitAr: 'مل',
      unitEn: 'ml',
      aisle: 'pantry',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  const listShort = generateGroceryListFromPlan(kosharyPlan, INITIAL_RECIPES, [], [], oliveOilShortPantry);
  const vegOilItemShort = listShort.find((i) => i.nameEn.toLowerCase() === 'vegetable oil');
  assert.equal(vegOilItemShort?.suggestion, undefined, 'No suggestion when substitute quantity is insufficient');

  // 4. Incompatible unit -> no line (convertAmount returns null)
  const oliveOilIncompatPantry: PantryItem[] = [
    {
      id: 'pantry-olive-oil-incompat',
      nameAr: 'زيت زيتون',
      nameEn: 'Olive Oil',
      amount: 5,
      unitAr: 'حزمة',
      unitEn: 'bunches',
      aisle: 'pantry',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  const listIncompat = generateGroceryListFromPlan(kosharyPlan, INITIAL_RECIPES, [], [], oliveOilIncompatPantry);
  const vegOilItemIncompat = listIncompat.find((i) => i.nameEn.toLowerCase() === 'vegetable oil');
  assert.equal(vegOilItemIncompat?.suggestion, undefined, 'No suggestion when unit conversion is null');

  // 5. Variant match: egypt-bessara with onions (3 pcs), pantry has spring onions (5 pcs) -> S12 attaches
  const bessaraPlan: WeeklyPlan = {
    id: 'bessara-plan',
    name: 'Bessara Plan',
    isRamadanMode: false,
    updatedAt: '2026-01-01T00:00:00.000Z',
    days: [{ dayId: 'sat', dayNameAr: 'السبت', dayNameEn: 'Saturday', slots: { dinner: { recipeId: 'egypt-bessara', servings: 4 } } }],
  };
  const springOnionsPantry: PantryItem[] = [
    {
      id: 'pantry-spring-onions',
      nameAr: 'بصل أخضر',
      nameEn: 'Spring Onions',
      amount: 5,
      unitAr: 'حبة',
      unitEn: 'pcs',
      aisle: 'produce',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  const listBessara = generateGroceryListFromPlan(bessaraPlan, INITIAL_RECIPES, [], [], springOnionsPantry);
  const onionItem = listBessara.find((i) => i.nameEn.toLowerCase() === 'onions');
  assert.ok(onionItem?.suggestion, 'Onion row should match variant and attach suggestion');
  assert.equal(onionItem?.suggestion?.rowId, 'S12');

  // 6. Pantry identity: "oil for frying" in pantry canonicalizes to "vegetable oil" for S01 (ghee -> vegetable oil)
  const feteerPlan: WeeklyPlan = {
    id: 'feteer-plan',
    name: 'Feteer Plan',
    isRamadanMode: false,
    updatedAt: '2026-01-01T00:00:00.000Z',
    days: [{ dayId: 'sat', dayNameAr: 'السبت', dayNameEn: 'Saturday', slots: { dinner: { recipeId: 'egypt-feteer-meshaltet', servings: 4 } } }],
  };
  const fryingOilPantry: PantryItem[] = [
    {
      id: 'pantry-frying-oil',
      nameAr: 'زيت للقلي',
      nameEn: 'Oil for frying',
      amount: 1000,
      unitAr: 'جرام',
      unitEn: 'g',
      aisle: 'pantry',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  const listFeteer = generateGroceryListFromPlan(feteerPlan, INITIAL_RECIPES, [], [], fryingOilPantry);
  const gheeItem = listFeteer.find((i) => i.nameEn.toLowerCase().includes('ghee'));
  assert.ok(gheeItem?.suggestion, 'Ghee item should recognize oil for frying as vegetable oil');
  assert.equal(gheeItem?.suggestion?.rowId, 'S01');

  // 7. Experimental (تجريبي) S16 exemption: cumin on hand in tiny amount (1 tsp) vs tahini 0.5 cup
  const feseekhPlan: WeeklyPlan = {
    id: 'feseekh-plan',
    name: 'Feseekh Plan',
    isRamadanMode: false,
    updatedAt: '2026-01-01T00:00:00.000Z',
    days: [{ dayId: 'sat', dayNameAr: 'السبت', dayNameEn: 'Saturday', slots: { dinner: { recipeId: 'egypt-feseekh', servings: 4 } } }],
  };
  const cuminPantry: PantryItem[] = [
    {
      id: 'pantry-cumin',
      nameAr: 'كمون',
      nameEn: 'Cumin',
      amount: 1,
      unitAr: 'ملعقة صغيرة',
      unitEn: 'tsp',
      aisle: 'pantry',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  const listFeseekh = generateGroceryListFromPlan(feseekhPlan, INITIAL_RECIPES, [], [], cuminPantry);
  const tahiniItem = listFeseekh.find((i) => i.nameEn.toLowerCase() === 'tahini');
  assert.ok(tahiniItem?.suggestion, 'S16 experimental hint attaches on any presence of cumin');
  assert.equal(tahiniItem?.suggestion?.rowId, 'S16');
  assert.equal(tahiniItem?.suggestion?.confidence, 'تجريبي');

  // 8. Scope: Lebanese/non-Egyptian recipe never attaches substitution
  const fakeLebaneseRecipe: Recipe = {
    id: 'lebanon-mujadara',
    titleAr: 'مجدرة لبنانية',
    titleEn: 'Lebanese Mujadara',
    descriptionAr: '',
    descriptionEn: '',
    region: 'levant',
    mealType: ['dinner'],
    prepTimeMinutes: 10,
    cookTimeMinutes: 30,
    servings: 4,
    difficulty: 'easy',
    tags: [],
    dietaryTags: ['vegetarian'],
    image: '',
    ingredients: [
      {
        id: 'ing-onion',
        nameAr: 'بصل',
        nameEn: 'Onion',
        amount: 2,
        unitAr: 'حبة',
        unitEn: 'pcs',
        aisle: 'produce',
      },
    ],
    instructionsAr: [],
    instructionsEn: [],
    votesCount: { likes: 0, dislikes: 0 },
    rating: 0,
  };
  const lebanesePlan: WeeklyPlan = {
    id: 'lebanese-plan',
    name: 'Lebanese Plan',
    isRamadanMode: false,
    updatedAt: '2026-01-01T00:00:00.000Z',
    days: [{ dayId: 'sat', dayNameAr: 'السبت', dayNameEn: 'Saturday', slots: { dinner: { recipeId: 'lebanon-mujadara', servings: 4 } } }],
  };
  const listLebanon = generateGroceryListFromPlan(lebanesePlan, [...INITIAL_RECIPES, fakeLebaneseRecipe], [], [], springOnionsPantry);
  const lebanonOnion = listLebanon.find((i) => i.nameEn.toLowerCase() === 'onion');
  assert.equal(lebanonOnion?.suggestion, undefined, 'Non-Egyptian recipe should never attach a suggestion');

  // 9. Dietary guard: S19 (minced beef -> minced lamb, breaks: vegetarian, vegan)
  // Seeded test: override egypt-kofta-haty with dietaryTags: ['vegetarian']
  const lambPantry: PantryItem[] = [
    {
      id: 'pantry-lamb',
      nameAr: 'لحم ضأن مفروم',
      nameEn: 'Minced lamb',
      amount: 1000,
      unitAr: 'جرام',
      unitEn: 'g',
      aisle: 'meat',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  const koftaPlan: WeeklyPlan = {
    id: 'kofta-plan',
    name: 'Kofta Plan',
    isRamadanMode: false,
    updatedAt: '2026-01-01T00:00:00.000Z',
    days: [{ dayId: 'sat', dayNameAr: 'السبت', dayNameEn: 'Saturday', slots: { dinner: { recipeId: 'egypt-kofta-haty', servings: 4 } } }],
  };

  // 9a. Normal kofta (no dietaryTags that conflict): S19 attaches
  const listKoftaNormal = generateGroceryListFromPlan(koftaPlan, INITIAL_RECIPES, [], [], lambPantry);
  const beefItemNormal = listKoftaNormal.find((i) => i.nameEn.toLowerCase() === 'minced beef');
  assert.ok(beefItemNormal?.suggestion, 'S19 attaches when no dietary conflict');
  assert.equal(beefItemNormal?.suggestion?.rowId, 'S19');

  // 9b. Seeded override with vegetarian: S19 suppressed
  const seededRecipes = INITIAL_RECIPES.map((r) =>
    r.id === 'egypt-kofta-haty' ? { ...r, dietaryTags: ['vegetarian' as const] } : r
  );
  const listKoftaGuarded = generateGroceryListFromPlan(koftaPlan, seededRecipes, [], [], lambPantry);
  const beefItemGuarded = listKoftaGuarded.find((i) => i.nameEn.toLowerCase() === 'minced beef');
  assert.equal(beefItemGuarded?.suggestion, undefined, 'Dietary guard suppresses S19 when recipe is tagged vegetarian');

  // 10. First-match-wins: egypt-feteer-meshaltet has ghee. Pantry has both vegetable oil (S01) and butter (S03)
  const bothSubstitutesPantry: PantryItem[] = [
    {
      id: 'pantry-veg-oil',
      nameAr: 'زيت طعام',
      nameEn: 'Vegetable Oil',
      amount: 1000,
      unitAr: 'جرام',
      unitEn: 'g',
      aisle: 'pantry',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'pantry-butter',
      nameAr: 'زبدة',
      nameEn: 'Butter',
      amount: 1000,
      unitAr: 'جرام',
      unitEn: 'g',
      aisle: 'dairy',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  const listFirstWins = generateGroceryListFromPlan(feteerPlan, INITIAL_RECIPES, [], [], bothSubstitutesPantry);
  const gheeFirst = listFirstWins.find((i) => i.nameEn.toLowerCase().includes('ghee'));
  assert.equal(gheeFirst?.suggestion?.rowId, 'S01', 'First match in file order (S01 before S03) wins');

  // 11. Ambiguous title: two custom recipes sharing titleAr match nothing
  const ambiguousPlan: WeeklyPlan = {
    id: 'ambig-plan',
    name: 'Ambig Plan',
    isRamadanMode: false,
    updatedAt: '2026-01-01T00:00:00.000Z',
    days: [{ dayId: 'sat', dayNameAr: 'السبت', dayNameEn: 'Saturday', slots: { dinner: { recipeId: 'custom-1', servings: 2 } } }],
  };
  const ambigRecipes: Recipe[] = [
    ...INITIAL_RECIPES,
    {
      ...recipe,
      id: 'custom-1',
      titleAr: 'عنوان مكرر',
      titleEn: 'Duplicate Title 1',
      ingredients: [{ id: 'ing1', nameAr: 'سمن بلدي', nameEn: 'Ghee', amount: 50, unitAr: 'جرام', unitEn: 'g', aisle: 'pantry' }],
    },
    {
      ...recipe,
      id: 'custom-2',
      titleAr: 'عنوان مكرر',
      titleEn: 'Duplicate Title 2',
      ingredients: [{ id: 'ing2', nameAr: 'سمن بلدي', nameEn: 'Ghee', amount: 50, unitAr: 'جرام', unitEn: 'g', aisle: 'pantry' }],
    },
  ];
  const listAmbig = generateGroceryListFromPlan(ambiguousPlan, ambigRecipes, [], [], fryingOilPantry);
  const ambigGhee = listAmbig.find((i) => i.nameEn.toLowerCase() === 'ghee');
  assert.equal(ambigGhee?.suggestion, undefined, 'Ambiguous recipe title should match nothing');

  // 12. Combined lines and disjunctive lines never fire
  const combinedPlan: WeeklyPlan = {
    id: 'comb-plan',
    name: 'Comb Plan',
    isRamadanMode: false,
    updatedAt: '2026-01-01T00:00:00.000Z',
    days: [{ dayId: 'sat', dayNameAr: 'السبت', dayNameEn: 'Saturday', slots: { dinner: { recipeId: 'custom-comb', servings: 2 } } }],
  };
  const combRecipes: Recipe[] = [
    ...INITIAL_RECIPES,
    {
      ...recipe,
      id: 'custom-comb',
      titleAr: 'وصفة بهارات',
      titleEn: 'Spices Recipe',
      ingredients: [
        { id: 'ing-c1', nameAr: 'ملح وفلفل وكمون', nameEn: 'salt, pepper & cumin', amount: 10, unitAr: 'جرام', unitEn: 'g', aisle: 'pantry' },
        { id: 'ing-c2', nameAr: 'سمن أو زيت', nameEn: 'ghee or oil', amount: 2, unitAr: 'ملعقة كبيرة', unitEn: 'tbsp', aisle: 'pantry' },
      ],
    },
  ];
  const listComb = generateGroceryListFromPlan(combinedPlan, combRecipes, [], [], bothSubstitutesPantry);
  const combItem1 = listComb.find((i) => i.nameEn.includes('cumin'));
  const combItem2 = listComb.find((i) => i.nameEn.includes('ghee or oil'));
  assert.equal(combItem1?.suggestion, undefined, 'Combined line never fires');
  assert.equal(combItem2?.suggestion, undefined, 'Disjunctive line never fires');

  // 13. Regression: uncovered item with no row has suggestion === undefined, unaffected fields
  const riceItem = listHappy.find((i) => i.nameEn.toLowerCase().includes('rice'));
  assert.ok(riceItem, 'Rice item exists in koshary');
  assert.equal(riceItem?.suggestion, undefined);
  assert.equal(riceItem?.isCovered, false);
});
