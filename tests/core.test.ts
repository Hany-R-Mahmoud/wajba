import test from 'node:test';
import assert from 'node:assert/strict';
import { generateGroceryListFromPlan, normalizeUnit } from '../src/utils/aggregator';
import { DIETARY_TAGS, GroceryItem, MonthlyPlan, PantryItem, Recipe, WeeklyPlan } from '../src/types';
import { clearWajbaScheduleData, createCurrentWajbaBackup, createEmptyMonthlyPlan, createEmptyWeeklyPlan, createWajbaBackup, deleteCustomRecipe, detectStorageIssues, loadCustomRecipes, parseWajbaBackup, replaceWajbaState, saveCustomRecipe, saveMonthlyPlan, saveWeeklyPlan, STORAGE_KEYS } from '../src/utils/storage';
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

test('schedule defaults are empty and reset clears weekly and monthly plans', () => {
  globalThis.localStorage = new MemoryStorage();
  const weeklyPlan = createEmptyWeeklyPlan();
  const monthlyPlan = createEmptyMonthlyPlan(2026, 7);

  assert.equal(weeklyPlan.days.every((day) => Object.keys(day.slots).length === 0), true);
  assert.equal(Object.values(monthlyPlan.days).every((day) => Object.keys(day.slots).length === 0), true);

  saveWeeklyPlan(weeklyPlan);
  saveMonthlyPlan(monthlyPlan);
  saveMonthlyPlan(createEmptyMonthlyPlan(2026, 8));
  clearWajbaScheduleData();

  assert.equal(localStorage.getItem(STORAGE_KEYS.WEEKLY_PLAN), null);
  assert.equal(localStorage.getItem(`${STORAGE_KEYS.MONTHLY_PLAN}_2026_7`), null);
  assert.equal(localStorage.getItem(`${STORAGE_KEYS.MONTHLY_PLAN}_2026_8`), null);
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
