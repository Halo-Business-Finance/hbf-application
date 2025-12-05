-- ===========================================
-- SECURITY FIX: Remove permissive INSERT policies
-- ===========================================

-- 1. Drop the permissive INSERT policy on loan_application_status_history
-- The trigger 'track_loan_status_change' already handles status history creation
DROP POLICY IF EXISTS "System can insert status history" ON public.loan_application_status_history;

-- 2. Drop the permissive INSERT policy on notifications  
-- Notifications should only be created through secure channels
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- ===========================================
-- SECURITY FIX: Create dedicated user_roles table
-- This separates role management from user-editable profile data
-- ===========================================

-- 3. Create the app_role enum type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END $$;

-- 4. Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 5. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for user_roles
-- Users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all roles (using a direct check to avoid recursion)
CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
        )
    );

-- Only admins can insert roles
CREATE POLICY "Only admins can insert roles" ON public.user_roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
        )
    );

-- Only admins can update roles
CREATE POLICY "Only admins can update roles" ON public.user_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
        )
    );

-- Only admins can delete roles
CREATE POLICY "Only admins can delete roles" ON public.user_roles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
        )
    );

-- 7. Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 
    CASE 
        WHEN role::text = 'admin' THEN 'admin'::public.app_role
        ELSE 'user'::public.app_role
    END
FROM public.profiles
WHERE id IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- 8. Create the updated has_role function to use the new table
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 9. Overload has_role to also accept user_role enum (for backward compatibility)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = CASE 
          WHEN _role::text = 'admin' THEN 'admin'::public.app_role
          ELSE 'user'::public.app_role
      END
  )
$$;

-- 10. Update get_current_user_role to use the new table
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
      WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::public.app_role) THEN 'admin'::public.user_role
      ELSE 'user'::public.user_role
  END;
$$;

-- 11. Create trigger for updated_at on user_roles
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Create trigger to auto-create user role when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists to avoid duplicates
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;

-- Create trigger to automatically add default role for new users
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();