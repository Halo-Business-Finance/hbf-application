-- Fix 3: Update the create_existing_loan_on_funded trigger to not hardcode anon key
-- Drop the existing trigger first (it's named trigger_create_existing_loan_on_funded)
DROP TRIGGER IF EXISTS trigger_create_existing_loan_on_funded ON public.loan_applications;

-- Now drop the function
DROP FUNCTION IF EXISTS public.create_existing_loan_on_funded();

-- Recreate function without hardcoded anon key
-- Notification sending has been removed - edge functions should handle this
CREATE OR REPLACE FUNCTION public.create_existing_loan_on_funded()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_term_months INTEGER := 60;
  v_interest_rate NUMERIC := 7.5;
  v_monthly_payment NUMERIC;
BEGIN
  IF NEW.status = 'funded' AND (OLD.status IS NULL OR OLD.status != 'funded') THEN
    
    -- Extract term and interest rate from loan_details if available
    IF NEW.loan_details IS NOT NULL THEN
      IF NEW.loan_details->>'term_months' IS NOT NULL THEN
        v_term_months := (NEW.loan_details->>'term_months')::INTEGER;
      END IF;
      
      IF NEW.loan_details->>'interest_rate' IS NOT NULL THEN
        v_interest_rate := (NEW.loan_details->>'interest_rate')::NUMERIC;
      END IF;
    END IF;
    
    -- Calculate monthly payment
    IF NEW.amount_requested IS NOT NULL AND NEW.amount_requested > 0 THEN
      v_monthly_payment := NEW.amount_requested * 
        (v_interest_rate / 1200 * POWER(1 + v_interest_rate / 1200, v_term_months)) / 
        (POWER(1 + v_interest_rate / 1200, v_term_months) - 1);
    ELSE
      v_monthly_payment := 0;
    END IF;
    
    -- Insert the existing loan record
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
    
    -- Note: Notification sending removed from trigger for security.
    -- Edge functions handle notifications using service role credentials.
    
    RAISE NOTICE 'Created existing loan for application %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger with correct naming
CREATE TRIGGER trigger_create_existing_loan_on_funded
  AFTER UPDATE ON public.loan_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.create_existing_loan_on_funded();