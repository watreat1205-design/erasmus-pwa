import { createMiddlewareClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({
    req,
    res,
  });

  // Refresh session if expired
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files
     * - images
     * - favicon
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
