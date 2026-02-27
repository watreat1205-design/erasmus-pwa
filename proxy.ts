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

  // ✅ PUBLIC: allow guest access to /courses/*
  if (isPublicRoute(pathname)) {
    return res;
  }

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

  // Only gate routes that appear in ACCESS
  const ruleKey = matchAllowed(pathname);
  if (!ruleKey) return res;

  // 1) Must be logged in
  const { data: auth, error: authErr } = await supabase.auth.getUser();
  const user = auth?.user;

  if (authErr || !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);

    const redirectRes = NextResponse.redirect(url);
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return redirectRes;
  }

  // 2) Fetch role from profiles
  let role: string | null = null;

  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profErr && profile?.role) {
    role = String(profile.role);
  } else {
    role = null;
  }

  // 3) Check allowed roles for this ruleKey
  const allowed = ACCESS[ruleKey] as readonly string[] | undefined;

    if (!role || !allowed || !allowed.includes(role)) {
    const url = req.nextUrl.clone();
    url.pathname = "/unauthorized";

    const redirectRes = NextResponse.redirect(url);
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ["/courses/:path*", "/admin/:path*", "/author/:path*", "/trainer/:path*"],
};
