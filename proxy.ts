import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ACCESS } from "@/lib/auth/access";

function matchAllowed(pathname: string) {
  const keys = Object.keys(ACCESS).sort((a, b) => b.length - a.length);

  for (const k of keys) {
    if (pathname === k) return k;
    if (pathname.startsWith(k.endsWith("/") ? k : `${k}/`)) return k;
  }
  return undefined;
}

function isPublicRoute(pathname: string) {
  // Guest learner access: everything under /courses is public
  return pathname === "/courses" || pathname.startsWith("/courses/");
}

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // ✅ Always create supabase and refresh session cookies first
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ✅ IMPORTANT: refresh session cookie on every request
  // This prevents "logged out" on server pages after navigation
  await supabase.auth.getUser();

  // ✅ PUBLIC: allow guest access to /courses/*
  if (isPublicRoute(pathname)) {
    return res;
  }

  // ✅ Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user and route not public -> send to login
  if (!user) {
    const next = req.nextUrl.pathname + (req.nextUrl.search || "");
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  // ✅ Determine which access rule applies
  const matched = matchAllowed(pathname);

  // If route not in ACCESS map, allow by default
  if (!matched) {
    return res;
  }

  // ✅ Read role from profiles (server-side, uses same cookies)
  let role: string | null = null;
  const { data: prof, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profErr) role = (prof?.role as string) ?? null;

  // ✅ Enforce access rule
  const allowedRoles = ACCESS[matched];
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role as any)) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return res;
}
