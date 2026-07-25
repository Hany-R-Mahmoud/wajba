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
import ThreeDPhotoCarousel from './ui/3d-carousel';
import { WajbaLogo } from './WajbaLogo';

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
    <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0c1220] text-[#18181b] dark:text-[#f8fafc] font-sans transition-colors flex flex-col justify-between selection:bg-[#ff7759] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#162032]/95 backdrop-blur-md border-b border-[#e2e0d8] dark:border-[#2b3a54] px-3 sm:px-8 py-3.5 flex items-center justify-between gap-2">
        <WajbaLogo variant="navbar" isArabic={isArabic} onClick={onEnterDashboard} />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(isArabic ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#f0eee8] dark:bg-[#0c1220] text-[#17171c] dark:text-stone-200 text-xs font-mono border border-[#e2e0d8] dark:border-[#2b3a54] hover:border-[#ff7759] transition-colors cursor-pointer"
            title={isArabic ? 'Switch to English' : 'التحويل للغة العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#ff7759]" />
            <span>{isArabic ? 'EN' : 'عربي'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-full bg-[#f0eee8] dark:bg-[#0c1220] text-[#17171c] dark:text-stone-200 border border-[#e2e0d8] dark:border-[#2b3a54] hover:border-[#ff7759] transition-colors cursor-pointer"
            title={isArabic ? 'تغيير المظهر' : 'Toggle Theme'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-[#17171c]" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* MAIN HERO & SCROLLABLE FEATURE SECTIONS */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-12 space-y-10 sm:space-y-14">

        {/* HERO SECTION WITH 3D CAROUSEL FIRST & TEXT CONTENT BELOW */}
        <section className="flex flex-col justify-between space-y-3 py-0">
          {/* 3D Photo Carousel Container */}
          <div className="w-full">
            <ThreeDPhotoCarousel
              language={language}
              onSelectDish={() => onEnterDashboard()}
            />
          </div>

          {/* Headline & Action Controls Below Carousel */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 pt-1 sm:pt-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17171c] dark:text-white leading-snug">
              {isArabic ? (
                <>
                  خطط لوجبات عائلتك <span className="text-[#D86540]">بلمسة تراثية أصيلة</span>
                </>
              ) : (
                <>
                  Middle Eastern Culinary Planning <span className="text-[#D86540]">Crafted with Precision</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed max-w-xl mx-auto">
              {isArabic
                ? 'استكشف أشهر الأطباق العربية والرمضانية، نظم جدولك الأسبوعي، وأنشئ قائمة تسوق مجمّعة تلقائياً مقسمة حسب أقسام السوبرماركت.'
                : 'Discover traditional MENA dishes, create custom weekly meal calendars, and aggregate your grocery items into organized store aisle checklists.'}
            </p>

            <div className="pt-1 flex items-center justify-center gap-2.5 flex-wrap">
              <button
                onClick={onEnterDashboard}
                className="py-2.5 px-6 rounded-full bg-[#17171c] hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#17171c] font-mono font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>{isArabic ? 'ابدأ التخطيط الآن ➔' : 'Start Meal Planning ➔'}</span>
              </button>

            </div>
          </div>
        </section>

        {/* SECTION 1: Authentic MENA Heritage Recipe Treasury */}
        <section className="bg-white dark:bg-[#162032] rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#e2e0d8] dark:border-[#2b3a54] shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17171c] dark:bg-white text-white dark:text-[#17171c] text-xs font-mono font-bold">
                <BookOpen className="w-3.5 h-3.5 text-[#ff7759]" />
                <span>{isArabic ? 'الميزة ١: مكتبة الوصفات الأصيلة' : 'Feature 1: Heritage Recipe Treasury'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-mono text-[#17171c] dark:text-white leading-tight">
                {isArabic
                  ? 'وصفات موثوقة من مصر والشام والخليج والمغرب العربي'
                  : 'Authentic Regional MENA Recipes & Image Catalogs'}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {isArabic
                  ? 'استمتع بوصفات تقليدية موثوقة مثل المكرونة البشاميل المصرية، المنسف الشامي، الكبسة الملكية، والفتة المصرية. تحتوي كل وصفة على قصص تراثية، وكتالوج صور متعدد، ومؤقتات طهي تفاعلية تتيح لك تشغيل التنبيهات أثناء إعداد الطعام.'
                  : 'Enjoy rich heritage recipes with multi-photo image catalogs, step-by-step cooking timers, cultural background stories, and family voting systems.'}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-[#f8f7f4] dark:bg-[#212e47] border border-[#e2e0d8] dark:border-[#384966] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ff7759]" />
                  <span className="font-bold">{isArabic ? 'مؤقتات طهي صوتية' : 'Cooking Timers'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#f8f7f4] dark:bg-[#212e47] border border-[#e2e0d8] dark:border-[#384966] flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#ff7759]" />
                  <span className="font-bold">{isArabic ? 'تصويت العائلة TOP 10' : 'Family Top 10'}</span>
                </div>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="lg:col-span-6">
              <div className="bg-[#f8f7f4] dark:bg-[#212e47] rounded-2xl p-5 border border-[#e2e0d8] dark:border-[#384966] shadow-xl space-y-4">
                <div className="relative h-56 rounded-xl overflow-hidden bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800"
                    alt="Macarona Bechamel"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/recipe-placeholder.svg";
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#17171c] text-white text-[10px] font-mono px-3 py-1 rounded-full border border-white/20">
                    {isArabic ? 'مصر 🇪🇬 • مكرونة بشاميل' : 'Egypt 🇪🇬 • Macarona Béchamel'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="font-bold text-[#17171c] dark:text-white">
                    {isArabic ? 'المكرونة البشاميل المصرية باللحم المفروم' : 'Egyptian Macarona Béchamel'}
                  </span>
                  <span className="text-[#ff7759] font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 70 {isArabic ? 'دقيقة' : 'mins'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#162032] text-[11px] font-mono text-stone-600 dark:text-stone-300 flex items-center justify-between border border-[#e2e0d8] dark:border-[#2b3a54]">
                  <span>{isArabic ? 'مؤقت طبقة البشاميل الذهبية:' : 'Velvet Béchamel Crust Timer:'}</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#ff7759] text-white font-bold">12:00 ⏱️</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Dedicated Ramadan Suhoor & Iftar Fasting Engine */}
        <section className="bg-white dark:bg-[#162032] text-[#17171c] dark:text-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#e2e0d8] dark:border-[#2b3a54] shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Fasting Widget */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-[#f8f7f4] dark:bg-[#212e47] rounded-2xl p-6 border border-[#e2e0d8] dark:border-[#384966] shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#e2e0d8] dark:border-[#384966] pb-3">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-[#ff7759] fill-[#ff7759]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#17171c] dark:text-white">
                      {isArabic ? 'حاسبة الصيام الرمضانية' : 'RAMADAN FASTING ENGINE'}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ff7759] text-[10px] font-mono text-white font-bold">
                    Active Mode
                  </span>
                </div>

                <div className="text-center py-4 bg-white dark:bg-[#162032] rounded-xl border border-[#e2e0d8] dark:border-[#2b3a54]">
                  <span className="text-[10px] font-mono text-stone-500 dark:text-stone-300 block mb-1">
                    {isArabic ? 'الوقت المتبقي حتى أذان المغرب (الإفطار)' : 'Countdown to Iftar Fast-Breaking'}
                  </span>
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-[#ff7759] tracking-widest">
                    04 : 28 : 15
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#162032] border border-[#e2e0d8] dark:border-[#2b3a54]">
                    <span>{isArabic ? '🌙 وجبة السحور:' : '🌙 Suhoor Meal:'}</span>
                    <span className="text-[#ff7759] font-bold">{isArabic ? 'فول مدمس وزبادي' : 'Foul & Yogurt'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#162032] border border-[#e2e0d8] dark:border-[#2b3a54]">
                    <span>{isArabic ? '🕌 وجبة الإفطار الرئيسية:' : '🕌 Iftar Main Meal:'}</span>
                    <span className="text-[#17171c] dark:text-white font-bold">{isArabic ? 'كبسة دجاج وقمر دين' : 'Chicken Kabsa'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17171c] dark:bg-white text-white dark:text-[#17171c] text-xs font-mono font-bold">
                <Moon className="w-3.5 h-3.5 text-[#ff7759]" />
                <span>{isArabic ? 'الميزة ٢: وضع شهر رمضان المخصص' : 'Feature 2: Ramadan Special Engine'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-mono text-[#17171c] dark:text-white leading-tight">
                {isArabic
                  ? 'جدولة مخصصة للسحور والإفطار مع حاسبة ساعات الصيام'
                  : 'Dedicated Suhoor & Iftar Planners with Fasting Countdowns'}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {isArabic
                  ? 'تحول بنقرة واحدة إلى وضع رمضان المخصص. يمنحك الجدول خانات محددة للإفطار والسحور، وحاسبة تنازلية لمواقيت الصيام، بالإضافة إلى توصيات للحلويات والمشروبات الرمضانية مثل القطايف والكنافة والعصائر التراثية.'
                  : 'Seamlessly toggle to Ramadan mode. Enjoy specialized Suhoor & Iftar meal slots, fasting countdown timers, hydration counters, and traditional Ramadan dessert recipes.'}
              </p>

            </div>
          </div>
        </section>

        {/* SECTION 3: Interactive Weekly & Monthly Planner with Serving Scaler */}
        <section className="bg-white dark:bg-[#162032] rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#e2e0d8] dark:border-[#2b3a54] shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17171c] dark:bg-white text-white dark:text-[#17171c] text-xs font-mono font-bold">
                <CalendarDays className="w-3.5 h-3.5 text-[#ff7759]" />
                <span>{isArabic ? 'الميزة ٣: التقويم المرن وحاسبة الحصص' : 'Feature 3: Flexible Calendar & Portion Scaler'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-mono text-[#17171c] dark:text-white leading-tight">
                {isArabic
                  ? 'تخطيط أسبوعي وشهري مع ضبط تلقائي لحصص العائلة'
                  : 'Interactive 7-Day & 30-Day Calendar Planners'}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {isArabic
                  ? 'نظم أسبوعك بالكامل أو خطط لشهر كامل مسبقاً. اضبط عدد الأفراد (مثلاً ٤ أو ٨ أو ١٢ فرداً) ليقوم النظام بتعديل كميات المكونات تلقائياً في قائمة التسوق.'
                  : 'Plan your weekly meals or full 30-day month ahead. Dynamically scale portion sizes for small or large family gatherings with zero effort.'}
              </p>

              <div className="space-y-2 pt-2 text-xs font-mono text-[#17171c] dark:text-stone-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff7759]" />
                  <span>{isArabic ? 'عرض الجدول الأسبوعي (٧ أيام كاملة)' : 'Weekly 7-Day Slot Grid'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff7759]" />
                  <span>{isArabic ? 'عرض التقويم الشهري (٣٠ يوماً)' : 'Monthly 30-Day Full Calendar'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff7759]" />
                  <span>{isArabic ? 'مكبر ومصغر الحصص الديناميكي' : 'Dynamic Family Serving Scaler'}</span>
                </div>
              </div>
            </div>

            {/* Calendar Preview Mockup */}
            <div className="lg:col-span-6">
              <div className="bg-[#f8f7f4] dark:bg-[#212e47] rounded-2xl p-5 border border-[#e2e0d8] dark:border-[#384966] shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2e0d8] dark:border-[#384966] text-xs">
                  <span className="font-bold text-[#17171c] dark:text-white">
                    {isArabic ? 'جدول الأسبوع (الجمعة - الخميس)' : 'Weekly Schedule (Fri - Thu)'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#17171c] dark:bg-white text-[#ff7759] dark:text-[#17171c] text-[11px] font-bold">
                    👥 6 {isArabic ? 'أفراد' : 'Servings'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#162032] text-center space-y-1 border border-[#e2e0d8] dark:border-[#2b3a54]">
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 block">{isArabic ? 'الجمعة' : 'Friday'}</span>
                    <span className="font-bold text-[#17171c] dark:text-white block">{isArabic ? 'منسف لحم' : 'Lamb Mansaf'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#162032] text-center space-y-1 border border-[#e2e0d8] dark:border-[#2b3a54]">
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 block">{isArabic ? 'السبت' : 'Saturday'}</span>
                    <span className="font-bold text-[#17171c] dark:text-white block">{isArabic ? 'مكرونة بشاميل' : 'Macarona Béchamel'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#162032] text-center space-y-1 border border-[#e2e0d8] dark:border-[#2b3a54]">
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 block">{isArabic ? 'الأحد' : 'Sunday'}</span>
                    <span className="font-bold text-[#17171c] dark:text-white block">{isArabic ? 'كبسة دجاج' : 'Kabsa'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Smart Grocery Aggregator & WhatsApp Sharing */}
        <section className="bg-white dark:bg-[#162032] text-[#17171c] dark:text-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#e2e0d8] dark:border-[#2b3a54] shadow-xs space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Grocery Checklist Mockup */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="bg-[#f8f7f4] dark:bg-[#212e47] text-[#17171c] dark:text-white rounded-2xl p-6 border border-[#e2e0d8] dark:border-[#384966] shadow-xl space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-[#e2e0d8] dark:border-[#384966] pb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#ff7759]" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      {isArabic ? 'قائمة التسوق التلقائية' : 'SMART GROCERY LIST'}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#17171c] text-[#ff7759] font-bold text-[10px]">
                    Auto-Aggregated
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 font-bold block mb-1">🥦 {isArabic ? 'ممر الخضروات والأعشاب:' : 'Produce Aisle:'}</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="accent-[#ff7759]" />
                        <span className="line-through text-stone-400">{isArabic ? 'بصل أحمر (٢ كجم)' : 'Red Onions (2 kg)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="accent-[#ff7759]" />
                        <span>{isArabic ? 'ثوم وطماطم طازجة' : 'Garlic & Fresh Tomatoes'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 font-bold block mb-1">🥩 {isArabic ? 'ممر اللحوم والدواجن:' : 'Meat & Poultry Aisle:'}</span>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#ff7759]" />
                      <span>{isArabic ? 'لحم ضأن للكتف (١.٥ كجم)' : 'Lamb Shoulder (1.5 kg)'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-300 border-t border-[#e2e0d8] dark:border-[#384966]">
                  <span>{isArabic ? 'مشاركة بنقرة واحدة:' : 'One-click sync:'}</span>
                  <span className="text-[#17171c] dark:text-white font-bold flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-[#ff7759]" /> WhatsApp Export
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17171c] dark:bg-white text-white dark:text-[#17171c] text-xs font-mono font-bold">
                <ShoppingBag className="w-3.5 h-3.5 text-[#ff7759]" />
                <span>{isArabic ? 'الميزة ٤: قائمة التسوق الذكية والمشاركة' : 'Feature 4: Smart Grocery & Sharing'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-mono text-[#17171c] dark:text-white leading-tight">
                {isArabic
                  ? 'قائمة تسوق مجمّعة ومصنفة تلقائياً حسب ممرات السوبرماركت'
                  : 'Auto-Aggregated Grocery Lists Categorized by Store Aisles'}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                {isArabic
                  ? 'لا داعي لحساب المقادير يدوياً. يجمع النظام كافة المكونات المطلوبة للأسبوع ويصنفها في ممرات واضحة (خضروات، لحوم، ألبان، بهارات)، مع إمكانية التصدير بنقرة واحدة عبر واتساب أو طباعة القائمة.'
                  : 'Automatically aggregates and groups ingredients into organized supermarket aisles. Export to WhatsApp or print your checklist instantly for hassle-free grocery trips.'}
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#17171c] dark:text-white">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#ff7759]" />
                  {isArabic ? 'دعم النسخ الاحتياطي JSON/CSV' : 'JSON & CSV Backup'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-[#ff7759]" />
                  {isArabic ? 'تصدير للواتساب' : 'WhatsApp Export'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION BANNER */}
        <section className="rounded-3xl bg-[#17171c] dark:bg-[#162032] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden border border-stone-800 dark:border-[#2b3a54]">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10 font-mono">
            <span className="text-xs font-mono text-[#ff7759] uppercase tracking-widest block font-bold">
              {isArabic ? 'منظومة طهي وجبة 2026' : 'Wajba Culinary System'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              {isArabic ? 'جاهز لتنظيم مائدة عائلتك بكل يسر وسهولة؟' : 'Ready to Elevate Your Family Meal Planning?'}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-stone-300 leading-relaxed max-w-xl mx-auto">
              {isArabic
                ? 'انضم الآن وابدأ في استكشاف أشهى الوصفات العربية وتخطيط جدول الأسبوع وإنشاء قائمة التسوق مجاناً.'
                : 'Start exploring authentic Middle Eastern recipes, plan your weekly schedule, and export smart grocery lists today.'}
            </p>

            <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={onEnterDashboard}
                className="py-4 px-10 rounded-full bg-[#ff7759] hover:bg-[#ff552e] text-white font-mono font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer hover:scale-105"
              >
                <span>{isArabic ? 'دخول التطبيق الآن ➔' : 'Enter App Now ➔'}</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#f0eee8] dark:bg-[#162032] border-t border-[#e2e0d8] dark:border-[#2b3a54] py-6 px-4 text-center text-[11px] font-mono text-stone-500 dark:text-stone-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f8f6f0] border border-[#e2e0d8] dark:border-[#384966] flex items-center justify-center p-1">
              <img src="/favicon.svg" alt="Wajba Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-[#17171c] dark:text-white font-mono">WAJBA SYSTEM <span className="text-[#D86540] text-xs"> وجبة</span></span>
          </div>
          <p>
            {isArabic
              ? '© 2026 وجبة WAJBA • محرك التخطيط العائلي والمطابخ العربية'
              : '© 2026 Wajba • Enterprise MENA Culinary & Grocery Planner'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
