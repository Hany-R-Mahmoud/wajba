import React, { useState, useMemo } from 'react';
import { DIETARY_TAGS, DietaryTag, Language, Recipe, Region } from '../types';
import { DIETARY_LABELS, filterRecipesByDietaryTag } from '../utils/recipes';
import { RecipeCard } from './RecipeCard';
import { Search, Plus, Filter, Bookmark, RotateCcw, ChevronDown } from 'lucide-react';

interface RecipeExplorerProps {
  recipes: Recipe[];
  language: Language;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  userVotes: { [recipeId: string]: 'like' | 'dislike' };
  onVote: (id: string, type: 'like' | 'dislike') => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onQuickAddToPlanner: (recipe: Recipe) => void;
  onOpenCreateRecipeModal: () => void;
}

export const RecipeExplorer: React.FC<RecipeExplorerProps> = ({
  recipes,
  language,
  favorites,
  onToggleFavorite,
  userVotes,
  onVote,
  onSelectRecipe,
  onQuickAddToPlanner,
  onOpenCreateRecipeModal,
}) => {
  const isArabic = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'meals' | 'sweets' | 'ramadan' | 'easy'>('all');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>('all');
  const [selectedDietaryTag, setSelectedDietaryTag] = useState<DietaryTag | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filteredRecipes = useMemo(() => {
    return filterRecipesByDietaryTag(recipes, selectedDietaryTag).filter((recipe) => {
      // Favorites filter
      if (onlyFavorites && !favorites.includes(recipe.id)) return false;

      // Category filter (Meals vs Sweets / Desserts)
      if (selectedCategory === 'meals' && recipe.mealType.includes('dessert')) return false;
      if (selectedCategory === 'sweets' && !recipe.mealType.includes('dessert')) return false;
      if (selectedCategory === 'ramadan' && !recipe.isRamadanSpecial) return false;
      if (selectedCategory === 'easy' && recipe.difficulty !== 'easy') return false;

      // Region filter
      if (selectedRegion !== 'all' && recipe.region !== selectedRegion) return false;

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch =
          recipe.titleAr.toLowerCase().includes(q) || recipe.titleEn.toLowerCase().includes(q);
        const descMatch =
          recipe.descriptionAr.toLowerCase().includes(q) || recipe.descriptionEn.toLowerCase().includes(q);
        const ingMatch = recipe.ingredients.some(
          (i) => i.nameAr.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q)
        );
        const tagMatch = recipe.tags.some((t) => t.toLowerCase().includes(q));

        if (!titleMatch && !descMatch && !ingMatch && !tagMatch) return false;
      }

      return true;
    });
  }, [recipes, searchQuery, selectedCategory, selectedRegion, selectedDietaryTag, onlyFavorites, favorites]);

  const isFiltered =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'all' ||
    selectedRegion !== 'all' ||
    selectedDietaryTag !== 'all' ||
    onlyFavorites;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRegion('all');
    setSelectedDietaryTag('all');
    setOnlyFavorites(false);
  };

  const categoryOptions = [
    { id: 'all' as const, ar: 'كل الأطباق', en: 'All dishes' },
    { id: 'meals' as const, ar: 'وجبات رئيسية', en: 'Main meals' },
    { id: 'sweets' as const, ar: 'حلويات وسكاكر', en: 'Sweets & desserts' },
    { id: 'ramadan' as const, ar: 'رمضانيات', en: 'Ramadan' },
    { id: 'easy' as const, ar: 'سهل وسريع', en: 'Quick & easy' },
  ];

  const regionOptions = [
    { id: 'all' as const, ar: 'كل المناطق', en: 'All regions' },
    { id: 'egypt' as const, ar: 'مصر', en: 'Egypt' },
    { id: 'levant' as const, ar: 'الشام', en: 'Levant' },
    { id: 'gulf' as const, ar: 'الخليج', en: 'Gulf' },
    { id: 'maghreb' as const, ar: 'المغرب', en: 'Maghreb' },
    { id: 'general' as const, ar: 'عام', en: 'General' },
  ];

  const dietaryOptions = [
    { id: 'all' as const, ar: 'كل الخصائص', en: 'All dietary options' },
    ...DIETARY_TAGS.map((tag) => ({ id: tag, ar: DIETARY_LABELS[tag].ar, en: DIETARY_LABELS[tag].en })),
  ];

  const FilterSelect = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: Array<{ id: string; ar: string; en: string }>;
    onChange: (value: string) => void;
  }) => (
    <label className="relative block">
      <span className="mb-1.5 block text-xs font-bold tracking-wide text-stone-500 dark:text-stone-400">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-11 w-full appearance-none rounded-xl border border-[#d9d9dd] bg-[#eeece7] px-3 text-xs font-mono text-[#212121] transition-colors hover:border-[#ff7759] focus:border-[#ff7759] focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {isArabic ? option.ar : option.en}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 -translate-y-1/2 end-3 h-4 w-4 text-stone-500" aria-hidden="true" />
      </span>
    </label>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar & Comprehensive Filters */}
      <div className="bg-white dark:bg-[#162032] p-4 sm:p-5 rounded-3xl border border-[#d9d9dd] dark:border-[#2b3a54] shadow-xs space-y-4">
        {/* Search & Custom Recipe Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-3.5 ltr:left-3.5 ltr:right-auto w-4 h-4 text-[#75758a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'ابحث باسم الوصفة، المكونات (بشاميل، كنافة، لحم)...'
                  : 'Search by recipe name or ingredient...'
              }
              className="w-full py-2.5 px-10 rounded-full bg-[#eeece7] dark:bg-stone-800 border border-[#d9d9dd] dark:border-stone-700 text-sm font-mono focus:outline-none focus:border-[#17171c]"
            />
          </div>

          <button
            onClick={onOpenCreateRecipeModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#17171c] hover:bg-[#212121] dark:bg-white dark:text-[#17171c] text-white text-xs sm:text-sm font-mono font-bold transition-all flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#ff7759]" />
            <span>{isArabic ? 'إضافة وصفة خاصة' : 'Add Custom Recipe'}</span>
          </button>
        </div>

        {/* Compact filter controls */}
        <div className="border-t border-[#d9d9dd] pt-4 dark:border-stone-800">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-stone-400">
              <Filter className="h-4 w-4" aria-hidden="true" />
              <span>{isArabic ? 'تصفية الوصفات' : 'Filter recipes'}</span>
            </div>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-[#d86540] hover:underline"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                <span>{isArabic ? 'إعادة ضبط الفلاتر' : 'Reset filters'}</span>
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <FilterSelect
              label={isArabic ? 'نوع الطبق' : 'Category'}
              value={selectedCategory}
              options={categoryOptions}
              onChange={(value) => setSelectedCategory(value as typeof selectedCategory)}
            />
            <FilterSelect
              label={isArabic ? 'المنطقة' : 'Region'}
              value={selectedRegion}
              options={regionOptions}
              onChange={(value) => setSelectedRegion(value as Region | 'all')}
            />
            <FilterSelect
              label={isArabic ? 'الخصائص الغذائية' : 'Dietary options'}
              value={selectedDietaryTag}
              options={dietaryOptions}
              onChange={(value) => setSelectedDietaryTag(value as DietaryTag | 'all')}
            />
          </div>
          <button
            type="button"
            aria-pressed={onlyFavorites}
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl px-3.5 text-xs font-bold transition-colors ${
              onlyFavorites
                ? 'bg-[#ff7759] text-white'
                : 'border border-[#d9d9dd] bg-[#eeece7] text-[#212121] hover:border-[#ff7759] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${onlyFavorites ? 'fill-white' : ''}`} aria-hidden="true" />
            <span>{isArabic ? 'المفضلة فقط' : 'Favorites only'}</span>
          </button>
        </div>
      </div>

      {/* Results Header / Status */}
      <div className="flex items-center justify-between text-xs font-mono text-stone-600 dark:text-stone-400 px-1">
        <span>
          {isArabic
            ? `عرض ${filteredRecipes.length} من إجمالي ${recipes.length} وصفة`
            : `Showing ${filteredRecipes.length} of ${recipes.length} recipes`}
        </span>
        {isFiltered && (
          <button
            onClick={handleResetFilters}
            className="inline-flex min-h-11 items-center rounded-lg px-2.5 text-[#ff7759] hover:underline cursor-pointer"
          >
            {isArabic ? 'إلغاء البحث والفلاتر' : 'Clear search & filters'}
          </button>
        )}
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-amber-200/80 dark:border-stone-800 p-8 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
            {isArabic ? 'لم نجد وصفات تطابق بحثك' : 'No recipes matched your search'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {isArabic
              ? 'جرب البحث عن كلمات أخرى أو قم بإعادة ضبط الفلاتر لعرض جميع الأطباق.'
              : 'Try searching for other terms or reset your filters to view all recipes.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#17171c] dark:bg-white text-white dark:text-[#17171c] text-xs font-mono font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isArabic ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              language={language}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={onToggleFavorite}
              userVote={userVotes[recipe.id]}
              onVote={onVote}
              onSelectRecipe={onSelectRecipe}
              onQuickAddToPlanner={onQuickAddToPlanner}
            />
          ))}
        </div>
      )}
    </div>
  );
};
