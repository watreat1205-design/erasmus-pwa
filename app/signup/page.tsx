"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import bgTemplate3 from "../../Templates/3b.jpg";

export default function SignupPage() {
  const supabase = createClient();

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

    // Create/Update profile (role allowed by your CHECK constraint)
    const { error: pErr } = await supabase.from("profiles").upsert(
      {
        id: userId,
        role: "trainer",
        full_name: fullName.trim(),
        email,
      },
      { onConflict: "id" }
    );

    if (pErr) {
      // Don’t block signup; just show message
      console.error("Profile upsert failed:", pErr.message);
      setMsg("Account created, but profile setup failed. Please contact support.");
      setLoading(false);
      return;
    }

    setLoading(false);
    // optional: redirect to login
    window.location.href = "/login";
  }

   return (
   <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-12">

    {/* Portrait FULL-COLOR template */}
    <div className="absolute inset-0 flex items-center justify-center">
     <div className="relative w-full max-w-xl min-h-screen overflow-hidden rounded-2xl shadow-2xl border border-white/30">
        <Image
          src={bgTemplate3}
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>

    {/* Signup form card */}
      <div className="w-full max-w-sm rounded-2xl bg-white/75 p-2.5 sm:p-3.5 shadow-lg backdrop-blur-md -mt-6">
      
      <h1 className="text-2xl font-semibold mb-3 text-gray-900">
        Create your account
      </h1>

      <form onSubmit={onSignup} className="space-y-2">

        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border px-4 py-1.5"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-4 py-1.5"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-4 py-1.5"
          required
        />

        <button
          disabled={loading}
          className="w-full rounded-xl bg-emerald-600 py-2 text-white font-semibold hover:bg-emerald-700"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        {msg && (
          <p className="text-sm text-red-600">{msg}</p>
        )}
      </form>

      <p className="mt-3 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-emerald-700">
          Login
        </Link>
      </p>
    </div>
  </div>
);

}
