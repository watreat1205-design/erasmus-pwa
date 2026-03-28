// app/profile/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function roleLabel(role: string | null | undefined) {
  switch (role) {
    case "dev":
      return "Developer / Content Author";
    case "trainer":
      return "Trainer";
    case "admin":
      return "Admin";
    default:
      return role ?? "User";
  }
}

function languageLabel(lang: string | null | undefined) {
  switch (lang) {
    case "en":
      return "English";
    case "el":
      return "Greek";
    case "it":
      return "Italian";
    case "es":
      return "Spanish";
    case "ro":
      return "Romanian";
    case "hr":
      return "Croatian";
    default:
      return (lang ?? "en").toUpperCase();
  }
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type CourseRow = {
  id: string;
  title: string;
};

type SectionRow = {
  id: string;
  course_id: string;
};

type LessonRow = {
  id: string;
  section_id: string;
};

type ModuleQuizRow = {
  id: string;
  course_id: string;
};

type CertificateRow = {
  id: string;
  course_id: string | null;
  file_path: string | null;
  issued_at: string | null;
  verification_code: string | null;
  certificate_number: string | null;
};

export default async function ProfilePage() {
  noStore();

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    redirect("/login?next=/profile");
  }

  const cookieStore = await cookies();
  const lang = cookieStore.get("i18nextLng")?.value ?? "en";
  const userId = user.id;

  const [profileResult, coursesResult, certificatesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at, updated_at")
      .eq("id", userId)
      .maybeSingle(),

    supabase
      .from("courses")
      .select("id, title")
      .eq("is_published", true)
      .order("position", { ascending: true, nullsFirst: false })
      .order("title", { ascending: true }),

    supabase
      .from("certificates")
      .select(
        "id, course_id, file_path, issued_at, verification_code, certificate_number"
      )
      .eq("user_id", userId)
      .order("issued_at", { ascending: false }),
  ]);

  const dbProfile = profileResult.data as ProfileRow | null;
  const courses = (coursesResult.data ?? []) as CourseRow[];
  const certificates = (certificatesResult.data ?? []) as CertificateRow[];

  const courseIds = courses.map((c) => c.id);

  const { data: sectionsData } = courseIds.length
    ? await supabase
        .from("course_sections")
        .select("id, course_id")
        .in("course_id", courseIds)
    : { data: [] as SectionRow[] };

  const sections = (sectionsData ?? []) as SectionRow[];
  const sectionIds = sections.map((s) => s.id);

  const { data: lessonsData } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, section_id")
        .eq("kind", "lesson")
        .in("section_id", sectionIds)
    : { data: [] as LessonRow[] };

  const lessons = (lessonsData ?? []) as LessonRow[];
  const lessonIds = lessons.map((l) => l.id);

  const { data: quizzesData } = courseIds.length
    ? await supabase
        .from("module_quizzes")
        .select("id, course_id")
        .eq("is_published", true)
        .in("course_id", courseIds)
    : { data: [] as ModuleQuizRow[] };

  const quizzes = (quizzesData ?? []) as ModuleQuizRow[];
  const quizIds = quizzes.map((q) => q.id);

  const sectionToCourse = new Map<string, string>();
  for (const section of sections) {
    sectionToCourse.set(section.id, section.course_id);
  }

  const lessonToCourse = new Map<string, string>();
  const lessonCountByCourse = new Map<string, number>();

  for (const lesson of lessons) {
    const courseId = sectionToCourse.get(lesson.section_id);
    if (!courseId) continue;

    lessonToCourse.set(lesson.id, courseId);
    lessonCountByCourse.set(
      courseId,
      (lessonCountByCourse.get(courseId) ?? 0) + 1
    );
  }

  const quizToCourse = new Map<string, string>();
  for (const quiz of quizzes) {
    quizToCourse.set(quiz.id, quiz.course_id);
  }

  const { data: lessonProgressData } = lessonIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", userId)
        .in("lesson_id", lessonIds)
    : { data: [] as { lesson_id: string }[] };

  const completedLessonsByCourse = new Map<string, number>();

  for (const row of lessonProgressData ?? []) {
    const courseId = lessonToCourse.get((row as { lesson_id: string }).lesson_id);
    if (!courseId) continue;

    completedLessonsByCourse.set(
      courseId,
      (completedLessonsByCourse.get(courseId) ?? 0) + 1
    );
  }

  const { data: passedQuizAttempts } = quizIds.length
    ? await supabase
        .from("module_quiz_attempts")
        .select("quiz_id")
        .eq("user_id", userId)
        .eq("passed", true)
        .in("quiz_id", quizIds)
    : { data: [] as { quiz_id: string }[] };

  const passedQuizzesByCourse = new Map<string, number>();
  const countedPassedQuizzes = new Set<string>();

  for (const row of passedQuizAttempts ?? []) {
    const quizId = (row as { quiz_id: string }).quiz_id;
    if (countedPassedQuizzes.has(quizId)) continue;
    countedPassedQuizzes.add(quizId);

    const courseId = quizToCourse.get(quizId);
    if (!courseId) continue;

    passedQuizzesByCourse.set(
      courseId,
      (passedQuizzesByCourse.get(courseId) ?? 0) + 1
    );
  }

  const totalCourses = courses.length;
  const totalModules = courses.length;
  const totalLessons = lessons.length;

  const completedLessons = Array.from(completedLessonsByCourse.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  let completedModules = 0;

  for (const course of courses) {
    const lessonCount = lessonCountByCourse.get(course.id) ?? 0;
    const completedLessonCount = completedLessonsByCourse.get(course.id) ?? 0;
    const passedQuizCount = Math.min(
      passedQuizzesByCourse.get(course.id) ?? 0,
      1
    );

    const hasRequiredLessons =
      lessonCount > 0 && completedLessonCount >= lessonCount;

    const hasQuiz = quizzes.some((quiz) => quiz.course_id === course.id);

    const isCompleted = hasQuiz
      ? hasRequiredLessons && passedQuizCount >= 1
      : hasRequiredLessons;

    if (isCompleted) {
      completedModules += 1;
    }
  }

  const lessonsProgress =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const modulesProgress =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  const fullName =
    dbProfile?.full_name?.trim() ||
    ((user.user_metadata?.full_name as string | undefined) ?? "").trim() ||
    user.email ||
    "Platform User";

  const email = dbProfile?.email || user.email || "—";
  const role =
    dbProfile?.role === "dev" ||
    dbProfile?.role === "admin" ||
    dbProfile?.role === "trainer"
      ? dbProfile.role
      : "trainer";

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

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Profile
          </h1>

          <Link
            href="/dashboard"
            prefetch={false}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>

        <section className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-400 shadow-sm">
          <div className="grid gap-6 px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.4fr_0.9fr] lg:px-10">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                DROPS e-learning platform
              </div>

              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Welcome back, {fullName}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">
                Learning for sustainable development through practical modules,
                activities, quizzes, and certification.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium">
                  Role: {roleLabel(role)}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium">
                  Language: {languageLabel(lang)}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
                Learning snapshot
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-bold">{completedLessons}</div>
                  <div className="mt-1 text-sm text-white/85">
                    Lessons completed
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-bold">{completedModules}</div>
                  <div className="mt-1 text-sm text-white/85">
                    Modules completed
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-bold">{certificates.length}</div>
                  <div className="mt-1 text-sm text-white/85">Certificates</div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <div className="text-2xl font-bold">{totalCourses}</div>
                  <div className="mt-1 text-sm text-white/85">Courses</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Account information
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Full name
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {fullName}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-900">
                    {email}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {roleLabel(role)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Language
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {languageLabel(lang)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Member since
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(dbProfile?.created_at)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Last updated
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(dbProfile?.updated_at)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Learning progress
              </h3>

              <div className="mt-5 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Lessons completed
                    </span>
                    <span className="text-slate-600">
                      {completedLessons} / {totalLessons}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${lessonsProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {lessonsProgress}% overall lesson progress
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Modules completed
                    </span>
                    <span className="text-slate-600">
                      {completedModules} / {totalModules}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-lime-500 transition-all"
                      style={{ width: `${modulesProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {modulesProgress}% overall module progress
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Certificates
                </h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {certificates.length} earned
                </span>
              </div>

              {certificates.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  No certificates available yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-900">
                            Certificate
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Certificate No:{" "}
                            <span className="font-medium text-slate-900">
                              {cert.certificate_number ?? "—"}
                            </span>
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Verification Code:{" "}
                            <span className="font-medium text-slate-900">
                              {cert.verification_code ?? "—"}
                            </span>
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Issued:{" "}
                            <span className="font-medium text-slate-900">
                              {formatDate(cert.issued_at)}
                            </span>
                          </p>
                        </div>

                        {cert.file_path ? (
                          <a
                            href={cert.file_path}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                          >
                            View certificate
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-500">
                            File not attached yet
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Quick actions
              </h3>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/courses"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Go to Courses
                </Link>

                <Link
                  href="/dashboard"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                >
                  Open Dashboard
                </Link>

                <Link
                  href="/logout"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100"
                >
                  Logout
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Platform overview
              </h3>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Available courses
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {totalCourses}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total modules
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {totalModules}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total lessons
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {totalLessons}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-lime-50 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Learning with purpose
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                The DROPS platform supports trainers and educators with practical
                sustainability learning materials, interactive activities, and
                certification pathways.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
