import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const admininKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl) {
  throw new Error("Supabase URL is missing");
}
if (!supabaseKey) {
  throw new Error("Supabase Key is missing");
}
if (!admininKey) {
  throw new Error("Admin Key is missing");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
export const adminSupabase = createClient(supabaseUrl, admininKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
