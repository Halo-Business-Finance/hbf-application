// Supabase Edge Function: update-profile
// Updates the current user's profile using service role to bypass RLS safely
// - Validates JWT to identify the user
// - Uses service role for the DB update

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Client bound to the caller JWT to read the user
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    // Validate session and get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    const profileSchema = z.object({
      first_name: z.string().trim().min(1).max(100).optional(),
      last_name: z.string().trim().min(1).max(100).optional(),
      phone: z.string().trim().min(10).max(20).optional()
    });

    const body = await req.json().catch(() => ({}));
    const validation = profileSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid profile data',
          details: validation.error.format()
        }),
        { status: 400, headers: { 'content-type': 'application/json', ...corsHeaders } }
      );
    }

    const payload = {
      first_name: validation.data.first_name || null,
      last_name: validation.data.last_name || null,
      phone: validation.data.phone || null,
      updated_at: new Date().toISOString(),
    } as const;

    // Service-role client to bypass RLS safely
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { error } = await admin
      .from('profiles')
      .update(payload)
      .eq('id', user.id);

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message || 'Update failed' }),
        { status: 400, headers: { 'content-type': 'application/json', ...corsHeaders } },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) } ), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  }
});