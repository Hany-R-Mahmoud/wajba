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
| `/seasons` | yes | New. Static month-by-month guide (12 sections, 223 entries), Arabic only until English is approved |
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
- Draft English text (`ENGLISH_IS_DRAFT`) is not published on `/seasons`. After the owner approves the English wording, set the flag to false and update `tests/seo.test.ts`.
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
| Account access | The owner's Google account is signed in to Search Console and owns other properties. Checked 2026-11-24 |
| Property for this site | **Not present.** Opening it shows "you don't have access to this property" (observed 2026-11-24) |
| Verification method | HTML file `public/googled5027b1ee88bdadf.html`, the same file the owner's `eldakheel` and `mahfazzti` projects use. Status: **prepared** (committed on the branch), not deployed |
| URL Inspection, sitemap | Not done: needs the property |
| Blocker | The file must be live at `https://wajjba.vercel.app/googled5027b1ee88bdadf.html` before Verify. That needs this branch merged and deployed to production, which is the owner's step |

Steps after the deploy:

1. Check `https://wajjba.vercel.app/googled5027b1ee88bdadf.html` returns the one-line token text.
2. In Search Console choose Add property, then URL prefix, enter `https://wajjba.vercel.app/`, choose the HTML file method, and click Verify.
3. Open Sitemaps and submit `sitemap.xml`.
4. Use URL Inspection on `/`, `/seasons` and one recipe URL, and request indexing for them once. Do not repeat requests.
5. Keep the token file deployed.
6. Read the first Performance data after a few days; Search Console needs time to accrue it.

Verification gives report access. It does not index pages or improve ranking.
