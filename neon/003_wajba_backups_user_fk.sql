-- Ties each backup to its user, like the family-group tables already are.
-- Before: user_id was text with no foreign key, so deleting a user left an orphan backup.
-- Run on a branch first. Idempotent: skips when user_id is already uuid.
DO $$
BEGIN
  IF (SELECT data_type FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'wajba_backups' AND column_name = 'user_id') = 'text' THEN
    -- Drop backups that cannot belong to a real user (not a uuid, or user deleted).
    DELETE FROM public.wajba_backups b
      WHERE b.user_id !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
         OR NOT EXISTS (SELECT 1 FROM neon_auth."user" u WHERE u.id::text = b.user_id);
    ALTER TABLE public.wajba_backups ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
    ALTER TABLE public.wajba_backups
      ADD CONSTRAINT wajba_backups_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE;
  END IF;
END $$;
