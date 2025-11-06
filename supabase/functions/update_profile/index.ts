// Supabase Edge Function: update-profile
// Updates the current user's profile using service role to bypass RLS safely
// - Validates JWT to identify the user
// - Uses service role for the DB update

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const body = await req.json().catch(() => ({}));
    const first_name = typeof body.first_name === 'string' ? body.first_name : null;
    const last_name = typeof body.last_name === 'string' ? body.last_name : null;
    const phone = typeof body.phone === 'string' ? body.phone : null;

    // Basic server-side validation
    const sanitize = (s: string | null, max: number) =>
      s && s.trim() ? s.trim().slice(0, max) : null;

    const payload = {
      first_name: sanitize(first_name, 100),
      last_name: sanitize(last_name, 100),
      phone: sanitize(phone, 20),
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