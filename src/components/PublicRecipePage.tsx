import React from 'react';
import {Recipe} from '../types';

interface PublicRecipePageProps {
  recipe: Recipe;
  language: 'ar' | 'en';
}

export const PublicRecipePage: React.FC<PublicRecipePageProps> = ({recipe, language}) => {
  const isArabic = language === 'ar';
  const title = isArabic ? recipe.titleAr : recipe.titleEn;
  const alternateTitle = isArabic ? recipe.titleEn : recipe.titleAr;
  const description = isArabic ? recipe.descriptionAr : recipe.descriptionEn;
  const alternateDescription = isArabic ? recipe.descriptionEn : recipe.descriptionAr;
  const instructions = isArabic ? recipe.instructionsAr : recipe.instructionsEn;
  const alternateInstructions = isArabic ? recipe.instructionsEn : recipe.instructionsAr;
  const story = isArabic ? recipe.storyAr || recipe.storyEn : recipe.storyEn || recipe.storyAr;

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-8 text-stone-900 dark:bg-[#0c1220] dark:text-slate-100 sm:px-8">
      <article className="mx-auto max-w-4xl space-y-8">
        <nav aria-label={isArabic ? 'مسار التنقل' : 'Breadcrumb'} className="text-sm">
          <a href="/" className="font-bold text-[#c74f31] hover:underline">Wajba</a>
          <span aria-hidden="true" className="mx-2">/</span>
          <span>{isArabic ? 'وصفة' : 'Recipe'}</span>
        </nav>

        <header className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#c74f31]">{isArabic ? 'وصفة عربية أصيلة' : 'Authentic MENA recipe'}</p>
          <h1 className="text-3xl font-black leading-tight sm:text-5xl">{title}</h1>
          <p className="text-lg text-stone-600 dark:text-stone-300">{alternateTitle}</p>
          <p className="max-w-3xl text-base leading-8">{description}</p>
          <p lang={isArabic ? 'en' : 'ar'} className="max-w-3xl text-sm leading-7 text-stone-600 dark:text-stone-300">{alternateDescription}</p>
        </header>

        <img
          src={recipe.image}
          alt={title}
          className="aspect-[16/9] w-full rounded-2xl object-cover"
          onError={(event) => {
            event.currentTarget.src = '/recipe-placeholder.svg';
          }}
        />

        {story ? (
          <section aria-labelledby="recipe-story" className="space-y-3">
            <h2 id="recipe-story" className="text-2xl font-bold">{isArabic ? 'قصة وأصل الطبخة' : 'Recipe Heritage & Origin'}</h2>
            <p className="leading-8">{story}</p>
          </section>
        ) : null}

        <div className="grid gap-8 md:grid-cols-2">
          <section aria-labelledby="recipe-ingredients" className="space-y-3">
            <h2 id="recipe-ingredients" className="text-2xl font-bold">{isArabic ? 'المكونات' : 'Ingredients'}</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-900">
                  <strong>{ingredient.amount} {ingredient.unitEn} {ingredient.nameEn}</strong>
                  <span lang="ar" className="block text-sm text-stone-600 dark:text-stone-300">{ingredient.amount} {ingredient.unitAr} {ingredient.nameAr}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="recipe-instructions" className="space-y-3">
            <h2 id="recipe-instructions" className="text-2xl font-bold">{isArabic ? 'خطوات التحضير والطهي' : 'Instructions'}</h2>
            <ol className="space-y-3">
              {instructions.map((step, index) => (
                <li key={`${index}-${step}`} className="rounded-lg border border-stone-200 bg-white p-3 leading-7 dark:border-stone-700 dark:bg-stone-900">
                  <span className="me-2 font-bold text-[#c74f31]">{index + 1}.</span>{step}
                  <span lang={isArabic ? 'en' : 'ar'} className="mt-1 block text-sm text-stone-600 dark:text-stone-300">{alternateInstructions[index]}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <footer className="flex flex-wrap gap-3 border-t border-stone-200 pt-6 dark:border-stone-700">
          <a href="/" className="rounded-lg bg-[#17171c] px-4 py-2 text-sm font-bold text-white hover:bg-stone-700">{isArabic ? 'فتح مخطط الوجبات' : 'Open meal planner'}</a>
          <a href="/" className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-bold hover:border-[#c74f31]">{isArabic ? 'استكشاف وصفات أخرى' : 'Explore more recipes'}</a>
        </footer>
      </article>
    </main>
  );
};

export const PublicRecipeNotFound: React.FC<{language: 'ar' | 'en'}> = ({language}) => (
  <main className="min-h-screen px-4 py-16 text-center">
    <h1 className="text-3xl font-black">{language === 'ar' ? 'الوصفة غير موجودة' : 'Recipe not found'}</h1>
    <p className="mt-3 text-stone-600">{language === 'ar' ? 'ارجع إلى وجبة لاستكشاف الوصفات.' : 'Return to Wajba to explore the recipe library.'}</p>
    <a href="/" className="mt-6 inline-block rounded-lg bg-[#17171c] px-4 py-2 font-bold text-white">{language === 'ar' ? 'العودة إلى وجبة' : 'Back to Wajba'}</a>
  </main>
);
