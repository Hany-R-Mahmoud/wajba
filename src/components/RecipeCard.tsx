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
    <div className="group bg-white dark:bg-[#162032] rounded-3xl border border-[#d9d9dd] dark:border-[#2b3a54] shadow-xs hover:border-[#17171c] dark:hover:border-[#ff7759] transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Top Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-[#eeece7] dark:bg-[#0c1220] cursor-pointer" onClick={() => onSelectRecipe(recipe)}>
        <img
          src={recipe.image}
          alt={isArabic ? recipe.titleAr : recipe.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Region Badge */}
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-black/60 text-white backdrop-blur-md shadow-xs border border-white/20">
          {isArabic ? regionInfo.ar : regionInfo.en}
        </span>

        {/* Favorite Star Button & Gallery Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe.id);
            }}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer"
            title={isArabic ? 'إضافة للمفضلة' : 'Favorite'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-[#ff7759] text-[#ff7759]' : 'text-stone-300'}`} />
          </button>

          {recipe.galleryImages && recipe.galleryImages.length > 1 && (
            <span
              className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono border border-white/20 shadow-xs"
              title={isArabic ? `كتالوج يحتوي على ${recipe.galleryImages.length} صور` : `${recipe.galleryImages.length} gallery images`}
            >
              🖼️ {recipe.galleryImages.length}
            </span>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-3 right-3 left-3 text-white">
          <h3 className="text-lg font-bold leading-snug line-clamp-1 drop-shadow-md">
            {isArabic ? recipe.titleAr : recipe.titleEn}
          </h3>
          <p className="text-xs text-stone-200/90 font-mono line-clamp-1">
            {isArabic ? recipe.titleEn : recipe.titleAr}
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* Description */}
        <p className="text-xs text-[#616161] dark:text-stone-300 line-clamp-2 leading-relaxed font-sans">
          {isArabic ? recipe.descriptionAr : recipe.descriptionEn}
        </p>

        {/* Info Pills (Time, Difficulty, Ramadan tag) */}
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#75758a] dark:text-stone-300 pt-2 border-t border-[#d9d9dd] dark:border-[#2b3a54]">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#ff7759]" />
            <span>{totalTime} {isArabic ? 'دقيقة' : 'min'}</span>
          </div>

          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#ff7759]" />
            <span>
              {recipe.difficulty === 'easy'
                ? isArabic ? 'سهل' : 'Easy'
                : recipe.difficulty === 'medium'
                ? isArabic ? 'متوسط' : 'Medium'
                : isArabic ? 'صعب' : 'Hard'}
            </span>
          </div>

          {recipe.isRamadanSpecial && (
            <span className="text-[#ff7759] font-bold bg-[#17171c] text-white px-2 py-0.5 rounded-full text-[10px] font-mono border border-white/10">
              🌙 {isArabic ? 'رمضاني' : 'Ramadan'}
            </span>
          )}
        </div>

        {/* Interactive Likes/Dislikes & Quick Add */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Voting Controls */}
          <div className="flex items-center gap-1 bg-[#eeece7] dark:bg-stone-800 p-1 rounded-full border border-[#d9d9dd] dark:border-stone-700">
            <button
              onClick={() => onVote(recipe.id, 'like')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                userVote === 'like'
                  ? 'bg-[#17171c] text-white shadow-xs'
                  : 'text-[#212121] dark:text-stone-300 hover:text-[#ff7759]'
              }`}
              title={isArabic ? 'أعجبني' : 'Like'}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{recipe.votesCount.likes}</span>
            </button>

            <button
              onClick={() => onVote(recipe.id, 'dislike')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                userVote === 'dislike'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-[#212121] dark:text-stone-300 hover:text-rose-700'
              }`}
              title={isArabic ? 'لم يعجبني' : 'Dislike'}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Add to Planner */}
          <button
            onClick={() => onQuickAddToPlanner(recipe)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#17171c] hover:bg-[#212121] dark:bg-white dark:text-[#17171c] text-white text-xs font-mono font-bold shadow-xs transition-all cursor-pointer"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-[#ff7759]" />
            <span>{isArabic ? 'للجدول' : '+ Plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
