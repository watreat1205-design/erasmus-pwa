import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ACCESS } from "@/lib/auth/access";

/* ---------------- PUBLIC ROUTES ---------------- */

function isPublicRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/welcome") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/update-password") ||
    pathname.startsWith("/courses") || // guest learner access (if you want)
    pathname.startsWith("/auth") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  );
}

/* ---------------- ROLE MATCH ---------------- */

function matchAllowed(pathname: string) {
  const keys = Object.keys(ACCESS).sort((a, b) => b.length - a.length);

  for (const k of keys) {
    if (pathname === k) return k;
    if (pathname.startsWith(k.endsWith("/") ? k : `${k}/`)) return k;
  }
  return undefined;
}

/* ---------------- MAIN PROXY ---------------- */

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Create response FIRST so we can attach cookies to it
  const res = NextResponse.next({
    request: { headers: req.headers },
  });

  /* ---------- SUPABASE (ALWAYS RUN) ---------- */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 🔑 ALWAYS refresh session so sb-* cookies are set/extended in prod
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Public routes still need cookie refresh — but no auth/role enforcement
  if (isPublicRoute(pathname)) {
    return res;
  }

  /* ---------- ROLE CHECK / PROTECTED ROUTES ---------- */

  const allowedKey = matchAllowed(pathname);

  // If route isn't in ACCESS map, let it through
  if (!allowedKey) return res;

  // If route is protected but user isn't logged in -> redirect to login
  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // If profile missing (or RLS blocks), default to learner
  const role = !pErr && profile?.role ? profile.role : "learner";

  const allowed = ACCESS[allowedKey] ?? [];
  if (!allowed.includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return res;
}

/* ---------------- MATCHER ---------------- */

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
