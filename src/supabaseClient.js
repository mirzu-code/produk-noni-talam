import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const buildAdminEmail = (username) => {
  const trimmed = username.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  const normalized = trimmed.replace(/\s+/g, '').toLowerCase();
  return `${normalized}@noni-talam-admin.com`;
};
