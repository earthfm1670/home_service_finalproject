import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import { Pool } from "pg";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});
