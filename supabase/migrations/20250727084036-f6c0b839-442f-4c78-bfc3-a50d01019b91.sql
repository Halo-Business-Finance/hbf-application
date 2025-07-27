-- Fix security issues by updating function search paths

-- Update the update_updated_at_column function to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Update the generate_application_number function to set search_path  
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.application_number IS NULL THEN
    NEW.application_number := 'HBF-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || LPAD((EXTRACT(EPOCH FROM NOW()) % 86400)::INTEGER::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;