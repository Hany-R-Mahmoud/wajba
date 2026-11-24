BEGIN;
-- Run on an isolated Neon validation branch after neon/004 and neon/005. All fixtures roll back.
DO $test$
#variable_conflict use_variable
DECLARE
  user_id uuid := gen_random_uuid();
  other_id uuid := gen_random_uuid();
  allowed boolean;
  seen integer;
BEGIN
  INSERT INTO neon_auth."user"(id,name,email,"emailVerified") VALUES
    (user_id,'Wajba limit user',user_id::text||'@example.invalid',false),
    (other_id,'Wajba other user',other_id::text||'@example.invalid',false);

  -- max = 3: hits 1 to 3 pass, hit 4 is refused, another user and another bucket are separate.
  FOR i IN 1..3 LOOP
    IF NOT public.wajba_rate_limit_hit(user_id,'t',interval '10 minutes',3) THEN RAISE EXCEPTION 'hit % should pass', i; END IF;
  END LOOP;
  IF public.wajba_rate_limit_hit(user_id,'t',interval '10 minutes',3) THEN RAISE EXCEPTION 'hit 4 should be refused'; END IF;
  IF NOT public.wajba_rate_limit_hit(other_id,'t',interval '10 minutes',3) THEN RAISE EXCEPTION 'other user should pass'; END IF;
  IF NOT public.wajba_rate_limit_hit(user_id,'u',interval '10 minutes',3) THEN RAISE EXCEPTION 'other bucket should pass'; END IF;

  -- An expired window starts over.
  UPDATE public.wajba_rate_limits SET window_start = now() - interval '11 minutes' WHERE user_id = user_id AND bucket = 't';
  IF NOT public.wajba_rate_limit_hit(user_id,'t',interval '10 minutes',3) THEN RAISE EXCEPTION 'new window should pass'; END IF;

  -- Deleting a user removes their limit rows.
  DELETE FROM neon_auth."user" WHERE id = other_id;
  SELECT count(*) INTO seen FROM public.wajba_rate_limits WHERE user_id = other_id;
  IF seen <> 0 THEN RAISE EXCEPTION 'limit rows should cascade'; END IF;
END
$test$;

-- RLS: a role that is not the table owner and has no policy sees nothing, even with a grant.
CREATE ROLE wajba_rls_probe NOLOGIN;
GRANT USAGE ON SCHEMA public TO wajba_rls_probe;
GRANT SELECT ON public.wajba_groups, public.wajba_group_members, public.wajba_backups TO wajba_rls_probe;
SET LOCAL ROLE wajba_rls_probe;
DO $probe$
DECLARE seen integer;
BEGIN
  SELECT count(*) INTO seen FROM (SELECT 1 FROM public.wajba_groups UNION ALL SELECT 1 FROM public.wajba_group_members UNION ALL SELECT 1 FROM public.wajba_backups) s;
  IF seen <> 0 THEN RAISE EXCEPTION 'RLS should hide all rows from a non-owner role'; END IF;
END
$probe$;
RESET ROLE;
ROLLBACK;
