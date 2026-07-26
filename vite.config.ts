import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

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
    plugins: [react(), tailwindcss(), seoIndexTags()],
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
