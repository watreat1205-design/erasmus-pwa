// app/admin/page.tsx
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: "trainer" | "admin" | "dev" | null;
  created_at: string | null;
  email: string | null;
};

type LessonCompletionRow = {
  user_id: string;
};

type ModuleProgressRow = {
  user_id: string;
  completed_at: string | null;
};

type CertificateRow = {
  user_id: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function countByUser<T extends { user_id: string }>(rows: T[]) {
  const map = new Map<string, number>();

  for (const row of rows) {
    map.set(row.user_id, (map.get(row.user_id) ?? 0) + 1);
  }

  return map;
}

export default async function AdminPage() {
  noStore();

  const supabase = await createSupabaseServerClient();

  const [
    profilesRes,
    lessonCompletionsRes,
    moduleProgressRes,
    certificatesRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role, created_at, email")
      .order("created_at", { ascending: false }),

    supabase.from("lesson_completions").select("user_id"),

    supabase
      .from("module_progress")
      .select("user_id, completed_at")
      .not("completed_at", "is", null),

    supabase.from("certificates").select("user_id"),
  ]);

  const profiles = (profilesRes.data ?? []) as ProfileRow[];
  const lessonCompletions = (lessonCompletionsRes.data ?? []) as LessonCompletionRow[];
  const moduleProgress = (moduleProgressRes.data ?? []) as ModuleProgressRow[];
  const certificates = (certificatesRes.data ?? []) as CertificateRow[];

  const lessonCountByUser = countByUser(lessonCompletions);
  const moduleCountByUser = countByUser(moduleProgress);
  const certificateCountByUser = countByUser(certificates);

  const totalUsers = profiles.length;
  const trainerCount = profiles.filter((p) => p.role === "trainer").length;
  const adminCount = profiles.filter((p) => p.role === "admin").length;
  const devCount = profiles.filter((p) => p.role === "dev").length;
  const completedModulesCount = moduleProgress.length;
  const certificatesIssuedCount = certificates.length;

  const users = profiles.map((profile) => ({
    id: profile.id,
    full_name: profile.full_name?.trim() || "—",
    email: profile.email?.trim() || "—",
    role: profile.role || "—",
    joined: formatDate(profile.created_at),
    lessonProgress: lessonCountByUser.get(profile.id) ?? 0,
    moduleProgress: moduleCountByUser.get(profile.id) ?? 0,
    certificatesCount: certificateCountByUser.get(profile.id) ?? 0,
  }));

  return (
    <div className="relative min-h-screen overflow-y-auto">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url(/templates/5.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center top",
        }}
      />

      <div className="fixed inset-0 -z-10 bg-black/20" />

      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Admin Panel</h1>
              <p className="mt-2 text-sm text-white/90">
                Read-only reporting area for users, progress, and certificates.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-md border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
              >
                ← Back to dashboard
              </Link>

              <Link
                href="/admin/export"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium !text-white hover:bg-slate-800"
              >
                Export CSV
              </Link>
            </div>
          </div>

          {(profilesRes.error ||
            lessonCompletionsRes.error ||
            moduleProgressRes.error ||
            certificatesRes.error) && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
              <div className="font-semibold">Some admin data could not be loaded.</div>
              <div className="mt-2 space-y-1">
                {profilesRes.error ? <div>Profiles: {profilesRes.error.message}</div> : null}
                {lessonCompletionsRes.error ? (
                  <div>Lesson completions: {lessonCompletionsRes.error.message}</div>
                ) : null}
                {moduleProgressRes.error ? (
                  <div>Module progress: {moduleProgressRes.error.message}</div>
                ) : null}
                {certificatesRes.error ? (
                  <div>Certificates: {certificatesRes.error.message}</div>
                ) : null}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-xl border border-white/30 bg-white/90 p-5 shadow-sm backdrop-blur-md">
              <div className="text-sm text-slate-500">Total users</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">{totalUsers}</div>
            </div>

            <div className="rounded-xl border border-white/30 bg-white/90 p-5 shadow-sm backdrop-blur-md">
              <div className="text-sm text-slate-500">Trainers</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">{trainerCount}</div>
            </div>

            <div className="rounded-xl border border-white/30 bg-white/90 p-5 shadow-sm backdrop-blur-md">
              <div className="text-sm text-slate-500">Admins</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">{adminCount}</div>
            </div>

            <div className="rounded-xl border border-white/30 bg-white/90 p-5 shadow-sm backdrop-blur-md">
              <div className="text-sm text-slate-500">Devs</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">{devCount}</div>
            </div>

            <div className="rounded-xl border border-white/30 bg-white/90 p-5 shadow-sm backdrop-blur-md">
              <div className="text-sm text-slate-500">Completed modules</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">
                {completedModulesCount}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/30 bg-white/90 p-5 shadow-sm backdrop-blur-md">
              <div className="text-sm text-slate-500">Certificates issued</div>
              <div className="mt-2 text-3xl font-semibold text-slate-900">
                {certificatesIssuedCount}
              </div>
            </div>

            <div className="rounded-xl border border-white/30 bg-white/90 p-5 shadow-sm backdrop-blur-md">
              <div className="text-sm text-slate-500">Report export</div>
              <div className="mt-2 text-sm text-slate-700">
                Download the current user and progress report as CSV for Excel and agency
                reporting.
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-white/30 bg-white/95 shadow-sm backdrop-blur-md">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Users overview</h2>
              <p className="mt-1 text-sm text-slate-600">
                Read-only summary of users, progress, and certificates.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50/90">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium">Lesson progress</th>
                    <th className="px-4 py-3 font-medium">Module progress</th>
                    <th className="px-4 py-3 font-medium">Certificates</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-t border-slate-200">
                        <td className="px-4 py-3 text-slate-900">{user.full_name}</td>
                        <td className="px-4 py-3 text-slate-700">{user.email}</td>
                        <td className="px-4 py-3 text-slate-700">{user.role}</td>
                        <td className="px-4 py-3 text-slate-700">{user.joined}</td>
                        <td className="px-4 py-3 text-slate-700">{user.lessonProgress}</td>
                        <td className="px-4 py-3 text-slate-700">{user.moduleProgress}</td>
                        <td className="px-4 py-3 text-slate-700">{user.certificatesCount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
