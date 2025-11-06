-- Create table to track loan application status changes
CREATE TABLE IF NOT EXISTS public.loan_application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id UUID NOT NULL,
  status TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  changed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loan_application_status_history ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_status_history_loan_id 
ON public.loan_application_status_history(loan_application_id);

-- RLS Policies
CREATE POLICY "Users can view status history for their applications"
ON public.loan_application_status_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.loan_applications
    WHERE loan_applications.id = loan_application_status_history.loan_application_id
    AND loan_applications.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all status history"
ON public.loan_application_status_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "System can insert status history"
ON public.loan_application_status_history
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update status history"
ON public.loan_application_status_history
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::user_role));

-- Create function to automatically track status changes
CREATE OR REPLACE FUNCTION public.track_loan_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.loan_application_status_history (
      loan_application_id,
      status,
      changed_by,
      notes
    ) VALUES (
      NEW.id,
      NEW.status,
      auth.uid(),
      'Status changed from ' || COALESCE(OLD.status, 'none') || ' to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create trigger to track status changes
DROP TRIGGER IF EXISTS track_loan_status_change_trigger ON public.loan_applications;
CREATE TRIGGER track_loan_status_change_trigger
AFTER UPDATE ON public.loan_applications
FOR EACH ROW
EXECUTE FUNCTION public.track_loan_status_change();

-- Backfill existing applications with initial draft status
INSERT INTO public.loan_application_status_history (loan_application_id, status, changed_at, notes)
SELECT 
  id,
  status,
  created_at,
  'Initial application creation'
FROM public.loan_applications
WHERE id NOT IN (SELECT DISTINCT loan_application_id FROM public.loan_application_status_history)
ON CONFLICT DO NOTHING;