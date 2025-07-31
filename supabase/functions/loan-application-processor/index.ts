import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoanApplicationData {
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

interface ApplicationValidationResult {
  isValid: boolean;
  errors: string[];
  riskScore: number;
  autoApprovalEligible: boolean;
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

    // Get user from token for authenticated requests
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (user && !userError) {
        userId = user.id;
      }
    }

    const { action, applicationData, applicationId } = await req.json();

    switch (action) {
      case 'validate':
        return await validateApplication(applicationData);
      
      case 'process':
        return await processApplication(supabase, applicationData, userId);
      
      case 'updateStatus':
        return await updateApplicationStatus(supabase, applicationId, applicationData.status, applicationData.notes);
      
      case 'calculate-eligibility':
        return await calculateEligibility(applicationData);

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error in loan-application-processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function validateApplication(applicationData: LoanApplicationData): Promise<Response> {
  const validation: ApplicationValidationResult = {
    isValid: true,
    errors: [],
    riskScore: 0,
    autoApprovalEligible: false
  };

  // Basic validation
  if (!applicationData.first_name || applicationData.first_name.length < 2) {
    validation.errors.push('First name must be at least 2 characters');
    validation.isValid = false;
  }

  if (!applicationData.last_name || applicationData.last_name.length < 2) {
    validation.errors.push('Last name must be at least 2 characters');
    validation.isValid = false;
  }

  if (!applicationData.business_name || applicationData.business_name.length < 2) {
    validation.errors.push('Business name is required');
    validation.isValid = false;
  }

  if (applicationData.amount_requested < 1000) {
    validation.errors.push('Minimum loan amount is $1,000');
    validation.isValid = false;
  }

  if (applicationData.amount_requested > 50000000) {
    validation.errors.push('Maximum loan amount is $50,000,000');
    validation.isValid = false;
  }

  // Phone validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(applicationData.phone.replace(/\D/g, ''))) {
    validation.errors.push('Invalid phone number format');
    validation.isValid = false;
  }

  // Risk scoring algorithm
  let riskScore = 50; // Base score

  // Years in business factor
  if (applicationData.years_in_business >= 5) {
    riskScore -= 15;
  } else if (applicationData.years_in_business >= 2) {
    riskScore -= 8;
  } else if (applicationData.years_in_business < 1) {
    riskScore += 20;
  }

  // Loan amount factor
  if (applicationData.amount_requested > 5000000) {
    riskScore += 15;
  } else if (applicationData.amount_requested < 100000) {
    riskScore -= 5;
  }

  // Loan type factor
  switch (applicationData.loan_type) {
    case 'refinance':
      riskScore -= 10;
      break;
    case 'bridge_loan':
      riskScore += 10;
      break;
    case 'working_capital':
      riskScore += 5;
      break;
  }

  validation.riskScore = Math.max(0, Math.min(100, riskScore));
  validation.autoApprovalEligible = validation.riskScore < 30 && validation.isValid;

  return new Response(
    JSON.stringify(validation),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function processApplication(supabase: any, applicationData: LoanApplicationData, userId?: string): Promise<Response> {
  try {
    // Check if user is authenticated for application submission
    if (!userId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Authentication required to submit application'
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First validate the application
    const validationResponse = await validateApplication(applicationData);
    const validation = await validationResponse.json();

    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          errors: validation.errors,
          message: 'Application validation failed'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine initial status based on risk score
    let initialStatus = 'submitted';
    if (validation.autoApprovalEligible) {
      initialStatus = 'under_review';
    } else if (validation.riskScore > 70) {
      initialStatus = 'requires_review';
    }

    // Generate application number
    const applicationNumber = generateApplicationNumber();

    // Create application record
    const { data: application, error: applicationError } = await supabase
      .from('loan_applications')
      .insert({
        ...applicationData,
        user_id: userId,
        application_number: applicationNumber,
        status: initialStatus,
        application_submitted_date: new Date().toISOString(),
        loan_details: {
          ...applicationData.loan_details,
          risk_score: validation.riskScore,
          auto_approval_eligible: validation.autoApprovalEligible
        }
      })
      .select()
      .single();

    if (applicationError) {
      throw applicationError;
    }

    // Log application processing
    console.log(`Application ${applicationNumber} processed with risk score: ${validation.riskScore}`);

    return new Response(
      JSON.stringify({
        success: true,
        application,
        riskScore: validation.riskScore,
        autoApprovalEligible: validation.autoApprovalEligible,
        message: 'Application processed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing application:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to process application',
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function updateApplicationStatus(
  supabase: any, 
  applicationId: string, 
  newStatus: string, 
  notes?: string
): Promise<Response> {
  try {
    const { data, error } = await supabase
      .from('loan_applications')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        loan_details: supabase.raw(`loan_details || '{"status_notes": "${notes || ''}"}'::jsonb`)
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log(`Application ${applicationId} status updated to: ${newStatus}`);

    return new Response(
      JSON.stringify({
        success: true,
        application: data,
        message: 'Application status updated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating application status:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to update application status',
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function calculateEligibility(applicationData: LoanApplicationData): Promise<Response> {
  const eligibility = {
    eligible: true,
    maxLoanAmount: 0,
    interestRateRange: { min: 0, max: 0 },
    termOptions: [] as string[],
    requirements: [] as string[],
    reasons: [] as string[]
  };

  // Calculate max loan amount based on business age and type
  let baseAmount = 1000000; // $1M base
  
  if (applicationData.years_in_business >= 5) {
    baseAmount *= 5;
  } else if (applicationData.years_in_business >= 2) {
    baseAmount *= 2;
  } else if (applicationData.years_in_business < 1) {
    baseAmount *= 0.5;
    eligibility.requirements.push('Minimum 1 year in business preferred');
  }

  // Adjust based on loan type
  switch (applicationData.loan_type) {
    case 'refinance':
      baseAmount *= 1.2;
      eligibility.interestRateRange = { min: 3.5, max: 6.5 };
      eligibility.termOptions = ['5 years', '10 years', '15 years', '20 years', '25 years'];
      break;
    case 'bridge_loan':
      baseAmount *= 0.8;
      eligibility.interestRateRange = { min: 6.0, max: 12.0 };
      eligibility.termOptions = ['6 months', '12 months', '18 months', '24 months'];
      break;
    case 'working_capital':
      baseAmount *= 0.6;
      eligibility.interestRateRange = { min: 4.0, max: 8.0 };
      eligibility.termOptions = ['1 year', '2 years', '3 years', '5 years'];
      break;
    default:
      eligibility.interestRateRange = { min: 4.0, max: 10.0 };
      eligibility.termOptions = ['2 years', '5 years', '10 years'];
  }

  eligibility.maxLoanAmount = Math.min(baseAmount, 50000000);

  // Check if requested amount exceeds eligibility
  if (applicationData.amount_requested > eligibility.maxLoanAmount) {
    eligibility.eligible = false;
    eligibility.reasons.push(`Requested amount exceeds maximum eligible amount of $${eligibility.maxLoanAmount.toLocaleString()}`);
  }

  // Add general requirements
  eligibility.requirements.push(
    'Valid business license',
    'Financial statements (last 2 years)',
    'Tax returns (business and personal)',
    'Bank statements (last 6 months)',
    'Business plan or project description'
  );

  return new Response(
    JSON.stringify(eligibility),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function generateApplicationNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
  const timeComponent = Math.floor(now.getTime() / 1000) % 86400;
  
  return `HBF-${year}-${dayOfYear.toString().padStart(3, '0')}-${timeComponent.toString().padStart(5, '0')}`;
}