-- Qualify enum casts in RLS policies to avoid search_path issues causing
-- "type \"user_role\" does not exist" errors during updates.

-- Ensure schema exists and enum is available (no-op if already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'user_role'
      AND n.nspname = 'public'
      AND t.typtype = 'e'
  ) THEN
    CREATE TYPE public.user_role AS ENUM ('admin','moderator','user');
  END IF;
END $$;

-- Update profiles table policies to use fully-qualified enum casts
ALTER POLICY "Admins can update any profile" ON public.profiles
  USING (public.has_role(auth.uid(), 'admin'::public.user_role) OR (auth.uid() = id));

ALTER POLICY "Admins can view all profiles" ON public.profiles
  USING (public.has_role(auth.uid(), 'admin'::public.user_role) OR (auth.uid() = id));

ALTER POLICY "Only admins can update user roles" ON public.profiles
  USING (public.has_role(auth.uid(), 'admin'::public.user_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.user_role));