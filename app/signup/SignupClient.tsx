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

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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
  setMsg("Signup succeeded but user id is missing.");
  setLoading(false);
  return;
}

const { error: pErr } = await supabase.from("profiles").upsert({
  id: userId,
  full_name:
    fullName.trim() || data.user?.user_metadata?.full_name || null,
  email: email.trim().toLowerCase(),
  role: "user",
});

if (pErr) {
  setMsg(pErr.message);
  setLoading(false);
  return;
}

router.replace(welcomeHref);

  }

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

    {/* Signup form card */}
    <div className="w-full max-w-sm rounded-2xl bg-white/75 p-2.5 sm:p-3.5 shadow-lg backdrop-blur-md -mt-6">
      {inviteToken && (
        <div className="rounded-lg bg-emerald-50 p-2 text-xs text-emerald-800 mb-2">
          You’re signing up via an NGO invite. After signup we’ll take you back.
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-3 text-gray-900">
        Create account
      </h1>

      <form onSubmit={onSignup} className="space-y-2">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border px-4 py-1.5"
          placeholder="Full name"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border px-4 py-1.5"
          placeholder="Email"
        />

        <input
          type="password"
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
          className="w-full rounded-xl bg-emerald-600 py-2 text-white font-semibold hover:bg-emerald-700"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>

      <p className="mt-3 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href={loginHref} className="font-medium text-emerald-700">
          Log in
        </Link>
      </p>

      <p className="text-xs text-gray-500">
        <Link href={welcomeHref} className="hover:underline">
          Back to Welcome
        </Link>
      </p>
    </div>
  </div>
);
}
