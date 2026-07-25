import React from 'react';
import { ActiveTimer, Language } from '../types';
import { BookOpen, CalendarDays, ShoppingBag, Trophy, Users, Moon, Sun, Globe, Utensils, Timer, Warehouse, Settings } from 'lucide-react';
import { WajbaLogo } from './WajbaLogo';

interface NavbarProps {
  currentTab: 'recipes' | 'planner' | 'grocery' | 'pantry' | 'leaderboard' | 'family' | 'settings';
  onTabChange: (tab: 'recipes' | 'planner' | 'grocery' | 'pantry' | 'leaderboard' | 'family' | 'settings') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  activeTimers: ActiveTimer[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  activeTimers,
}) => {
  const isArabic = language === 'ar';

  const navItems = [
    {
      id: 'recipes' as const,
      labelAr: 'وصفات الطعام',
      labelEn: 'Recipes',
      icon: BookOpen,
    },
    {
      id: 'planner' as const,
      labelAr: 'جدول الوجبات',
      labelEn: 'Weekly Plan',
      icon: CalendarDays,
    },
    {
      id: 'grocery' as const,
      labelAr: 'قائمة التسوق',
      labelEn: 'Grocery List',
      icon: ShoppingBag,
    },
    {
      id: 'pantry' as const,
      labelAr: 'مخزن المنزل',
      labelEn: 'Pantry',
      icon: Warehouse,
    },
    {
      id: 'leaderboard' as const,
      labelAr: 'أفضل ١٠ وجبات',
      labelEn: 'Top 10 Meals',
      icon: Trophy,
    },
    {
      id: 'family' as const,
      labelAr: 'المشاركة العائلية',
      labelEn: 'Family Sync',
      icon: Users,
    },
    {
      id: 'settings' as const,
      labelAr: 'الإعدادات',
      labelEn: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#162032]/95 backdrop-blur-md border-b border-[#e2e0d8] dark:border-[#2b3a54] transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-1 sm:gap-2">
          {/* Brand Logo & Name */}
          <WajbaLogo variant="navbar" isArabic={isArabic} onClick={() => onTabChange('recipes')} />

          {/* Center Navigation Tabs for Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#f0eee8] dark:bg-[#0c1220] p-1.5 rounded-full border border-[#e2e0d8] dark:border-[#2b3a54]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#17171c] text-white shadow-xs dark:bg-white dark:text-[#17171c]'
                      : 'text-[#17171c] dark:text-stone-300 hover:text-[#ff7759] dark:hover:text-[#ff7759]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isArabic ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Active Timers Badge if any */}
            {activeTimers.length > 0 && (
              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ff7759] text-white text-xs font-mono font-bold animate-pulse cursor-pointer shadow-xs"
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{activeTimers.length}</span>
              </div>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(isArabic ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eeece7] dark:bg-stone-800 text-[#17171c] dark:text-stone-200 text-xs font-mono hover:border-[#17171c] transition-colors border border-[#d9d9dd] dark:border-stone-700 cursor-pointer"
              title={isArabic ? 'Switch to English' : 'التحويل للغة العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#ff7759]" />
              <span>{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-full bg-[#eeece7] dark:bg-stone-800 text-[#17171c] dark:text-stone-200 hover:border-[#17171c] transition-colors border border-[#d9d9dd] dark:border-stone-700 cursor-pointer"
              title={isArabic ? 'تغيير المظهر' : 'Toggle Theme'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-[#17171c]" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-start py-2 border-t border-[#d9d9dd] dark:border-stone-800 overflow-x-auto no-scrollbar gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-mono whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-white bg-[#17171c] dark:bg-white dark:text-[#17171c] font-bold'
                    : 'text-[#616161] dark:text-stone-400 hover:text-[#17171c] dark:hover:text-stone-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{isArabic ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
