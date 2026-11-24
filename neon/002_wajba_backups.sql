-- Documents the cloud-backup table that already exists in production
-- (one JSON backup per signed-in user, written by api/backup.ts).
-- Safe to run on a fresh branch and a no-op on production.
CREATE TABLE IF NOT EXISTS public.wajba_backups (
  user_id text PRIMARY KEY,
  backup jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- Accessed only by the authenticated server API, never a public Data API.
REVOKE ALL ON public.wajba_backups FROM PUBLIC;
