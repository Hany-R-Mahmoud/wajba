import React from 'react';
import { ActiveTimer, Language } from '../types';
import { BookOpen, CalendarDays, ShoppingBag, Trophy, Users, Moon, Sun, Globe, Utensils, Timer } from 'lucide-react';

interface NavbarProps {
  currentTab: 'recipes' | 'planner' | 'grocery' | 'leaderboard' | 'family';
  onTabChange: (tab: 'recipes' | 'planner' | 'grocery' | 'leaderboard' | 'family') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  isRamadanMode: boolean;
  onToggleRamadanMode: () => void;
  activeTimers: ActiveTimer[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  isRamadanMode,
  onToggleRamadanMode,
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
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-amber-50/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-amber-200/60 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('recipes')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-700/20">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-amber-950 dark:text-amber-100 tracking-tight">
                  وجبة <span className="text-amber-700 dark:text-amber-400 font-bold text-base">Wajba</span>
                </span>
              </div>
              <p className="text-[10px] font-semibold text-amber-800/70 dark:text-stone-400 hidden sm:block">
                {isArabic ? 'جدول الوجبات وقائمة التسوق الذكية' : 'MENA Meal Planner & Grocery Checklist'}
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-amber-100/60 dark:bg-stone-800/70 p-1.5 rounded-2xl border border-amber-200/50 dark:border-stone-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-700 text-white shadow-md shadow-amber-800/20 dark:bg-amber-600'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-amber-200/50 dark:hover:bg-stone-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{isArabic ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Ramadan Mode Toggle Badge */}
            <button
              onClick={onToggleRamadanMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isRamadanMode
                  ? 'bg-amber-900 text-amber-100 border-amber-600 shadow-sm shadow-amber-900/30 dark:bg-amber-950 dark:text-amber-200'
                  : 'bg-amber-100/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-amber-200 dark:border-stone-700 hover:bg-amber-200/60'
              }`}
              title={isArabic ? 'تبديل وضع شهر رمضان المبارك' : 'Toggle Ramadan Planning Mode'}
            >
              <Moon className={`w-3.5 h-3.5 ${isRamadanMode ? 'text-amber-400 fill-amber-400' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">
                {isRamadanMode
                  ? isArabic
                    ? 'وضع رمضان 🌙'
                    : 'Ramadan Mode 🌙'
                  : isArabic
                  ? 'وضع عادي'
                  : 'Standard'}
              </span>
            </button>

            {/* Active Timers Badge if any */}
            {activeTimers.length > 0 && (
              <div
                onClick={() => {
                  /* timer bar is persistent at bottom */
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold animate-pulse cursor-pointer shadow-sm"
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{activeTimers.length}</span>
              </div>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(isArabic ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-100/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold hover:bg-amber-200/80 dark:hover:bg-stone-700 transition-colors border border-amber-200/60 dark:border-stone-700"
              title={isArabic ? 'Switch to English' : 'التحويل للغة العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-xl bg-amber-100/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-amber-200/80 dark:hover:bg-stone-700 transition-colors border border-amber-200/60 dark:border-stone-700"
              title={isArabic ? 'تغيير المظهر' : 'Toggle Theme'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-amber-800" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-amber-200/40 dark:border-stone-800 overflow-x-auto no-scrollbar gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-amber-800 dark:text-amber-400 font-bold bg-amber-200/60 dark:bg-stone-800'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
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
