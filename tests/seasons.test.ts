import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCE, getMonthList, DATASET_VERSION, DATASET_DATE } from '../src/data/seasons';
import { INITIAL_RECIPES } from '../src/data/recipes';
import { cairoMonth, isInSeason, isPeak, isSeasonalRecipe, matchProduce, recipeSeasonality, recipesUsing } from '../src/utils/season';
import { Ingredient, Recipe } from '../src/types';

const byAr = (name: string) => PRODUCE.find((p) => p.nameAr === name)!;
const names = (text: string) => matchProduce(text).map((p) => p.nameAr);
const recipe = (id: string) => INITIAL_RECIPES.find((r) => r.id === id)!;
const line = (nameAr: string, aisle: Ingredient['aisle'] = 'produce'): Ingredient => ({
  id: nameAr, nameAr, nameEn: nameAr, amount: 1, unitAr: 'حبة', unitEn: 'pcs', aisle,
});

// --- Dataset invariants (ported from Mawsimha produce.test.ts) ---

test('dataset has 36 items and 223 unique month entries with authored per-month counts', () => {
  const counts = [18, 18, 21, 14, 17, 19, 20, 21, 21, 17, 19, 18];
  assert.equal(PRODUCE.length, 36);
  assert.equal(new Set(PRODUCE.map((p) => p.id)).size, 36);
  assert.equal(DATASET_VERSION, 'mawsimha-v1-2026-11-02');
  assert.equal(DATASET_DATE, '2026-11-02');
  assert.deepEqual(counts.map((_, i) => getMonthList(i + 1).length), counts);
  assert.equal(counts.reduce((a, b) => a + b), 223);
  for (const p of PRODUCE) {
    assert.equal(p.seasonStartMonth, p.seasonMonths[0]);
    assert.equal(p.seasonEndMonth, p.seasonMonths.at(-1));
    assert.equal(new Set(p.seasonMonths).size, p.seasonMonths.length);
    assert.ok(p.peakMonths.every((m) => p.seasonMonths.includes(m)), `${p.nameAr}: peak must be inside season`);
    assert.match(p.id, /^\d{2}$/);
    assert.ok(p.nameEn.trim() && p.cookHintEn.trim() && p.cookHintAr.trim(), `${p.id}: names and hints present`);
  }
});

test('green beans keep two distinct seasons and are out in July', () => {
  const beans = byAr('فاصوليا خضراء');
  assert.deepEqual(beans.seasonMonths, [3, 4, 5, 9, 10, 11]);
  assert.deepEqual(beans.peakMonths, [4, 10]);
  assert.equal(beans.seasonStartMonth, 3);
  assert.equal(beans.seasonEndMonth, 11);
  assert.ok(!getMonthList(7).includes(beans));
});

test('every item keeps its exact authored peak months', () => {
  const expected = [
    [5, 6, 7, 8], [5, 6, 7, 8], [6, 7, 8], [5, 6, 7, 8], [6, 7, 8, 9], [7, 8, 9], [4, 10], [12, 1, 2], [12, 1, 2],
    [6, 7, 8], [12, 1, 2], [12, 1, 2], [12, 1, 2, 3], [2, 3, 4], [4, 5, 6, 7], [4, 5, 6], [11, 12, 1, 2, 3],
    [11, 12, 1, 2, 3], [11, 12, 1, 2, 3], [1, 2], [12, 1], [12, 1, 2, 3], [9, 10], [8, 9], [7, 8], [8], [10],
    [1, 2], [12, 1, 2], [6, 7, 8], [6, 7, 8], [6, 7], [6], [7], [9, 10], [1, 2, 3],
  ];
  assert.deepEqual(PRODUCE.map((p) => p.peakMonths), expected);
});

test('month list puts peak items first, then category, then Arabic name', () => {
  const rank = { vegetable: 0, fruit: 1, herbs: 2 };
  for (let m = 1; m <= 12; m++) {
    const list = getMonthList(m);
    for (let i = 1; i < list.length; i++) {
      const a = list[i - 1];
      const b = list[i];
      const cmp =
        Number(b.peakMonths.includes(m as never)) - Number(a.peakMonths.includes(m as never)) ||
        rank[a.category] - rank[b.category] ||
        a.nameAr.localeCompare(b.nameAr, 'ar') ||
        a.id.localeCompare(b.id);
      assert.ok(cmp <= 0);
    }
  }
  assert.deepEqual(getMonthList(1, 'herbs').map((p) => p.id), ['19']);
});

test('Cairo month crosses UTC month boundaries in winter and summer', () => {
  for (const [date, month] of [
    ['2026-01-31T21:59:59Z', 1],
    ['2026-01-31T22:00:00Z', 2],
    ['2026-07-31T20:59:59Z', 7],
    ['2026-07-31T21:00:00Z', 8],
    ['2026-12-31T22:00:00Z', 1],
  ] as const) {
    assert.equal(cairoMonth(new Date(date)), month);
  }
});

// --- Ingredient matching ---

test('real Wajba ingredient names match the right produce item', () => {
  assert.deepEqual(names('طماطم مفرومة'), ['طماطم']);
  assert.deepEqual(names('طماطم مبشورة'), ['طماطم']);
  assert.deepEqual(names('عصير طماطم طازج'), ['طماطم']);
  assert.deepEqual(names('بصل مفروم ناعم'), ['بصل']);
  assert.deepEqual(names('ثوم مفروم للطشة'), ['ثوم']);
  assert.deepEqual(names('بطاطا'), ['بطاطس']);
  assert.deepEqual(names('كوسا وقرع ولفت'), ['كوسة']);
  assert.deepEqual(names('ملفوف أبيض'), ['كرنب']);
  assert.deepEqual(names('ورق عنب'), ['عنب']);
  assert.deepEqual(names('عصير ليمون'), ['ليمون بلدي']);
  assert.deepEqual(names('فاصوليا خضراء مقطعة'), ['فاصوليا خضراء']);
  assert.deepEqual(names('بقدونس وكزبرة وشبت مفرومين'), ['خضرة (بقدونس وشبت وكزبرة)']);
});

test('compound lines return every item they name, with the leading و tolerated', () => {
  assert.deepEqual(names('بصل وثوم').sort(), ['بصل', 'ثوم'].sort());
  assert.deepEqual(names('خيار وطماطم وفجل وبقلة وخس').sort(), ['خس', 'خيار', 'طماطم'].sort());
  assert.deepEqual(names('كوسة وباذنجان وفلفل مقور').sort(), ['باذنجان', 'كوسة'].sort());
});

test('false-positive guard: similar or processed names do not match', () => {
  // whole-word matching: a produce word inside another word never hits
  assert.deepEqual(names('بصلة'), ['بصل']);
  assert.deepEqual(names('بصلاني'), []);
  assert.deepEqual(names('مثوم'), []);
  assert.deepEqual(names('خسارة'), []);
  // different products with a similar name
  assert.deepEqual(names('بصل أخضر'), [], 'spring onion is not dry onion');
  assert.deepEqual(names('بصل أخضر مفروم'), []);
  assert.deepEqual(names('معجون طماطم'), [], 'paste is not fresh tomato');
  assert.deepEqual(names('صلصة طماطم وبصل مفروم وسمن'), ['بصل']);
  assert.deepEqual(names('ليمون مصير'), [], 'preserved lemon');
  assert.deepEqual(names('ليمون مجفف'), [], 'dried lime');
  assert.deepEqual(names('تين مجفف'), []);
  assert.deepEqual(names('مشمش مجفف'), []);
  assert.deepEqual(names('دبس رمان بكر وسماق وعصير ليمون'), ['ليمون بلدي'], 'molasses is not pomegranate');
  assert.deepEqual(names('كزبرة جافة مطحونة'), [], 'ground coriander is a spice');
  assert.deepEqual(names('ثوم مفروم بكثرة وكزبرة جافة'), ['ثوم']);
  assert.deepEqual(names('أوراق موز أو ورق خبز وقصدير'), []);
  // ambiguous names are intentionally unmatched
  assert.deepEqual(names('فلفل أخضر وفلفل حار مفروم'), []);
  assert.deepEqual(names('فلفل أسود'), []);
  assert.deepEqual(names('فاصوليا بيضاء'), []);
  assert.deepEqual(names('تمر منزوع النوى'), []);
  assert.deepEqual(names('فلفل أخضر حار وفلفل رومي مقطع'), ['فلفل رومي']);
});

test('isInSeason and isPeak follow the dataset', () => {
  assert.ok(isInSeason('10', 7) && isPeak('10', 7), 'molokhia peaks in July');
  assert.ok(isInSeason('10', 5) && !isPeak('10', 5), 'molokhia in season, not peak, in May');
  assert.ok(!isInSeason('10', 1), 'molokhia is out in January');
  assert.ok(isInSeason(byAr('طماطم'), 1) && !isPeak(byAr('طماطم'), 1), 'tomato is year-round, peak in summer');
  assert.ok(!isInSeason('99', 1) && !isPeak('99', 1), 'unknown id is never in season');
});

// --- Recipe seasonality against real recipes ---

test('molokhia recipe is seasonal in July and not in January', () => {
  const molokhia = recipe('egypt-molokhia');
  const july = recipeSeasonality(molokhia, 7);
  const january = recipeSeasonality(molokhia, 1);
  assert.equal(july.score, 1);
  assert.deepEqual(july.peak.map((p) => p.nameAr), ['ملوخية']);
  assert.equal(january.score, 0.5, 'garlic is in season, molokhia is not');
  assert.ok(isSeasonalRecipe(molokhia, 7));
  assert.ok(!isSeasonalRecipe(molokhia, 1));
});

test('a recipe with only year-round produce is never "seasonal this month"', () => {
  const koshary = recipe('egypt-koshary');
  for (let m = 1; m <= 12; m++) {
    assert.equal(recipeSeasonality(koshary, m).score, 1);
    assert.ok(!isSeasonalRecipe(koshary, m), `koshary month ${m}`);
  }
});

test('score counts only produce-aisle lines and is null with no known produce', () => {
  const partial = { ingredients: [line('طماطم'), line('نعناع طازج'), line('باذنجان', 'pantry')] };
  const s = recipeSeasonality(partial, 1);
  assert.equal(s.total, 2, 'pantry-aisle line ignored');
  assert.equal(s.known, 1, 'mint has no dataset entry');
  assert.equal(s.score, 1);
  assert.equal(recipeSeasonality({ ingredients: [line('نعناع طازج')] }, 1).score, null);
  assert.equal(recipeSeasonality({ ingredients: [] }, 1).score, null);
});

test('false-positive guard on a real recipe: spring onion and lemon do not read as onion out of season', () => {
  const feseekh = recipe('egypt-feseekh');
  const produce = feseekh.ingredients.filter((i) => i.aisle === 'produce').map((i) => i.nameAr);
  assert.ok(produce.includes('بصل أخضر'));
  assert.ok(!matchProduce('بصل أخضر').length);
  const s = recipeSeasonality(feseekh, 8);
  assert.equal(s.known, produce.filter((n) => matchProduce(n).length).length);
  assert.ok(!s.seasonal.some((p) => p.nameAr === 'بصل'));
});

test('recipesUsing links produce to real recipes through the produce aisle', () => {
  const ids = (id: string) => recipesUsing(id, INITIAL_RECIPES).map((r) => r.id);
  assert.deepEqual(ids('10'), ['egypt-molokhia']);
  assert.ok(ids('03').includes('egypt-mesakaa'));
  assert.ok(ids('12').includes('egypt-qarnabeet-maqli'));
  assert.deepEqual(ids('36'), [], 'no artichoke recipe in the catalog yet');
  const custom: Recipe = { ...recipe('egypt-molokhia'), id: 'custom-1', isCustom: true };
  assert.ok(recipesUsing('10', [custom, ...INITIAL_RECIPES]).some((r) => r.id === 'custom-1'));
});

test('catalog-wide: seasonal recipes exist in every month and never include out-of-season produce', () => {
  for (let m = 1; m <= 12; m++) {
    const seasonal = INITIAL_RECIPES.filter((r) => isSeasonalRecipe(r, m));
    assert.ok(seasonal.length > 0, `month ${m} has at least one seasonal recipe`);
    for (const r of seasonal) assert.equal(recipeSeasonality(r, m).outOfSeason, 0);
  }
});
