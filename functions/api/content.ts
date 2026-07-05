// Cloudflare Pages Function — same-origin API for reading/writing site content.
// The Sanity write token lives ONLY here (server-side), never in the browser.
//
// Routes handled:
//   GET  /api/content  -> returns the current site content from Sanity
//   POST /api/content  -> saves site content to Sanity (requires the admin password)
//
// Required Cloudflare environment variables (Settings -> Environment variables):
//   SANITY_TOKEN     - a Sanity token with WRITE (Editor) permissions
//   ADMIN_PASSWORD   - the password the site owner types to log in
// Optional (defaults shown):
//   SANITY_PROJECT_ID (default: s42jv3ts)
//   SANITY_DATASET    (default: production)

interface Env {
  SANITY_TOKEN?: string;
  ADMIN_PASSWORD?: string;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
}

interface Ctx {
  request: Request;
  env: Env;
}

const API_VERSION = '2023-05-03';
const DEFAULT_PROJECT_ID = 's42jv3ts';
const DEFAULT_DATASET = 'production';

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const sanityBase = (env: Env): string => {
  const projectId = env.SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
  const dataset = env.SANITY_DATASET || DEFAULT_DATASET;
  return `https://${projectId}.api.sanity.io/v${API_VERSION}/data/{op}/${dataset}`;
};

export const onRequestGet = async (ctx: Ctx): Promise<Response> => {
  const { env } = ctx;
  try {
    const query = encodeURIComponent('*[_id == "siteContent"][0]');
    const url = `${sanityBase(env).replace('{op}', 'query')}?query=${query}`;
    const headers: Record<string, string> = {};
    if (env.SANITY_TOKEN) headers['Authorization'] = `Bearer ${env.SANITY_TOKEN}`;

    const res = await fetch(url, { headers });
    if (!res.ok) return json({ result: null });

    const data: any = await res.json();
    return json({ result: data.result ?? null });
  } catch {
    return json({ result: null });
  }
};

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  const { request, env } = ctx;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_json' }, 400);
  }

  // Password check happens on the SERVER — the real gate.
  if (!env.ADMIN_PASSWORD || body?.password !== env.ADMIN_PASSWORD) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }

  if (!env.SANITY_TOKEN) {
    return json({ ok: false, error: 'server_not_configured' }, 500);
  }

  const content = body?.content;
  if (!content || typeof content !== 'object') {
    return json({ ok: false, error: 'no_content' }, 400);
  }

  try {
    const url = sanityBase(env).replace('{op}', 'mutate');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.SANITY_TOKEN}`,
      },
      body: JSON.stringify({
        mutations: [
          {
            createOrReplace: {
              _id: 'siteContent',
              _type: 'siteContent',
              ...content,
            },
          },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return json({ ok: false, error: text }, 502);
    }

    return json({ ok: true });
  } catch (error: any) {
    return json({ ok: false, error: String(error?.message || error) }, 502);
  }
};
