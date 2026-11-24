import React, { useState, useRef, useEffect } from 'react';
import { ActiveTimer, Language } from '../types';
import {
  BookOpen,
  CalendarDays,
  Leaf,
  ShoppingBag,
  Trophy,
  Users,
  Moon,
  Sun,
  Globe,
  Timer,
  Warehouse,
  Settings,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import { WajbaLogo } from './WajbaLogo';
import {PwaInstallMenuAction} from './PwaInstallMenuAction';
import { NavigationTab } from './MobileBottomNav';
import { AccountEntry } from './AccountEntry';
import { FEATURE_FLAGS } from '../config/features';

interface NavbarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  activeTimers: ActiveTimer[];
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  activeTimers,
  onOpenAccount,
}) => {
  const isArabic = language === 'ar';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavItems = [
    {
      id: 'planner' as const,
      labelAr: 'الجدول',
      labelEn: 'Plan',
      icon: CalendarDays,
    },
    {
      id: 'recipes' as const,
      labelAr: 'الوصفات',
      labelEn: 'Recipes',
      icon: BookOpen,
    },
    {
      id: 'grocery' as const,
      labelAr: 'التسوق',
      labelEn: 'Grocery',
      icon: ShoppingBag,
    },
    {
      id: 'seasons' as const,
      labelAr: 'في موسمه',
      labelEn: 'In Season',
      icon: Leaf,
    },
  ];

  const secondaryNavItems = [
    {
      id: 'pantry' as const,
      labelAr: 'المخزن',
      labelEn: 'Pantry',
      icon: Warehouse,
    },
    ...(FEATURE_FLAGS.leaderboard
      ? [
          {
            id: 'leaderboard' as const,
            labelAr: 'أفضل ١٠ وجبات',
            labelEn: 'Top 10 Meals',
            icon: Trophy,
          },
        ]
      : []),
    {
      id: 'family' as const,
      labelAr: 'العائلة',
      labelEn: 'Family',
      icon: Users,
    },
    {
      id: 'settings' as const,
      labelAr: 'الإعدادات',
      labelEn: 'Settings',
      icon: Settings,
    },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === currentTab);
  const activeSecondaryItem = secondaryNavItems.find((item) => item.id === currentTab);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-night-card/95 backdrop-blur-md border-b border-line dark:border-night-line transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-1 sm:gap-2">
          {/* Brand Logo & Name */}
          <WajbaLogo variant="navbar" isArabic={isArabic} onClick={() => onTabChange('planner')} />

          {/* Compact Center Navigation Tabs for Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#f0eee8]/90 dark:bg-night/90 p-1 rounded-full border border-line dark:border-night-line">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-ink text-white shadow-xs dark:bg-white dark:text-ink'
                      : 'text-ink dark:text-stone-300 hover:text-coral dark:hover:text-coral'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{isArabic ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}

            {/* Secondary Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSecondaryActive
                    ? 'bg-ink text-white shadow-xs dark:bg-white dark:text-ink'
                    : 'text-ink dark:text-stone-300 hover:text-coral dark:hover:text-coral'
                }`}
              >
                {isSecondaryActive && activeSecondaryItem ? (
                  <>
                    <activeSecondaryItem.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{isArabic ? activeSecondaryItem.labelAr : activeSecondaryItem.labelEn}</span>
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                    <span>{isArabic ? 'المزيد' : 'More'}</span>
                  </>
                )}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className={`absolute top-full mt-2 w-48 bg-white dark:bg-night-card border border-line dark:border-night-line rounded-2xl shadow-xl p-1.5 z-50 transition-all ${
                    isArabic ? 'left-0' : 'right-0'
                  }`}
                >
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-ink text-white dark:bg-white dark:text-ink'
                            : 'text-ink dark:text-stone-300 hover:bg-[#f0eee8] dark:hover:bg-night hover:text-coral'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{isArabic ? item.labelAr : item.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Active Timers Badge if any */}
            {activeTimers.length > 0 && (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-coral text-white text-xs font-mono font-bold animate-pulse cursor-pointer shadow-xs">
                <Timer className="w-3.5 h-3.5" />
                <span>{activeTimers.length}</span>
              </div>
            )}

            <PwaInstallMenuAction language={language} dark={theme === 'dark'} />

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(isArabic ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-soft dark:bg-stone-800 text-ink dark:text-stone-200 text-xs font-mono hover:border-ink transition-colors border border-hairline dark:border-stone-700 cursor-pointer"
              title={isArabic ? 'Switch to English' : 'التحويل للغة العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-coral" />
              <span>{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-full bg-soft dark:bg-stone-800 text-ink dark:text-stone-200 hover:border-ink transition-colors border border-hairline dark:border-stone-700 cursor-pointer"
              title={isArabic ? 'تغيير المظهر' : 'Toggle Theme'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-ink" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <AccountEntry language={language} onOpen={onOpenAccount} />
          </div>
        </div>

      </div>
    </header>
  );
};
