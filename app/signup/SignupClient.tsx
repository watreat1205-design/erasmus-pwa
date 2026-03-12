// app/signup/SignupClient.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function SignupClient() {
  const supabase = createClient();
  const router = useRouter();
  const sp = useSearchParams();

  const inviteToken = (sp.get("invite") ?? "").trim() || null;
  const lang = (sp.get("lang") ?? "").trim() || null;

  const welcomeHref = useMemo(() => {
    const params = new URLSearchParams();
    if (inviteToken) params.set("invite", inviteToken);
    if (lang) params.set("lang", lang);
    const qs = params.toString();
    return qs ? `/welcome?${qs}` : "/welcome";
  }, [inviteToken, lang]);

  const loginHref = useMemo(() => {
    const params = new URLSearchParams();
    if (inviteToken) params.set("invite", inviteToken);
    if (lang) params.set("lang", lang);
    const qs = params.toString();
    return qs ? `/login?${qs}` : "/login";
  }, [inviteToken, lang]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${welcomeHref}`,
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setMsg("Signup succeeded but user ID is missing.");
      setLoading(false);
      return;
    }

    if (!data.session) {
      setMsg("Account created. Please check your email to confirm your account, then log in.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName.trim() || data.user?.user_metadata?.full_name || null,
      email: cleanEmail,
      role: "trainer",
    });

    if (profileError) {
      setMsg(profileError.message);
      setLoading(false);
      return;
    }

    router.replace(welcomeHref);
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
              {inviteToken && (
                <div className="mb-2 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-800">
                  You’re signing up via an NGO invite. After signup we’ll take you back.
                </div>
              )}

              <h1 className="mb-3 text-2xl font-semibold text-gray-900">
                Create account
              </h1>

              <form onSubmit={onSignup} autoComplete="on" className="space-y-2">
                <input
                  name="full_name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border px-4 py-1.5"
                  placeholder="Full name"
                />

                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border px-4 py-1.5"
                  placeholder="Email"
                />

                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border px-4 py-1.5"
                  placeholder="Password"
                />

                {msg && (
                  <div className="rounded-lg bg-red-100 p-2 text-xs text-red-700">
                    {msg}
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full rounded-xl bg-emerald-600 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Sign up"}
                </button>
              </form>

              <p className="mt-3 text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href={loginHref}
                  className="font-medium text-emerald-700 hover:underline"
                >
                  Log in
                </Link>
              </p>

              <p className="mt-1 text-xs text-gray-500">
                <Link href={welcomeHref} className="hover:underline">
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
