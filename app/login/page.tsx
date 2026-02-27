import Image from "next/image";
import Link from "next/link";
import { login } from "./actions";

import bgTemplate3 from "../../Templates/3b.jpg";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const sp = await searchParams;

  const nextParam = sp?.next;

  const raw =
    typeof nextParam === "string"
      ? nextParam
      : Array.isArray(nextParam)
        ? nextParam[0]
        : "/welcome";

  // prevent open redirects
  const nextUrl = raw.startsWith("/") ? raw : "/welcome";

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

      {/* Login form card */}
        <div className="w-full max-w-sm rounded-2xl bg-white/75 p-2.5 sm:p-3.5 shadow-lg backdrop-blur-md -mt-6">
        <form action={login} className="space-y-2">
          <h1 className="text-2xl font-semibold mb-3 text-gray-900">Login</h1>

          <input type="hidden" name="next" value={nextUrl} />

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
            <Link href="/signup" className="font-medium text-emerald-700">
              Register
            </Link>
          </p>

          <p className="text-xs text-gray-500">
            <Link href="/welcome" className="hover:underline">
              Back to Welcome
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
