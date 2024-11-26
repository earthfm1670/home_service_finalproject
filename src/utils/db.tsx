import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL is missing");
}
if (!supabaseKey) {
  throw new Error("Supabase Key is missing");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
  throw new Error("connectionString is missing");
}
export const connectionPool = new Pool({
  connectionString: connectionString,
});
