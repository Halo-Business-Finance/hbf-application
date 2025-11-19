import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, documentName, shareableLink, senderName } = await req.json();

    // Check if Microsoft 365 credentials are configured
    const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
    const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
    const tenantId = Deno.env.get('MICROSOFT_TENANT_ID');
    const senderEmail = Deno.env.get('MICROSOFT_SENDER_EMAIL');

    if (!clientId || !clientSecret || !tenantId || !senderEmail) {
      return new Response(
        JSON.stringify({ 
          error: 'Microsoft 365 credentials not configured. Please add MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID, and MICROSOFT_SENDER_EMAIL in your project secrets.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get access token from Microsoft
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials',
        }),
      }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Token error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to authenticate with Microsoft 365' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Send email via Microsoft Graph API
    const emailBody = {
      message: {
        subject: `${senderName} shared a document with you: ${documentName}`,
        body: {
          contentType: 'HTML',
          content: `
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0078d4;">Document Shared With You</h2>
                <p><strong>${senderName}</strong> has shared a document with you.</p>
                <p><strong>Document:</strong> ${documentName}</p>
                <p style="margin: 30px 0;">
                  <a href="${shareableLink}" 
                     style="background-color: #0078d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    View Document
                  </a>
                </p>
                <p style="color: #666; font-size: 14px;">
                  <em>Note: This link will expire based on the sharing settings.</em>
                </p>
              </body>
            </html>
          `,
        },
        toRecipients: [
          {
            emailAddress: {
              address: recipientEmail,
            },
          },
        ],
      },
      saveToSentItems: true,
    };

    const sendResponse = await fetch(
      `https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailBody),
      }
    );

    if (!sendResponse.ok) {
      const error = await sendResponse.text();
      console.error('Send email error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
