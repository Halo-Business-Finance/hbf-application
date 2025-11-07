-- Create existing_loans table for tracking funded loans
CREATE TABLE public.existing_loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  loan_application_id UUID REFERENCES public.loan_applications(id) ON DELETE SET NULL,
  loan_type TEXT NOT NULL CHECK (loan_type IN ('commercial', 'business')),
  loan_name TEXT NOT NULL,
  lender TEXT NOT NULL,
  loan_balance NUMERIC NOT NULL,
  original_amount NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  term_months INTEGER NOT NULL,
  remaining_months INTEGER NOT NULL,
  maturity_date DATE NOT NULL,
  origination_date DATE NOT NULL,
  has_prepayment_penalty BOOLEAN NOT NULL DEFAULT false,
  prepayment_period_end_date DATE,
  status TEXT NOT NULL DEFAULT 'current' CHECK (status IN ('current', 'funded_by_us', 'partner_funded')),
  loan_purpose TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.existing_loans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own existing loans"
  ON public.existing_loans
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own existing loans"
  ON public.existing_loans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own existing loans"
  ON public.existing_loans
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own existing loans"
  ON public.existing_loans
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all existing loans"
  ON public.existing_loans
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins can update all existing loans"
  ON public.existing_loans
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Add trigger for updated_at
CREATE TRIGGER update_existing_loans_updated_at
  BEFORE UPDATE ON public.existing_loans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();