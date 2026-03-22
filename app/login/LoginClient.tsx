"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginClient() {
  const sp = useSearchParams();

  const inviteToken = (sp.get("invite") ?? "").trim() || null;
  const lang = (sp.get("lang") ?? "").trim() || null;

  const nextParam = sp.get("next");
  const safeBase = nextParam && nextParam.startsWith("/") ? nextParam : "/welcome";

  const qs = useMemo(() => {
    const params = new URLSearchParams();
    if (inviteToken) params.set("invite", inviteToken);
    if (lang) params.set("lang", lang);
    return params.toString();
  }, [inviteToken, lang]);

  const nextUrl =
    qs.length > 0 ? `${safeBase}${safeBase.includes("?") ? "&" : "?"}${qs}` : safeBase;

  const signupHref = qs.length > 0 ? `/signup?${qs}` : "/signup";
  const welcomeHref = qs.length > 0 ? `/welcome?${qs}` : "/welcome";
  const resetHref = qs.length > 0 ? `/reset-password?${qs}` : "/reset-password";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Login failed");
        setPending(false);
        return;
      }

      window.location.href = nextUrl;
    } catch {
      setError("Network error");
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#eef1f4] px-4 pt-4 pb-6">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] items-start justify-center">
        <div className="relative h-[720px] w-[680px] overflow-hidden rounded-2xl border border-black/10 shadow-2xl">
          <Image
            src="/templates/3b.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 flex h-full items-center justify-center px-8 py-8">
            <div className="w-full max-w-sm rounded-2xl bg-white/80 p-3 shadow-lg backdrop-blur-md sm:p-4">
              <h1 className="mb-3 text-2xl font-semibold text-gray-900">Login</h1>

              {inviteToken && (
                <div className="mb-2 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-800">
                  You’re logging in via an NGO invite. We’ll continue after login.
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-2" autoComplete="on">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border px-4 py-1.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-lg border px-4 py-1.5 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 hover:text-gray-900"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href={resetHref}
                    prefetch={false}
                    className="text-sm text-gray-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-100 p-2 text-xs text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-xl bg-emerald-600 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {pending ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="mt-3 text-sm text-gray-700">
                Don&apos;t have an account?{" "}
                <Link
                  href={signupHref}
                  prefetch={false}
                  className="font-medium text-emerald-700 hover:underline"
                >
                  Register
                </Link>
              </p>

              <p className="text-xs text-gray-600">
                <Link
                  href={welcomeHref}
                  prefetch={false}
                  className="hover:underline"
                >
                  Back to Welcome
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
