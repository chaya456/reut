// Cloudflare Pages Function — runs on EVERY request before static assets are served.
//
// This is a client-side SPA: `public/_redirects` sends every path to the same
// index.html, so without this middleware Google receives byte-identical raw
// HTML (same <title>, same description, no <link rel="canonical">) for the
// homepage, /products, /news and every /product/:slug page. That is exactly
// what Search Console reports as "duplicate content, no user-selected
// canonical" — the pages never got distinct signals before JS even ran.
//
// This rewrites <title>, the description meta tag, the canonical link and the
// og:* tags to match the requested route, so each URL is unique in the raw
// HTML response (no JS execution required for Google to tell them apart).

import { products } from '../data/products';

interface Ctx {
  request: Request;
  next: () => Promise<Response>;
}

// Minimal ambient type for the Workers-runtime HTMLRewriter global
// (avoids adding an @cloudflare/workers-types dependency for one file).
declare class HTMLRewriter {
  on(
    selector: string,
    handlers: {
      element(el: { setAttribute(name: string, value: string): void; setInnerContent(content: string): void }): void;
    }
  ): HTMLRewriter;
  transform(response: Response): Response;
}

const SITE_URL = 'https://erech-musaf.co.il';
const SUFFIX = 'רעות מחמלי - ערך מוסף';
const DEFAULT_DESCRIPTION =
  'רעות מחמלי - ערך מוסף. מומחים בחריטות לייזר, מיתוג יחודי, הטבעה בחום על מוצרים, מקלדות בעיצוב אישי ומכשור חדשני בירושלים.';

interface RouteMeta {
  title: string;
  description: string;
}

const STATIC_ROUTES: Record<string, RouteMeta> = {
  '/': { title: `רעות מחמלי | ערך מוסף - חריטות ומיתוג`, description: DEFAULT_DESCRIPTION },
  '/products': {
    title: `המוצרים שלנו | ${SUFFIX}`,
    description: 'כל המוצרים שניתן להוסיף להם ערך מוסף: חריטות לייזר, הטבעות ומיתוג אישי בירושלים - רעות מחמלי.',
  },
  '/news': {
    title: `ניוז ועדכונים | ${SUFFIX}`,
    description: 'עדכונים, חדשות ומבצעים מרעות מחמלי - ערך מוסף.',
  },
  '/calculator': {
    title: `מחשבון תמחור | ${SUFFIX}`,
    description: 'חישוב הערכת מחיר לחריטת לייזר, הטבעה או מיתוג אישי על המוצר שלכם.',
  },
  '/accessibility': {
    title: `הצהרת נגישות | ${SUFFIX}`,
    description: 'הצהרת הנגישות של אתר רעות מחמלי - ערך מוסף.',
  },
  '/privacy': {
    title: `מדיניות פרטיות | ${SUFFIX}`,
    description: 'מדיניות הפרטיות של אתר רעות מחמלי - ערך מוסף.',
  },
  '/terms': {
    title: `תנאי שימוש | ${SUFFIX}`,
    description: 'תנאי השימוש באתר רעות מחמלי - ערך מוסף.',
  },
};

function getRouteMeta(pathname: string): RouteMeta | null {
  const staticMeta = STATIC_ROUTES[pathname];
  if (staticMeta) return staticMeta;

  if (pathname.startsWith('/product/')) {
    const encodedSlug = pathname.slice('/product/'.length);
    let slug = encodedSlug;
    try {
      slug = decodeURIComponent(encodedSlug);
    } catch {
      // malformed escape sequence - fall back to the raw slug
    }
    const product = products.find((p) => p.id === slug);
    if (product) {
      return { title: `${product.seoTitle} | ${SUFFIX}`, description: product.description };
    }
  }

  return null;
}

export const onRequest = async (ctx: Ctx): Promise<Response> => {
  const { request, next } = ctx;
  const response = await next();

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  const url = new URL(request.url);
  const normalizedPath = url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '/';
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;
  const meta = getRouteMeta(normalizedPath);

  const rewriter = new HTMLRewriter()
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute('href', canonicalUrl);
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute('content', canonicalUrl);
      },
    });

  if (meta) {
    rewriter
      .on('title', {
        element(el) {
          el.setInnerContent(meta.title);
        },
      })
      .on('meta[name="description"]', {
        element(el) {
          el.setAttribute('content', meta.description);
        },
      })
      .on('meta[property="og:title"]', {
        element(el) {
          el.setAttribute('content', meta.title);
        },
      })
      .on('meta[property="og:description"]', {
        element(el) {
          el.setAttribute('content', meta.description);
        },
      });
  }

  return rewriter.transform(response);
};
