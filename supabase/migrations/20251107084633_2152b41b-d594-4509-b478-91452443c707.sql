-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  preferences JSONB NOT NULL DEFAULT '{
    "loan_funded": {"email": true, "in_app": true, "sms": false},
    "application_submitted": {"email": true, "in_app": true, "sms": false},
    "application_approved": {"email": true, "in_app": true, "sms": true},
    "application_rejected": {"email": true, "in_app": true, "sms": false},
    "application_under_review": {"email": true, "in_app": true, "sms": false},
    "document_required": {"email": true, "in_app": true, "sms": false},
    "payment_reminder": {"email": true, "in_app": true, "sms": false},
    "payment_received": {"email": true, "in_app": true, "sms": false},
    "status_update": {"email": true, "in_app": true, "sms": false}
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::user_role));

-- Function to get or create user preferences
CREATE OR REPLACE FUNCTION get_user_notification_preferences(_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_preferences JSONB;
BEGIN
  -- Try to get existing preferences
  SELECT preferences INTO v_preferences
  FROM public.notification_preferences
  WHERE user_id = _user_id;
  
  -- If no preferences exist, create default ones
  IF v_preferences IS NULL THEN
    INSERT INTO public.notification_preferences (user_id)
    VALUES (_user_id)
    RETURNING preferences INTO v_preferences;
  END IF;
  
  RETURN v_preferences;
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();