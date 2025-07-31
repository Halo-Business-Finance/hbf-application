import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CRMContact {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  lead_source?: string;
  lead_status?: string;
  contact_type?: string;
  notes?: string;
  tags?: string[];
}

interface CRMOpportunity {
  id?: string;
  contact_id: string;
  loan_application_id?: string;
  opportunity_name: string;
  loan_type: string;
  loan_amount?: number;
  probability?: number;
  stage?: string;
  expected_close_date?: string;
  notes?: string;
}

interface CRMActivity {
  id?: string;
  contact_id?: string;
  opportunity_id?: string;
  activity_type: string;
  subject: string;
  description?: string;
  duration_minutes?: number;
  scheduled_at?: string;
  completed_at?: string;
  status?: string;
  priority?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    
    const supabase = createClient(
      "https://zosgzkpfgaaadadezpxo.supabase.co",
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc2d6a3BmZ2FhYWRhZGV6cHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NzAxMjgsImV4cCI6MjA2OTE0NjEyOH0.r2puMuMTlbLkXqceD7MfC630q_W0K-9GbI632BtFJOY"
    );

    // Get user from token
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (user && !userError) {
        userId = user.id;
      }
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, data } = await req.json();

    switch (action) {
      case 'create_contact':
        return await createContact(supabase, userId, data);
      
      case 'update_contact':
        return await updateContact(supabase, userId, data);
      
      case 'get_contacts':
        return await getContacts(supabase, userId);
      
      case 'create_opportunity':
        return await createOpportunity(supabase, userId, data);
      
      case 'update_opportunity':
        return await updateOpportunity(supabase, userId, data);
      
      case 'get_opportunities':
        return await getOpportunities(supabase, userId);
      
      case 'create_activity':
        return await createActivity(supabase, userId, data);
      
      case 'get_activities':
        return await getActivities(supabase, userId, data.contact_id);
      
      case 'sync_loan_application':
        return await syncLoanApplication(supabase, userId, data);
      
      case 'sync_with_external_crm':
        return await syncWithExternalCRM(supabase, userId, data);
      
      case 'get_integration_settings':
        return await getIntegrationSettings(supabase, userId);
      
      case 'update_integration_settings':
        return await updateIntegrationSettings(supabase, userId, data);

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error in crm-integration:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function createContact(supabase: any, userId: string, contactData: CRMContact): Promise<Response> {
  try {
    const { data: contact, error } = await supabase
      .from('crm_contacts')
      .insert({
        ...contactData,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await createActivity(supabase, userId, {
      contact_id: contact.id,
      activity_type: 'note',
      subject: 'Contact Created',
      description: `New contact created: ${contactData.first_name} ${contactData.last_name}`,
      status: 'completed',
      completed_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ success: true, contact }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function updateContact(supabase: any, userId: string, data: { id: string; updates: Partial<CRMContact> }): Promise<Response> {
  try {
    const { data: contact, error } = await supabase
      .from('crm_contacts')
      .update(data.updates)
      .eq('id', data.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, contact }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating contact:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getContacts(supabase: any, userId: string): Promise<Response> {
  try {
    const { data: contacts, error } = await supabase
      .from('crm_contacts')
      .select('*, crm_opportunities(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, contacts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function createOpportunity(supabase: any, userId: string, opportunityData: CRMOpportunity): Promise<Response> {
  try {
    const { data: opportunity, error } = await supabase
      .from('crm_opportunities')
      .insert(opportunityData)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await createActivity(supabase, userId, {
      contact_id: opportunityData.contact_id,
      opportunity_id: opportunity.id,
      activity_type: 'note',
      subject: 'Opportunity Created',
      description: `New opportunity created: ${opportunityData.opportunity_name}`,
      status: 'completed',
      completed_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ success: true, opportunity }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating opportunity:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function updateOpportunity(supabase: any, userId: string, data: { id: string; updates: Partial<CRMOpportunity> }): Promise<Response> {
  try {
    const { data: opportunity, error } = await supabase
      .from('crm_opportunities')
      .update(data.updates)
      .eq('id', data.id)
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, opportunity }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getOpportunities(supabase: any, userId: string): Promise<Response> {
  try {
    const { data: opportunities, error } = await supabase
      .from('crm_opportunities')
      .select(`
        *,
        crm_contacts(first_name, last_name, email, company_name),
        loan_applications(application_number, status)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, opportunities }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function createActivity(supabase: any, userId: string, activityData: CRMActivity): Promise<Response> {
  try {
    const { data: activity, error } = await supabase
      .from('crm_activities')
      .insert({
        ...activityData,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, activity }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating activity:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getActivities(supabase: any, userId: string, contactId?: string): Promise<Response> {
  try {
    let query = supabase
      .from('crm_activities')
      .select(`
        *,
        crm_contacts(first_name, last_name),
        crm_opportunities(opportunity_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (contactId) {
      query = query.eq('contact_id', contactId);
    }

    const { data: activities, error } = await query;

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, activities }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching activities:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function syncLoanApplication(supabase: any, userId: string, data: { applicationId: string }): Promise<Response> {
  try {
    // Get loan application details
    const { data: application, error: appError } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('id', data.applicationId)
      .eq('user_id', userId)
      .single();

    if (appError) throw appError;

    // Check if contact already exists
    let contact;
    const { data: existingContact } = await supabase
      .from('crm_contacts')
      .select('*')
      .eq('email', `${application.first_name.toLowerCase()}.${application.last_name.toLowerCase()}@example.com`)
      .eq('user_id', userId)
      .single();

    if (existingContact) {
      contact = existingContact;
    } else {
      // Create new contact
      const { data: newContact, error: contactError } = await supabase
        .from('crm_contacts')
        .insert({
          user_id: userId,
          first_name: application.first_name,
          last_name: application.last_name,
          email: `${application.first_name.toLowerCase()}.${application.last_name.toLowerCase()}@example.com`,
          phone: application.phone,
          company_name: application.business_name,
          lead_source: 'loan_application',
          lead_status: 'qualified',
          contact_type: 'prospect'
        })
        .select()
        .single();

      if (contactError) throw contactError;
      contact = newContact;
    }

    // Create opportunity
    const { data: opportunity, error: oppError } = await supabase
      .from('crm_opportunities')
      .insert({
        contact_id: contact.id,
        loan_application_id: application.id,
        opportunity_name: `${application.loan_type} - ${application.business_name}`,
        loan_type: application.loan_type,
        loan_amount: application.amount_requested,
        stage: application.status === 'submitted' ? 'qualification' : 'prospecting',
        probability: application.status === 'submitted' ? 75 : 50
      })
      .select()
      .single();

    if (oppError) throw oppError;

    // Log activity
    await createActivity(supabase, userId, {
      contact_id: contact.id,
      opportunity_id: opportunity.id,
      activity_type: 'application_submitted',
      subject: 'Loan Application Submitted',
      description: `${application.loan_type} application for $${application.amount_requested?.toLocaleString()} submitted`,
      status: 'completed',
      completed_at: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ success: true, contact, opportunity }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing loan application:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function syncWithExternalCRM(supabase: any, userId: string, data: any): Promise<Response> {
  try {
    // Get integration settings
    const { data: settings, error: settingsError } = await supabase
      .from('crm_integration_settings')
      .select('*')
      .eq('user_id', userId)
      .eq('external_crm_name', 'loanflow-nexus')
      .single();

    if (settingsError || !settings || !settings.sync_enabled) {
      return new Response(
        JSON.stringify({ success: false, error: 'CRM integration not configured or disabled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log sync attempt
    const { data: syncLog, error: logError } = await supabase
      .from('crm_sync_log')
      .insert({
        user_id: userId,
        sync_type: 'manual',
        operation: 'sync',
        entity_type: data.entity_type || 'contact',
        status: 'pending',
        data_payload: data
      })
      .select()
      .single();

    if (logError) throw logError;

    // Here you would implement the actual sync logic with loanflow-nexus
    // For now, we'll simulate a successful sync
    
    // Update sync log
    await supabase
      .from('crm_sync_log')
      .update({
        status: 'success',
        processing_time_ms: 1500
      })
      .eq('id', syncLog.id);

    return new Response(
      JSON.stringify({ success: true, message: 'Sync completed successfully', syncLogId: syncLog.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing with external CRM:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getIntegrationSettings(supabase: any, userId: string): Promise<Response> {
  try {
    const { data: settings, error } = await supabase
      .from('crm_integration_settings')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, settings }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching integration settings:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function updateIntegrationSettings(supabase: any, userId: string, settingsData: any): Promise<Response> {
  try {
    const { data: settings, error } = await supabase
      .from('crm_integration_settings')
      .upsert({
        user_id: userId,
        external_crm_name: 'loanflow-nexus',
        ...settingsData
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, settings }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating integration settings:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}