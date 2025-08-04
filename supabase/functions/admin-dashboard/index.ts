import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApplicationStats {
  total: number;
  byStatus: { [key: string]: number };
  byLoanType: { [key: string]: number };
  totalAmount: number;
  averageAmount: number;
  thisMonth: number;
  thisWeek: number;
}

interface ApplicationFilter {
  status?: string;
  loanType?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  searchTerm?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get service role key from environment
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      "https://zosgzkpfgaaadadezpxo.supabase.co",
      serviceRoleKey,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    let action = url.searchParams.get('action') || 'stats';
    let body = null;

    // Handle POST requests with body
    if (req.method === 'POST') {
      try {
        body = await req.json();
        if (body.action) {
          action = body.action;
        }
      } catch (e) {
        // If no valid JSON body, continue with URL params
      }
    }

    switch (action) {
      case 'stats':
        return await getApplicationStats(supabase);
      
      case 'applications':
        const filters = body ? body : Object.fromEntries(url.searchParams.entries());
        return await getFilteredApplications(supabase, filters);
      
      case 'update-status':
        const { applicationId, status, notes } = await req.json();
        return await updateApplicationStatus(supabase, applicationId, status, notes);
      
      case 'export':
        return await exportApplications(supabase, Object.fromEntries(url.searchParams.entries()));

      case 'analytics':
        return await getAnalytics(supabase);

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error in admin-dashboard:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getApplicationStats(supabase: any): Promise<Response> {
  try {
    // Get all applications
    const { data: applications, error } = await supabase
      .from('loan_applications')
      .select('*');

    if (error) throw error;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const stats: ApplicationStats = {
      total: applications.length,
      byStatus: {},
      byLoanType: {},
      totalAmount: 0,
      averageAmount: 0,
      thisMonth: 0,
      thisWeek: 0
    };

    applications.forEach((app: any) => {
      // Status counts
      stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
      
      // Loan type counts
      stats.byLoanType[app.loan_type] = (stats.byLoanType[app.loan_type] || 0) + 1;
      
      // Amount calculations
      if (app.amount_requested) {
        stats.totalAmount += app.amount_requested;
      }
      
      // Time-based counts
      const createdAt = new Date(app.created_at);
      if (createdAt >= startOfMonth) {
        stats.thisMonth++;
      }
      if (createdAt >= startOfWeek) {
        stats.thisWeek++;
      }
    });

    stats.averageAmount = applications.length > 0 ? stats.totalAmount / applications.length : 0;

    return new Response(
      JSON.stringify({ stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error getting application stats:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get application stats',
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getFilteredApplications(supabase: any, filters: ApplicationFilter): Promise<Response> {
  try {
    let query = supabase
      .from('loan_applications')
      .select(`
        *,
        profiles(first_name, last_name)
      `);

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.loanType) {
      query = query.eq('loan_type', filters.loanType);
    }

    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    if (filters.amountMin) {
      query = query.gte('amount_requested', parseInt(filters.amountMin));
    }

    if (filters.amountMax) {
      query = query.lte('amount_requested', parseInt(filters.amountMax));
    }

    if (filters.searchTerm) {
      query = query.or(`
        business_name.ilike.%${filters.searchTerm}%,
        first_name.ilike.%${filters.searchTerm}%,
        last_name.ilike.%${filters.searchTerm}%,
        application_number.ilike.%${filters.searchTerm}%
      `);
    }

    // Order by most recent first
    query = query.order('created_at', { ascending: false });

    const { data: applications, error } = await query;

    if (error) throw error;

    // Format applications to flatten profile data
    const formattedApplications = applications.map((app: any) => ({
      ...app,
      first_name: app.profiles?.first_name || app.first_name || 'N/A',
      last_name: app.profiles?.last_name || app.last_name || 'N/A',
      profiles: undefined // Remove the nested profiles object
    }));

    return new Response(
      JSON.stringify({ applications: formattedApplications }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error getting filtered applications:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get applications',
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function updateApplicationStatus(
  supabase: any, 
  applicationId: string, 
  status: string, 
  notes?: string
): Promise<Response> {
  try {
    // Get current application details
    const { data: application, error: fetchError } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (fetchError) throw fetchError;

    // Update application status
    const { data: updatedApplication, error: updateError } = await supabase
      .from('loan_applications')
      .update({
        status: status,
        updated_at: new Date().toISOString(),
        loan_details: {
          ...application.loan_details,
          status_notes: notes || '',
          status_updated_at: new Date().toISOString()
        }
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Trigger notification (call notification service)
    try {
      await supabase.functions.invoke('notification-service', {
        body: {
          action: 'application-status-change',
          notificationData: {
            applicationId,
            newStatus: status,
            applicantEmail: `${application.first_name}@example.com`, // In real app, get from user profile
            applicantName: `${application.first_name} ${application.last_name}`,
            applicationNumber: application.application_number
          }
        }
      });
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't fail the status update if notification fails
    }

    console.log(`Application ${applicationId} status updated to: ${status}`);

    return new Response(
      JSON.stringify({
        success: true,
        application: updatedApplication,
        message: 'Application status updated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating application status:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update application status',
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function exportApplications(supabase: any, filters: ApplicationFilter): Promise<Response> {
  try {
    // Get applications with the same filtering logic
    const applicationsResponse = await getFilteredApplications(supabase, filters);
    const { applications } = await applicationsResponse.json();

    // Convert to CSV format
    const csvHeader = [
      'Application Number',
      'Status',
      'Loan Type',
      'Amount Requested',
      'Applicant Name',
      'Business Name',
      'Phone',
      'Years in Business',
      'Application Date',
      'Submitted Date'
    ].join(',');

    const csvRows = applications.map((app: any) => [
      app.application_number || '',
      app.status || '',
      app.loan_type || '',
      app.amount_requested || 0,
      `"${app.first_name || ''} ${app.last_name || ''}"`,
      `"${app.business_name || ''}"`,
      app.phone || '',
      app.years_in_business || 0,
      app.application_started_date ? new Date(app.application_started_date).toLocaleDateString() : '',
      app.application_submitted_date ? new Date(app.application_submitted_date).toLocaleDateString() : ''
    ].join(','));

    const csvContent = [csvHeader, ...csvRows].join('\n');

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="loan_applications_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Error exporting applications:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to export applications',
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getAnalytics(supabase: any): Promise<Response> {
  try {
    const { data: applications, error } = await supabase
      .from('loan_applications')
      .select('*');

    if (error) throw error;

    // Calculate analytics
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const analytics = {
      totalApplications: applications.length,
      applicationsTrend: {
        last30Days: applications.filter((app: any) => new Date(app.created_at) >= last30Days).length,
        last7Days: applications.filter((app: any) => new Date(app.created_at) >= last7Days).length
      },
      approvalRate: {
        total: applications.filter((app: any) => app.status === 'approved').length / applications.length * 100,
        last30Days: 0
      },
      averageProcessingTime: calculateAverageProcessingTime(applications),
      topLoanTypes: getTopLoanTypes(applications),
      amountDistribution: getAmountDistribution(applications),
      statusDistribution: getStatusDistribution(applications)
    };

    // Calculate approval rate for last 30 days
    const recentApps = applications.filter((app: any) => new Date(app.created_at) >= last30Days);
    if (recentApps.length > 0) {
      analytics.approvalRate.last30Days = 
        recentApps.filter((app: any) => app.status === 'approved').length / recentApps.length * 100;
    }

    return new Response(
      JSON.stringify({ analytics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error getting analytics:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get analytics',
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

function calculateAverageProcessingTime(applications: any[]): number {
  const processedApps = applications.filter(app => 
    app.application_submitted_date && 
    (app.status === 'approved' || app.status === 'rejected')
  );

  if (processedApps.length === 0) return 0;

  const totalTime = processedApps.reduce((sum, app) => {
    const submitted = new Date(app.application_submitted_date);
    const processed = new Date(app.updated_at);
    return sum + (processed.getTime() - submitted.getTime());
  }, 0);

  return totalTime / processedApps.length / (1000 * 60 * 60 * 24); // Convert to days
}

function getTopLoanTypes(applications: any[]): Array<{ type: string; count: number; percentage: number }> {
  const typeCounts: { [key: string]: number } = {};
  
  applications.forEach(app => {
    typeCounts[app.loan_type] = (typeCounts[app.loan_type] || 0) + 1;
  });

  return Object.entries(typeCounts)
    .map(([type, count]) => ({
      type,
      count,
      percentage: (count / applications.length) * 100
    }))
    .sort((a, b) => b.count - a.count);
}

function getAmountDistribution(applications: any[]): Array<{ range: string; count: number }> {
  const ranges = [
    { min: 0, max: 50000, label: '$0 - $50K' },
    { min: 50000, max: 100000, label: '$50K - $100K' },
    { min: 100000, max: 500000, label: '$100K - $500K' },
    { min: 500000, max: 1000000, label: '$500K - $1M' },
    { min: 1000000, max: 5000000, label: '$1M - $5M' },
    { min: 5000000, max: Infinity, label: '$5M+' }
  ];

  return ranges.map(range => ({
    range: range.label,
    count: applications.filter(app => 
      app.amount_requested >= range.min && app.amount_requested < range.max
    ).length
  }));
}

function getStatusDistribution(applications: any[]): Array<{ status: string; count: number; percentage: number }> {
  const statusCounts: { [key: string]: number } = {};
  
  applications.forEach(app => {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
  });

  return Object.entries(statusCounts)
    .map(([status, count]) => ({
      status,
      count,
      percentage: (count / applications.length) * 100
    }))
    .sort((a, b) => b.count - a.count);
}