import { supabase } from "@/integrations/supabase/client";

interface LoanflowCrmConfig {
  apiEndpoint: string;
  apiKey?: string;
  webhookUrl?: string;
  fieldMapping: {
    [applicationField: string]: string; // maps application fields to CRM fields
  };
}

interface LoanApplicationData {
  first_name: string;
  last_name: string;
  phone: string;
  business_name: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip: string;
  years_in_business: number;
  loan_type: string;
  amount_requested: number;
  application_number: string;
  status: string;
}

export class LoanflowCrmService {
  private config: LoanflowCrmConfig;

  constructor(config: LoanflowCrmConfig) {
    this.config = config;
  }

  /**
   * Sync loan application data to Loanflow CRM
   */
  async syncApplication(applicationData: LoanApplicationData): Promise<{ success: boolean; error?: string }> {
    try {
      // Map application fields to CRM fields
      const crmData = this.mapApplicationToCrm(applicationData);

      // Send to loanflow-crm
      const response = await this.sendToCrm(crmData);

      if (response.ok) {
        // Log successful sync
        await this.logSync(applicationData.application_number, 'success', crmData);
        return { success: true };
      } else {
        const errorText = await response.text();
        await this.logSync(applicationData.application_number, 'failed', crmData, errorText);
        return { success: false, error: errorText };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logSync(applicationData.application_number, 'failed', {}, errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Map application fields to CRM fields based on configuration
   */
  private mapApplicationToCrm(applicationData: LoanApplicationData): Record<string, any> {
    const crmData: Record<string, any> = {};

    // Apply field mapping
    Object.entries(this.config.fieldMapping).forEach(([appField, crmField]) => {
      if (applicationData[appField as keyof LoanApplicationData] !== undefined) {
        crmData[crmField] = applicationData[appField as keyof LoanApplicationData];
      }
    });

    // Add metadata
    crmData.source = 'loan_application';
    crmData.imported_at = new Date().toISOString();
    crmData.application_number = applicationData.application_number;

    return crmData;
  }

  /**
   * Send data to Loanflow CRM
   */
  private async sendToCrm(data: Record<string, any>): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authentication if API key is provided
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    // Use webhook URL if provided, otherwise use API endpoint
    const endpoint = this.config.webhookUrl || this.config.apiEndpoint;

    return fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  /**
   * Log sync attempts for debugging and monitoring
   */
  private async logSync(
    applicationNumber: string, 
    status: 'success' | 'failed', 
    data: Record<string, any>, 
    error?: string
  ): Promise<void> {
    try {
      // Get current user ID from auth context
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('No authenticated user for sync logging');
        return;
      }

      await supabase.from('crm_sync_log').insert({
        user_id: user.id,
        sync_type: 'automatic',
        operation: 'import_application',
        entity_type: 'loan_application',
        status,
        external_id: applicationNumber,
        data_payload: data,
        error_message: error,
        processing_time_ms: Date.now(),
      });
    } catch (logError) {
      console.error('Failed to log sync attempt:', logError);
    }
  }

  /**
   * Test the CRM connection
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
      };

      const response = await this.sendToCrm(testData);
      
      if (response.ok) {
        return { success: true };
      } else {
        const errorText = await response.text();
        return { success: false, error: `Connection test failed: ${errorText}` };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: `Connection test failed: ${errorMessage}` };
    }
  }
}

/**
 * Default field mapping for common CRM fields
 */
export const DEFAULT_FIELD_MAPPING = {
  first_name: 'first_name',
  last_name: 'last_name',
  phone: 'phone',
  business_name: 'company_name',
  business_address: 'address',
  business_city: 'city',
  business_state: 'state',
  business_zip: 'zip_code',
  years_in_business: 'years_in_business',
  loan_type: 'loan_type',
  amount_requested: 'loan_amount',
  application_number: 'application_id',
  status: 'status',
};

/**
 * Create a configured Loanflow CRM service instance
 */
export function createLoanflowCrmService(config: Partial<LoanflowCrmConfig>): LoanflowCrmService {
  const fullConfig: LoanflowCrmConfig = {
    apiEndpoint: config.apiEndpoint || '',
    apiKey: config.apiKey,
    webhookUrl: config.webhookUrl,
    fieldMapping: config.fieldMapping || DEFAULT_FIELD_MAPPING,
  };

  return new LoanflowCrmService(fullConfig);
}