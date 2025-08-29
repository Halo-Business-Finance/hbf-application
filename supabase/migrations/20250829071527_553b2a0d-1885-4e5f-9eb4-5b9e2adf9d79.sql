-- Add missing RLS policies for crm_sync_log table to secure audit trail
-- Only admin users should be able to update or delete sync log entries

-- Add UPDATE policy for crm_sync_log (only admins)
CREATE POLICY "Only admins can update sync logs" 
ON crm_sync_log 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Add DELETE policy for crm_sync_log (only admins) 
CREATE POLICY "Only admins can delete sync logs" 
ON crm_sync_log 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::user_role));