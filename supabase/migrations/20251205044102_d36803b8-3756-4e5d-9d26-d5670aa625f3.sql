-- Drop the redundant role column from profiles table
-- All role checks now use the user_roles table via has_role RPC function

ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;