-- Create table for external notification webhooks
CREATE TABLE IF NOT EXISTS public.external_notification_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('slack', 'discord')),
  webhook_url TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  channels JSONB DEFAULT '[]'::jsonb,
  event_types JSONB DEFAULT '["loan_funded", "application_submitted", "application_approved"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.external_notification_webhooks ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage webhooks
CREATE POLICY "Admins can view all webhooks"
  ON public.external_notification_webhooks
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.user_role));

CREATE POLICY "Admins can insert webhooks"
  ON public.external_notification_webhooks
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.user_role));

CREATE POLICY "Admins can update webhooks"
  ON public.external_notification_webhooks
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::public.user_role));

CREATE POLICY "Admins can delete webhooks"
  ON public.external_notification_webhooks
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::public.user_role));

-- Add trigger for updated_at
CREATE TRIGGER update_external_notification_webhooks_updated_at
  BEFORE UPDATE ON public.external_notification_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();