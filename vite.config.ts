import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {existsSync, readFileSync} from 'node:fs';
import path from 'path';
import {defineConfig} from 'vite';

function pwaServiceWorkerPlugin() {
  return {
    name: 'wajba-pwa-service-worker',
    generateBundle(_options: unknown, bundle: Record<string, {type: string}>) {
      const precacheEntries = new Set(['/index.html']);
      for (const fileName of Object.keys(bundle)) {
        if (/^assets\/index-[^/]+\.(?:js|css)$/.test(fileName)) precacheEntries.add(`/${fileName}`);
      }
      for (const publicFile of ['manifest.webmanifest', 'favicon.svg', 'wajba-icon-192.png', 'wajba-icon-512.png', 'wajba-icon-maskable-512.png', 'apple-touch-icon.png']) {
        if (existsSync(path.resolve(__dirname, 'public', publicFile))) precacheEntries.add(`/${publicFile}`);
      }
      const source = readFileSync(path.resolve(__dirname, 'src/pwa/service-worker.js'), 'utf8')
        .replace('__PRECACHE_ENTRIES__', JSON.stringify([...precacheEntries]));
      this.emitFile({type: 'asset', fileName: 'sw.js', source});
    },
  };
}

function seoIndexTags() {
  const configuredSiteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL;
  if (!configuredSiteUrl) {
    return {name: 'wajba-seo-index-tags'};
  }

  const parsedSiteUrl = new URL(configuredSiteUrl);
  if (!['http:', 'https:'].includes(parsedSiteUrl.protocol)) {
    throw new Error('VITE_SITE_URL must use http or https.');
  }

  const siteUrl = parsedSiteUrl.toString().replace(/\/$/, '');
  const htmlSiteUrl = siteUrl.replaceAll('&', '&amp;');

  return {
    name: 'wajba-seo-index-tags',
    transformIndexHtml(html: string) {
      const withAbsoluteImage = html.replaceAll('content="/wajba-logo.png"', `content="${htmlSiteUrl}/wajba-logo.png"`);
      return withAbsoluteImage.replace(
        '</head>',
        `    <link rel="canonical" href="${htmlSiteUrl}/" />\n    <meta property="og:url" content="${htmlSiteUrl}/" />\n</head>`,
      );
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [pwaServiceWorkerPlugin(), react(), tailwindcss(), seoIndexTags()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
