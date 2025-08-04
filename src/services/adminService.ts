import { supabase } from '@/integrations/supabase/client';

export interface ApplicationStats {
  total: number;
  byStatus: { [key: string]: number };
  byLoanType: { [key: string]: number };
  totalAmount: number;
  averageAmount: number;
  thisMonth: number;
  thisWeek: number;
}

export interface ApplicationFilter {
  status?: string;
  loanType?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  searchTerm?: string;
}

export interface Analytics {
  totalApplications: number;
  applicationsTrend: {
    last30Days: number;
    last7Days: number;
  };
  approvalRate: {
    total: number;
    last30Days: number;
  };
  averageProcessingTime: number;
  topLoanTypes: Array<{ type: string; count: number; percentage: number }>;
  amountDistribution: Array<{ range: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number; percentage: number }>;
}

class AdminService {
  /**
   * Get application statistics
   */
  async getApplicationStats(): Promise<ApplicationStats> {
    try {
      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: null
      });

      if (error) throw error;

      return data.stats;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      throw new Error('Failed to fetch application statistics');
    }
  }

  /**
   * Get filtered applications
   */
  async getFilteredApplications(filters: ApplicationFilter) {
    try {
      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: {
          action: 'applications',
          ...filters
        }
      });

      if (error) throw error;

      return data.applications;
    } catch (error) {
      console.error('Error fetching filtered applications:', error);
      throw new Error('Failed to fetch applications');
    }
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(applicationId: string, status: string, notes?: string) {
    try {
      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: {
          applicationId,
          status,
          notes
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
   * Export applications to CSV
   */
  async exportApplications(filters: ApplicationFilter): Promise<Blob> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('action', 'export');
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `https://zosgzkpfgaaadadezpxo.supabase.co/functions/v1/admin-dashboard?${searchParams}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc2d6a3BmZ2FhYWRhZGV6cHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NzAxMjgsImV4cCI6MjA2OTE0NjEyOH0.r2puMuMTlbLkXqceD7MfC630q_W0K-9GbI632BtFJOY'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting applications:', error);
      throw new Error('Failed to export applications');
    }
  }

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<Analytics> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('action', 'analytics');

      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: null
      });

      if (error) throw error;

      return data.analytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to fetch analytics');
    }
  }

  /**
   * Get all applications (admin view)
   */
  async getAllApplications() {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select(`
          *,
          profiles(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching all applications:', error);
      throw new Error('Failed to fetch applications');
    }
  }

  /**
   * Get application details with full information
   */
  async getApplicationDetails(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select(`
          *,
          profiles(*)
        `)
        .eq('id', applicationId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw new Error('Failed to fetch application details');
    }
  }

  /**
   * Batch update application statuses
   */
  async batchUpdateStatus(applicationIds: string[], status: string, notes?: string) {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .update({
          status: status as any,
          updated_at: new Date().toISOString()
        })
        .in('id', applicationIds)
        .select();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error batch updating applications:', error);
      throw new Error('Failed to batch update applications');
    }
  }
}

export const adminService = new AdminService();