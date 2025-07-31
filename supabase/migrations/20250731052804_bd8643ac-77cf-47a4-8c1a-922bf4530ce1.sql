-- CRM Integration Schema for Halo Business Finance

-- CRM Contacts table to store lead and customer information
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  external_crm_id TEXT, -- Reference to loanflow-nexus CRM
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  job_title TEXT,
  lead_source TEXT DEFAULT 'website',
  lead_status TEXT DEFAULT 'new' CHECK (lead_status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  contact_type TEXT DEFAULT 'lead' CHECK (contact_type IN ('lead', 'prospect', 'customer', 'partner')),
  assigned_to UUID, -- Internal user assignment
  notes TEXT,
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_follow_up_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CRM Opportunities table to track loan opportunities
CREATE TABLE public.crm_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  loan_application_id UUID REFERENCES public.loan_applications(id),
  external_crm_id TEXT, -- Reference to loanflow-nexus CRM
  opportunity_name TEXT NOT NULL,
  loan_type TEXT NOT NULL,
  loan_amount NUMERIC(15,2),
  probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  stage TEXT DEFAULT 'prospecting' CHECK (stage IN ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  expected_close_date DATE,
  actual_close_date DATE,
  loss_reason TEXT,
  assigned_to UUID,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CRM Activities table to track interactions
CREATE TABLE public.crm_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES public.crm_opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  external_crm_id TEXT, -- Reference to loanflow-nexus CRM
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'note', 'task', 'application_submitted', 'status_change')),
  subject TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CRM Integration Settings table
CREATE TABLE public.crm_integration_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  external_crm_name TEXT NOT NULL DEFAULT 'loanflow-nexus',
  api_endpoint TEXT,
  sync_enabled BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_direction TEXT DEFAULT 'bidirectional' CHECK (sync_direction IN ('push_only', 'pull_only', 'bidirectional')),
  field_mappings JSONB DEFAULT '{}',
  webhook_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, external_crm_name)
);

-- CRM Sync Log table to track synchronization
CREATE TABLE public.crm_sync_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  sync_type TEXT NOT NULL CHECK (sync_type IN ('manual', 'automatic', 'webhook')),
  operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete', 'sync')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('contact', 'opportunity', 'activity', 'application')),
  entity_id UUID,
  external_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'partial')),
  error_message TEXT,
  data_payload JSONB,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_sync_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for CRM Contacts
CREATE POLICY "Users can view their own contacts" 
ON public.crm_contacts 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can create contacts" 
ON public.crm_contacts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts" 
ON public.crm_contacts 
FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete their own contacts" 
ON public.crm_contacts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for CRM Opportunities
CREATE POLICY "Users can view opportunities for their contacts" 
ON public.crm_opportunities 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.crm_contacts 
    WHERE id = contact_id AND (user_id = auth.uid() OR assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can create opportunities for their contacts" 
ON public.crm_opportunities 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.crm_contacts 
    WHERE id = contact_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update opportunities for their contacts" 
ON public.crm_opportunities 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.crm_contacts 
    WHERE id = contact_id AND (user_id = auth.uid() OR assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can delete opportunities for their contacts" 
ON public.crm_opportunities 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.crm_contacts 
    WHERE id = contact_id AND user_id = auth.uid()
  )
);

-- RLS Policies for CRM Activities
CREATE POLICY "Users can view their own activities" 
ON public.crm_activities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
ON public.crm_activities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" 
ON public.crm_activities 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities" 
ON public.crm_activities 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for CRM Integration Settings
CREATE POLICY "Users can manage their own integration settings" 
ON public.crm_integration_settings 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for CRM Sync Log
CREATE POLICY "Users can view their own sync logs" 
ON public.crm_sync_log 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create sync logs" 
ON public.crm_sync_log 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_crm_contacts_user_id ON public.crm_contacts(user_id);
CREATE INDEX idx_crm_contacts_email ON public.crm_contacts(email);
CREATE INDEX idx_crm_contacts_external_id ON public.crm_contacts(external_crm_id);
CREATE INDEX idx_crm_opportunities_contact_id ON public.crm_opportunities(contact_id);
CREATE INDEX idx_crm_opportunities_loan_app_id ON public.crm_opportunities(loan_application_id);
CREATE INDEX idx_crm_activities_contact_id ON public.crm_activities(contact_id);
CREATE INDEX idx_crm_activities_user_id ON public.crm_activities(user_id);
CREATE INDEX idx_crm_sync_log_user_id ON public.crm_sync_log(user_id);
CREATE INDEX idx_crm_sync_log_created_at ON public.crm_sync_log(created_at);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_crm_contacts_updated_at
BEFORE UPDATE ON public.crm_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_opportunities_updated_at
BEFORE UPDATE ON public.crm_opportunities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_activities_updated_at
BEFORE UPDATE ON public.crm_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_integration_settings_updated_at
BEFORE UPDATE ON public.crm_integration_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();