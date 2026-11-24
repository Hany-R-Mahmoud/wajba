import type { IncomingMessage } from 'node:http';
import { neon } from '@neondatabase/serverless';

export async function authenticatedUser(req: IncomingMessage): Promise<string | null> {
  if (!req.headers.authorization?.startsWith('Bearer ')) return null;
  try {
    const token = req.headers.authorization.slice(7);
    if (!token.startsWith('session:')) return null;
    const sessionToken = token.slice(8);
    if (!process.env.DATABASE_URL || !/^[A-Za-z0-9_-]{32,512}$/.test(sessionToken)) return null;
    const sql = neon(process.env.DATABASE_URL);
    const users = await sql`SELECT s."userId" FROM neon_auth.session s
      JOIN neon_auth."user" u ON u.id=s."userId"
      WHERE s.token=${sessionToken} AND s."expiresAt">now()
      AND (u.banned IS NOT TRUE OR u."banExpires"<=now())`;
    return users.length === 1 ? users[0].userId : null;
  } catch { return null; }
}
