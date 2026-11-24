-- SEC-6. Run on a Neon branch first, then production. Idempotent. Not applied by anyone yet.
--
-- A shared per-user rate limit for the API routes that have none today (cloud backup,
-- group create/publish/rotate/revoke/leave/remove). Better Auth's own limiter is in memory per
-- serverless instance, so it does not hold across instances; this one lives in the database.
-- The join flow keeps its own table (wajba_join_limits) and is not touched here.
--
-- Same rule as the join flow: with p_max = N, hits 1..N are allowed and hit N+1 is refused.
--
-- Wired in server/rateLimit.ts (api/backup.ts PUT, api/groups.ts writes). Apply this file BEFORE deploying that code
-- (if the table is missing the code logs a warning and lets the request through). Each call runs
--   SELECT public.wajba_rate_limit_hit(${user}, 'backup_put', interval '1 hour', 30) AS allowed
-- and answer 429 when allowed is false. Suggested buckets and limits:
--   backup_put   30 per hour    (each write is up to 1 MB)
--   backup_get   60 per hour
--   group_create 10 per hour    (the 20-groups-per-owner cap stays)
--   group_write  60 per 10 min  (publish, rotate, revoke, leave, remove)
-- Calls are idempotent per request count, so retried reads cost one hit each; keep limits above retry volume.

CREATE TABLE IF NOT EXISTS public.wajba_rate_limits (
  user_id uuid NOT NULL REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  bucket text NOT NULL CHECK (length(bucket) BETWEEN 1 AND 40),
  window_start timestamptz NOT NULL DEFAULT now(),
  hits integer NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, bucket)
);

-- Server API only, like the other Wajba tables (see 004 for the RLS reasoning).
ALTER TABLE public.wajba_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.wajba_rate_limits FROM PUBLIC;
DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('REVOKE ALL ON public.wajba_rate_limits FROM %I', r);
    END IF;
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.wajba_rate_limit_hit(p_user uuid, p_bucket text, p_window interval, p_max integer)
RETURNS boolean
LANGUAGE sql
AS $$
  WITH hit AS (
    INSERT INTO public.wajba_rate_limits AS l (user_id, bucket)
    VALUES (p_user, p_bucket)
    ON CONFLICT (user_id, bucket) DO UPDATE SET
      hits = CASE WHEN l.window_start < now() - p_window THEN 1 ELSE l.hits + 1 END,
      window_start = CASE WHEN l.window_start < now() - p_window THEN now() ELSE l.window_start END
    RETURNING hits
  )
  SELECT hits <= p_max FROM hit
$$;

REVOKE ALL ON FUNCTION public.wajba_rate_limit_hit(uuid, text, interval, integer) FROM PUBLIC;
DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('REVOKE ALL ON FUNCTION public.wajba_rate_limit_hit(uuid, text, interval, integer) FROM %I', r);
    END IF;
  END LOOP;
END $$;
