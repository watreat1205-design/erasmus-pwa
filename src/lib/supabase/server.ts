import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Use this in Server Components (page.tsx, layout.tsx).
 * It can READ cookies. Writing cookies may be blocked by Next,
 * so we safely ignore cookie writes there.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          // In Server Components, Next.js may throw if we try to set cookies.
          // That's OK — auth still works because reads are enough there.
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignore: cookie writes not allowed in Server Components
          }
        },
      },
    }
  );
}

/**
 * Backwards compatible name (your existing code imports this).
 */
export async function createClient() {
  return createSupabaseServerClient();
}
