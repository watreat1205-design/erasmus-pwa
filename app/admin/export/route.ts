import { createSupabaseServerClient } from "@/lib/supabase/server";

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

function formatDateTimeForFilename(date: Date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mi = String(date.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}_${hh}-${mi}`;
}

function countByUser<T extends { user_id: string }>(rows: T[]) {
  const map = new Map<string, number>();

  for (const row of rows) {
    map.set(row.user_id, (map.get(row.user_id) ?? 0) + 1);
  }

  return map;
}

function escapeCsv(value: string | number | null | undefined) {
  const text = String(value ?? "");
  if (text.includes('"') || text.includes(",") || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET() {
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

  if (profilesRes.error) {
    return new Response(`Export failed: ${profilesRes.error.message}`, { status: 500 });
  }

  if (lessonCompletionsRes.error) {
    return new Response(`Export failed: ${lessonCompletionsRes.error.message}`, {
      status: 500,
    });
  }

  if (moduleProgressRes.error) {
    return new Response(`Export failed: ${moduleProgressRes.error.message}`, {
      status: 500,
    });
  }

  if (certificatesRes.error) {
    return new Response(`Export failed: ${certificatesRes.error.message}`, {
      status: 500,
    });
  }

  const profiles = (profilesRes.data ?? []) as ProfileRow[];
  const lessonCompletions = (lessonCompletionsRes.data ?? []) as LessonCompletionRow[];
  const moduleProgress = (moduleProgressRes.data ?? []) as ModuleProgressRow[];
  const certificates = (certificatesRes.data ?? []) as CertificateRow[];

  const lessonCountByUser = countByUser(lessonCompletions);
  const moduleCountByUser = countByUser(moduleProgress);
  const certificateCountByUser = countByUser(certificates);

  const lines = [
    [
      "Full Name",
      "Email",
      "Role",
      "Joined At",
      "Lesson Progress",
      "Module Progress",
      "Certificates Count",
    ].join(","),
  ];

  for (const profile of profiles) {
    lines.push(
      [
        escapeCsv(profile.full_name ?? ""),
        escapeCsv(profile.email ?? ""),
        escapeCsv(profile.role ?? ""),
        escapeCsv(profile.created_at ?? ""),
        escapeCsv(lessonCountByUser.get(profile.id) ?? 0),
        escapeCsv(moduleCountByUser.get(profile.id) ?? 0),
        escapeCsv(certificateCountByUser.get(profile.id) ?? 0),
      ].join(",")
    );
  }

  const csv = lines.join("\n");
  const filename = `admin-report_${formatDateTimeForFilename(new Date())}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
