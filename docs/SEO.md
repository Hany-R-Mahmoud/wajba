# Wajba SEO and Search Console

Audited 2026-11-24 from the repo, the build output (`SITE_URL=https://wajjba.vercel.app bun run build`), and public HTTP requests to https://wajjba.vercel.app. No Search Console report data was read, so nothing here says how Google currently treats the site.

## How it works

- `index.html` plus `vite.config.ts` (`seoIndexTags`) give the home page its canonical, absolute Open Graph image, and `WebSite`/`WebApplication` JSON-LD when `SITE_URL` or `VITE_SITE_URL` is set at build time. Production already has it set.
- `scripts/prerender_seo.ts` runs after `vite build` and writes static HTML for `/seasons`, every `/recipes/<id>`, and `404.html`, plus `sitemap.xml`, `robots.txt`, and `llms.txt` (only when `SITE_URL` is set).
- `src/utils/seo.ts` updates title, description, canonical, Open Graph, and Recipe JSON-LD on client navigation.
- `vercel.json` sends `X-Robots-Tag: noindex` for `/dashboard` and `/api/*`; branch deployments are off except `main`.

## Route audit

| Route | Indexed | Notes |
|---|---|---|
| `/` | yes | Arabic, canonical, WebSite and WebApplication JSON-LD |
| `/seasons` | yes | Static month-by-month guide (12 sections, 223 entries), Arabic with approved English produce names |
| `/recipes/<id>` | yes (100) | English prerendered page, canonical, Recipe JSON-LD |
| `/dashboard/*` | no | Private app shell: meta `noindex,follow` from the client and `X-Robots-Tag` header |
| `/api/*` | no | Header `noindex`, and `Disallow: /api/` in robots.txt |
| `404.html` | no | `noindex,follow` |

## Fixed in this pass

1. Recipe and 404 pages carried the homepage JSON-LD copied from `index.html`. It is now stripped, so each page has only its own schema.
2. `/dashboard` served `index,follow` in its static HTML and only flipped to `noindex` after JavaScript ran. The header now says `noindex` from the first byte.
3. There was no public page for the seasonal feature. `/seasons` is added with its own title, description, canonical, sitemap entry, `llms.txt` line, and links from the landing footer and every recipe page.
4. `robots.txt` now disallows `/api/`.

## Decisions and limits

- Language: pages are not split into separate Arabic and English URLs, so no `hreflang`. Recipe pages are English; the home page and `/seasons` are Arabic.
- English produce names were approved on 2026-11-24 (`ENGLISH_IS_DRAFT = false`), so they are published on `/seasons`; `tests/seo.test.ts` checks both states.
- No `lastmod` in the sitemap: there is no real per-page modified date to report.
- No FAQ, rating, or price schema: nothing visible on the pages supports it.
- `llms.txt` is a map for AI and coding agents, not a Google Search feature.
- Changing `SITE_URL` needs a redeploy.

## Google Search Console record

| Field | Value |
|---|---|
| Production URL | https://wajjba.vercel.app/ |
| Intended public pages | `/`, `/seasons`, `/recipes/<id>` |
| Property type | URL prefix `https://wajjba.vercel.app/` (a `vercel.app` subdomain: no DNS control, so no Domain property) |
| Property for this site | **Active.** Added 2026-11-24 as URL prefix `https://wajjba.vercel.app/` in the owner's Search Console account |
| Verification method | HTML file `public/googled5027b1ee88bdadf.html` (also used by the owner's `eldakheel` and `mahfazzti` projects). Live since the 2026-11-24 deploy; Search Console auto-verified ownership with it |
| Sitemap | `sitemap.xml` submitted 2026-11-24, accepted ("Sitemap submitted successfully") |
| URL Inspection | Not done yet (optional) |

Remaining steps:

1. Optional: use URL Inspection on `/`, `/seasons` and one recipe URL, and request indexing for each once. Do not repeat requests.
2. Keep the token file deployed. Removing it ends verification.
3. Read the first Performance and Pages data after a few days; Search Console needs time to accrue it.

Verification gives report access. It does not index pages or improve ranking.
