-- Create credit_scores table
CREATE TABLE IF NOT EXISTS public.credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 300 AND score <= 850),
  bureau TEXT NOT NULL CHECK (bureau IN ('experian', 'equifax', 'transunion')),
  score_date DATE NOT NULL DEFAULT CURRENT_DATE,
  report_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.credit_scores ENABLE ROW LEVEL SECURITY;

-- Policies for credit_scores
CREATE POLICY "Users can view their own credit scores"
  ON public.credit_scores
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit scores"
  ON public.credit_scores
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credit scores"
  ON public.credit_scores
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all credit scores"
  ON public.credit_scores
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Admins can manage all credit scores"
  ON public.credit_scores
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Add trigger for updated_at
CREATE TRIGGER update_credit_scores_updated_at
  BEFORE UPDATE ON public.credit_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster queries
CREATE INDEX idx_credit_scores_user_id ON public.credit_scores(user_id);
CREATE INDEX idx_credit_scores_date ON public.credit_scores(score_date DESC);