import React, { useState, useMemo } from 'react';
import { DIETARY_TAGS, DietaryTag, Language, Recipe, Region } from '../types';
import { DIETARY_LABELS, filterRecipesByDietaryTag } from '../utils/recipes';
import { RecipeCard } from './RecipeCard';
import { Search, Plus, Sparkles, Filter, Bookmark, RotateCcw } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#17171c] dark:bg-[#162032] text-white p-6 sm:p-8 shadow-xs border border-stone-800 dark:border-[#2b3a54]">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#ff7759]" />
            <span>{isArabic ? 'مكتبة المطبخ العربي والمصري الاصيل' : 'Authentic MENA Culinary Treasury'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
            {isArabic ? 'استكشف أشهى الأطباق واصنع جدولك العائلي' : 'Explore Authentic Dishes & Plan Your Feast'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-200/90 leading-relaxed font-sans">
            {isArabic
              ? 'مجموعة وصفات تراثية موثوقة من المكرونة البشاميل والفتة إلى الكبسة والحلويات الرمضانية مع مؤقتات طهي تفاعلية وقائمة تسوق ذكية.'
              : 'Discover heritage recipes from Egyptian Macarona Béchamel to Levantine Mansaf & Ramadan Sweets with interactive cooking timers.'}
          </p>
        </div>
      </div>

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
              className="w-full py-2.5 px-10 rounded-full bg-[#eeece7] dark:bg-stone-800 border border-[#d9d9dd] dark:border-stone-700 text-xs font-mono focus:outline-none focus:border-[#17171c]"
            />
          </div>

          <button
            onClick={onOpenCreateRecipeModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#17171c] hover:bg-[#212121] dark:bg-white dark:text-[#17171c] text-white text-xs font-mono font-bold transition-all flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#ff7759]" />
            <span>{isArabic ? 'إضافة وصفة خاصة' : 'Add Custom Recipe'}</span>
          </button>
        </div>

        {/* Primary Type Filter (Meals vs Sweets & Desserts) */}
        <div className="pt-3 border-t border-[#d9d9dd] dark:border-stone-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-mono text-[#75758a] me-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{isArabic ? 'نوع الطبق:' : 'Category:'}</span>
            </span>

            {[
              { id: 'all', ar: 'الكل 🍽️', en: 'All 🍽️' },
              { id: 'meals', ar: 'وجبات رئيسية 🥘', en: 'Meals 🥘' },
              { id: 'sweets', ar: 'حلويات وسكاكر 🥐', en: 'Sweets & Desserts 🥐' },
              { id: 'ramadan', ar: 'رمضانيات 🌙', en: 'Ramadan 🌙' },
              { id: 'easy', ar: 'سهل وسريع ⚡', en: 'Quick & Easy ⚡' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#17171c] text-white shadow-xs dark:bg-white dark:text-[#17171c]'
                    : 'bg-[#eeece7] dark:bg-stone-800 text-[#212121] dark:text-stone-300 hover:border-[#17171c] border border-[#d9d9dd]'
                }`}
              >
                {isArabic ? cat.ar : cat.en}
              </button>
            ))}
          </div>
        </div>

        {/* Region & Favorites Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#d9d9dd] dark:border-stone-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-mono text-[#75758a] me-1">
              {isArabic ? 'المنطقة:' : 'Region:'}
            </span>

            {[
              { id: 'all', ar: 'الكل 🌍', en: 'All 🌍' },
              { id: 'egypt', ar: 'مصر 🇪🇬', en: 'Egypt 🇪🇬' },
              { id: 'levant', ar: 'الشام 🇱🇧', en: 'Levant 🇱🇧' },
              { id: 'gulf', ar: 'الخليج 🇸🇦', en: 'Gulf 🇸🇦' },
              { id: 'maghreb', ar: 'المغرب 🇲🇦', en: 'Maghreb 🇲🇦' },
              { id: 'general', ar: 'عام 🇸🇦', en: 'General 🇸🇦' },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id as Region | 'all')}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedRegion === reg.id
                    ? 'bg-[#17171c] text-white shadow-xs dark:bg-white dark:text-[#17171c]'
                    : 'bg-[#eeece7] dark:bg-stone-800 text-[#212121] dark:text-stone-300 border border-[#d9d9dd] dark:border-stone-700'
                }`}
              >
                {isArabic ? reg.ar : reg.en}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                onlyFavorites
                  ? 'bg-[#ff7759] text-white'
                  : 'bg-[#eeece7] dark:bg-stone-800 text-[#212121] dark:text-stone-300 border border-[#d9d9dd] dark:border-stone-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : ''}`} />
              <span>{isArabic ? 'المفضلة' : 'Favorites'}</span>
            </button>
          </div>
        </div>

        {/* Dietary Filter Bar */}
        <div className="border-t border-[#d9d9dd] pt-3 dark:border-stone-800">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-mono text-[#75758a]">
            <span>{isArabic ? 'الخصائص الغذائية:' : 'Dietary Options:'}</span>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-[#ff7759] hover:underline cursor-pointer font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isArabic ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              aria-pressed={selectedDietaryTag === 'all'}
              onClick={() => setSelectedDietaryTag('all')}
              className={`rounded-full px-3 py-1 text-xs font-mono transition-all cursor-pointer ${
                selectedDietaryTag === 'all'
                  ? 'bg-[#17171c] text-white dark:bg-white dark:text-[#17171c]'
                  : 'bg-[#eeece7] dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              {isArabic ? 'الكل' : 'All'}
            </button>
            {DIETARY_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                aria-pressed={selectedDietaryTag === tag}
                onClick={() => setSelectedDietaryTag(tag)}
                className={`rounded-full px-3 py-1 text-xs font-mono transition-all cursor-pointer ${
                  selectedDietaryTag === tag
                    ? 'bg-[#ff7759] text-white font-bold'
                    : 'bg-[#eeece7] dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                {isArabic ? DIETARY_LABELS[tag].ar : DIETARY_LABELS[tag].en}
              </button>
            ))}
          </div>
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
            className="text-[#ff7759] hover:underline cursor-pointer"
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

