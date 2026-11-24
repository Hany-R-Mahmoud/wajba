import { IngredientAisle, ProduceItem, Recipe, SeasonMonth } from '../types';
import { PRODUCE } from '../data/seasons';

/** Current calendar month in Cairo (1-12), regardless of the device time zone. */
export function cairoMonth(date: Date = new Date()): SeasonMonth {
  return Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', month: 'numeric' }).format(date),
  ) as SeasonMonth;
}

/**
 * Arabic text normalisation for matching only (never shown to users):
 * strips diacritics and tatweel, folds alef/yaa/taa-marbuta variants, and
 * turns punctuation into spaces.
 */
export function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[()[\]{}،,؛;:.!?؟/\\\-–—+*"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Alias words/phrases per produce id, as they appear in Wajba ingredient
 * names (already in `normalizeArabic` form). Matching is by whole word, so
 * `بصل` never hits inside another word, and a leading `و` (and) or `ال`
 * (the) is tolerated: `وبصل` -> `بصل`.
 *
 * Deliberately NOT aliased (too ambiguous): bare `فلفل` (black/hot pepper),
 * bare `فاصوليا` (dried beans), `تمر` (dried dates), `خضار`.
 */
export const PRODUCE_ALIASES: Record<string, string[]> = {
  '01': ['طماطم', 'طماطه', 'بندوره'],
  '02': ['خيار'],
  '03': ['باذنجان'],
  '04': ['كوسه', 'كوسا'],
  '05': ['فلفل رومي', 'فلفل الوان', 'فلفل ملون', 'فلفل حلو'],
  '06': ['باميه'],
  '07': ['فاصوليا خضراء', 'فاصوليا خضرا'],
  '08': ['بسله', 'بازلاء', 'بازلا'],
  '09': ['سبانخ'],
  '10': ['ملوخيه'],
  '11': ['كرنب', 'كرنبه', 'ملفوف'],
  '12': ['قرنبيط'],
  '13': ['جزر'],
  '14': ['بطاطس', 'بطاطا'],
  '15': ['بصل', 'بصله'],
  '16': ['ثوم'],
  '17': ['خس'],
  '18': ['جرجير'],
  '19': ['بقدونس', 'شبت', 'كزبره', 'كزبره خضراء'],
  '20': ['برتقال'],
  '21': ['يوسفي'],
  '22': ['ليمون'],
  '23': ['جوافه'],
  '24': ['مانجو', 'مانجا'],
  '25': ['عنب'],
  '26': ['تين', 'تين برشومي', 'تين شوكي'],
  '27': ['رمان'],
  '28': ['فراوله'],
  '29': ['موز'],
  '30': ['بطيخ'],
  '31': ['شمام', 'كنتالوب'],
  '32': ['خوخ'],
  '33': ['مشمش'],
  '34': ['برقوق'],
  '35': ['بلح', 'رطب'],
  '36': ['خرشوف'],
};

/**
 * Phrases that look like a produce item but are processed or a different
 * product. They are blanked out before alias matching.
 */
export const PRODUCE_EXCLUSIONS: string[] = [
  'معجون طماطم',
  'صلصه طماطم',
  'طماطم معلبه',
  'بصل اخضر',
  'بصل بودر',
  'بودره بصل',
  'ثوم بودر',
  'ثوم مطحون',
  'ليمون مصير',
  'ليمون مجفف',
  'ليمون ناشف',
  'كزبره جافه',
  'كزبره ناشفه',
  'كزبره مطحونه',
  'مشمش مجفف',
  'قمر الدين',
  'تين مجفف',
  'دبس رمان',
  'دبس تمر',
  'باميه مجففه',
  'باميه ناشفه',
  'ملوخيه مجففه',
  'ملوخيه ناشفه',
  'ورق موز',
  'اوراق موز',
];

/** Word-slot candidates: the token itself, minus a leading `و`, minus `ال`. */
function toSlots(normalized: string): string[][] {
  return normalized
    .split(' ')
    .filter(Boolean)
    .map((token) => {
      const candidates = [token];
      let rest = token;
      if (rest.length >= 3 && rest.startsWith('و')) {
        rest = rest.slice(1);
        candidates.push(rest);
      }
      if (rest.length >= 4 && rest.startsWith('ال')) {
        candidates.push(rest.slice(2));
      }
      return candidates;
    });
}

type PhraseSlots = string[];

function phraseAt(slots: string[][], phrase: PhraseSlots, start: number, consumed: boolean[]): boolean {
  for (let k = 0; k < phrase.length; k++) {
    const slot = slots[start + k];
    if (!slot || consumed[start + k] || !slot.includes(phrase[k])) return false;
  }
  return true;
}

const EXCLUSION_PHRASES: PhraseSlots[] = PRODUCE_EXCLUSIONS.map((p) => p.split(' '));
const ALIAS_PHRASES: Array<{ id: string; phrase: PhraseSlots }> = Object.entries(PRODUCE_ALIASES).flatMap(
  ([id, aliases]) => aliases.map((alias) => ({ id, phrase: alias.split(' ') })),
);
const PRODUCE_BY_ID = new Map<string, ProduceItem>(PRODUCE.map((p) => [p.id, p]));

const matchCache = new Map<string, ProduceItem[]>();

/**
 * Produce items named in an Arabic ingredient name, in dataset order.
 * Compound lines ("بصل وثوم") return every item they name.
 */
export function matchProduce(nameAr: string): ProduceItem[] {
  const cached = matchCache.get(nameAr);
  if (cached) return cached;

  const slots = toSlots(normalizeArabic(nameAr));
  const consumed: boolean[] = new Array(slots.length).fill(false);

  for (const phrase of EXCLUSION_PHRASES) {
    for (let i = 0; i < slots.length; i++) {
      if (phraseAt(slots, phrase, i, consumed)) {
        for (let k = 0; k < phrase.length; k++) consumed[i + k] = true;
      }
    }
  }

  const ids = new Set<string>();
  for (const { id, phrase } of ALIAS_PHRASES) {
    for (let i = 0; i < slots.length; i++) {
      if (phraseAt(slots, phrase, i, consumed)) ids.add(id);
    }
  }

  const result = PRODUCE.filter((p) => ids.has(p.id));
  matchCache.set(nameAr, result);
  return result;
}

export function isInSeason(item: ProduceItem | string, month: number): boolean {
  const p = typeof item === 'string' ? PRODUCE_BY_ID.get(item) : item;
  return Boolean(p && p.seasonMonths.includes(month as SeasonMonth));
}

export function isPeak(item: ProduceItem | string, month: number): boolean {
  const p = typeof item === 'string' ? PRODUCE_BY_ID.get(item) : item;
  return Boolean(p && p.peakMonths.includes(month as SeasonMonth));
}

/** Available every month of the year (tomato, onion, garlic, ...). */
export function isYearRound(item: ProduceItem): boolean {
  return item.seasonMonths.length === 12;
}

export interface RecipeSeasonality {
  /** Produce-aisle ingredient lines in the recipe. */
  total: number;
  /** Lines that name at least one dataset item. */
  known: number;
  /** Known lines whose every named item is in season this month. */
  inSeason: number;
  /** Known lines naming an item that is out of season this month. */
  outOfSeason: number;
  /** Distinct in-season items that are not year-round (the interesting ones). */
  seasonal: ProduceItem[];
  /** Subset of `seasonal` at peak this month. */
  peak: ProduceItem[];
  /** inSeason / known, or null when the recipe names no known produce. */
  score: number | null;
}

const PRODUCE_AISLE: IngredientAisle = 'produce';

/** Seasonal score of a recipe for a month: share of known produce lines in season. */
export function recipeSeasonality(recipe: Pick<Recipe, 'ingredients'>, month: number): RecipeSeasonality {
  let total = 0;
  let known = 0;
  let inSeason = 0;
  let outOfSeason = 0;
  const seasonal = new Map<string, ProduceItem>();

  for (const ingredient of recipe.ingredients) {
    if (ingredient.aisle !== PRODUCE_AISLE) continue;
    total++;
    const matches = matchProduce(ingredient.nameAr);
    if (matches.length === 0) continue;
    known++;
    if (matches.every((m) => isInSeason(m, month))) {
      inSeason++;
      for (const m of matches) {
        if (!isYearRound(m)) seasonal.set(m.id, m);
      }
    } else {
      outOfSeason++;
    }
  }

  const seasonalItems = [...seasonal.values()];
  return {
    total,
    known,
    inSeason,
    outOfSeason,
    seasonal: seasonalItems,
    peak: seasonalItems.filter((m) => isPeak(m, month)),
    score: known === 0 ? null : inSeason / known,
  };
}

/**
 * "Seasonal this month": uses at least one limited-season item that is in
 * season, and no known produce that is out of season.
 */
export function isSeasonalRecipe(recipe: Pick<Recipe, 'ingredients'>, month: number): boolean {
  const s = recipeSeasonality(recipe, month);
  return s.seasonal.length > 0 && s.outOfSeason === 0;
}

/** Recipes whose produce-aisle lines name this item. */
export function recipesUsing<R extends Pick<Recipe, 'ingredients'>>(produceId: string, recipes: R[]): R[] {
  return recipes.filter((recipe) =>
    recipe.ingredients.some(
      (ingredient) =>
        ingredient.aisle === PRODUCE_AISLE && matchProduce(ingredient.nameAr).some((p) => p.id === produceId),
    ),
  );
}

/**
 * Contiguous month runs for display, wrapping over the new year:
 * [11,12,1,2,3] -> [[11,3]]; green beans [3,4,5,9,10,11] -> [[3,5],[9,11]].
 * A full year returns [[1,12]].
 */
export function seasonRanges(months: SeasonMonth[]): Array<[SeasonMonth, SeasonMonth]> {
  const set = new Set<number>(months);
  if (set.size === 12) return [[1, 12]];
  const ranges: Array<[SeasonMonth, SeasonMonth]> = [];
  for (let m = 1; m <= 12; m++) {
    const prev = m === 1 ? 12 : m - 1;
    if (!set.has(m) || set.has(prev)) continue; // not the start of a run
    let end = m;
    while (set.has(end === 12 ? 1 : end + 1)) end = end === 12 ? 1 : end + 1;
    ranges.push([m as SeasonMonth, end as SeasonMonth]);
  }
  return ranges;
}
