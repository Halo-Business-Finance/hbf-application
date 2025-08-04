import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.52.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationData {
  type: 'email' | 'sms' | 'system';
  recipient: string;
  template: string;
  data: any;
  applicationId?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
      serviceRoleKey
    );

    const { action, notificationData } = await req.json();

    switch (action) {
      case 'send':
        return await sendNotification(notificationData);
      
      case 'send-bulk':
        return await sendBulkNotifications(notificationData.notifications);
      
      case 'get-templates':
        return await getEmailTemplates();

      case 'application-status-change':
        return await handleApplicationStatusChange(supabase, notificationData);

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error in notification-service:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function sendNotification(notificationData: NotificationData): Promise<Response> {
  try {
    console.log(`Sending ${notificationData.type} notification to ${notificationData.recipient}`);

    switch (notificationData.type) {
      case 'email':
        return await sendEmail(notificationData);
      case 'sms':
        return await sendSMS(notificationData);
      case 'system':
        return await createSystemNotification(notificationData);
      default:
        throw new Error('Invalid notification type');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to send notification',
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function sendEmail(notificationData: NotificationData): Promise<Response> {
  try {
    const template = getEmailTemplate(notificationData.template, notificationData.data);
    
    // For demo purposes, we'll log the email instead of actually sending it
    // In production, you would integrate with SendGrid, Resend, or similar service
    console.log('EMAIL NOTIFICATION:');
    console.log('To:', notificationData.recipient);
    console.log('Subject:', template.subject);
    console.log('Content:', template.text);
    
    // Simulate email sending
    const emailLog = {
      timestamp: new Date().toISOString(),
      recipient: notificationData.recipient,
      template: notificationData.template,
      subject: template.subject,
      status: 'sent',
      application_id: notificationData.applicationId
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email notification sent successfully',
        emailLog
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to send email',
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function sendSMS(notificationData: NotificationData): Promise<Response> {
  try {
    const message = getSMSTemplate(notificationData.template, notificationData.data);
    
    // For demo purposes, we'll log the SMS instead of actually sending it
    // In production, you would integrate with Twilio, AWS SNS, or similar service
    console.log('SMS NOTIFICATION:');
    console.log('To:', notificationData.recipient);
    console.log('Message:', message);
    
    const smsLog = {
      timestamp: new Date().toISOString(),
      recipient: notificationData.recipient,
      template: notificationData.template,
      message: message,
      status: 'sent',
      application_id: notificationData.applicationId
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'SMS notification sent successfully',
        smsLog
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error sending SMS:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to send SMS',
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function createSystemNotification(notificationData: NotificationData): Promise<Response> {
  // This would typically store in-app notifications in the database
  console.log('SYSTEM NOTIFICATION:', notificationData);
  
  return new Response(
    JSON.stringify({
      success: true,
      message: 'System notification created successfully'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleApplicationStatusChange(supabase: any, notificationData: any): Promise<Response> {
  try {
    const { applicationId, newStatus, applicantEmail, applicantName, applicationNumber } = notificationData;

    // Send email notification based on status change
    const emailNotification: NotificationData = {
      type: 'email',
      recipient: applicantEmail,
      template: `application_${newStatus}`,
      data: {
        applicantName,
        applicationNumber,
        newStatus,
        timestamp: new Date().toISOString()
      },
      applicationId
    };

    return await sendNotification(emailNotification);

  } catch (error) {
    console.error('Error handling application status change:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to handle application status change',
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function sendBulkNotifications(notifications: NotificationData[]): Promise<Response> {
  const results = [];
  
  for (const notification of notifications) {
    try {
      const response = await sendNotification(notification);
      const result = await response.json();
      results.push({ notification, result });
    } catch (error) {
      results.push({ 
        notification, 
        result: { success: false, error: error.message } 
      });
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: `Processed ${results.length} notifications`,
      results
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getEmailTemplates(): Promise<Response> {
  const templates = {
    application_submitted: {
      subject: 'Application Received - {{applicationNumber}}',
      html: `
        <h2>Thank you for your loan application!</h2>
        <p>Dear {{applicantName}},</p>
        <p>We have received your loan application #{{applicationNumber}}.</p>
        <p>Our team will review your application and contact you within 2-3 business days.</p>
        <p>Best regards,<br>Halo Business Finance Team</p>
      `,
      text: 'Thank you for your loan application! We have received your application #{{applicationNumber}} and will review it within 2-3 business days.'
    },
    application_under_review: {
      subject: 'Application Under Review - {{applicationNumber}}',
      html: `
        <h2>Your application is under review</h2>
        <p>Dear {{applicantName}},</p>
        <p>Your loan application #{{applicationNumber}} is currently under review by our underwriting team.</p>
        <p>We may contact you for additional documentation if needed.</p>
        <p>Best regards,<br>Halo Business Finance Team</p>
      `,
      text: 'Your loan application #{{applicationNumber}} is currently under review by our underwriting team.'
    },
    application_approved: {
      subject: 'Congratulations! Application Approved - {{applicationNumber}}',
      html: `
        <h2>Congratulations! Your loan has been approved!</h2>
        <p>Dear {{applicantName}},</p>
        <p>We are pleased to inform you that your loan application #{{applicationNumber}} has been approved.</p>
        <p>Our team will contact you shortly to discuss the next steps.</p>
        <p>Best regards,<br>Halo Business Finance Team</p>
      `,
      text: 'Congratulations! Your loan application #{{applicationNumber}} has been approved. Our team will contact you shortly.'
    },
    application_rejected: {
      subject: 'Application Update - {{applicationNumber}}',
      html: `
        <h2>Application Update</h2>
        <p>Dear {{applicantName}},</p>
        <p>After careful review, we are unable to approve your loan application #{{applicationNumber}} at this time.</p>
        <p>Please feel free to contact us to discuss alternative options.</p>
        <p>Best regards,<br>Halo Business Finance Team</p>
      `,
      text: 'After careful review, we are unable to approve your loan application #{{applicationNumber}} at this time.'
    }
  };

  return new Response(
    JSON.stringify({ templates }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function getEmailTemplate(templateName: string, data: any): EmailTemplate {
  const templates: { [key: string]: EmailTemplate } = {
    application_submitted: {
      subject: `Application Received - ${data.applicationNumber}`,
      html: `
        <h2>Thank you for your loan application!</h2>
        <p>Dear ${data.applicantName},</p>
        <p>We have received your loan application #${data.applicationNumber}.</p>
        <p>Our team will review your application and contact you within 2-3 business days.</p>
        <p>Best regards,<br>Halo Business Finance Team</p>
      `,
      text: `Thank you for your loan application! We have received your application #${data.applicationNumber} and will review it within 2-3 business days.`
    },
    application_under_review: {
      subject: `Application Under Review - ${data.applicationNumber}`,
      html: `
        <h2>Your application is under review</h2>
        <p>Dear ${data.applicantName},</p>
        <p>Your loan application #${data.applicationNumber} is currently under review by our underwriting team.</p>
        <p>We may contact you for additional documentation if needed.</p>
        <p>Best regards,<br>Halo Business Finance Team</p>
      `,
      text: `Your loan application #${data.applicationNumber} is currently under review by our underwriting team.`
    },
    application_approved: {
      subject: `Congratulations! Application Approved - ${data.applicationNumber}`,
      html: `
        <h2>Congratulations! Your loan has been approved!</h2>
        <p>Dear ${data.applicantName},</p>
        <p>We are pleased to inform you that your loan application #${data.applicationNumber} has been approved.</p>
        <p>Our team will contact you shortly to discuss the next steps.</p>
        <p>Best regards,<br>Halo Business Finance Team</p>
      `,
      text: `Congratulations! Your loan application #${data.applicationNumber} has been approved. Our team will contact you shortly.`
    },
    application_rejected: {
      subject: `Application Update - ${data.applicationNumber}`,
      html: `
        <h2>Application Update</h2>
        <p>Dear ${data.applicantName},</p>
        <p>After careful review, we are unable to approve your loan application #${data.applicationNumber} at this time.</p>
        <p>Please feel free to contact us to discuss alternative options.</p>
        <p>Best regards,<br>Halo Business Finance Team</p>
      `,
      text: `After careful review, we are unable to approve your loan application #${data.applicationNumber} at this time.`
    }
  };

  return templates[templateName] || {
    subject: 'Notification from Halo Business Finance',
    html: '<p>You have received a notification from Halo Business Finance.</p>',
    text: 'You have received a notification from Halo Business Finance.'
  };
}

function getSMSTemplate(templateName: string, data: any): string {
  const templates: { [key: string]: string } = {
    application_submitted: `Halo Business Finance: Your application #${data.applicationNumber} has been received. We'll review it within 2-3 business days.`,
    application_under_review: `Halo Business Finance: Your application #${data.applicationNumber} is under review. We may contact you for additional info.`,
    application_approved: `Halo Business Finance: Congratulations! Your application #${data.applicationNumber} has been approved. We'll contact you soon.`,
    application_rejected: `Halo Business Finance: Your application #${data.applicationNumber} update. Please contact us to discuss options.`
  };

  return templates[templateName] || 'You have received a notification from Halo Business Finance.';
}