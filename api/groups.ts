import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomInt, randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { authenticatedUser } from '../server/auth.js';
import { parseFamilyPlan } from '../src/utils/family.js';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 10 }, () => alphabet[randomInt(alphabet.length)]).join('');
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  const reply = (status: number, value: unknown) => { res.statusCode = status; res.end(JSON.stringify(value)); };
  if (!['GET','POST'].includes(req.method ?? '')) { res.setHeader('Allow', 'GET, POST'); return reply(405, { error: 'Method not allowed' }); }
  if (!process.env.DATABASE_URL || !process.env.NEON_AUTH_BASE_URL) return reply(503, { error: 'Not configured' });
  const user = await authenticatedUser(req);
  if (!user) return reply(401, { error: 'Sign in required' });
  try {
    const sql = neon(process.env.DATABASE_URL);
    if (!(await sql`SELECT id FROM neon_auth."user" WHERE id=${user}`).length) return reply(401, { error: 'Sign in required' });
    if (req.method === 'GET') {
      const id = new URL(req.url ?? '/', 'https://wajjba.vercel.app').searchParams.get('id');
      if (id && !uuid.test(id)) return reply(400, { error: 'Invalid group' });
      const groups = await sql`SELECT g.id,g.name,g.owner_id,g.plan,g.revision,(g.owner_id=${user}) AS is_owner,
        (SELECT count(*)::int FROM public.wajba_group_members WHERE group_id=g.id AND status='active') AS member_count
        FROM public.wajba_groups g JOIN public.wajba_group_members m ON m.group_id=g.id
        WHERE m.user_id=${user} AND m.status='active' ORDER BY g.created_at DESC`;
      if (!id) return reply(200, { groups });
      const group = groups.find(g => g.id === id);
      if (!group) return reply(403, { error: 'Not a group member' });
      const members = await sql`SELECT m.user_id,u.name,(g.owner_id=m.user_id) AS is_owner
        FROM public.wajba_group_members m JOIN neon_auth."user" u ON u.id=m.user_id
        JOIN public.wajba_groups g ON g.id=m.group_id WHERE m.group_id=${id} AND m.status='active' ORDER BY m.joined_at`;
      const invites = group.is_owner ? await sql`SELECT invite_code,invite_expires_at FROM public.wajba_groups WHERE id=${id}` : [];
      return reply(200, { group, members, invite: invites[0] ?? null });
    }
    let body = req.body;
    if (Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body) ?? '') > 1_000_000) return reply(413, { error: 'Plan too large' });
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return reply(400, { error: 'Invalid JSON' }); } }
    if (!body || typeof body !== 'object') return reply(400, { error: 'Invalid request' });
    const data = body as Record<string, unknown>;
    if (data.action === 'create') {
      const name = typeof data.name === 'string' ? data.name.trim() : '';
      if (!name || name.length > 80) return reply(400, { error: 'Invalid group name' });
      const id = randomUUID(), code = newCode();
      const rows = await sql`WITH created AS (
        INSERT INTO public.wajba_groups(id,name,owner_id,invite_code,invite_expires_at)
        SELECT ${id},${name},${user},${code},now()+interval '30 days'
        WHERE (SELECT count(*) FROM public.wajba_groups WHERE owner_id=${user}) < 20 RETURNING id
      ) INSERT INTO public.wajba_group_members(group_id,user_id) SELECT id,${user} FROM created RETURNING group_id`;
      return rows.length ? reply(200, { id }) : reply(400, { error: 'Group limit reached' });
    }
    if (data.action === 'join') {
      const code = typeof data.code === 'string' ? data.code.trim().toUpperCase() : '';
      const limits = await sql`INSERT INTO public.wajba_join_limits(user_id) VALUES(${user})
        ON CONFLICT(user_id) DO UPDATE SET
        attempts=CASE WHEN wajba_join_limits.window_start < now()-interval '10 minutes' THEN 1 ELSE wajba_join_limits.attempts+1 END,
        window_start=CASE WHEN wajba_join_limits.window_start < now()-interval '10 minutes' THEN now() ELSE wajba_join_limits.window_start END RETURNING attempts`;
      if (limits[0].attempts > 10) return reply(429, { error: 'Too many attempts. Try later.' });
      if (!/^[A-HJ-NP-Z2-9]{10}$/.test(code)) return reply(400, { error: 'Invalid or expired invitation' });
      const rows = await sql`WITH invitation AS (
        SELECT id FROM public.wajba_groups WHERE invite_code=${code} AND invite_expires_at>now() FOR UPDATE
      ) INSERT INTO public.wajba_group_members(group_id,user_id) SELECT id,${user} FROM invitation
        ON CONFLICT(group_id,user_id) DO UPDATE SET status='active'
        WHERE wajba_group_members.status <> 'removed' RETURNING group_id`;
      return rows.length ? reply(200, { id: rows[0].group_id }) : reply(400, { error: 'Invalid or expired invitation' });
    }
    if (typeof data.id !== 'string' || !uuid.test(data.id)) return reply(400, { error: 'Invalid group' });
    const id = data.id;
    if (data.action === 'publish') {
      const plan = parseFamilyPlan(data.plan);
      if (!plan || !Number.isInteger(data.revision)) return reply(400, { error: 'Invalid plan' });
      const rows = await sql`UPDATE public.wajba_groups g SET plan=${JSON.stringify(plan)}::jsonb,revision=revision+1
        WHERE g.id=${id} AND g.revision=${data.revision as number}
        AND EXISTS(SELECT 1 FROM public.wajba_group_members WHERE group_id=g.id AND user_id=${user} AND status='active') RETURNING revision`;
      return rows.length ? reply(200, { revision: rows[0].revision }) : reply(409, { error: 'Plan changed or access ended. Refresh first.' });
    }
    if (data.action === 'rotate' || data.action === 'revoke') {
      const code = data.action === 'rotate' ? newCode() : null;
      const rows = await sql`UPDATE public.wajba_groups SET invite_code=${code},invite_expires_at=now()+interval '30 days'
        WHERE id=${id} AND owner_id=${user} RETURNING id`;
      return rows.length ? reply(200, { ok: true }) : reply(403, { error: 'Owner only' });
    }
    if (data.action === 'leave') {
      const rows = await sql`UPDATE public.wajba_group_members m SET status='left' WHERE group_id=${id} AND user_id=${user} AND status='active'
        AND EXISTS(SELECT 1 FROM public.wajba_groups WHERE id=m.group_id AND owner_id<>${user}) RETURNING user_id`;
      return rows.length ? reply(200, { ok: true }) : reply(403, { error: 'Owner must keep membership' });
    }
    if (data.action === 'remove' && typeof data.userId === 'string' && uuid.test(data.userId) && data.userId !== user) {
      const rows = await sql`WITH locked AS (SELECT id FROM public.wajba_groups WHERE id=${id} AND owner_id=${user} FOR UPDATE),
        removed AS (UPDATE public.wajba_group_members SET status='removed' WHERE group_id IN(SELECT id FROM locked) AND user_id=${data.userId} RETURNING group_id)
        UPDATE public.wajba_groups SET invite_code=NULL WHERE id IN(SELECT group_id FROM removed) RETURNING id`;
      return rows.length ? reply(200, { ok: true }) : reply(403, { error: 'Owner only' });
    }
    return reply(400, { error: 'Unknown action' });
  } catch { return reply(500, { error: 'Group request failed. Try again.' }); }
}
