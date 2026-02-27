import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/getRole";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Default fallback
  let displayName = user?.email ?? "User";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    // ✅ use full_name (NOT profile.name)
    const full = profile?.full_name?.trim();
    if (full) displayName = full.split(/\s+/)[0]; // first name for greeting
  }

  const role = await getCurrentUserRole();

  const cards = [
    {
      title: "My Courses",
      desc: "Continue lessons and track progress.",
      href: "/courses",
    },
    {
      title: "Certificates",
      desc: "View and download PDF certificates.",
      href: "/certificates",
    },
    {
      title: "Quizzes",
      desc: "Take quizzes and view results.",
      href: "/quizzes",
    },
    {
      title: "Profile",
      desc: "Update your details and preferences.",
      href: "/profile",
    },
    {
      title: "Support",
      desc: "Contact us or read FAQs.",
      href: "/support",
    },
    {
      title: "Settings",
      desc: "Language, notifications, and account.",
      href: "/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Welcome back, {displayName} 👋
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Choose what you want to do next.
            </p>
          </div>

          <Link
            href="/logout"
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
          >
            <span className="text-white">Logout</span>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{c.title}</h2>
                <span className="text-gray-400 transition group-hover:translate-x-0.5">
                  →
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">{c.desc}</p>

              <div className="mt-4 text-sm font-medium text-gray-900 underline-offset-4 group-hover:underline">
                Open
              </div>
            </Link>
          ))}

          {role === "dev" && (
            <Link
              href="/trainer/courses"
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Trainer Panel
                </h2>
                <span className="text-gray-400 transition group-hover:translate-x-0.5">
                  →
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Manage courses, modules, and uploads.
              </p>

              <div className="mt-4 text-sm font-medium text-gray-900 underline-offset-4 group-hover:underline">
                Open
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
