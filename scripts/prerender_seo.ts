import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {INITIAL_RECIPES} from '../src/data/recipes';
import {PublicRecipeNotFound, PublicRecipePage} from '../src/components/PublicRecipePage';
import {getRecipeJsonLd} from '../src/utils/seo';

const distDir = path.resolve('dist');
const siteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL;

function html(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function xml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function validSiteUrl(value: string): string {
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('SITE_URL must use http or https.');
  }
  if (['localhost', '127.0.0.1', '::1'].includes(parsed.hostname) || /example\.(com|org)$/i.test(parsed.hostname)) {
    throw new Error('SITE_URL must be the real production domain, not a placeholder.');
  }
  return parsed.toString().replace(/\/$/, '');
}

function replaceTag(source: string, pattern: RegExp, replacement: string): string {
  return source.replace(pattern, replacement);
}

function routeHtml(template: string, recipe: (typeof INITIAL_RECIPES)[number], baseUrl?: string): string {
  const recipeUrl = `/recipes/${encodeURIComponent(recipe.id)}`;
  const canonical = baseUrl ? `${baseUrl}${recipeUrl}` : undefined;
  const socialImage = baseUrl ? `${baseUrl}/wajba-logo.png` : '/wajba-logo.png';
  const schema = JSON.stringify(getRecipeJsonLd(recipe, baseUrl)).replace(/</g, '\\u003c');
  let result = template
    .replace('<html lang="ar" dir="rtl">', '<html lang="en" dir="ltr">')
    .replace(/<noscript>[\s\S]*?<\/noscript>\n?/g, '')
    .replace('<div id="root"></div>', `<div id="root">${renderToStaticMarkup(React.createElement(PublicRecipePage, {recipe, language: 'en'}))}</div>`);

  result = replaceTag(result, /<title>[\s\S]*?<\/title>/, `<title>${html(`${recipe.titleEn} | Wajba`)}</title>`);
  result = replaceTag(result, /<meta name="description"[^>]*>/, `<meta name="description" content="${html(recipe.descriptionEn)}" />`);
  result = replaceTag(result, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${html(`${recipe.titleEn} | Wajba`)}" />`);
  result = replaceTag(result, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${html(recipe.descriptionEn)}" />`);
  result = replaceTag(result, /<meta property="og:type"[^>]*>/, '<meta property="og:type" content="article" />');
  result = replaceTag(result, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${html(socialImage)}" />`);
  result = replaceTag(result, /<meta property="og:image:alt"[^>]*>/, '<meta property="og:image:alt" content="شعار وجبة Wajba" />');
  result = replaceTag(result, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${html(`${recipe.titleEn} | Wajba`)}" />`);
  result = replaceTag(result, /<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${html(recipe.descriptionEn)}" />`);
  result = replaceTag(result, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${html(socialImage)}" />`);
  result = replaceTag(result, /<meta name="robots"[^>]*>/, '<meta name="robots" content="index,follow" />');
  result = result.replace(/<link rel="canonical"[^>]*>\n?/g, '');
  result = result.replace(/<meta property="og:url"[^>]*>\n?/g, '');
  result = result.replace('</head>', `${canonical ? `    <link rel="canonical" href="${html(canonical)}" />\n    <meta property="og:url" content="${html(canonical)}" />\n` : ''}    <script type="application/ld+json">${schema}</script>\n  </head>`);
  return result;
}

function notFoundHtml(template: string): string {
  let result = template
    .replace(/<noscript>[\s\S]*?<\/noscript>\n?/g, '')
    .replace('<div id="root"></div>', `<div id="root">${renderToStaticMarkup(React.createElement(PublicRecipeNotFound, {language: 'en'}))}</div>`)
    .replace('<title>خطط لوجبات عائلتك بلمسة تراثية أصيلة | Wajba</title>', '<title>Page not found | Wajba</title>')
    .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="The requested Wajba page was not found." />')
    .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex,follow" />')
    .replace(/<meta property="og:title"[^>]*>/, '<meta property="og:title" content="Page not found | Wajba" />')
    .replace(/<meta property="og:description"[^>]*>/, '<meta property="og:description" content="The requested Wajba page was not found." />')
    .replace(/<link rel="canonical"[^>]*>\n?/g, '')
    .replace(/<meta property="og:url"[^>]*>\n?/g, '');
  return result;
}

async function writeCrawlerFiles(baseUrl: string) {
  const recipeUrls = INITIAL_RECIPES.map((recipe) => `${baseUrl}/recipes/${encodeURIComponent(recipe.id)}`);
  const urls = [`${baseUrl}/`, ...recipeUrls];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${xml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
  await writeFile(path.join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`, 'utf8');

  const curatedRecipes = INITIAL_RECIPES.slice(0, 10);
  const llms = [
    '# Wajba',
    '',
    'Wajba is a bilingual Arabic and English MENA recipe library and meal planner with weekly planning, Ramadan mode, and grocery organization.',
    '',
    '## Important pages',
    `- Home: ${baseUrl}/`,
    '',
    '## Selected recipe pages',
    ...curatedRecipes.map((recipe) => `- ${recipe.titleEn}: ${baseUrl}/recipes/${encodeURIComponent(recipe.id)}`),
    '',
    'The complete public recipe URL inventory is available in sitemap.xml.',
    '',
  ].join('\n');
  await writeFile(path.join(distDir, 'llms.txt'), llms, 'utf8');
}

async function main() {
  const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
  const baseUrl = siteUrl ? validSiteUrl(siteUrl) : undefined;
  await writeFile(path.join(distDir, '404.html'), notFoundHtml(template), 'utf8');

  for (const recipe of INITIAL_RECIPES) {
    const routeDir = path.join(distDir, 'recipes', recipe.id);
    await mkdir(routeDir, {recursive: true});
    await writeFile(path.join(routeDir, 'index.html'), routeHtml(template, recipe, baseUrl), 'utf8');
  }

  if (baseUrl) {
    await writeCrawlerFiles(baseUrl);
    console.log(`SEO pages, sitemap, robots.txt, and llms.txt generated for ${baseUrl}`);
  } else {
    console.warn('SITE_URL/VITE_SITE_URL is unset; generated recipe pages without production canonicals or crawler files.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
