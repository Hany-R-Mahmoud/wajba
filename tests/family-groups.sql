BEGIN;
-- Run only on an isolated Neon validation branch. All fixtures roll back.
DO $test$
#variable_conflict use_variable
DECLARE
  owner_id uuid := gen_random_uuid();
  member_id uuid := gen_random_uuid();
  outsider_id uuid := gen_random_uuid();
  group_id uuid := gen_random_uuid();
  affected integer;
BEGIN
  INSERT INTO neon_auth."user"(id,name,email,"emailVerified") VALUES
    (owner_id,'Wajba test owner',owner_id::text||'@example.invalid',false),
    (member_id,'Wajba test member',member_id::text||'@example.invalid',false),
    (outsider_id,'Wajba test outsider',outsider_id::text||'@example.invalid',false);
  WITH created AS (
    INSERT INTO public.wajba_groups(id,name,owner_id,invite_code,invite_expires_at)
    VALUES(group_id,'Disposable validation',owner_id,'TESTABC234',now()+interval '30 days') RETURNING id
  ) INSERT INTO public.wajba_group_members(group_id,user_id) SELECT id,owner_id FROM created;
  IF NOT EXISTS(SELECT 1 FROM public.wajba_group_members m WHERE m.group_id=group_id AND m.user_id=owner_id AND status='active') THEN RAISE EXCEPTION 'atomic creation failed'; END IF;
  WITH invitation AS (
    SELECT id FROM public.wajba_groups WHERE invite_code='TESTABC234' AND invite_expires_at>now() FOR UPDATE
  ) INSERT INTO public.wajba_group_members(group_id,user_id) SELECT id,member_id FROM invitation
    ON CONFLICT ON CONSTRAINT wajba_group_members_pkey DO UPDATE SET status='active'
    WHERE wajba_group_members.status <> 'removed';
  IF NOT EXISTS(SELECT 1 FROM public.wajba_group_members m WHERE m.group_id=group_id AND m.user_id=member_id AND status='active') THEN RAISE EXCEPTION 'join failed'; END IF;
  UPDATE public.wajba_groups g SET revision=revision+1 WHERE g.id=group_id AND revision=0
    AND EXISTS(SELECT 1 FROM public.wajba_group_members m WHERE m.group_id=g.id AND m.user_id=member_id AND status='active');
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected<>1 THEN RAISE EXCEPTION 'member publish failed'; END IF;
  UPDATE public.wajba_groups g SET revision=revision+1 WHERE g.id=group_id AND revision=0;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected<>0 THEN RAISE EXCEPTION 'stale revision accepted'; END IF;
  UPDATE public.wajba_groups g SET revision=revision+1 WHERE g.id=group_id
    AND EXISTS(SELECT 1 FROM public.wajba_group_members m WHERE m.group_id=g.id AND m.user_id=outsider_id AND status='active');
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected<>0 THEN RAISE EXCEPTION 'outsider published'; END IF;
  UPDATE public.wajba_groups SET invite_code=NULL WHERE id=group_id;
  IF (SELECT count(*) FROM public.wajba_group_members m WHERE m.group_id=group_id AND status='active')<>2 THEN RAISE EXCEPTION 'revoke disconnected members'; END IF;
  UPDATE public.wajba_groups SET invite_code='TESTABC234',invite_expires_at=now()-interval '1 second' WHERE id=group_id;
  WITH invitation AS (SELECT id FROM public.wajba_groups WHERE invite_code='TESTABC234' AND invite_expires_at>now() FOR UPDATE)
    INSERT INTO public.wajba_group_members(group_id,user_id) SELECT id,outsider_id FROM invitation;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected<>0 THEN RAISE EXCEPTION 'expired invitation accepted'; END IF;
  UPDATE public.wajba_groups SET invite_expires_at=now()+interval '30 days' WHERE id=group_id;
  UPDATE public.wajba_group_members m SET status='removed' WHERE m.group_id=group_id AND m.user_id=member_id;
  WITH invitation AS (SELECT id FROM public.wajba_groups WHERE invite_code='TESTABC234' AND invite_expires_at>now() FOR UPDATE)
    INSERT INTO public.wajba_group_members(group_id,user_id) SELECT id,member_id FROM invitation
    ON CONFLICT ON CONSTRAINT wajba_group_members_pkey DO UPDATE SET status='active'
    WHERE wajba_group_members.status <> 'removed';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected<>0 THEN RAISE EXCEPTION 'removed member rejoined'; END IF;
  UPDATE public.wajba_group_members m SET status='left' WHERE m.group_id=group_id AND m.user_id=owner_id AND status='active'
    AND EXISTS(SELECT 1 FROM public.wajba_groups g WHERE g.id=m.group_id AND g.owner_id<>owner_id);
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected<>0 THEN RAISE EXCEPTION 'owner left group'; END IF;
  FOR affected IN 1..11 LOOP
    INSERT INTO public.wajba_join_limits(user_id) VALUES(outsider_id)
    ON CONFLICT(user_id) DO UPDATE SET attempts=wajba_join_limits.attempts+1;
  END LOOP;
  IF (SELECT attempts FROM public.wajba_join_limits WHERE user_id=outsider_id)<>11 THEN RAISE EXCEPTION 'rate limit count failed'; END IF;
END $test$;
ROLLBACK;
