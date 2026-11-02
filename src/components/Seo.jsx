import { useEffect } from 'react';
import seo from '../seo/seo.json';

// ===== SEO POR PÁGINA =====
// Actualiza título, descripción, URL canónica, robots, Open Graph, Twitter y los
// datos estructurados de la página (migas de pan y artículo).
// En el hosting el servidor ya entrega estas etiquetas en el HTML (api/seo.php);
// este componente las mantiene correctas al navegar dentro de la web.
// Los valores salen de src/seo/seo.json; las props permiten sobrescribirlos.

const absolute = (url) => (url && !/^https?:\/\//.test(url) ? `${seo.siteUrl}${url}` : url);

const setMeta = (selector, attr, key, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    el.setAttribute(attr, key);
    if (selector.startsWith('link')) el.setAttribute('rel', key);
    document.head.appendChild(el);
  }
  el.setAttribute(selector.startsWith('link') ? 'href' : 'content', value);
};

const breadcrumb = (path, page) => {
  if (path === '/') return null;
  const items = [{ name: 'Inicio', url: '/' }];
  if (page.parent && seo.pages[page.parent]) {
    items.push({ name: seo.pages[page.parent].breadcrumb || seo.pages[page.parent].title, url: page.parent });
  }
  items.push({ name: page.breadcrumb || page.title, url: path });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(it.url) })),
  };
};

const article = (path, page) => ({
  '@context': 'https://schema.org',
  '@type': page.articleType || 'BlogPosting',
  headline: page.title,
  description: page.description,
  image: [absolute(page.image || seo.defaultImage)],
  datePublished: page.published,
  dateModified: page.modified || page.published,
  inLanguage: seo.language,
  mainEntityOfPage: absolute(path),
  author: { '@type': 'Organization', name: seo.organization.name, url: seo.siteUrl },
  publisher: {
    '@type': 'Organization',
    name: seo.organization.name,
    logo: { '@type': 'ImageObject', url: absolute(seo.organization.logo) },
  },
});

/** Ruta inicial: sus datos estructurados ya vienen del servidor. */
const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/';

const Seo = ({ path, notFound = false, ...overrides }) => {
  const base = notFound ? seo.notFound : seo.pages[path] || {};
  const page = { ...base, ...Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== undefined && v !== '')) };
  const key = JSON.stringify([path, notFound, page]);

  useEffect(() => {
    const title = page.title || seo.siteName;
    const description = page.description || seo.pages['/'].description;
    const image = absolute(page.image || seo.defaultImage);
    const canonical = absolute(page.canonical || path || '/');

    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setMeta('link[rel="canonical"]', 'rel', 'canonical', canonical);
    setMeta('meta[property="og:type"]', 'property', 'og:type', page.type === 'article' ? 'article' : 'website');
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // Datos estructurados de la página (los del servidor se conservan en la primera carga)
    if (window.location.pathname === initialPath && document.head.querySelector('script[data-seo-page]')) return;
    document.head.querySelectorAll('script[data-seo-page]').forEach((el) => el.remove());
    if (notFound || page.noindex) return;
    const blocks = [breadcrumb(path, page), page.type === 'article' && page.published ? article(path, page) : null].filter(Boolean);
    blocks.forEach((data) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-seo-page', '');
      el.textContent = JSON.stringify(data);
      document.head.appendChild(el);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
};

export default Seo;
