import type { IncomingMessage, ServerResponse } from 'node:http';
import { neon } from '@neondatabase/serverless';
import { authenticatedUser } from '../server/auth.js';
import { parseWajbaBackup } from '../src/utils/storage.js';

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  const reply = (status: number, body: unknown) => { res.statusCode = status; res.end(JSON.stringify(body)); };
  if (!['GET', 'PUT'].includes(req.method ?? '')) {
    res.setHeader('Allow', 'GET, PUT');
    return reply(405, { error: 'Method not allowed' });
  }
  if (!process.env.DATABASE_URL) return reply(503, { error: 'Cloud backup is not configured' });
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return reply(401, { error: 'Sign in required' });
  const userId = await authenticatedUser(req);
  if (!userId) return reply(401, { error: 'Invalid or expired session' });
  try {
    const sql = neon(process.env.DATABASE_URL);
    const users = await sql`SELECT id FROM neon_auth."user" WHERE id = ${userId}`;
    if (users.length === 0) return reply(401, { error: 'Sign in required' });
    if (req.method === 'GET') {
      const rows = await sql`SELECT backup, updated_at FROM public.wajba_backups WHERE user_id = ${userId}`;
      return reply(200, rows[0] ?? { backup: null });
    }
    let body = req.body;
    if (typeof body === 'string') {
      if (Buffer.byteLength(body) > 1_000_000) return reply(413, { error: 'Backup is too large' });
      try { body = JSON.parse(body); } catch { return reply(400, { error: 'Invalid JSON' }); }
    }
    if (Buffer.byteLength(JSON.stringify(body) ?? '') > 1_000_000) return reply(413, { error: 'Backup is too large' });
    const backup = parseWajbaBackup(body);
    if (!backup) return reply(400, { error: 'Invalid Wajba backup' });
    await sql`INSERT INTO public.wajba_backups (user_id, backup) VALUES (${userId}, ${JSON.stringify(backup)}::jsonb)
      ON CONFLICT (user_id) DO UPDATE SET backup = EXCLUDED.backup, updated_at = now()`;
    return reply(200, { saved: true });
  } catch {
    return reply(500, { error: 'Cloud backup is unavailable. Your local data is unchanged.' });
  }
}
