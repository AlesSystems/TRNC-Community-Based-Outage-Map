import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For build time, provide fallback values to prevent build errors
// Runtime will work correctly if env vars are set, or fail gracefully if not
const url = supabaseUrl || (typeof window === 'undefined' ? 'https://placeholder.supabase.co' : '');
const key = supabaseAnonKey || (typeof window === 'undefined' ? 'placeholder-key' : '');

export const supabase = createClient(url, key);
