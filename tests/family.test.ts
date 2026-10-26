import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_RECIPES } from '../src/data/recipes';
import { createEmptyWeeklyPlan, decodePlanFromUrl, loadWeeklyPlan, saveFamilyWeek, STORAGE_KEYS } from '../src/utils/storage';
import { parseFamilyPlan, prepareFamilyImport, referencedFamilyPlan } from '../src/utils/family';

test('family plans require seven unique days, valid slots, and resolvable recipes', () => {
  const weeklyPlan = createEmptyWeeklyPlan();
  const valid = { weeklyPlan, customRecipes: [] };
  assert.ok(parseFamilyPlan(valid));
  assert.equal(parseFamilyPlan({ ...valid, weeklyPlan: { ...weeklyPlan, days: [] } }), null);
  assert.equal(parseFamilyPlan({ ...valid, weeklyPlan: { ...weeklyPlan, days: Array(7).fill(weeklyPlan.days[0]) } }), null);
  const invalid = structuredClone(valid);
  invalid.weeklyPlan.days[0].slots.dinner = { recipeId: 'missing', servings: 2 };
  assert.equal(parseFamilyPlan(invalid), null);
  invalid.weeklyPlan.days[0].slots.dinner = { recipeId: INITIAL_RECIPES[0].id, servings: -1 };
  assert.equal(parseFamilyPlan(invalid), null);
});

test('only referenced custom recipes are shared and importing preserves existing IDs', () => {
  const weeklyPlan = createEmptyWeeklyPlan();
  const recipe = { ...INITIAL_RECIPES[0], id: 'custom-existing', isCustom: true };
  weeklyPlan.days[0].slots.dinner = { recipeId: recipe.id, servings: 4, customNote: 'family note' };
  const shared = referencedFamilyPlan(weeklyPlan, [recipe, { ...recipe, id: 'private-unreferenced' }]);
  assert.equal(shared.customRecipes.length, 1);
  const imported = prepareFamilyImport(shared, () => 'new-id');
  assert.equal(imported.customRecipes[0].id, 'custom-new-id');
  assert.equal(imported.weeklyPlan.days[0].slots.dinner?.recipeId, 'custom-new-id');
  assert.equal(shared.weeklyPlan.days[0].slots.dinner?.recipeId, 'custom-existing');
  assert.equal(imported.weeklyPlan.days[0].slots.dinner?.customNote, 'family note');
  assert.equal(parseFamilyPlan({ weeklyPlan, customRecipes: [recipe, recipe] }), null);
});

test('snapshot decoder rejects malformed and oversized data', () => {
  assert.equal(decodePlanFromUrl('e30='), null);
  assert.equal(decodePlanFromUrl('%invalid'), null);
  assert.equal(decodePlanFromUrl('a'.repeat(100_001)), null);
});

test('cancelled snapshot import preserves local week and unrelated URL state', () => {
  const saved = createEmptyWeeklyPlan();
  saved.name = 'Keep this week';
  const incoming = { ...saved, name: 'Incoming week' };
  let cleaned = '';
  let writes = 0;
  const previous = ['window', 'document', 'localStorage'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const);
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => key === STORAGE_KEYS.WEEKLY_PLAN ? JSON.stringify(saved) : null,
      setItem: () => { writes++; },
    } });
    Object.defineProperty(globalThis, 'document', { configurable: true, value: { title: 'Wajba' } });
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {
      location: { pathname: '/dashboard', search: `?keep=yes&plan=${encodeURIComponent(Buffer.from(JSON.stringify(incoming)).toString('base64'))}`, hash: '#section' },
      history: { replaceState: (_state: unknown, _title: string, url: string) => { cleaned = url; } },
      confirm: () => false,
    } });
    assert.equal(loadWeeklyPlan().name, 'Keep this week');
    assert.equal(writes, 0);
    assert.equal(cleaned, '/dashboard?keep=yes#section');
  } finally {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});

test('family import rolls back recipe writes if saving the week fails', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const data = new Map([[STORAGE_KEYS.CUSTOM_RECIPES, '[]'], [STORAGE_KEYS.WEEKLY_PLAN, '{"name":"original"}']]);
  let fail = true;
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        if (key === STORAGE_KEYS.WEEKLY_PLAN && fail) { fail = false; throw new Error('Storage full'); }
        data.set(key, value);
      },
      removeItem: (key: string) => data.delete(key),
    } });
    assert.throws(() => saveFamilyWeek(createEmptyWeeklyPlan(), [INITIAL_RECIPES[0]]), /Storage full/);
    assert.equal(data.get(STORAGE_KEYS.CUSTOM_RECIPES), '[]');
    assert.equal(data.get(STORAGE_KEYS.WEEKLY_PLAN), '{"name":"original"}');
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
