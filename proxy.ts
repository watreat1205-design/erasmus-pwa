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
    pathname.startsWith("/courses") || // guest learner access
    pathname.startsWith("/auth") ||
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
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // ✅ Allow public routes
  if (isPublicRoute(pathname)) {
    return res;
  }

  /* ---------- SUPABASE ---------- */
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

  // 🔑 refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ❌ Not logged in → redirect to login
  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* ---------- ROLE CHECK ---------- */
  const allowedKey = matchAllowed(pathname);
  if (!allowedKey) return res;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "learner";
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
