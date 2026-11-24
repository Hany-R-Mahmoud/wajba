import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import {
  ENGLISH_IS_DRAFT,
  GUIDE_NOTE_AR,
  GUIDE_NOTE_EN,
  SOURCE_NOTE_AR,
  SOURCE_NOTE_EN,
  SEASON_MONTHS_AR,
  SEASON_MONTHS_EN,
  getMonthList,
} from '../data/seasons';
import { cairoMonth } from '../utils/season';

/**
 * Public, crawlable seasonal guide at `/seasons`. Static text only, so it can be
 * prerendered. English names appear only after the owner approves the English
 * wording (`ENGLISH_IS_DRAFT`), so unapproved text never reaches search results.
 */
export const PublicSeasonsPage: React.FC<{ language: Language }> = ({ language }) => {
  const isArabic = language === 'ar';
  const showEnglish = !isArabic || !ENGLISH_IS_DRAFT;
  const months = isArabic ? SEASON_MONTHS_AR : SEASON_MONTHS_EN;
  // Set after mount so the prerendered HTML stays the same for every visitor.
  const [nowMonth, setNowMonth] = useState<number | null>(null);
  useEffect(() => {
    const m = cairoMonth();
    setNowMonth(m);
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-8 text-stone-900 dark:bg-[#071829] dark:text-slate-100 sm:px-8">
      <article className="mx-auto max-w-4xl space-y-8">
        <nav aria-label={isArabic ? 'مسار التنقل' : 'Breadcrumb'} className="text-sm">
          <a href="/" className="font-bold text-[#b9401f] hover:underline dark:text-[#ff7759]">Wajba</a>
          <span aria-hidden="true" className="mx-2">/</span>
          <span>{isArabic ? 'في موسمه' : 'In season'}</span>
        </nav>

        <header className="space-y-3">
          <h1 className="text-3xl font-black leading-tight sm:text-5xl">
            {isArabic ? 'ماذا في موسمه في مصر؟ خضار وفاكهة كل شهر' : 'What is in season in Egypt? Produce by month'}
          </h1>
          <p className="max-w-3xl text-base leading-8">
            {isArabic
              ? 'خضار وفاكهة مصر في موسمها شهراً بشهر، مع أفكار للطبخ.'
              : 'Egyptian produce in season, month by month, with cooking ideas.'}
          </p>
          <p className="text-sm font-bold">{isArabic ? GUIDE_NOTE_AR : GUIDE_NOTE_EN}</p>
          <p className="text-xs opacity-80">{isArabic ? SOURCE_NOTE_AR : SOURCE_NOTE_EN}</p>
          <a href="/" className="inline-flex min-h-11 items-center rounded-lg bg-[#17171c] px-4 font-bold text-white hover:bg-stone-700 dark:bg-white dark:text-[#17171c] dark:hover:bg-stone-200">{isArabic ? 'افتح وجبة' : 'Open Wajba'}</a>
        </header>

        <nav aria-label={isArabic ? 'الشهور' : 'Months'}>
          <ul className="flex flex-wrap gap-2">
            {months.map((name, index) => (
              <li key={name}>
                <a href={`#month-${index + 1}`} className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border px-3 text-sm font-bold hover:border-[#b9401f] dark:border-[#2b3a54] dark:bg-[#162032] dark:hover:border-[#ff7759] ${nowMonth === index + 1 ? 'border-[#b9401f] bg-white' : 'border-stone-300 bg-white'}`}>
                  {name}
                  {nowMonth === index + 1 && <span className="text-xs font-medium">{isArabic ? 'الآن' : 'Now'}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {months.map((monthName, index) => {
          const month = index + 1;
          const items = getMonthList(month);
          return (
            <section key={month} id={`month-${month}`} aria-labelledby={`month-heading-${month}`} className="space-y-3">
              <h2 id={`month-heading-${month}`} className="scroll-mt-4 text-2xl font-bold">
                {isArabic ? `في موسمه في ${monthName}` : `In season in ${monthName}`}
                <span className="ms-2 text-sm font-medium text-stone-600 dark:text-stone-400">({items.length})</span>
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((item) => {
                  const peak = item.peakMonths.includes(month as never);
                  return (
                    <li key={item.id} className="rounded-xl border border-stone-200 bg-white p-3 dark:border-[#2b3a54] dark:bg-[#162032]">
                      <strong>{isArabic ? item.nameAr : item.nameEn}</strong>
                      {peak && <span className="ms-2 rounded-full border border-[#ff7759]/60 px-2 py-0.5 text-xs font-bold text-[#8f2f14] dark:text-[#ff9a82]">{isArabic ? 'في عز موسمه' : 'Peak season'}</span>}
                      {showEnglish && isArabic && <span lang="en" className="block text-sm text-stone-600 dark:text-stone-300">{item.nameEn}</span>}
                      <span className="mt-1 block text-sm leading-7 text-stone-700 dark:text-stone-300">{isArabic ? item.cookHintAr : item.cookHintEn}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <footer className="space-y-3 border-t border-stone-200 pt-6 text-sm dark:border-[#2b3a54]">
          <div className="flex flex-wrap gap-3">
            <a href="/dashboard/seasons" className="rounded-lg bg-[#17171c] px-4 py-2 font-bold text-white hover:bg-stone-700">{isArabic ? 'افتح الدليل التفاعلي' : 'Open the interactive guide'}</a>
            <a href="/" className="rounded-lg border border-stone-300 px-4 py-2 font-bold hover:border-[#b9401f]">{isArabic ? 'الصفحة الرئيسية' : 'Home'}</a>
          </div>
        </footer>
      </article>
    </main>
  );
};
