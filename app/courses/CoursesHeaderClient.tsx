"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CoursesHeaderClient() {
  const supabase = createClient();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
  }, [supabase]);

  return (
    <div className="flex items-center gap-3">
      {loggedIn ? (
        <>
          <Link
            href="/dashboard"
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/welcome"
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-900"
          >
            Back to welcome
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-100"
          >
            Trainer login
          </Link>
          <span className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-black">
            {/* keep spacing like your screenshot */}
            &nbsp;
          </span>
        </>
      )}
    </div>
  );
}
