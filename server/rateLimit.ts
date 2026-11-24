import type { neon } from '@neondatabase/serverless';

type Sql = ReturnType<typeof neon>;

export const LIMITS = {
  backup_put: { windowSeconds: 3600, max: 30 },
  group_create: { windowSeconds: 3600, max: 10 },
  group_write: { windowSeconds: 600, max: 60 },
} as const;
export type LimitBucket = keyof typeof LIMITS;

// 42P01 = table missing, 42883 = function missing: neon/005 has not been applied yet.
const MISSING = new Set(['42P01', '42883']);

/**
 * Counts one hit for this user and bucket (neon/005). Returns null when allowed, or the
 * Retry-After seconds when refused. If 005 is not applied it fails open with a warning;
 * any other database error is rethrown so the caller's catch answers 500.
 * shortcut: Retry-After is the whole window, not the exact time left; fine for client backoff.
 */
export async function rateLimitHit(sql: Sql, userId: string, bucket: LimitBucket): Promise<number | null> {
  const { windowSeconds, max } = LIMITS[bucket];
  try {
    const rows = await sql`SELECT public.wajba_rate_limit_hit(${userId}::uuid, ${bucket}, make_interval(secs => ${windowSeconds}), ${max}) AS allowed`;
    return rows[0]?.allowed === false ? windowSeconds : null;
  } catch (error) {
    const code = (error as { code?: string } | null)?.code;
    if (code && MISSING.has(code)) {
      console.warn('wajba rate limit skipped: neon/005 is not applied');
      return null;
    }
    throw error;
  }
}
