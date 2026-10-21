import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }: { name: string; value: string }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth token
  await supabase.auth.getUser();

  return supabaseResponse;
};

// Aliased export matching prompt
export const createClient = (request: NextRequest) => updateSession(request);
