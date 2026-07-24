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
  onOpenLanding?: () => void;
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
  onOpenLanding,
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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#162032]/95 backdrop-blur-md border-b border-[#e2e0d8] dark:border-[#2b3a54] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onTabChange('recipes')}>
            <div className="w-10 h-10 rounded-xl bg-[#f8f6f0] border border-[#e2e0d8] dark:border-[#384966] flex items-center justify-center overflow-hidden p-1 shadow-sm group-hover:scale-105 transition-transform">
              <img src="/favicon.svg" alt="Wajba Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#17171c] dark:text-white font-mono flex items-center gap-1.5">
                  WAJBA <span className="text-[#D86540] font-bold text-xs uppercase tracking-widest bg-[#D86540]/10 px-1.5 py-0.5 rounded">وجبة</span>
                </span>
              </div>
              <p className="text-[10px] font-mono text-stone-500 dark:text-stone-300 hidden sm:block">
                {isArabic ? 'جدول الوجبات وقائمة التسوق الذكية' : 'Middle Eastern Culinary Architecture'}
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-[#f0eee8] dark:bg-[#0c1220] p-1.5 rounded-full border border-[#e2e0d8] dark:border-[#2b3a54]">
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
          <div className="flex items-center gap-2">
            {/* Landing Guide Button */}
            {onOpenLanding && (
              <button
                onClick={onOpenLanding}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f0eee8] dark:bg-[#0c1220] text-[#17171c] dark:text-stone-200 text-xs font-mono border border-[#e2e0d8] dark:border-[#2b3a54] hover:border-[#ff7759] transition-all cursor-pointer"
                title={isArabic ? 'عرض صفحة البداية والتعريف' : 'View Landing Guide'}
              >
                <span>{isArabic ? 'الرئيسية 🏠' : 'Landing 🏠'}</span>
              </button>
            )}

            {/* Ramadan Mode Toggle Badge */}
            <button
              onClick={onToggleRamadanMode}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono border transition-all cursor-pointer ${
                isRamadanMode
                  ? 'bg-[#17171c] text-white border-[#17171c] dark:bg-white dark:text-[#17171c]'
                  : 'bg-[#f0eee8] dark:bg-[#0c1220] text-[#17171c] dark:text-stone-300 border-[#e2e0d8] dark:border-[#2b3a54] hover:border-[#17171c]'
              }`}
              title={isArabic ? 'تبديل وضع شهر رمضان المبارك' : 'Toggle Ramadan Planning Mode'}
            >
              <Moon className={`w-3.5 h-3.5 ${isRamadanMode ? 'text-[#ff7759] fill-[#ff7759]' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">
                {isRamadanMode
                  ? isArabic
                    ? 'رمضان 🌙'
                    : 'Ramadan Mode 🌙'
                  : isArabic
                  ? 'عادي'
                  : 'Standard'}
              </span>
            </button>

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
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#d9d9dd] dark:border-stone-800 overflow-x-auto no-scrollbar gap-1">
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
