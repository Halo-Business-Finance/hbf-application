-- Create system_settings table to store configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  category TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read settings
CREATE POLICY "Admins can view system settings"
ON public.system_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update settings
CREATE POLICY "Admins can update system settings"
ON public.system_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert settings
CREATE POLICY "Admins can insert system settings"
ON public.system_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.system_settings (setting_key, setting_value, category) VALUES
('notification_email_enabled', '{"enabled": true}'::jsonb, 'notifications'),
('notification_sms_enabled', '{"enabled": false}'::jsonb, 'notifications'),
('notification_system_enabled', '{"enabled": true}'::jsonb, 'notifications'),
('email_template_welcome', '{"subject": "Welcome to Our Platform", "body": "Welcome {{name}}!"}'::jsonb, 'email_templates'),
('data_retention_days', '{"applications": 365, "logs": 90}'::jsonb, 'data_retention'),
('security_password_min_length', '{"value": 8}'::jsonb, 'security'),
('security_session_timeout', '{"minutes": 60}'::jsonb, 'security')
ON CONFLICT (setting_key) DO NOTHING;