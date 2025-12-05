// Supabase Edge Function: update-profile
// Updates the current user's profile using authenticated client
// - Validates JWT to identify the user
// - Uses authenticated client with RLS for security transparency

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

    // Client bound to the caller JWT - RLS policies will be enforced
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    // Validate session and get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Authentication failed:', userError?.message);
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
      console.warn('Profile validation failed for user:', user.id);
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

    // Use authenticated client - RLS policy ensures users can only update their own profile
    // The RLS policy "Users can update their own profile" already enforces auth.uid() = id
    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id);

    if (error) {
      console.error('Profile update failed for user:', user.id, error.message);
      return new Response(
        JSON.stringify({ error: error.message || 'Update failed' }),
        { status: 400, headers: { 'content-type': 'application/json', ...corsHeaders } },
      );
    }

    console.log('Profile updated successfully for user:', user.id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  } catch (e) {
    console.error('Unexpected error in update_profile:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  }
});
