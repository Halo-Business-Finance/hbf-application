import { supabase } from '@/integrations/supabase/client';

export interface CRMContact {
  id?: string;
  user_id?: string;
  external_crm_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  lead_source?: string;
  lead_status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  contact_type?: 'lead' | 'prospect' | 'customer' | 'partner';
  assigned_to?: string;
  notes?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  last_contact_date?: string;
  next_follow_up_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CRMOpportunity {
  id?: string;
  contact_id: string;
  loan_application_id?: string;
  external_crm_id?: string;
  opportunity_name: string;
  loan_type: string;
  loan_amount?: number;
  probability?: number;
  stage?: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  expected_close_date?: string;
  actual_close_date?: string;
  loss_reason?: string;
  assigned_to?: string;
  notes?: string;
  custom_fields?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CRMActivity {
  id?: string;
  contact_id?: string;
  opportunity_id?: string;
  user_id?: string;
  external_crm_id?: string;
  activity_type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'application_submitted' | 'status_change';
  subject: string;
  description?: string;
  duration_minutes?: number;
  scheduled_at?: string;
  completed_at?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  created_at?: string;
  updated_at?: string;
}

export interface CRMIntegrationSettings {
  id?: string;
  user_id?: string;
  external_crm_name?: string;
  api_endpoint?: string;
  sync_enabled?: boolean;
  last_sync_at?: string;
  sync_direction?: 'push_only' | 'pull_only' | 'bidirectional';
  field_mappings?: Record<string, any>;
  webhook_url?: string;
  settings?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

class CRMService {
  async createContact(contactData: Omit<CRMContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<CRMContact> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'create_contact',
        data: contactData
      }
    });

    if (error) {
      console.error('Error creating contact:', error);
      throw new Error('Failed to create contact');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to create contact');
    }

    return data.contact;
  }

  async updateContact(id: string, updates: Partial<CRMContact>): Promise<CRMContact> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'update_contact',
        data: { id, updates }
      }
    });

    if (error) {
      console.error('Error updating contact:', error);
      throw new Error('Failed to update contact');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to update contact');
    }

    return data.contact;
  }

  async getContacts(): Promise<CRMContact[]> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'get_contacts'
      }
    });

    if (error) {
      console.error('Error fetching contacts:', error);
      throw new Error('Failed to fetch contacts');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch contacts');
    }

    return data.contacts;
  }

  async createOpportunity(opportunityData: Omit<CRMOpportunity, 'id' | 'created_at' | 'updated_at'>): Promise<CRMOpportunity> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'create_opportunity',
        data: opportunityData
      }
    });

    if (error) {
      console.error('Error creating opportunity:', error);
      throw new Error('Failed to create opportunity');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to create opportunity');
    }

    return data.opportunity;
  }

  async updateOpportunity(id: string, updates: Partial<CRMOpportunity>): Promise<CRMOpportunity> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'update_opportunity',
        data: { id, updates }
      }
    });

    if (error) {
      console.error('Error updating opportunity:', error);
      throw new Error('Failed to update opportunity');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to update opportunity');
    }

    return data.opportunity;
  }

  async getOpportunities(): Promise<CRMOpportunity[]> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'get_opportunities'
      }
    });

    if (error) {
      console.error('Error fetching opportunities:', error);
      throw new Error('Failed to fetch opportunities');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch opportunities');
    }

    return data.opportunities;
  }

  async createActivity(activityData: Omit<CRMActivity, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<CRMActivity> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'create_activity',
        data: activityData
      }
    });

    if (error) {
      console.error('Error creating activity:', error);
      throw new Error('Failed to create activity');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to create activity');
    }

    return data.activity;
  }

  async getActivities(contactId?: string): Promise<CRMActivity[]> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'get_activities',
        data: { contact_id: contactId }
      }
    });

    if (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch activities');
    }

    return data.activities;
  }

  async syncLoanApplication(applicationId: string): Promise<{ contact: CRMContact; opportunity: CRMOpportunity }> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'sync_loan_application',
        data: { applicationId }
      }
    });

    if (error) {
      console.error('Error syncing loan application:', error);
      throw new Error('Failed to sync loan application to CRM');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to sync loan application to CRM');
    }

    return { contact: data.contact, opportunity: data.opportunity };
  }

  async syncWithExternalCRM(entityType: string, entityData: any): Promise<string> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'sync_with_external_crm',
        data: { entity_type: entityType, ...entityData }
      }
    });

    if (error) {
      console.error('Error syncing with external CRM:', error);
      throw new Error('Failed to sync with external CRM');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to sync with external CRM');
    }

    return data.syncLogId;
  }

  async getIntegrationSettings(): Promise<CRMIntegrationSettings[]> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'get_integration_settings'
      }
    });

    if (error) {
      console.error('Error fetching integration settings:', error);
      throw new Error('Failed to fetch integration settings');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch integration settings');
    }

    return data.settings;
  }

  async updateIntegrationSettings(settingsData: Partial<CRMIntegrationSettings>): Promise<CRMIntegrationSettings> {
    const { data, error } = await supabase.functions.invoke('crm-integration', {
      body: {
        action: 'update_integration_settings',
        data: settingsData
      }
    });

    if (error) {
      console.error('Error updating integration settings:', error);
      throw new Error('Failed to update integration settings');
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to update integration settings');
    }

    return data.settings;
  }

  // Utility methods for status mappings between loan applications and CRM
  mapLoanStatusToCRMStage(loanStatus: string): string {
    const statusMap: Record<string, string> = {
      'draft': 'prospecting',
      'submitted': 'qualification',
      'under_review': 'proposal',
      'approved': 'negotiation',
      'funded': 'closed_won',
      'rejected': 'closed_lost',
      'cancelled': 'closed_lost'
    };
    return statusMap[loanStatus] || 'prospecting';
  }

  mapCRMStageToLoanStatus(crmStage: string): string {
    const stageMap: Record<string, string> = {
      'prospecting': 'draft',
      'qualification': 'submitted',
      'proposal': 'under_review',
      'negotiation': 'approved',
      'closed_won': 'funded',
      'closed_lost': 'rejected'
    };
    return stageMap[crmStage] || 'draft';
  }

  calculateOpportunityProbability(stage: string, loanAmount: number): number {
    const baseProbabilities: Record<string, number> = {
      'prospecting': 10,
      'qualification': 25,
      'proposal': 50,
      'negotiation': 75,
      'closed_won': 100,
      'closed_lost': 0
    };

    let probability = baseProbabilities[stage] || 10;

    // Adjust based on loan amount (smaller loans typically have higher success rates)
    if (loanAmount <= 100000) {
      probability += 15;
    } else if (loanAmount <= 500000) {
      probability += 10;
    } else if (loanAmount <= 1000000) {
      probability += 5;
    }

    return Math.min(100, Math.max(0, probability));
  }
}

export const crmService = new CRMService();