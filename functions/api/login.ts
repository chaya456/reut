// Cloudflare Pages Function — verifies the admin password server-side.
// The password itself is stored as a Cloudflare environment variable (ADMIN_PASSWORD),
// NOT hardcoded in the browser bundle.
//
//   POST /api/login  { password }  ->  { ok: true|false }

interface Env {
  ADMIN_PASSWORD?: string;
}

interface Ctx {
  request: Request;
  env: Env;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const onRequestPost = async (ctx: Ctx): Promise<Response> => {
  const { request, env } = ctx;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, 400);
  }

  const ok = !!env.ADMIN_PASSWORD && body?.password === env.ADMIN_PASSWORD;
  return json({ ok }, ok ? 200 : 401);
};
