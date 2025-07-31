import { supabase } from '@/integrations/supabase/client';

export interface LoanApplicationValidation {
  isValid: boolean;
  errors: string[];
  riskScore: number;
  autoApprovalEligible: boolean;
}

export interface LoanEligibility {
  eligible: boolean;
  maxLoanAmount: number;
  interestRateRange: { min: number; max: number };
  termOptions: string[];
  requirements: string[];
  reasons: string[];
}

export interface LoanApplicationData {
  loan_type: string;
  amount_requested: number;
  first_name: string;
  last_name: string;
  phone: string;
  business_name: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip: string;
  years_in_business: number;
  loan_details: any;
}

class LoanApplicationService {
  /**
   * Validate loan application data
   */
  async validateApplication(applicationData: LoanApplicationData): Promise<LoanApplicationValidation> {
    try {
      const { data, error } = await supabase.functions.invoke('loan-application-processor', {
        body: {
          action: 'validate',
          applicationData
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error validating application:', error);
      throw new Error('Failed to validate application');
    }
  }

  /**
   * Process and submit loan application
   */
  async processApplication(applicationData: LoanApplicationData) {
    try {
      const { data, error } = await supabase.functions.invoke('loan-application-processor', {
        body: {
          action: 'process',
          applicationData
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error processing application:', error);
      throw new Error('Failed to process application');
    }
  }

  /**
   * Update application status (admin function)
   */
  async updateApplicationStatus(applicationId: string, status: string, notes?: string) {
    try {
      const { data, error } = await supabase.functions.invoke('loan-application-processor', {
        body: {
          action: 'updateStatus',
          applicationId,
          applicationData: { status, notes }
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw new Error('Failed to update application status');
    }
  }

  /**
   * Calculate loan eligibility
   */
  async calculateEligibility(applicationData: LoanApplicationData): Promise<LoanEligibility> {
    try {
      const { data, error } = await supabase.functions.invoke('loan-application-processor', {
        body: {
          action: 'calculate-eligibility',
          applicationData
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error calculating eligibility:', error);
      throw new Error('Failed to calculate eligibility');
    }
  }

  /**
   * Get user's loan applications
   */
  async getUserApplications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw new Error('Failed to fetch applications');
    }
  }

  /**
   * Get application by ID
   */
  async getApplicationById(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw new Error('Failed to fetch application');
    }
  }

  /**
   * Save application as draft
   */
  async saveAsDraft(userId: string, applicationData: Partial<LoanApplicationData>) {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert({
          user_id: userId,
          loan_type: applicationData.loan_type as any,
          amount_requested: applicationData.amount_requested,
          first_name: applicationData.first_name,
          last_name: applicationData.last_name,
          phone: applicationData.phone,
          business_name: applicationData.business_name,
          business_address: applicationData.business_address,
          business_city: applicationData.business_city,
          business_state: applicationData.business_state,
          business_zip: applicationData.business_zip,
          years_in_business: applicationData.years_in_business,
          loan_details: applicationData.loan_details || {},
          status: 'draft',
          application_started_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error('Failed to save draft');
    }
  }

  /**
   * Delete application (draft only)
   */
  async deleteApplication(applicationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('loan_applications')
        .delete()
        .eq('id', applicationId)
        .eq('user_id', userId)
        .eq('status', 'draft');

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting application:', error);
      throw new Error('Failed to delete application');
    }
  }
}

export const loanApplicationService = new LoanApplicationService();