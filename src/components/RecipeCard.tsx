import React from 'react';
import { Language, Recipe } from '../types';
import { Clock, ThumbsUp, ThumbsDown, Star, CalendarPlus, Flame } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  language: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  userVote?: 'like' | 'dislike';
  onVote: (id: string, type: 'like' | 'dislike') => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onQuickAddToPlanner: (recipe: Recipe) => void;
}

export const REGION_BADGES: { [key in Recipe['region']]: { ar: string; en: string; flag: string; bg: string } } = {
  egypt: { ar: 'مصر 🇪🇬', en: 'Egypt 🇪🇬', flag: '🇪🇬', bg: 'bg-red-900/10 text-red-900 dark:text-red-300 border-red-200' },
  levant: { ar: 'بلاد الشام 🇱🇧', en: 'Levant 🇱🇧', flag: '🇱🇧', bg: 'bg-emerald-900/10 text-emerald-900 dark:text-emerald-300 border-emerald-200' },
  gulf: { ar: 'الخليج العربي 🇸🇦', en: 'Arab Gulf 🇸🇦', flag: '🇸🇦', bg: 'bg-amber-900/10 text-amber-900 dark:text-amber-300 border-amber-200' },
  maghreb: { ar: 'المغرب العربي 🇲🇦', en: 'Maghreb 🇲🇦', flag: '🇲🇦', bg: 'bg-rose-900/10 text-rose-900 dark:text-rose-300 border-rose-200' },
  general: { ar: 'عربي عام 🌍', en: 'Arab World 🌍', flag: '🌍', bg: 'bg-stone-900/10 text-stone-800 dark:text-stone-300 border-stone-200' },
};

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  language,
  isFavorite,
  onToggleFavorite,
  userVote,
  onVote,
  onSelectRecipe,
  onQuickAddToPlanner,
}) => {
  const isArabic = language === 'ar';
  const regionInfo = REGION_BADGES[recipe.region] || REGION_BADGES.general;

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div className="group bg-white dark:bg-stone-900 rounded-2xl border border-amber-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Top Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-amber-100 dark:bg-stone-800 cursor-pointer" onClick={() => onSelectRecipe(recipe)}>
        <img
          src={recipe.image}
          alt={isArabic ? recipe.titleAr : recipe.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Region Badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-sm ${regionInfo.bg}`}>
          {isArabic ? regionInfo.ar : regionInfo.en}
        </span>

        {/* Favorite Star Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          className="absolute top-3 left-3 p-2 rounded-full bg-stone-900/40 hover:bg-stone-900/70 backdrop-blur-md text-white transition-colors"
          title={isArabic ? 'إضافة للمفضلة' : 'Favorite'}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
        </button>

        {/* Title Overlay */}
        <div className="absolute bottom-3 right-3 left-3 text-white">
          <h3 className="text-lg font-bold leading-snug line-clamp-1 drop-shadow-md">
            {isArabic ? recipe.titleAr : recipe.titleEn}
          </h3>
          <p className="text-xs text-amber-200/90 font-medium line-clamp-1">
            {isArabic ? recipe.titleEn : recipe.titleAr}
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* Description */}
        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
          {isArabic ? recipe.descriptionAr : recipe.descriptionEn}
        </p>

        {/* Info Pills (Time, Difficulty, Ramadan tag) */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500 dark:text-stone-400 font-semibold pt-1 border-t border-amber-100 dark:border-stone-800">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>{totalTime} {isArabic ? 'دقيقة' : 'min'}</span>
          </div>

          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {recipe.difficulty === 'easy'
                ? isArabic ? 'سهل' : 'Easy'
                : recipe.difficulty === 'medium'
                ? isArabic ? 'متوسط' : 'Medium'
                : isArabic ? 'صعب' : 'Hard'}
            </span>
          </div>

          {recipe.isRamadanSpecial && (
            <span className="text-amber-800 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-md text-[10px]">
              🌙 {isArabic ? 'رمضاني' : 'Ramadan'}
            </span>
          )}
        </div>

        {/* Interactive Likes/Dislikes & Quick Add */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {/* Voting Controls */}
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-stone-800/80 p-1 rounded-xl border border-amber-200/60 dark:border-stone-700">
            <button
              onClick={() => onVote(recipe.id, 'like')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                userVote === 'like'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-stone-700'
              }`}
              title={isArabic ? 'أعجبني' : 'Like'}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{recipe.votesCount.likes}</span>
            </button>

            <button
              onClick={() => onVote(recipe.id, 'dislike')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                userVote === 'dislike'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-rose-100 dark:hover:bg-stone-700'
              }`}
              title={isArabic ? 'لم يعجبني' : 'Dislike'}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Add to Planner */}
          <button
            onClick={() => onQuickAddToPlanner(recipe)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>{isArabic ? 'للجدول' : '+ Plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
