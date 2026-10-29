import { toNodeHandler } from 'better-auth/node';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { appAuth } from '../server/appAuth.js';

// Better Auth must receive the original request stream for OAuth and CSRF checks.
export const config = { api: { bodyParser: false } };

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store');
  const url = new URL(req.url ?? '/', 'https://wajjba.vercel.app');
  const path = url.searchParams.get('authPath');
  if (path) {
    url.pathname = `/api/auth/${path}`;
    url.searchParams.delete('authPath');
    req.url = url.pathname + url.search;
  }
  let auth: ReturnType<typeof appAuth>;
  try {
    auth = appAuth();
  } catch {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Sign-in is temporarily unavailable' }));
    return;
  }
  return toNodeHandler(auth)(req, res);
}
