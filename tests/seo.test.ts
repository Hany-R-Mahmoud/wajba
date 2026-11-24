import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PublicSeasonsPage } from '../src/components/PublicSeasonsPage';
import { ENGLISH_IS_DRAFT, GUIDE_NOTE_AR, PRODUCE } from '../src/data/seasons';
import { SEASONS_SEO, getSeoMetadata } from '../src/utils/seo';

const page = (language: 'ar' | 'en') => renderToStaticMarkup(React.createElement(PublicSeasonsPage, { language }));

test('public seasons page lists every month, every entry and the guide note', () => {
  const html = page('ar');
  assert.equal((html.match(/id="month-\d+"/g) ?? []).length, 12);
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  const entries = PRODUCE.reduce((sum, p) => sum + p.seasonMonths.length, 0);
  assert.equal(entries, 223);
  assert.equal((html.match(/<strong>/g) ?? []).length, entries);
  const peaks = PRODUCE.reduce((sum, p) => sum + p.peakMonths.length, 0);
  assert.equal((html.match(/في عز موسمه<\/span>/g) ?? []).length, peaks, 'peak is written in words on every peak entry');
  assert.ok(html.includes(GUIDE_NOTE_AR));
  assert.ok(html.includes('href="/dashboard/seasons"'));
});

test('public Arabic page shows English names only once the owner approved them', () => {
  const html = page('ar');
  const shown = PRODUCE.filter((p) => html.includes(p.nameEn)).length;
  if (ENGLISH_IS_DRAFT) assert.equal(shown, 0, 'draft English must not be public');
  else assert.ok(shown > 0, 'approved English names appear on the public page');
});

test('seasons route has its own indexable metadata', () => {
  const meta = getSeoMetadata(undefined, 'https://wajjba.vercel.app', false, false, true);
  assert.equal(meta.path, '/seasons');
  assert.equal(meta.title, SEASONS_SEO.title);
  assert.equal(meta.robots, 'index,follow');
  assert.notEqual(meta.title, getSeoMetadata().title);
  assert.equal(getSeoMetadata(undefined, undefined, false, true).robots, 'noindex,follow', 'dashboard stays noindex');
});

test('private routes are noindex by header, and the Search Console token is deployed as given', () => {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const header = (source: string) =>
    config.headers.find((h: { source: string }) => h.source === source)?.headers.find((h: { key: string }) => h.key === 'X-Robots-Tag')?.value;
  assert.match(header('/dashboard'), /noindex/);
  assert.match(header('/dashboard/:path*'), /noindex/);
  assert.match(header('/api/:path*'), /noindex/);
  assert.equal(config.git.deploymentEnabled.main, true);
  assert.equal(config.git.deploymentEnabled['*'], false);
  assert.equal(
    readFileSync('public/googled5027b1ee88bdadf.html', 'utf8'),
    'google-site-verification: googled5027b1ee88bdadf.html',
  );
});
