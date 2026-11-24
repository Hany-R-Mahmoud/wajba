import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  Leaf,
  MoreHorizontal,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Trophy,
  Users,
  Warehouse,
} from 'lucide-react';
import { Language } from '../types';
import { FEATURE_FLAGS } from '../config/features';

export type NavigationTab =
  | 'recipes'
  | 'planner'
  | 'grocery'
  | 'seasons'
  | 'pantry'
  | 'leaderboard'
  | 'family'
  | 'settings';

interface MobileBottomNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  language: Language;
}

const primaryItems = [
  { id: 'planner' as const, labelAr: 'الجدول', labelEn: 'Plan', icon: CalendarDays },
  { id: 'recipes' as const, labelAr: 'الوصفات', labelEn: 'Recipes', icon: BookOpen },
  { id: 'grocery' as const, labelAr: 'التسوق', labelEn: 'Grocery', icon: ShoppingBag },
  { id: 'seasons' as const, labelAr: 'في موسمه', labelEn: 'In Season', icon: Leaf },
];

const secondaryItems = [
  { id: 'pantry' as const, labelAr: 'المخزن', labelEn: 'Pantry', icon: Warehouse },
  ...(FEATURE_FLAGS.leaderboard
    ? [{ id: 'leaderboard' as const, labelAr: 'أفضل الوجبات', labelEn: 'Top 10 Meals', icon: Trophy }]
    : []),
  { id: 'family' as const, labelAr: 'العائلة', labelEn: 'Family', icon: Users },
  { id: 'settings' as const, labelAr: 'الإعدادات', labelEn: 'Settings', icon: Settings },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  language,
}) => {
  const isArabic = language === 'ar';
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const isSecondaryActive = secondaryItems.some((item) => item.id === currentTab);

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMoreOpen(false);
    };

    document.addEventListener('pointerdown', handleOutsidePointer);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleTabChange = (tab: NavigationTab) => {
    onTabChange(tab);
    setIsMoreOpen(false);
  };

  return (
    <nav
      ref={navRef}
      aria-label={isArabic ? 'التنقل الرئيسي' : 'Primary navigation'}
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-line bg-white/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(23,23,28,0.08)] backdrop-blur-md dark:border-night-line dark:bg-night-card/95"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {isMoreOpen && (
        <div
          className={`absolute bottom-full mb-2 w-[min(18rem,calc(100vw-1rem))] rounded-2xl border border-line bg-white p-2 shadow-xl dark:border-night-line dark:bg-night-card ${
            isArabic ? 'right-2' : 'left-2'
          }`}
          role="menu"
          aria-label={isArabic ? 'المزيد من الوجهات' : 'More destinations'}
        >
          <div className="mb-1 flex items-center gap-2 px-3 py-2 text-xs font-bold text-stone-500 dark:text-stone-400">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>{isArabic ? 'المزيد' : 'More'}</span>
          </div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleTabChange(item.id)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-xs font-mono font-medium transition-colors ${
                  isActive
                    ? 'bg-ink text-white dark:bg-white dark:text-ink'
                    : 'text-ink hover:bg-[#f0eee8] hover:text-coral-deep dark:hover:text-coral dark:text-stone-300 dark:hover:bg-night'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{isArabic ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => handleTabChange(item.id)}
              className={`flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-mono font-medium transition-colors ${
                isActive
                  ? 'bg-ink text-white shadow-xs dark:bg-white dark:text-ink'
                  : 'text-[#616161] hover:bg-[#f0eee8] hover:text-coral-deep dark:hover:text-coral dark:text-stone-400 dark:hover:bg-night dark:hover:text-stone-200'
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="max-w-full truncate">{isArabic ? item.labelAr : item.labelEn}</span>
            </button>
          );
        })}

        <button
          type="button"
          aria-expanded={isMoreOpen}
          aria-haspopup="menu"
          aria-current={isSecondaryActive ? 'page' : undefined}
          onClick={() => setIsMoreOpen((open) => !open)}
          className={`flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1 text-[10px] font-mono font-medium transition-colors ${
            isSecondaryActive || isMoreOpen
              ? 'bg-ink text-white shadow-xs dark:bg-white dark:text-ink'
              : 'text-[#616161] hover:bg-[#f0eee8] hover:text-coral-deep dark:hover:text-coral dark:text-stone-400 dark:hover:bg-night dark:hover:text-stone-200'
          }`}
        >
          {isMoreOpen ? <ChevronDown className="h-[18px] w-[18px]" aria-hidden="true" /> : <MoreHorizontal className="h-[18px] w-[18px]" aria-hidden="true" />}
          <span>{isArabic ? 'المزيد' : 'More'}</span>
        </button>
      </div>
    </nav>
  );
};
