CREATE TABLE IF NOT EXISTS public.wajba_groups (
  id uuid PRIMARY KEY,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
  owner_id uuid NOT NULL REFERENCES neon_auth."user"(id),
  plan jsonb,
  revision integer NOT NULL DEFAULT 0,
  invite_code text UNIQUE,
  invite_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.wajba_group_members (
  group_id uuid NOT NULL REFERENCES public.wajba_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES neon_auth."user"(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','left','removed')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);
CREATE TABLE IF NOT EXISTS public.wajba_join_limits (
  user_id uuid PRIMARY KEY REFERENCES neon_auth."user"(id),
  window_start timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS wajba_group_members_user_idx ON public.wajba_group_members(user_id);
-- These tables are accessed only by the authenticated server API, never a public Data API.
REVOKE ALL ON public.wajba_groups, public.wajba_group_members, public.wajba_join_limits FROM PUBLIC;
