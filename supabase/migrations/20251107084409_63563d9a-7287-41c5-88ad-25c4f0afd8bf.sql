-- Update trigger to include userId in notification payload
CREATE OR REPLACE FUNCTION public.create_existing_loan_on_funded()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_term_months INTEGER := 60;
  v_interest_rate NUMERIC := 7.5;
  v_monthly_payment NUMERIC;
  v_user_email TEXT;
  v_user_name TEXT;
  v_loan_number TEXT;
BEGIN
  IF NEW.status = 'funded' AND (OLD.status IS NULL OR OLD.status != 'funded') THEN
    
    IF NEW.loan_details IS NOT NULL THEN
      IF NEW.loan_details->>'term_months' IS NOT NULL THEN
        v_term_months := (NEW.loan_details->>'term_months')::INTEGER;
      END IF;
      
      IF NEW.loan_details->>'interest_rate' IS NOT NULL THEN
        v_interest_rate := (NEW.loan_details->>'interest_rate')::NUMERIC;
      END IF;
    END IF;
    
    IF NEW.amount_requested IS NOT NULL AND NEW.amount_requested > 0 THEN
      v_monthly_payment := NEW.amount_requested * 
        (v_interest_rate / 1200 * POWER(1 + v_interest_rate / 1200, v_term_months)) / 
        (POWER(1 + v_interest_rate / 1200, v_term_months) - 1);
    ELSE
      v_monthly_payment := 0;
    END IF;
    
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
    
    -- Get user details for notification
    SELECT email INTO v_user_email
    FROM auth.users
    WHERE id = NEW.user_id;
    
    v_user_name := COALESCE(NEW.first_name || ' ' || NEW.last_name, 'Valued Customer');
    v_loan_number := COALESCE(NEW.application_number, NEW.id::TEXT);
    
    -- Send notification using pg_net extension (include userId for in-app notification)
    PERFORM net.http_post(
      url := 'https://zosgzkpfgaaadadezpxo.supabase.co/functions/v1/notification-service',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc2d6a3BmZ2FhYWRhZGV6cHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NzAxMjgsImV4cCI6MjA2OTE0NjEyOH0.r2puMuMTlbLkXqceD7MfC630q_W0K-9GbI632BtFJOY'
      ),
      body := jsonb_build_object(
        'action', 'loan-funded',
        'notificationData', jsonb_build_object(
          'userId', NEW.user_id,
          'applicantEmail', v_user_email,
          'applicantName', v_user_name,
          'loanNumber', v_loan_number,
          'loanAmount', NEW.amount_requested,
          'loanType', NEW.loan_type,
          'monthlyPayment', v_monthly_payment,
          'interestRate', v_interest_rate,
          'termMonths', v_term_months
        )
      )
    );
    
    RAISE NOTICE 'Created existing loan for application % and sent notification to %', NEW.id, v_user_email;
  END IF;
  
  RETURN NEW;
END;
$function$;