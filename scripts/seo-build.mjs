// Genera dist/sitemap.xml con las páginas fijas de src/seo/seo.json.
// En el hosting, /sitemap.xml lo sirve api/sitemap.php, que además incluye las
// noticias de la base de datos; este archivo es el respaldo (p. ej. en Vercel).
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const seo = JSON.parse(readFileSync(join(root, 'src/seo/seo.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const urls = Object.entries(seo.pages)
  .filter(([, page]) => !page.noindex && !page.canonical)
  .map(([path, page]) => [
    '  <url>',
    `    <loc>${seo.siteUrl}${path}</loc>`,
    `    <lastmod>${page.published || today}</lastmod>`,
    `    <changefreq>${page.changefreq || 'monthly'}</changefreq>`,
    `    <priority>${page.priority || '0.5'}</priority>`,
    '  </url>',
  ].join('\n'));

writeFileSync(
  join(root, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
);
console.log(`✔ sitemap.xml con ${urls.length} páginas`);
