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
