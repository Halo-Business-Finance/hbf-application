-- Create a safe server-side profile update function that avoids enum dependencies
CREATE OR REPLACE FUNCTION public.update_profile(
  _first_name text,
  _last_name text,
  _phone text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.profiles
  SET 
    first_name = NULLIF(_first_name, ''),
    last_name  = NULLIF(_last_name, ''),
    phone      = NULLIF(_phone, ''),
    updated_at = NOW()
  WHERE id = auth.uid();
END;
$$;