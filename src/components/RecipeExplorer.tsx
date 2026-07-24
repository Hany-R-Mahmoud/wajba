import React, { useState, useMemo } from 'react';
import { Language, Recipe, Region } from '../types';
import { RecipeCard } from './RecipeCard';
import { Search, Plus, Sparkles, Filter, Star, Flame, Bookmark } from 'lucide-react';

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
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Favorites filter
      if (onlyFavorites && !favorites.includes(recipe.id)) return false;

      // Region filter
      if (selectedRegion !== 'all' && recipe.region !== selectedRegion) return false;

      // Tag filter
      if (selectedTag === 'ramadan' && !recipe.isRamadanSpecial) return false;
      if (selectedTag === 'easy' && recipe.difficulty !== 'easy') return false;

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
  }, [recipes, searchQuery, selectedRegion, selectedTag, onlyFavorites, favorites]);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isArabic ? 'مكتبة المطبخ العربي والمصري الاصيل' : 'Authentic MENA Culinary Treasury'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            {isArabic ? 'استكشف أشهى الأطباق واصنع جدولك العائلي' : 'Explore Authentic Dishes & Plan Your Feast'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            {isArabic
              ? 'مجموعة وصفات تراثية موثوقة من الكشري والفتة إلى الكبسة والمنسف الشامي مع مؤقتات طهي تفاعلية وقائمة تسوق ذكية.'
              : 'Discover heritage recipes from Egyptian Koshary to Levantine Mansaf & Gulf Kabsa with interactive cooking timers.'}
          </p>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-amber-200/80 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-3.5 ltr:left-3.5 ltr:right-auto w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'ابحث باسم الوصفة، المكونات (كشري، ثوم، لحم)...'
                  : 'Search by recipe name or ingredient...'
              }
              className="w-full py-2.5 px-10 rounded-xl bg-amber-50/50 dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
          </div>

          {/* Add Custom Recipe Button */}
          <button
            onClick={onOpenCreateRecipeModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? 'إضافة وصفة خاصة' : 'Add Custom Recipe'}</span>
          </button>
        </div>

        {/* Region & Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100 dark:border-stone-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-stone-500 me-1 hidden sm:inline">
              <Filter className="w-3.5 h-3.5 inline me-1" />
              {isArabic ? 'المنطقة:' : 'Region:'}
            </span>

            {[
              { id: 'all', ar: 'الكل 🌍', en: 'All 🌍' },
              { id: 'egypt', ar: 'مصر 🇪🇬', en: 'Egypt 🇪🇬' },
              { id: 'levant', ar: 'الشام 🇱🇧', en: 'Levant 🇱🇧' },
              { id: 'gulf', ar: 'الخليج 🇸🇦', en: 'Gulf 🇸🇦' },
            ].map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id as Region | 'all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedRegion === reg.id
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-amber-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100'
                }`}
              >
                {isArabic ? reg.ar : reg.en}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Favorites Toggle Button */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                onlyFavorites
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-amber-200 dark:border-stone-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : ''}`} />
              <span>{isArabic ? 'المفضلة' : 'Favorites'}</span>
            </button>
          </div>
        </div>
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
              ? 'جرب البحث عن كلمات أخرى مثل كشري، ملوخية، أرز، أو قم بإلغاء الفلاتر.'
              : 'Try searching for terms like Koshary, Molokhia, or reset your filters.'}
          </p>
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
