import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Flame, Leaf, Plus, ShoppingBag } from 'lucide-react';
import { GroceryItem, Language, ProduceCategory, ProduceItem, Recipe, SeasonMonth } from '../types';
import {
  GUIDE_NOTE_AR,
  GUIDE_NOTE_EN,
  SOURCE_NOTE_AR,
  SOURCE_NOTE_EN,
  PRODUCE,
  PRODUCE_CATEGORY_LABELS,
  SEASON_MONTHS_AR,
  SEASON_MONTHS_EN,
  getMonthList,
} from '../data/seasons';
import { cairoMonth, isPeak, isYearRound, recipesUsing, seasonRanges } from '../utils/season';

interface SeasonalViewProps {
  recipes: Recipe[];
  language: Language;
  /** IDs of custom grocery extras, used to show the "added" state. */
  groceryExtraIds: string[];
  onAddToGrocery: (item: GroceryItem) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  /** Opens the recipe list filtered to this month's seasonal recipes. */
  onOpenSeasonalRecipes: () => void;
}

const RECIPES_SHOWN = 2;
const CATEGORY_IDS: Array<ProduceCategory | 'all'> = ['all', 'vegetable', 'fruit', 'herbs'];

export const seasonGroceryId = (produceId: string) => `season_${produceId}`;

export function buildSeasonGroceryItem(item: ProduceItem, isArabic: boolean): GroceryItem {
  const isHerbs = item.category === 'herbs';
  return {
    id: seasonGroceryId(item.id),
    nameAr: item.nameAr,
    nameEn: item.nameEn,
    amount: 1,
    unitAr: isHerbs ? 'حزمة' : 'كجم',
    unitEn: isHerbs ? 'bunch' : 'kg',
    aisle: 'produce',
    isChecked: false,
    recipeSources: [isArabic ? 'دليل المواسم' : 'Seasonal guide'],
    isCustomExtra: true,
  };
}

export const SeasonalView: React.FC<SeasonalViewProps> = ({
  recipes,
  language,
  groceryExtraIds,
  onAddToGrocery,
  onSelectRecipe,
  onOpenSeasonalRecipes,
}) => {
  const isArabic = language === 'ar';
  const monthNames = isArabic ? SEASON_MONTHS_AR : SEASON_MONTHS_EN;
  const currentMonth = useMemo(() => cairoMonth(), []);
  const [month, setMonth] = useState<SeasonMonth>(currentMonth);
  const [category, setCategory] = useState<ProduceCategory | 'all'>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const stripRef = useRef<HTMLDivElement>(null);

  // Keep the selected month visible inside the strip without moving the page.
  // Runs a frame later so a language switch (which flips `dir` in App) has laid out first.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const strip = stripRef.current;
      const selected = strip?.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!strip || !selected) return;
      const stripBox = strip.getBoundingClientRect();
      const box = selected.getBoundingClientRect();
      strip.scrollLeft += box.left + box.width / 2 - (stripBox.left + stripBox.width / 2);
    });
    return () => cancelAnimationFrame(frame);
  }, [month, isArabic]);

  const inMonth = useMemo(() => getMonthList(month), [month]);
  const peakCount = inMonth.filter((p) => isPeak(p, month)).length;
  const recipesByProduce = useMemo(() => {
    const map = new Map<string, Recipe[]>();
    for (const p of PRODUCE) map.set(p.id, recipesUsing(p.id, recipes));
    return map;
  }, [recipes]);
  // Items with recipes first; getMonthList already puts peak first and sort is stable.
  const visible = useMemo(
    () =>
      getMonthList(month, category).sort(
        (a, b) => Number((recipesByProduce.get(b.id) ?? []).length > 0) - Number((recipesByProduce.get(a.id) ?? []).length > 0),
      ),
    [month, category, recipesByProduce],
  );
  const seasonalRecipeCount = useMemo(
    () => new Set(inMonth.flatMap((p) => (!isYearRound(p) ? (recipesByProduce.get(p.id) ?? []).map((r) => r.id) : []))).size,
    [inMonth, recipesByProduce],
  );

  const rangeText = (item: ProduceItem) =>
    isYearRound(item)
      ? isArabic ? 'طوال السنة' : 'All year'
      : seasonRanges(item.seasonMonths)
          .map(([a, b]) => (a === b ? monthNames[a - 1] : `${monthNames[a - 1]} – ${monthNames[b - 1]}`))
          .join(isArabic ? '، ' : ', ');

  const peakText = (item: ProduceItem) =>
    seasonRanges(item.peakMonths)
      .map(([a, b]) => (a === b ? monthNames[a - 1] : `${monthNames[a - 1]} – ${monthNames[b - 1]}`))
      .join(isArabic ? '، ' : ', ');

  const seasonLine = (item: ProduceItem) =>
    `${rangeText(item)}${isArabic ? '، عز الموسم ' : ', peak '}${peakText(item)}`;

  const chip =
    'min-h-11 rounded-xl px-3.5 text-xs font-bold transition-colors inline-flex items-center justify-center';
  const chipIdle =
    'border border-[#d9d9dd] bg-[#eeece7] text-[#212121] hover:border-[#ff7759] dark:border-[#2b3a54] dark:bg-[#071829] dark:text-stone-300';
  const chipActive = 'bg-[#17171c] text-white dark:bg-white dark:text-[#17171c]';

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-3xl border border-[#d9d9dd] bg-white p-4 shadow-xs dark:border-[#2b3a54] dark:bg-[#162032] sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#17171c] text-[#ff7759] dark:bg-white">
            <Leaf className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold text-[#17171c] dark:text-white">
              {isArabic ? 'في موسمه' : 'In Season'}
            </h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              {isArabic
                ? 'خضار وفاكهة مصر في موسمها. أضف أي صنف إلى قائمة التسوق.'
                : 'Egyptian produce in season. Add any item to your grocery list.'}
            </p>
          </div>
        </div>

        {/* Month strip */}
        <div>
          <p id="season-month-label" className="mb-1.5 text-xs font-bold tracking-wide text-stone-500 dark:text-stone-400">
            {isArabic ? 'اختر الشهر' : 'Choose a month'}
          </p>
          <div
            ref={stripRef}
            role="group"
            aria-labelledby="season-month-label"
            className="flex gap-1.5 overflow-x-auto px-4 pb-1 [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)] lg:grid lg:grid-cols-12 lg:overflow-visible lg:px-0 lg:[mask-image:none]"
          >
            {monthNames.map((name, index) => {
              const m = (index + 1) as SeasonMonth;
              const selected = m === month;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setMonth(m)}
                  className={`${chip} shrink-0 flex-col gap-0 px-3 lg:px-1 ${selected ? chipActive : chipIdle}`}
                >
                  <span>{name}</span>
                  {m === currentMonth && (
                    <span className="text-[10px] font-medium leading-none opacity-80">
                      {isArabic ? 'الآن' : 'Now'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category filter */}
        <div>
          <p id="season-category-label" className="mb-1.5 text-xs font-bold tracking-wide text-stone-500 dark:text-stone-400">
            {isArabic ? 'النوع' : 'Type'}
          </p>
          <div role="group" aria-labelledby="season-category-label" className="flex flex-wrap gap-1.5">
            {CATEGORY_IDS.map((id) => {
              const count = id === 'all' ? inMonth.length : inMonth.filter((p) => p.category === id).length;
              const selected = id === category;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setCategory(id)}
                  className={`${chip} gap-1.5 ${selected ? chipActive : chipIdle}`}
                >
                  <span>{PRODUCE_CATEGORY_LABELS[id][isArabic ? 'ar' : 'en']}</span>
                  <span className="font-mono opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d9d9dd] pt-3 dark:border-[#2b3a54]">
          <p role="status" className="text-xs text-stone-600 dark:text-stone-400">
            {isArabic
              ? `${inMonth.length} صنف في موسمه في ${monthNames[month - 1]}، منها ${peakCount} في عز موسمه`
              : `${inMonth.length} items in season in ${monthNames[month - 1]}, ${peakCount} at peak`}
          </p>
          {month === currentMonth && seasonalRecipeCount > 0 && (
            <button
              type="button"
              onClick={onOpenSeasonalRecipes}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#17171c] px-4 text-xs font-mono font-bold text-white hover:bg-[#212121] dark:bg-white dark:text-[#17171c]"
            >
              <Leaf className="h-4 w-4 text-[#ff7759]" aria-hidden="true" />
              <span>{isArabic ? 'وصفات هذا الشهر' : 'Recipes for this month'}</span>
            </button>
          )}
        </div>
      </section>

      {/* Produce cards */}
      {visible.length === 0 ? (
        <div className="rounded-3xl border border-[#d9d9dd] bg-white p-8 text-center dark:border-[#2b3a54] dark:bg-[#162032]">
          <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
            {isArabic ? 'لا توجد أصناف من هذا النوع في الشهر المختار.' : 'No items of this type in the chosen month.'}
          </p>
          <button type="button" onClick={() => setCategory('all')} className={`${chip} ${chipActive} mt-3`}>
            {isArabic ? 'عرض الكل' : 'Show all'}
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => {
            const peak = isPeak(item, month);
            const added = groceryExtraIds.includes(seasonGroceryId(item.id));
            const usedBy = recipesByProduce.get(item.id) ?? [];
            const isOpen = Boolean(expanded[item.id]);
            const shown = isOpen ? usedBy : usedBy.slice(0, RECIPES_SHOWN);
            const name = isArabic ? item.nameAr : item.nameEn;
            return (
              <li
                key={item.id}
                className="flex min-w-0 flex-col gap-3 rounded-3xl border border-[#d9d9dd] bg-white p-4 shadow-xs dark:border-[#2b3a54] dark:bg-[#162032]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-[#17171c] dark:text-white">
                      <bdi>{name}</bdi>
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {PRODUCE_CATEGORY_LABELS[item.category][isArabic ? 'ar' : 'en']}
                    </p>
                  </div>
                  {peak && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#ff7759]/60 px-2.5 py-1 text-xs font-bold text-[#8f2f14] dark:border-[#ff7759]/70 dark:text-[#ff9a82]">
                      <Flame className="h-3 w-3" aria-hidden="true" />
                      {isArabic ? 'في عز موسمه' : 'Peak season'}
                    </span>
                  )}
                </div>

                <dl className="space-y-1.5 text-sm text-stone-700 dark:text-stone-300">
                  <div className="flex flex-wrap gap-x-1.5">
                    <dt className="font-bold">{isArabic ? 'الموسم:' : 'Season:'}</dt>
                    <dd><bdi>{seasonLine(item)}</bdi></dd>
                  </div>
                  <div className="flex flex-wrap gap-x-1.5">
                    <dt className="font-bold">{isArabic ? 'يناسب:' : 'Cook with:'}</dt>
                    <dd><bdi>{isArabic ? item.cookHintAr : item.cookHintEn}</bdi></dd>
                  </div>
                </dl>

                <div className="border-t border-[#d9d9dd] pt-3 dark:border-[#2b3a54]">
                  {usedBy.length === 0 ? (
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {isArabic ? 'لا توجد وصفة تستخدمه بعد.' : 'No recipe uses this yet.'}
                    </p>
                  ) : (
                    <>
                      <p className="mb-1.5 text-xs font-bold text-stone-700 dark:text-stone-300">
                        {isArabic ? 'وصفات تستخدمه' : 'Recipes using this'}
                        <span className="font-mono text-stone-500 dark:text-stone-400"> ({usedBy.length})</span>
                      </p>
                      <ul className="flex flex-wrap gap-1.5">
                        {shown.map((recipe) => (
                          <li key={recipe.id} className="max-w-full">
                            <button
                              type="button"
                              onClick={() => onSelectRecipe(recipe)}
                              className="min-h-11 max-w-full truncate rounded-xl border border-[#d9d9dd] bg-[#eeece7] px-3 text-xs font-medium text-[#212121] hover:border-[#ff7759] dark:border-[#2b3a54] dark:bg-[#071829] dark:text-stone-200"
                            >
                              {isArabic ? recipe.titleAr : recipe.titleEn}
                            </button>
                          </li>
                        ))}
                      </ul>
                      {usedBy.length > RECIPES_SHOWN && (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setExpanded((prev) => ({ ...prev, [item.id]: !isOpen }))}
                          className="mt-1 inline-flex min-h-11 items-center gap-1 text-xs font-bold text-[#b9401f] hover:underline dark:text-[#ff7759]"
                        >
                          {isOpen ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
                          <span>
                            {isOpen
                              ? isArabic ? 'عرض أقل' : 'Show fewer'
                              : isArabic ? `عرض الكل (${usedBy.length})` : `Show all (${usedBy.length})`}
                          </span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                <button
                  type="button"
                  disabled={added}
                  onClick={() => onAddToGrocery(buildSeasonGroceryItem(item, isArabic))}
                  className={`mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-colors ${
                    added
                      ? 'cursor-default border border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100'
                      : 'bg-[#17171c] text-white hover:bg-[#212121] dark:bg-white dark:text-[#17171c]'
                  }`}
                >
                  {added ? <ShoppingBag className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4 text-[#ff7759]" aria-hidden="true" />}
                  <span>
                    {added
                      ? isArabic ? 'في قائمة التسوق' : 'In your grocery list'
                      : isArabic ? 'أضف إلى قائمة التسوق' : 'Add to grocery list'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Guide note and source */}
      <footer className="rounded-2xl border border-[#d9d9dd] bg-[#eeece7] p-4 text-xs text-stone-700 dark:border-[#2b3a54] dark:bg-[#162032] dark:text-stone-300">
        <p className="font-bold">{isArabic ? GUIDE_NOTE_AR : GUIDE_NOTE_EN}</p>
        <p className="mt-1 text-xs opacity-80">{isArabic ? SOURCE_NOTE_AR : SOURCE_NOTE_EN}</p>
      </footer>
    </div>
  );
};
