import React from 'react';
import { Language, Recipe } from '../types';
import { Clock, ThumbsUp, ThumbsDown, Star, BookOpen, Flame } from 'lucide-react';
import { DIETARY_LABELS } from '../utils/recipes';

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
  levant: { ar: 'بلاد الشام 🇱🇧', en: 'Levant 🇱🇧', flag: '🇱🇧', bg: 'bg-night-soft/10 text-ink dark:text-stone-200 border-hairline' },
  gulf: { ar: 'الخليج العربي 🇸🇦', en: 'Arab Gulf 🇸🇦', flag: '🇸🇦', bg: 'bg-ink/10 text-ink dark:text-coral border-hairline' },
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
    <div className="group bg-white dark:bg-night-card rounded-3xl border border-hairline dark:border-night-line shadow-xs hover:border-ink dark:hover:border-coral transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Top Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-soft dark:bg-night cursor-pointer" onClick={() => onSelectRecipe(recipe)}>
        <img
          src={recipe.image}
          alt={isArabic ? recipe.titleAr : recipe.titleEn}
          onError={(e) => {
              (e.target as HTMLImageElement).src = '/recipe-placeholder.svg';
          }}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Region Badge */}
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/70 text-white backdrop-blur-md shadow-xs border border-white/20">
          {isArabic ? regionInfo.ar : regionInfo.en}
        </span>

        {/* Favorite Star Button */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe.id);
            }}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-colors cursor-pointer"
            title={isArabic ? 'إضافة للمفضلة' : 'Favorite'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-coral text-coral' : 'text-stone-300'}`} />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-3 right-3 left-3 text-white">
          <h3 className="text-xl font-extrabold leading-snug line-clamp-1 drop-shadow-md">
            <a
              href={`/recipes/${encodeURIComponent(recipe.id)}`}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex min-h-11 items-center hover:underline"
            >
              {isArabic ? recipe.titleAr : recipe.titleEn}
            </a>
          </h3>
          <p lang={isArabic ? 'en' : 'ar'} className="text-sm font-medium text-stone-200/90 font-mono line-clamp-1">
            {isArabic ? recipe.titleEn : recipe.titleAr}
          </p>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* Description */}
        <p className="text-sm sm:text-base text-[#424242] dark:text-stone-200 line-clamp-2 leading-relaxed font-sans font-normal">
          {isArabic ? recipe.descriptionAr : recipe.descriptionEn}
        </p>

        {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5" aria-label={isArabic ? 'الوسوم الغذائية' : 'Dietary tags'}>
            {recipe.dietaryTags.map((tag) => <span key={tag} className="rounded-full bg-soft px-2.5 py-1 text-xs font-bold text-ink dark:bg-night-soft dark:text-stone-200">{isArabic ? DIETARY_LABELS[tag].ar : DIETARY_LABELS[tag].en}</span>)}
          </div>
        )}

        {/* Info Pills (Time, Difficulty, Ramadan tag) */}
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-mono font-medium text-[#616161] dark:text-stone-300 pt-2 border-t border-hairline dark:border-night-line">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-coral-deep dark:text-coral" />
            <span>{totalTime} {isArabic ? 'دقيقة' : 'min'}</span>
          </div>

          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-coral-deep dark:text-coral" />
            <span>
              {recipe.difficulty === 'easy'
                ? isArabic ? 'سهل' : 'Easy'
                : recipe.difficulty === 'medium'
                ? isArabic ? 'متوسط' : 'Medium'
                : isArabic ? 'صعب' : 'Hard'}
            </span>
          </div>

          {recipe.isRamadanSpecial && (
            <span className="text-coral font-bold bg-ink px-2.5 py-0.5 rounded-full text-xs font-mono border border-white/10">
              🌙 {isArabic ? 'رمضاني' : 'Ramadan'}
            </span>
          )}
        </div>

        {/* Interactive Likes/Dislikes & Quick Add */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Voting Controls */}
          <div className="flex items-center gap-1 bg-soft dark:bg-night-soft p-1 rounded-full border border-hairline dark:border-night-line">
            <button
              onClick={() => onVote(recipe.id, 'like')}
              className={`flex min-h-11 min-w-11 items-center justify-center gap-1 px-3 rounded-full text-xs sm:text-sm font-mono font-bold transition-colors cursor-pointer ${
                userVote === 'like'
                  ? 'bg-ink text-white shadow-xs'
                  : 'text-body dark:text-stone-300 hover:text-coral-deep dark:hover:text-coral'
              }`}
              title={isArabic ? 'أعجبني' : 'Like'}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{recipe.votesCount.likes}</span>
            </button>

            <button
              onClick={() => onVote(recipe.id, 'dislike')}
              className={`flex min-h-11 min-w-11 items-center justify-center gap-1 px-3 rounded-full text-xs sm:text-sm font-mono font-bold transition-colors cursor-pointer ${
                userVote === 'dislike'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-body dark:text-stone-300 hover:text-rose-700'
              }`}
              title={isArabic ? 'لم يعجبني' : 'Dislike'}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Add to Planner */}
          <button
            onClick={() => onQuickAddToPlanner(recipe)}
            className="flex min-h-11 items-center gap-1.5 px-4 rounded-full bg-ink hover:bg-body dark:bg-white dark:text-ink text-white text-xs sm:text-sm font-mono font-bold shadow-xs transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-coral dark:text-coral-deep" />
            <span>{isArabic ? 'التفاصيل' : 'Details'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
