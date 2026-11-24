import React from 'react';
import { Language } from '../types';
import {
  Utensils,
  BookOpen,
  CalendarDays,
  ShoppingBag,
  Moon,
  Trophy,
  CheckCircle2,
  Sparkles,
  Flame,
  Clock,
  Share2,
  Globe,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { DishOrbitCarousel } from './ui/dish-orbit-carousel';
import { LandingActions } from './LandingActions';
import { INITIAL_RECIPES } from '../data/recipes';
import { WajbaLogo } from './WajbaLogo';
import {PwaInstallMenuAction} from './PwaInstallMenuAction';
import StandaloneVisitorCounter from './StandaloneVisitorCounter';
import { FEATURE_FLAGS } from '../config/features';

const LANDING_RECIPES = ['egypt-koshary', 'egypt-macarona-beamel', 'egypt-molokhia', 'egypt-mahshi-meshkel', 'egypt-fatteh']
  .flatMap(id => INITIAL_RECIPES.filter(recipe => recipe.id === id));

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

  return (
    <div className="min-h-screen bg-paper dark:bg-night text-[#18181b] dark:text-[#f8fafc] font-sans transition-colors flex flex-col justify-between selection:bg-coral-deep selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-night-card/95 backdrop-blur-md border-b border-line dark:border-night-line transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-1 sm:gap-2">
            <WajbaLogo variant="navbar" isArabic={isArabic} onClick={onEnterDashboard} />

            <div className="flex items-center gap-1 sm:gap-2">
              <PwaInstallMenuAction language={language} dark={theme === 'dark'} />
              {/* Language Switcher */}
              <button
                onClick={() => onLanguageChange(isArabic ? 'en' : 'ar')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-soft dark:bg-night-soft text-ink dark:text-stone-200 text-xs font-mono hover:border-ink transition-colors border border-hairline dark:border-night-line cursor-pointer"
                title={isArabic ? 'Switch to English' : 'التحويل للغة العربية'}
              >
                <Globe className="w-3.5 h-3.5 text-coral-deep dark:text-coral" />
                <span>{isArabic ? 'EN' : 'عربي'}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-full bg-soft dark:bg-night-soft text-ink dark:text-stone-200 hover:border-ink transition-colors border border-hairline dark:border-night-line cursor-pointer"
                title={isArabic ? 'تغيير المظهر' : 'Toggle theme'}
              >
                {theme === 'light' ? <Moon className="w-4 h-4 text-ink" /> : <Sun className="w-4 h-4 text-coral" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN HERO & SCROLLABLE FEATURE SECTIONS */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-12 space-y-10 sm:space-y-14">

        {/* HERO SECTION WITH 3D CAROUSEL FIRST & TEXT CONTENT BELOW */}
        <DishOrbitCarousel recipes={LANDING_RECIPES} language={language} onEnterDashboard={onEnterDashboard} />

        {/* SECTION 1: Authentic MENA Heritage Recipe Treasury */}
        <section id="wajba-features" className="bg-white dark:bg-night-card rounded-3xl p-6 sm:p-10 lg:p-14 border border-line dark:border-night-line shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink dark:bg-white text-white dark:text-ink text-xs font-mono font-bold">
                <BookOpen className="w-3.5 h-3.5 text-coral dark:text-coral-deep" />
                <span>{isArabic ? 'الوصفات' : 'Recipes'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-mono text-ink dark:text-white leading-tight">
                {isArabic
                  ? 'وصفات من مصر والشام والخليج والمغرب'
                  : 'Recipes from Egypt, the Levant, the Gulf and the Maghreb'}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {isArabic
                  ? 'قصة لكل وصفة، وصور، ومؤقت طبخ.'
                  : 'A story, photos and a cooking timer with each recipe.'}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-paper dark:bg-night-soft border border-line dark:border-night-line flex items-center gap-2">
                  <Flame className="w-4 h-4 text-coral-deep dark:text-coral" />
                  <span className="font-bold">{isArabic ? 'مؤقتات الطبخ' : 'Cooking timers'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-paper dark:bg-night-soft border border-line dark:border-night-line flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-coral-deep dark:text-coral" />
                  <span className="font-bold">{isArabic ? 'أفضل ١٠ وصفات للعائلة' : 'Family top 10'}</span>
                </div>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-paper dark:bg-night-soft rounded-2xl p-6 border border-line dark:border-night-line shadow-xl space-y-4">
                <div className="relative h-56 rounded-xl overflow-hidden bg-stone-900">
                  <img
                    src="/recipe-images/wajba-egypt-macarona-beamel.webp"
                    alt="Macarona Bechamel"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/recipe-placeholder.svg";
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-ink text-white text-[10px] font-mono px-3 py-1 rounded-full border border-white/20">
                    {isArabic ? 'مصر 🇪🇬 • مكرونة بشاميل' : 'Egypt 🇪🇬 • Macarona Béchamel'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="font-bold text-ink dark:text-white">
                    {isArabic ? 'المكرونة البشاميل المصرية باللحم المفروم' : 'Egyptian Macarona Béchamel'}
                  </span>
                  <span className="text-coral-deep dark:text-coral font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 70 {isArabic ? 'دقيقة' : 'mins'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-night-card text-[11px] font-mono text-stone-600 dark:text-stone-300 flex items-center justify-between border border-line dark:border-night-line">
                  <span>{isArabic ? 'مؤقت طبقة البشاميل الذهبية:' : 'Velvet Béchamel Crust Timer:'}</span>
                  <span className="px-2 py-0.5 rounded-md bg-coral-deep text-white font-bold">12:00 ⏱️</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Dedicated Ramadan Suhoor & Iftar Fasting Engine */}
        <section className="bg-white dark:bg-night-card text-ink dark:text-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-line dark:border-night-line shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Fasting Widget */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-paper dark:bg-night-soft rounded-2xl p-6 border border-line dark:border-night-line shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-line dark:border-night-line pb-3">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-coral-deep dark:text-coral fill-coral" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink dark:text-white">
                      {isArabic ? 'رمضان' : 'RAMADAN'}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-coral-deep text-[10px] font-mono text-white font-bold">
                    {isArabic ? 'وضع رمضان' : 'Ramadan mode'}
                  </span>
                </div>

                <div className="text-center py-4 bg-white dark:bg-night-card rounded-xl border border-line dark:border-night-line">
                  <span className="text-[10px] font-mono text-stone-500 dark:text-stone-300 block mb-1">
                    {isArabic ? 'الوقت المتبقي على أذان المغرب (الإفطار)' : 'Time left until iftar'}
                  </span>
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-coral-deep dark:text-coral tracking-widest">
                    04 : 28 : 15
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-night-card border border-line dark:border-night-line">
                    <span>{isArabic ? '🌙 وجبة السحور:' : '🌙 Suhoor Meal:'}</span>
                    <span className="text-coral-deep dark:text-coral font-bold">{isArabic ? 'فول مدمس وزبادي' : 'Foul & Yogurt'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-night-card border border-line dark:border-night-line">
                    <span>{isArabic ? '🕌 وجبة الإفطار الرئيسية:' : '🕌 Iftar Main Meal:'}</span>
                    <span className="text-ink dark:text-white font-bold">{isArabic ? 'كبسة دجاج وقمر دين' : 'Chicken Kabsa'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink dark:bg-white text-white dark:text-ink text-xs font-mono font-bold">
                <Moon className="w-3.5 h-3.5 text-coral dark:text-coral-deep" />
                <span>{isArabic ? 'رمضان' : 'Ramadan'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-mono text-ink dark:text-white leading-tight">
                {isArabic
                  ? 'سحور وإفطار في رمضان'
                  : 'Suhoor and iftar in Ramadan'}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {isArabic
                  ? 'خانات للسحور والإفطار، وعدّاد لوقت المغرب.'
                  : 'Meal slots for suhoor and iftar, plus an iftar countdown.'}
              </p>

            </div>
          </div>
        </section>

        {/* SECTION 3: Interactive Weekly & Monthly Planner with Serving Scaler */}
        <section className="bg-white dark:bg-night-card rounded-3xl p-6 sm:p-10 lg:p-14 border border-line dark:border-night-line shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink dark:bg-white text-white dark:text-ink text-xs font-mono font-bold">
                <CalendarDays className="w-3.5 h-3.5 text-coral dark:text-coral-deep" />
                <span>{isArabic ? 'الجدول' : 'Plan'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-mono text-ink dark:text-white leading-tight">
                {isArabic
                  ? 'خطة أسبوع أو شهر'
                  : 'A week or a month planned'}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {isArabic
                  ? 'اختر عدد الأفراد وتُضبط الكميات.'
                  : 'Set family size and quantities adjust.'}
              </p>

              <div className="space-y-2 pt-2 text-xs font-mono text-ink dark:text-stone-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-coral-deep dark:text-coral" />
                  <span>{isArabic ? 'عرض الأسبوع (٧ أيام)' : 'Week view (7 days)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-coral-deep dark:text-coral" />
                  <span>{isArabic ? 'عرض الشهر (٣٠ يوماً)' : 'Month view (30 days)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-coral-deep dark:text-coral" />
                  <span>{isArabic ? 'الكميات تتغير مع عدد الأفراد' : 'Quantities follow family size'}</span>
                </div>
              </div>
            </div>

            {/* Calendar Preview Mockup */}
            <div className="lg:col-span-5">
              <div className="bg-paper dark:bg-night-soft rounded-2xl p-6 border border-line dark:border-night-line shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-line dark:border-night-line text-xs">
                  <span className="font-bold text-ink dark:text-white">
                    {isArabic ? 'جدول الأسبوع (الجمعة - الخميس)' : 'Weekly plan (Fri - Thu)'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-ink dark:bg-white text-coral dark:text-ink text-[11px] font-bold">
                    👥 6 {isArabic ? 'أفراد' : 'Servings'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-3 rounded-xl bg-white dark:bg-night-card text-center space-y-1 border border-line dark:border-night-line">
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 block">{isArabic ? 'الجمعة' : 'Friday'}</span>
                    <span className="font-bold text-ink dark:text-white block">{isArabic ? 'منسف لحم' : 'Lamb Mansaf'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-night-card text-center space-y-1 border border-line dark:border-night-line">
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 block">{isArabic ? 'السبت' : 'Saturday'}</span>
                    <span className="font-bold text-ink dark:text-white block">{isArabic ? 'مكرونة بشاميل' : 'Macarona Béchamel'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-night-card text-center space-y-1 border border-line dark:border-night-line">
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 block">{isArabic ? 'الأحد' : 'Sunday'}</span>
                    <span className="font-bold text-ink dark:text-white block">{isArabic ? 'كبسة دجاج' : 'Kabsa'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Smart Grocery Aggregator & WhatsApp Sharing */}
        <section className="bg-white dark:bg-night-card text-ink dark:text-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-line dark:border-night-line shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Grocery Checklist Mockup */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-paper dark:bg-night-soft text-ink dark:text-white rounded-2xl p-6 border border-line dark:border-night-line shadow-xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-line dark:border-night-line pb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-coral-deep dark:text-coral" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      {isArabic ? 'قائمة التسوق' : 'GROCERY LIST'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-ink text-coral font-bold text-[10px]">
                    {isArabic ? 'تجميع تلقائي' : 'Auto-grouped'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 font-bold block mb-1">🥦 {isArabic ? 'ممر الخضروات والأعشاب:' : 'Produce Aisle:'}</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="accent-coral" />
                        <span className="line-through text-stone-400">{isArabic ? 'بصل أحمر (٢ كجم)' : 'Red Onions (2 kg)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="accent-coral" />
                        <span>{isArabic ? 'ثوم وطماطم طازجة' : 'Garlic & Fresh Tomatoes'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 font-bold block mb-1">🥩 {isArabic ? 'ممر اللحوم والدواجن:' : 'Meat & Poultry Aisle:'}</span>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="accent-coral" />
                      <span>{isArabic ? 'لحم ضأن للكتف (١.٥ كجم)' : 'Lamb Shoulder (1.5 kg)'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-300 border-t border-line dark:border-night-line">
                  <span>{isArabic ? 'مشاركة بنقرة واحدة:' : 'Share in one tap:'}</span>
                  <span className="text-ink dark:text-white font-bold flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-coral-deep dark:text-coral" /> {isArabic ? 'واتساب' : 'WhatsApp'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ink dark:bg-white text-white dark:text-ink text-xs font-mono font-bold">
                <ShoppingBag className="w-3.5 h-3.5 text-coral dark:text-coral-deep" />
                <span>{isArabic ? 'قائمة التسوق' : 'Grocery list'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-mono text-ink dark:text-white leading-tight">
                {isArabic
                  ? 'قائمة تسوق جاهزة'
                  : 'A ready grocery list'}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {isArabic
                  ? 'نجمّع المكونات حسب الأقسام، وتقدر تبعتها واتساب أو تطبعها.'
                  : 'Ingredients grouped by aisle. Send to WhatsApp or print.'}
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-ink dark:text-white">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-coral-deep dark:text-coral" />
                  {isArabic ? 'نسخة احتياطية JSON/CSV' : 'JSON and CSV backup'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-coral-deep dark:text-coral" />
                  {isArabic ? 'إرسال عبر واتساب' : 'Send to WhatsApp'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION BANNER */}
        <section className="landing-final rounded-3xl bg-ink dark:bg-night-card text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden border border-stone-800 dark:border-night-line">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10 font-mono">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              {isArabic ? 'ابدأ خطة الأسبوع' : 'Plan your week'}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-stone-300 leading-relaxed max-w-xl mx-auto">
              {isArabic
                ? 'اختر وصفاتك، وخذ قائمة التسوق جاهزة. مجاناً.'
                : 'Pick your recipes and get the grocery list ready. Free.'}
            </p>

            <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
              <LandingActions language={language} onEnterDashboard={onEnterDashboard} />
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#f0eee8] dark:bg-night-card border-t border-line dark:border-night-line py-6 px-4 text-center text-[11px] font-mono text-stone-600 dark:text-stone-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f8f6f0] border border-line dark:border-night-line flex items-center justify-center p-1">
              <img src="/wajba-logo.png" alt="شعار وجبة Wajba" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-ink dark:text-white font-mono">WAJBA</span>
          </div>
          <a href="/seasons" className="underline hover:text-coral-deep dark:hover:text-coral">{isArabic ? 'دليل المواسم: ماذا في موسمه في مصر' : 'Seasonal produce guide'}</a>
          <a href="/privacy.html" className="inline-flex min-h-11 items-center underline hover:text-coral-deep dark:hover:text-coral">{isArabic ? 'سياسة الخصوصية' : 'Privacy policy'}</a>
          <p>
            {isArabic
              ? '© 2026 وجبة'
              : '© 2026 Wajba'}
          </p>
        </div>
        {FEATURE_FLAGS.visitorCounter && <StandaloneVisitorCounter />}
      </footer>
    </div>
  );
};

export default LandingPage;
