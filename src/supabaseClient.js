import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://PLACEHOLDER.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "PLACEHOLDER";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
