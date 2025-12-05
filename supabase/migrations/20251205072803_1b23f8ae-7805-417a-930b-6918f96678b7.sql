-- Create function to sanitize sensitive fields from CRM sync log data_payload
CREATE OR REPLACE FUNCTION public.sanitize_crm_sync_payload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sanitized_payload JSONB;
  sensitive_fields TEXT[] := ARRAY['ssn', 'social_security', 'tax_id', 'ein', 'password', 'credit_card', 'card_number', 'cvv', 'bank_account', 'routing_number', 'drivers_license', 'passport'];
  field TEXT;
BEGIN
  -- Start with the original payload
  sanitized_payload := COALESCE(NEW.data_payload, '{}'::jsonb);
  
  -- Redact known sensitive fields (case-insensitive check)
  FOREACH field IN ARRAY sensitive_fields
  LOOP
    -- Check top-level fields
    IF sanitized_payload ? field THEN
      sanitized_payload := sanitized_payload || jsonb_build_object(field, '[REDACTED]');
    END IF;
    
    -- Check common nested structures
    IF sanitized_payload->'data' ? field THEN
      sanitized_payload := jsonb_set(sanitized_payload, ARRAY['data', field], '"[REDACTED]"'::jsonb);
    END IF;
    
    IF sanitized_payload->'contact' ? field THEN
      sanitized_payload := jsonb_set(sanitized_payload, ARRAY['contact', field], '"[REDACTED]"'::jsonb);
    END IF;
    
    IF sanitized_payload->'customer' ? field THEN
      sanitized_payload := jsonb_set(sanitized_payload, ARRAY['customer', field], '"[REDACTED]"'::jsonb);
    END IF;
  END LOOP;
  
  -- Mask email addresses (show only first 3 chars)
  IF sanitized_payload ? 'email' AND jsonb_typeof(sanitized_payload->'email') = 'string' THEN
    sanitized_payload := jsonb_set(
      sanitized_payload, 
      ARRAY['email'], 
      to_jsonb(SUBSTRING(sanitized_payload->>'email' FROM 1 FOR 3) || '***@***')
    );
  END IF;
  
  -- Mask phone numbers (show only last 4 digits)
  IF sanitized_payload ? 'phone' AND jsonb_typeof(sanitized_payload->'phone') = 'string' THEN
    sanitized_payload := jsonb_set(
      sanitized_payload, 
      ARRAY['phone'], 
      to_jsonb('***-***-' || RIGHT(REGEXP_REPLACE(sanitized_payload->>'phone', '[^0-9]', '', 'g'), 4))
    );
  END IF;
  
  NEW.data_payload := sanitized_payload;
  RETURN NEW;
END;
$$;

-- Create trigger to sanitize data on insert
DROP TRIGGER IF EXISTS sanitize_crm_sync_payload_trigger ON public.crm_sync_log;
CREATE TRIGGER sanitize_crm_sync_payload_trigger
  BEFORE INSERT ON public.crm_sync_log
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_crm_sync_payload();

-- Create function to enforce data retention (delete logs older than 90 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_crm_sync_logs()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.crm_sync_log
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE 'Deleted % old CRM sync log entries', deleted_count;
  RETURN deleted_count;
END;
$$;

-- Add comment documenting the retention policy
COMMENT ON FUNCTION public.cleanup_old_crm_sync_logs() IS 'Deletes CRM sync logs older than 90 days. Should be called periodically via cron job or scheduled function.';