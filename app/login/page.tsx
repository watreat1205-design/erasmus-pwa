import Image from "next/image";
import Link from "next/link";
import { login } from "./actions";


export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string | string[];
    invite?: string;
    lang?: string;
  }>;
}) {
  const sp = await searchParams;

  const inviteToken = (sp?.invite ?? "").trim() || null;
  const lang = (sp?.lang ?? "").trim() || null;

  const nextParam = sp?.next;

  const raw =
    typeof nextParam === "string"
      ? nextParam
      : Array.isArray(nextParam)
      ? nextParam[0]
      : "/welcome";

  // prevent open redirects
  const safeBase = raw.startsWith("/") ? raw : "/welcome";

  // Build next URL with invite + lang preserved
  const params = new URLSearchParams();
  if (inviteToken) params.set("invite", inviteToken);
  if (lang) params.set("lang", lang);

  const nextUrl =
    params.toString().length > 0
      ? `${safeBase}${safeBase.includes("?") ? "&" : "?"}${params}`
      : safeBase;

  const signupHref =
    inviteToken || lang
      ? `/signup?${params.toString()}`
      : "/signup";

  const welcomeHref =
    inviteToken || lang
      ? `/welcome?${params.toString()}`
      : "/welcome";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-12">
      {/* Portrait FULL-COLOR template */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-xl min-h-screen overflow-hidden rounded-2xl shadow-2xl border border-white/30">
          <Image
            src="/templates/3.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* Login form card */}
      <div className="w-full max-w-sm rounded-2xl bg-white/75 p-2.5 sm:p-3.5 shadow-lg backdrop-blur-md -mt-6">
        <form action={login} className="space-y-2">
          <h1 className="text-2xl font-semibold mb-3 text-gray-900">Login</h1>

          {/* Hidden redirect */}
          <input type="hidden" name="next" value={nextUrl} />

          {inviteToken && (
            <div className="rounded-lg bg-emerald-50 p-2 text-xs text-emerald-800">
              You’re logging in via an NGO invite. We’ll continue after login.
            </div>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border px-4 py-1.5"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border px-4 py-1.5"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-2 text-white font-semibold hover:bg-emerald-700"
          >
            Login
          </button>

          <p className="mt-3 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href={signupHref} className="font-medium text-emerald-700">
              Register
            </Link>
          </p>

          <p className="text-xs text-gray-500">
            <Link href={welcomeHref} className="hover:underline">
              Back to Welcome
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
