"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "./actions";

export default function LoginClient({
  nextUrl,
  signupHref,
  welcomeHref,
  resetHref,
  inviteToken,
}: {
  nextUrl: string;
  signupHref: string;
  welcomeHref: string;
  resetHref: string;
  inviteToken: string | null;
}) {
  const [pending, setPending] = useState(false);

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white/80 p-3 sm:p-4 shadow-lg backdrop-blur-md">
      <form
        action={async (formData) => {
          setPending(true);
          await login(formData);
        }}
        className="space-y-2"
        autoComplete="on"
      >
        <h1 className="text-2xl font-semibold mb-3 text-gray-900">Login</h1>

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
          autoComplete="email"
          className="w-full rounded-lg border px-4 py-1.5"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border px-4 py-1.5"
        />

        <div className="flex items-center justify-end">
          <Link href={resetHref} className="text-sm text-gray-700 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-emerald-600 py-2 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "Logging in..." : "Login"}
        </button>

        <p className="mt-3 text-sm text-gray-700">
          Don&apos;t have an account?{" "}
          <Link href={signupHref} className="font-medium text-emerald-700 hover:underline">
            Register
          </Link>
        </p>

        <p className="text-xs text-gray-600">
          <Link href={welcomeHref} className="hover:underline">
            Back to Welcome
          </Link>
        </p>
      </form>
    </div>
  );
}
