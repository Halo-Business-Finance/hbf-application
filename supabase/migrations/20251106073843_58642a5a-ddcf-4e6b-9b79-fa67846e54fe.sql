-- Ensure the user_role enum exists
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('user', 'moderator', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;