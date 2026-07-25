import {Recipe} from '../types';

export const DEFAULT_SEO = {
  title: 'خطط لوجبات عائلتك بلمسة تراثية أصيلة | Wajba',
  description: 'خطط لوجبات عائلتك، واكتشف وصفات عربية أصيلة، ونظم قائمة التسوق الأسبوعية بسهولة.',
};

const DASHBOARD_SEO = {
  title: 'لوحة تخطيط الوجبات العائلية | Wajba',
  description: 'لوحة Wajba الخاصة بتخطيط الوجبات والوصفات وقائمة التسوق العائلية.',
};

export interface SeoMetadata {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'article';
  image: string;
  robots: string;
  recipe?: Recipe;
}

function siteBaseUrl(siteUrl?: string): string | undefined {
  if (!siteUrl) return undefined;
  const parsed = new URL(siteUrl);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('SITE_URL must use http or https.');
  }
  return parsed.toString().replace(/\/$/, '');
}

export function getSeoMetadata(recipe?: Recipe, siteUrl?: string, notFound = false, dashboard = false): SeoMetadata {
  siteBaseUrl(siteUrl);
  const path = recipe ? `/recipes/${encodeURIComponent(recipe.id)}` : dashboard ? '/dashboard' : '/';

  return {
    title: recipe ? `${recipe.titleEn} | Wajba` : dashboard ? DASHBOARD_SEO.title : DEFAULT_SEO.title,
    description: recipe?.descriptionEn || (dashboard ? DASHBOARD_SEO.description : DEFAULT_SEO.description),
    path,
    type: recipe ? 'article' : 'website',
    image: '/logo.svg',
    robots: notFound || dashboard ? 'noindex,follow' : 'index,follow',
    recipe,
  };
}

export function getPublicRecipeRoute(recipes: Recipe[], pathname = window.location.pathname): {recipe?: Recipe; isRecipePath: boolean} {
  const match = pathname.match(/^\/recipes\/([^/]+)\/?$/);
  if (!match) return {isRecipePath: false};

  let recipeId: string;
  try {
    recipeId = decodeURIComponent(match[1]);
  } catch {
    return {isRecipePath: true};
  }
  return {
    recipe: recipes.find((candidate) => candidate.id === recipeId),
    isRecipePath: true,
  };
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertCanonical(href: string | null) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    existing?.remove();
    return;
  }

  const link = existing || document.head.appendChild(document.createElement('link'));
  link.rel = 'canonical';
  link.href = href;
}

function recipeJsonLd(recipe: Recipe, url: string, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.titleEn,
    alternateName: recipe.titleAr,
    description: recipe.descriptionEn,
    image: [image],
    url,
    author: { '@type': 'Organization', name: 'Wajba' },
    recipeCuisine: recipe.region,
    prepTime: `PT${recipe.prepTimeMinutes}M`,
    cookTime: `PT${recipe.cookTimeMinutes}M`,
    totalTime: `PT${recipe.prepTimeMinutes + recipe.cookTimeMinutes}M`,
    recipeYield: `${recipe.servings} servings`,
    recipeIngredient: recipe.ingredients.map((ingredient) => `${ingredient.amount} ${ingredient.unitEn} ${ingredient.nameEn}`),
    recipeInstructions: recipe.instructionsEn.map((text) => ({
      '@type': 'HowToStep',
      text,
    })),
  };
}

export function updateSeo(recipe?: Recipe, notFound = false, dashboard = false) {
  const metadata = getSeoMetadata(recipe, window.location.origin, notFound, dashboard);
  const canonicalUrl = notFound || dashboard ? null : new URL(metadata.path, window.location.origin).href;
  const socialImageUrl = new URL(metadata.image, window.location.origin).href;
  const recipeImageUrl = recipe ? new URL(recipe.image, window.location.origin).href : socialImageUrl;

  document.title = metadata.title;
  upsertMeta('name', 'description', metadata.description);
  upsertMeta('name', 'robots', metadata.robots);
  upsertMeta('property', 'og:title', metadata.title);
  upsertMeta('property', 'og:description', metadata.description);
  upsertMeta('property', 'og:type', metadata.type);
  upsertMeta('property', 'og:url', canonicalUrl || window.location.href);
  upsertMeta('property', 'og:image', socialImageUrl);
  upsertMeta('property', 'og:image:alt', 'Wajba logo');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', metadata.title);
  upsertMeta('name', 'twitter:description', metadata.description);
  upsertMeta('name', 'twitter:image', socialImageUrl);
  upsertCanonical(canonicalUrl);

  document.head.querySelectorAll('script[data-wajba-seo-schema]').forEach((element) => element.remove());
  if (recipe && canonicalUrl) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.wajbaSeoSchema = 'true';
    script.textContent = JSON.stringify(recipeJsonLd(recipe, canonicalUrl, recipeImageUrl));
    document.head.appendChild(script);
  }
}

export function getRecipeJsonLd(recipe: Recipe, siteUrl?: string) {
  const baseUrl = siteBaseUrl(siteUrl);
  const url = baseUrl ? `${baseUrl}/recipes/${encodeURIComponent(recipe.id)}` : undefined;
  const image = /^https?:\/\//.test(recipe.image) ? recipe.image : baseUrl ? new URL(recipe.image, baseUrl).href : recipe.image;
  return recipeJsonLd(recipe, url || `/recipes/${encodeURIComponent(recipe.id)}`, image);
}
