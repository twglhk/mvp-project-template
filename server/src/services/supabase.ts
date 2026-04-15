import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../env.js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseServiceKey);
  }
  return client;
}
