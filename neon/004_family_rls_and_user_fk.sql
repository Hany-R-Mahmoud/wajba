-- SEC-5. Run on a Neon branch first, then production. Idempotent.
-- Not applied by anyone yet; the owner runs it.
--
-- 1. Row-level security on every Wajba table, with no policies.
--    The server API connects with DATABASE_URL as the table owner, and owners bypass RLS
--    (we do NOT use FORCE ROW LEVEL SECURITY, which would lock the API out too).
--    Any other role, such as the Neon Data API roles if someone ever turns the Data API on,
--    sees no rows and can write none, instead of relying only on REVOKE FROM PUBLIC.
-- 2. Account deletion: member rows and join-limit rows follow the user (ON DELETE CASCADE).
--    Before this, deleting a user who was in a group failed on the foreign key.
--    wajba_groups.owner_id is left as it is (blocks deleting an owner). See the owner decision below.

ALTER TABLE public.wajba_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wajba_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wajba_join_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wajba_backups ENABLE ROW LEVEL SECURITY;

-- Belt and braces for the Data API roles, only where those roles exist.
DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('REVOKE ALL ON public.wajba_groups, public.wajba_group_members, public.wajba_join_limits, public.wajba_backups FROM %I', r);
    END IF;
  END LOOP;
END $$;

-- Re-create a user foreign key with ON DELETE CASCADE unless it already has it.
DO $$
DECLARE
  target record;
  existing record;
BEGIN
  FOR target IN
    SELECT * FROM (VALUES
      ('wajba_group_members', 'user_id'),
      ('wajba_join_limits', 'user_id')
    ) AS t(tbl, col)
  LOOP
    SELECT c.conname, c.confdeltype INTO existing
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
      WHERE c.contype = 'f'
        AND c.conrelid = format('public.%I', target.tbl)::regclass
        AND c.confrelid = 'neon_auth."user"'::regclass
        AND a.attname = target.col;
    IF existing.conname IS NULL OR existing.confdeltype <> 'c' THEN
      IF existing.conname IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', target.tbl, existing.conname);
      END IF;
      EXECUTE format(
        'ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES neon_auth."user"(id) ON DELETE CASCADE',
        target.tbl, target.tbl || '_' || target.col || '_fkey', target.col);
    END IF;
  END LOOP;
END $$;

-- OWNER DECISION (not applied): what should deleting a group owner do?
--   Today: blocked by the foreign key, so account deletion fails until the owner deletes or hands over groups.
--   Option A, delete their groups and, through wajba_group_members, every member's link to them:
--     ALTER TABLE public.wajba_groups DROP CONSTRAINT wajba_groups_owner_id_fkey;
--     ALTER TABLE public.wajba_groups ADD CONSTRAINT wajba_groups_owner_id_fkey
--       FOREIGN KEY (owner_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE;
--   Option B, keep blocking and add a "transfer or delete groups" step to account deletion in the app.
