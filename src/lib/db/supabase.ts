import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes("your-project.supabase.co") &&
  !supabaseKey.includes("your-anon-key") &&
  !supabaseKey.includes("your-publishable-key")
);

let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (typeof window === "undefined") {
    return createClient(supabaseUrl, supabaseKey);
  }
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseKey);
  }
  return browserClient;
}
