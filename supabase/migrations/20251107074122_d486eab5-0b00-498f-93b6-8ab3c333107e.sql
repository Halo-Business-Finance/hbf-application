-- Function to automatically create an existing loan when application is funded
CREATE OR REPLACE FUNCTION public.create_existing_loan_on_funded()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_term_months INTEGER := 60; -- Default 5 year term
  v_interest_rate NUMERIC := 7.5; -- Default 7.5% interest rate
  v_monthly_payment NUMERIC;
BEGIN
  -- Only proceed if status changed to 'funded'
  IF NEW.status = 'funded' AND (OLD.status IS NULL OR OLD.status != 'funded') THEN
    
    -- Try to extract term and rate from loan_details if available
    IF NEW.loan_details IS NOT NULL THEN
      IF NEW.loan_details->>'term_months' IS NOT NULL THEN
        v_term_months := (NEW.loan_details->>'term_months')::INTEGER;
      END IF;
      
      IF NEW.loan_details->>'interest_rate' IS NOT NULL THEN
        v_interest_rate := (NEW.loan_details->>'interest_rate')::NUMERIC;
      END IF;
    END IF;
    
    -- Calculate monthly payment using standard loan formula
    -- P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    -- where P = payment, L = loan amount, c = monthly interest rate, n = number of payments
    IF NEW.amount_requested IS NOT NULL AND NEW.amount_requested > 0 THEN
      v_monthly_payment := NEW.amount_requested * 
        (v_interest_rate / 1200 * POWER(1 + v_interest_rate / 1200, v_term_months)) / 
        (POWER(1 + v_interest_rate / 1200, v_term_months) - 1);
    ELSE
      v_monthly_payment := 0;
    END IF;
    
    -- Insert new existing loan record
    INSERT INTO public.existing_loans (
      user_id,
      loan_application_id,
      loan_name,
      loan_type,
      lender,
      loan_balance,
      original_amount,
      monthly_payment,
      interest_rate,
      term_months,
      remaining_months,
      maturity_date,
      origination_date,
      status,
      loan_purpose,
      has_prepayment_penalty,
      prepayment_period_end_date
    ) VALUES (
      NEW.user_id,
      NEW.id,
      COALESCE(NEW.business_name, NEW.first_name || ' ' || NEW.last_name) || ' - ' || NEW.loan_type,
      NEW.loan_type,
      'Heritage Business Funding',
      COALESCE(NEW.amount_requested, 0),
      COALESCE(NEW.amount_requested, 0),
      v_monthly_payment,
      v_interest_rate,
      v_term_months,
      v_term_months,
      CURRENT_DATE + (v_term_months || ' months')::INTERVAL,
      CURRENT_DATE,
      'current',
      COALESCE(NEW.loan_details->>'loan_purpose', 'Business financing'),
      false,
      NULL
    );
    
    -- Log the creation
    RAISE NOTICE 'Created existing loan for application %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on loan_applications table
DROP TRIGGER IF EXISTS trigger_create_existing_loan_on_funded ON public.loan_applications;

CREATE TRIGGER trigger_create_existing_loan_on_funded
  AFTER UPDATE OF status ON public.loan_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.create_existing_loan_on_funded();

-- Add comment for documentation
COMMENT ON FUNCTION public.create_existing_loan_on_funded() IS 
'Automatically creates an existing_loans record when a loan_application status changes to funded. Extracts loan terms from loan_details JSON if available, otherwise uses defaults.';