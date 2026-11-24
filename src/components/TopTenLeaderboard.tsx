import React from 'react';
import { Language, Recipe } from '../types';
import { Trophy, ThumbsUp, ThumbsDown, Star, Flame, Eye } from 'lucide-react';
import { REGION_BADGES } from './RecipeCard';

interface TopTenLeaderboardProps {
  recipes: Recipe[];
  language: Language;
  userVotes: { [recipeId: string]: 'like' | 'dislike' };
  onVote: (id: string, type: 'like' | 'dislike') => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const TopTenLeaderboard: React.FC<TopTenLeaderboardProps> = ({
  recipes,
  language,
  userVotes,
  onVote,
  onSelectRecipe,
}) => {
  const isArabic = language === 'ar';

  // Sort recipes by score = likes - dislikes + rating * 20
  const sortedTop10 = [...recipes]
    .sort((a, b) => {
      const scoreA = a.votesCount.likes - a.votesCount.dislikes + a.rating * 20;
      const scoreB = b.votesCount.likes - b.votesCount.dislikes + b.rating * 20;
      return scoreB - scoreA;
    })
    .slice(0, 10);

  const getRankBadge = (index: number) => {
    if (index === 0) return { icon: '🏆', bg: 'bg-coral text-stone-950 font-black', text: '#1' };
    if (index === 1) return { icon: '🥈', bg: 'bg-stone-300 text-stone-900 font-bold', text: '#2' };
    if (index === 2) return { icon: '🥉', bg: 'bg-ink dark:bg-white text-white dark:text-ink font-bold', text: '#3' };
    return { icon: '', bg: 'bg-stone-100 dark:bg-night-soft text-stone-700 dark:text-stone-300 font-bold', text: `#${index + 1}` };
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-ink dark:bg-night-line text-white p-6 rounded-3xl shadow-xl flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral/20 text-coral-deep dark:text-coral text-xs font-bold border border-coral/30">
            <Trophy className="w-4 h-4 text-coral-deep dark:text-coral" />
            <span>{isArabic ? 'قائمة الشرف والمحبة العائلية' : 'Top 10 Authentic Leaderboard'}</span>
          </div>
          <h1 className="text-2xl font-black">
            {isArabic ? 'أفضل ١٠ وجبات في المطبخ العربي والمصري' : 'Top 10 Most Beloved Dishes'}
          </h1>
          <p className="text-xs text-stone-100/90 max-w-lg">
            {isArabic
              ? 'ترتيب أفضل الأكلات الشعبية بناءً على تصويت المستخدمين وتقييم العائلات العربية.'
              : 'Rankings updated dynamically based on authentic recipe popularity & votes.'}
          </p>
        </div>
        <div className="text-5xl hidden sm:block">👑</div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {sortedTop10.map((recipe, idx) => {
          const rank = getRankBadge(idx);
          const regionInfo = REGION_BADGES[recipe.region] || REGION_BADGES.general;
          const userVote = userVotes[recipe.id];

          return (
            <div
              key={recipe.id}
              className={`group bg-white dark:bg-night-card p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                idx === 0
                  ? 'border-coral/80 shadow-md ring-2 ring-coral/30 dark:ring-coral/30'
                  : 'border-hairline dark:border-night-line hover:border-coral'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                {/* Rank Badge */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm ${rank.bg} flex-shrink-0 shadow-xs`}>
                  {rank.icon || rank.text}
                </div>

                {/* Recipe Thumbnail */}
                <img
                  src={recipe.image}
                  alt={isArabic ? recipe.titleAr : recipe.titleEn}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/recipe-placeholder.svg';
                  }}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover cursor-pointer flex-shrink-0 group-hover:scale-105 transition-transform"
                  onClick={() => onSelectRecipe(recipe)}
                />

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${regionInfo.bg}`}>
                      {isArabic ? regionInfo.ar : regionInfo.en}
                    </span>
                    <span className="text-[11px] font-bold text-coral-deep dark:text-coral flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-coral text-coral-deep dark:text-coral" />
                      {recipe.rating}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectRecipe(recipe)}
                    className="text-base font-extrabold text-stone-900 dark:text-stone-100 hover:text-coral-deep dark:hover:text-coral cursor-pointer line-clamp-1"
                  >
                    {isArabic ? recipe.titleAr : recipe.titleEn}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-1">
                    {isArabic ? recipe.descriptionAr : recipe.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Voting & View Action */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-night-line">
                <div className="flex items-center gap-1.5 bg-soft dark:bg-night-soft p-1 rounded-xl border border-hairline dark:border-night-line">
                  <button
                    onClick={() => onVote(recipe.id, 'like')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      userVote === 'like'
                        ? 'bg-ink dark:bg-white text-white'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-emerald-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{recipe.votesCount.likes}</span>
                  </button>

                  <button
                    onClick={() => onVote(recipe.id, 'dislike')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      userVote === 'dislike'
                        ? 'bg-rose-600 text-white'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-rose-100'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onSelectRecipe(recipe)}
                  className="px-3 py-1.5 rounded-xl bg-ink dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-ink text-xs font-bold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'عرض' : 'View'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
