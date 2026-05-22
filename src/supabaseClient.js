import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env and restart the dev server.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Diagnostic function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);
    console.log('Key exists:', !!supabaseAnonKey);

    // Try to fetch from products table
    const { data, error, status } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase connection test FAILED:', {
        status,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return { success: false, error: error.message };
    }

    console.log('Supabase connection test PASSED. Products table is accessible.');
    return { success: true, data };
  } catch (e) {
    console.error('Supabase connection test ERROR:', e);
    return { success: false, error: e.message };
  }
};

export const buildAdminEmail = (username) => {
  const trimmed = username.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  const normalized = trimmed.replace(/\s+/g, '').toLowerCase();
  return `${normalized}@noni-talam-admin.com`;
};
