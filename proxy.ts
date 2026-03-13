// proxy.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ACCESS } from "@/lib/auth/access";

function isPublicRoute(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/welcome") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/update-password") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  );
}

function matchAllowed(pathname: string) {
  const keys = Object.keys(ACCESS).sort((a, b) => b.length - a.length);

  for (const k of keys) {
    if (pathname === k) return k;
    if (pathname.startsWith(k.endsWith("/") ? k : `${k}/`)) return k;
  }

  return undefined;
}

function normalizeRole(role: string | null | undefined) {
  if (role === "trainer" || role === "admin" || role === "dev") return role;
  return null;
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

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
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPublicRoute(pathname)) {
    return res;
  }

  const allowedKey = matchAllowed(pathname);

  if (!allowedKey) {
    return res;
  }

  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);

    const redirectRes = NextResponse.redirect(loginUrl);

    res.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie);
    });

    return redirectRes;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("proxy profile error:", profileError);
  }

  const role = normalizeRole(profile?.role);
  const allowed = ACCESS[allowedKey] ?? [];

  if (!role || !allowed.includes(role)) {
    const redirectRes = NextResponse.redirect(new URL("/unauthorized", req.url));

    res.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie);
    });

    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
