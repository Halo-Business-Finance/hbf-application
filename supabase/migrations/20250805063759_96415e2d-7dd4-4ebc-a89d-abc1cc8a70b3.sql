-- Add email column to loan_applications table
ALTER TABLE public.loan_applications 
ADD COLUMN email text;