import { createClient } from "@supabase/supabase-js";

// ✅ these values come from your .env file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ✅ supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true }, // keeps user logged in on refresh
});
