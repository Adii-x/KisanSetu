import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// If you generate typed definitions from Supabase, replace `any` with your Database type.
type Database = any;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast in development; in production this will surface clearly in logs.
  // eslint-disable-next-line no-console
  console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
);

export default supabase;

