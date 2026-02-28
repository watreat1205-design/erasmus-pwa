"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import bgTemplate3 from "../../Templates/3b.jpg";

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

    await supabase.from("profiles").upsert({
  id: userId,
  full_name: fullName.trim() || null,
  email: email.trim().toLowerCase(),
  role: "user", // 👈 required by your DB constraint
});

    if (pErr) {
      setMsg(pErr.message);
      setLoading(false);
      return;
    }

    router.replace(welcomeHref);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src={bgTemplate3}
        alt=""
        fill
        priority
        className="object-cover object-[center_55%]"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md rounded-2xl bg-white/10 p-6 text-white backdrop-blur">
            {inviteToken && (
              <div className="mb-4 rounded-xl bg-white/10 p-3 text-sm text-white/90">
                You’re signing up via an NGO invite. After signup we’ll take you back.
              </div>
            )}

            <h1 className="text-2xl font-semibold">Create account</h1>

            <form onSubmit={onSignup} className="mt-6 space-y-4">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl bg-white/15 px-3 py-2"
                placeholder="Full name"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl bg-white/15 px-3 py-2"
                placeholder="Email"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-white/15 px-3 py-2"
                placeholder="Password"
              />

              {msg && (
                <div className="rounded-xl bg-red-500/20 p-3 text-sm">
                  {msg}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-white px-4 py-3 text-black"
              >
                {loading ? "Creating..." : "Sign up"}
              </button>
            </form>

            <div className="mt-4 text-sm">
              Already have an account?{" "}
              <Link href={loginHref} className="underline">
                Log in
              </Link>
            </div>

            <div className="mt-2 text-sm">
              <Link href={welcomeHref} className="underline">
                Back to Welcome
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
