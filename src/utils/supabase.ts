import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Database functionality may be limited.');
}

// Create supabase client
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Export a function to create a new client (useful in API routes)
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Error handling wrapper for Supabase queries
export async function safeQuery<T>(queryFn: () => Promise<T>): Promise<{ data: T | null; error: any }> {
  try {
    const result = await queryFn();
    return { data: result, error: null };
  } catch (error) {
    console.error('Database query error:', error);
    return { data: null, error };
  }
}

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    if (error) throw error;
    return { connected: true, message: 'Successfully connected to Supabase' };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { connected: false, message: 'Failed to connect to Supabase', error };
  }
}
