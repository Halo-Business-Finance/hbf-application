-- Create role enum type
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Add role column to profiles table with default 'user'
ALTER TABLE public.profiles 
ADD COLUMN role public.user_role NOT NULL DEFAULT 'user';

-- Create security definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  );
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role 
  FROM public.profiles 
  WHERE id = auth.uid();
$$;

-- Update profiles RLS policies to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = id);

-- Update profiles RLS policies to allow admins to update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = id);

-- Allow admins to view all loan applications
CREATE POLICY "Admins can view all loan applications" 
ON public.loan_applications 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

-- Allow admins to update all loan applications
CREATE POLICY "Admins can update all loan applications" 
ON public.loan_applications 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);