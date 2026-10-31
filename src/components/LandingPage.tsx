import React, { useState } from 'react';
import { WorksWheel } from './ui/works-wheel';
import { INITIAL_RECIPES } from '../data/recipes';
import { Language } from '../types';
import {
  Moon,
  Globe,
  Sun,
} from 'lucide-react';
import { WajbaLogo } from './WajbaLogo';
import {PwaInstallMenuAction} from './PwaInstallMenuAction';

interface LandingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onEnterDashboard: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onLanguageChange,
  onEnterDashboard,
  theme,
  onThemeToggle,
}) => {
  const isArabic = language === 'ar';
  const [meals] = useState(() => {
    const shuffled = [...INITIAL_RECIPES];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 9);
  });
  const items = meals.map((meal) => ({
    title: isArabic ? meal.titleAr : meal.titleEn,
    image: meal.image,
    href: '/recipes/' + encodeURIComponent(meal.id),
  }));

  return (
    <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0c1220] text-[#18181b] dark:text-[#f8fafc] font-sans transition-colors flex flex-col justify-between selection:bg-[#ff7759] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#162032]/95 backdrop-blur-md border-b border-[#e2e0d8] dark:border-[#2b3a54] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-1 sm:gap-2">
            <WajbaLogo variant="navbar" isArabic={isArabic} onClick={onEnterDashboard} />

            <div className="flex items-center gap-1 sm:gap-2">
              <PwaInstallMenuAction language={language} dark={theme === 'dark'} />
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
        </div>
      </header>

      <main className="flex-1">
        <h1 className="sr-only">{isArabic ? 'وجبة — خطط لوجبات عائلتك' : 'Wajba — Plan your family meals'}</h1>
        <div dir="ltr" className="h-[calc(100svh-10rem)] min-h-[24rem]">
          <WorksWheel items={items} label={isArabic ? 'وجبة' : 'Wajba'} action={isArabic ? 'الوصفة' : 'View recipe'} />
        </div>
        <div className="relative flex flex-col items-center gap-3 px-4 pb-6 text-center">
          <p className="text-xs text-stone-600 dark:text-stone-300">{isArabic ? 'وصفات عربية، وخطة أسبوعية، وقائمة تسوق.' : 'MENA recipes, a weekly plan, and your grocery list.'}</p>
          <button type="button" onClick={onEnterDashboard} className="rounded-full bg-[#17171c] px-6 py-2.5 text-sm text-white dark:bg-white dark:text-[#17171c] focus-visible:outline-2 focus-visible:outline-offset-4">
            {isArabic ? 'ابدأ التخطيط الآن' : 'Start Meal Planning'}
          </button>
        </div>
      </main>
    </div>
  );
};
export default LandingPage;
