// app/reset-password/ResetPasswordClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordClient() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setMessage("");

        const code = searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            if (!cancelled) {
              setReady(false);
              setMessage("Invalid or expired reset link.");
            }
            return;
          }

          if (!cancelled) {
            setReady(true);
            setMessage("");
          }
          return;
        }

        const hash = window.location.hash.startsWith("#")
          ? window.location.hash.slice(1)
          : window.location.hash;

        if (hash) {
          const hashParams = new URLSearchParams(hash);
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          const type = hashParams.get("type");

          if (accessToken && refreshToken && type === "recovery") {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              if (!cancelled) {
                setReady(false);
                setMessage("Invalid or expired reset link.");
              }
              return;
            }

            if (!cancelled) {
              setReady(true);
              setMessage("");

              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            }
            return;
          }
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!cancelled) {
          if (session) {
            setReady(true);
            setMessage("");
          } else {
            setReady(false);
            setMessage(
              "Recovery session not found. Please open the reset link from the email again."
            );
          }
        }
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [searchParams, supabase]);

  async function handleReset() {
    if (!password.trim()) {
      setMessage("Please enter a password.");
      return;
    }

    if (password.trim().length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password: password.trim(),
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Reset Password</h1>

        {initializing ? (
          <p>Checking link...</p>
        ) : (
          <>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full rounded border px-3 py-2"
              disabled={!ready || loading}
            />

            <button
              onClick={handleReset}
              disabled={!ready || loading}
              className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
