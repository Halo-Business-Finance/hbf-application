-- Fix search_path for notification functions
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.notifications
  SET read = true, read_at = now()
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.notifications
  SET read = true, read_at = now()
  WHERE user_id = auth.uid() AND read = false;
END;
$$;