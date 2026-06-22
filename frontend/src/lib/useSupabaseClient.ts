import { useMemo } from 'react';
import { useSession } from '@clerk/nextjs';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local',
  );
}

// Per-component Supabase client that forwards the Clerk session token so RLS
// policies can read `auth.jwt()->>'sub'` (the Clerk user id).
//
// Setup (one-time): Supabase dashboard → Authentication → Third-Party Auth → add Clerk.
// Write RLS policies against `auth.jwt()->>'sub'`. No Clerk "supabase" JWT template
// needed — that approach is deprecated.
//
// @see https://clerk.com/docs/integrations/databases/supabase
// @see https://supabase.com/docs/guides/auth/third-party/clerk
export function useSupabaseClient(): SupabaseClient {
  const { session } = useSession();

  return useMemo(
    () =>
      createClient(supabaseUrl as string, supabaseAnonKey as string, {
        // Returning null falls back to anon role for signed-out users.
        accessToken: async () => (session ? ((await session.getToken()) ?? null) : null),
      }),
    [session],
  );
}
