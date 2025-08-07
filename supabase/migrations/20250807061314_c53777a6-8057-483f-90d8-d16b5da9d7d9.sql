-- Fix the function search path security warning
-- This ensures the function operates with a secure search path

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is being changed and the user is not an admin, prevent the update
  IF OLD.role IS DISTINCT FROM NEW.role AND NOT has_role(auth.uid(), 'admin'::user_role) THEN
    RAISE EXCEPTION 'Only administrators can modify user roles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = '';