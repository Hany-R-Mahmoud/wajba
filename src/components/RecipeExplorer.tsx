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
      {/* Hero Welcome Banner - Cohere Dark Style */}
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
              ? 'مجموعة وصفات تراثية موثوقة من المكرونة البشاميل والفتة إلى الكبسة والمنسف الشامي مع مؤقتات طهي تفاعلية وقائمة تسوق ذكية.'
              : 'Discover heritage recipes from Egyptian Macarona Béchamel to Levantine Mansaf & Gulf Kabsa with interactive cooking timers.'}
          </p>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white dark:bg-[#162032] p-4 sm:p-5 rounded-3xl border border-[#d9d9dd] dark:border-[#2b3a54] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-3.5 ltr:left-3.5 ltr:right-auto w-4 h-4 text-[#75758a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? 'ابحث باسم الوصفة، المكونات (بشاميل، ثوم، لحم)...'
                  : 'Search by recipe name or ingredient...'
              }
              className="w-full py-2.5 px-10 rounded-full bg-[#eeece7] dark:bg-stone-800 border border-[#d9d9dd] dark:border-stone-700 text-xs font-mono focus:outline-none focus:border-[#17171c]"
            />
          </div>

          {/* Add Custom Recipe Button */}
          <button
            onClick={onOpenCreateRecipeModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#17171c] hover:bg-[#212121] dark:bg-white dark:text-[#17171c] text-white text-xs font-mono font-bold transition-all flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#ff7759]" />
            <span>{isArabic ? 'إضافة وصفة خاصة' : 'Add Custom Recipe'}</span>
          </button>
        </div>

        {/* Region & Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#d9d9dd] dark:border-stone-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-mono text-[#75758a] me-1 hidden sm:inline">
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
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedRegion === reg.id
                    ? 'bg-[#17171c] text-white shadow-xs dark:bg-white dark:text-[#17171c]'
                    : 'bg-[#eeece7] dark:bg-stone-800 text-[#212121] dark:text-stone-300 hover:border-[#17171c] border border-[#d9d9dd]'
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
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
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
              ? 'جرب البحث عن كلمات أخرى مثل بشاميل، ملوخية، أرز، أو قم بإلغاء الفلاتر.'
              : 'Try searching for terms like Béchamel, Molokhia, or reset your filters.'}
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
