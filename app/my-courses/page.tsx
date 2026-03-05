import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/getRole";
import Image from "next/image";
import T from "@/components/T";

type ModuleQuizLite = {
  id: string;
  course_id: string;
};

function normalizeModuleQuizzes(value: unknown): ModuleQuizLite[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((q) => {
      if (!q || typeof q !== "object") return null;
      const r = q as Record<string, unknown>;

      const id = typeof r.id === "string" ? r.id : null;
      const course_id = typeof r.course_id === "string" ? r.course_id : null;

      if (!id || !course_id) return null;
      return { id, course_id };
    })
    .filter((x): x is ModuleQuizLite => x !== null);
}
function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

// ✅ helper: sanitize UUID arrays before using `.in(...)`
function sanitizeIds(ids: unknown[]): string[] {
  const clean = ids
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== "undefined" && s !== "null")
    .filter((s) => isUuid(s));

  return Array.from(new Set(clean));
}     

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CourseRow = {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
};

export default async function MyCoursesPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return (
      <div style={{ padding: 24 }}>

       <h2><T k="myCourses.title" fallback="My Courses" /></h2>
       <p style={{ color: "crimson" }}><T k="auth.mustBeLoggedIn" fallback="You must be logged in." /></p>
       <Link href="/login"><T k="auth.goToLogin" fallback="Go to login" /></Link>

      </div>
    );
  }

  const role = await getCurrentUserRole();

  // fetch enrollments for this user
  const { data: enrollments, error: enrErr } = await supabase
    .from("course_enrollments")
    .select("course_id, enrolled_at")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  if (enrErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>My Courses</h2>
        <p style={{ color: "crimson" }}>{enrErr.message}</p>
      </div>
    );
  }

  // ✅ sanitize courseIds to avoid `undefined` reaching Postgres `.in(...)`
  const courseIds = sanitizeIds((enrollments ?? []).map((e) => e.course_id));

  if (!courseIds.length) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
             <h1 className="text-3xl font-semibold text-gray-900">
             <T k="myCourses.title" fallback="My Courses" />
             </h1>
             <p className="mt-2 text-sm text-white/90">
             <T k="myCourses.subtitle" fallback="Courses you are enrolled in." />
             </p>
            </div>

            <div className="flex items-center gap-2">
  <Link
    href="/dashboard"
    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
  >
    Dashboard
  </Link>
   <Link
  href="/welcome"
  className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium hover:bg-gray-900 !text-white [&_*]:!text-white"
>
  Back to welcome
</Link>

</div>

          </div>

          <div className="mt-8 rounded-xl border border-white/20 bg-white/85 p-6">
            <p className="text-gray-700">
              <T k="myCourses.empty" fallback="You are not enrolled in any courses yet." />
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Courses query (learners see only published)
  const coursesQuery = supabase
    .from("courses")
    .select("id, title, description, is_published")
    .in("id", courseIds)
    .order("title", { ascending: true });

  const { data: courses, error: cErr } =
    role === "learner"
      ? await coursesQuery.eq("is_published", true)
      : await coursesQuery;

  if (cErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>My Courses</h2>
        <p style={{ color: "crimson" }}>{cErr.message}</p>
      </div>
    );
  }

  // Keep same order as enrollments (optional)
  const courseMap = new Map((courses ?? []).map((c) => [c.id, c as CourseRow]));
  const ordered = (enrollments ?? [])
    .map((e) => courseMap.get(String(e.course_id)))
    .filter(Boolean) as CourseRow[];

  /**
   * -----------------------------
   * LESSON PROGRESS + NEXT LESSON
   * lesson_progress: row exists => completed
   * next lesson: first incomplete lesson ordered by section.position then lesson.position
   * -----------------------------
   */
  const totalByCourse = new Map<string, number>();
  const completedByCourse = new Map<string, number>();
  const nextLessonByCourse = new Map<string, string>();
  const firstLessonByCourse = new Map<string, string>();

  // 1) sections for these courses
  const { data: sections, error: sErr } = await supabase
    .from("course_sections")
    .select("id, course_id, position")
    .in("course_id", courseIds);

  if (sErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>My Courses</h2>
        <p style={{ color: "crimson" }}>{sErr.message}</p>
      </div>
    );
  }

  const sectionIds = sanitizeIds((sections ?? []).map((s) => s.id));

  // map section -> course + section position
  const sectionMeta = new Map<string, { courseId: string; sectionPos: number }>();
  for (const s of sections ?? []) {
  const sid = String(s.id ?? "").trim();
  const cid = String(s.course_id ?? "").trim();
  if (!isUuid(sid) || !isUuid(cid)) continue;

  sectionMeta.set(sid, {
    courseId: cid,
    sectionPos: Number(s.position ?? 0),
  });
}
  // 2) lessons under those sections
  const { data: lessons, error: lErr } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, section_id, position")
        .in("section_id", sectionIds)
        .eq("kind", "lesson") // ✅ only count real activities
    : { data: [], error: null };

  if (lErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>My Courses</h2>
        <p style={{ color: "crimson" }}>{lErr.message}</p>
      </div>
    );
  }

  const lessonIds = sanitizeIds((lessons ?? []).map((l) => l.id));

  // totals per course + ordered lesson lists per course
  const lessonsByCourse = new Map<
    string,
    { id: string; sectionPos: number; lessonPos: number }[]
  >();

  for (const l of lessons ?? []) {
    const meta = sectionMeta.get(String(l.section_id));
    if (!meta) continue;

    const cid = meta.courseId;
    totalByCourse.set(cid, (totalByCourse.get(cid) ?? 0) + 1);

    const arr = lessonsByCourse.get(cid) ?? [];
    arr.push({
      id: String(l.id),
      sectionPos: meta.sectionPos,
      lessonPos: Number(l.position ?? 0),
    });
    lessonsByCourse.set(cid, arr);
  }

  // 3) completed lessons for this user
  const { data: progressRows, error: pErr } = lessonIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds)
    : { data: [], error: null };

  if (pErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>My Courses</h2>
        <p style={{ color: "crimson" }}>{pErr.message}</p>
      </div>
    );
  }

  const completedSet = new Set((progressRows ?? []).map((p) => String(p.lesson_id)));

  // completed count per course + first/next lesson per course
  for (const [cid, arr] of lessonsByCourse.entries()) {
    // order lessons within course (section position, then lesson position)
    arr.sort((a, b) =>
      a.sectionPos !== b.sectionPos ? a.sectionPos - b.sectionPos : a.lessonPos - b.lessonPos
    );

    if (arr[0]) firstLessonByCourse.set(cid, arr[0].id);

    let done = 0;
    for (const l of arr) {
      if (completedSet.has(String(l.id))) done += 1;
    }
    completedByCourse.set(cid, done);

    const next = arr.find((l) => !completedSet.has(String(l.id)));
    if (next) nextLessonByCourse.set(cid, next.id);
  }

  /**
   * -----------------------------
   * MODULE QUIZ COUNTS (NEW SYSTEM)
   * -----------------------------
   */
  // ✅ IMPORTANT: use sanitized courseIds here (not `(courses ?? []).map(...)`)
  const courseIds2 = courseIds;

  const { data: allModuleQuizzes, error: mqErr } = courseIds2.length
    ? await supabase
        .from("module_quizzes")
        .select("id, course_id")
        .in("course_id", courseIds2)
        .eq("is_published", true)
    : { data: [] as unknown[], error: null };

  if (mqErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>My Courses</h2>
        <p style={{ color: "crimson" }}>{mqErr.message}</p>
      </div>
    );
  }

  const moduleQuizzes = normalizeModuleQuizzes(allModuleQuizzes);
  const quizIds = sanitizeIds(moduleQuizzes.map((q) => q.id));

  const { data: passedAttempts, error: qaErr } = quizIds.length
    ? await supabase
        .from("module_quiz_attempts")
        .select("quiz_id")
        .eq("user_id", user.id)
        .eq("passed", true)
        .in("quiz_id", quizIds)
    : { data: [] as { quiz_id: string }[], error: null };

  if (qaErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>My Courses</h2>
        <p style={{ color: "crimson" }}>{qaErr.message}</p>
      </div>
    );
  }

  const passedQuizIdSet = new Set((passedAttempts ?? []).map((a) => a.quiz_id));

  const totalQuizzesByCourse = new Map<string, number>();
  const passedQuizzesByCourse = new Map<string, number>();

  for (const q of moduleQuizzes) {
    totalQuizzesByCourse.set(
      q.course_id,
      (totalQuizzesByCourse.get(q.course_id) ?? 0) + 1
    );

    if (passedQuizIdSet.has(q.id)) {
      passedQuizzesByCourse.set(
        q.course_id,
        (passedQuizzesByCourse.get(q.course_id) ?? 0) + 1
      );
    }
  }

return (
  <div className="relative min-h-screen overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 -translate-y-7">
      <Image
        src="/templates/5.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
    </div>

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/20" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

    {/* Page content */}
    <div className="relative z-10">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
           <h1 className="text-3xl font-semibold text-white">
             <T k="myCourses.title" fallback="My Courses" />
          </h1>
          <p className="mt-2 text-sm text-white/90">
           <T k="myCourses.subtitle" fallback="Courses you are enrolled in." />
          </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-md border border-white/30 bg-white/80 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-white"
            >
              <T k="nav.dashboard" fallback="Dashboard" />
            </Link>

           <Link
             href="/welcome"
             className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium hover:bg-gray-900 !text-white [&_*]:!text-white"
           >
             <T k="nav.welcomePage" fallback="Back to welcome" />
           </Link>            

          </div>
        </div>

        {/* Body */}
        {!ordered.length ? (
          <div className="mt-8 rounded-xl border border-white/20 bg-white/85 p-6">
           <p className="text-gray-800">
             <T k="myCourses.empty" fallback="You are not enrolled in any courses yet." />
           </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ordered.map((c) => {
              if (!c?.id) return null;

              const lessonTotal = totalByCourse.get(c.id) ?? 0;
              const lessonDone = completedByCourse.get(c.id) ?? 0;

              const quizTotal = totalQuizzesByCourse.get(c.id) ?? 0;
              const quizDone = passedQuizzesByCourse.get(c.id) ?? 0;

              const reqTotal = lessonTotal + quizTotal;
              const reqDone = lessonDone + quizDone;

              const pct = reqTotal ? Math.round((reqDone / reqTotal) * 100) : 0;

              const courseHref = `/my-courses/${c.id}`;

              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-white/20 bg-white/85 p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={courseHref}
                      className="flex items-center gap-1 text-lg font-semibold text-gray-900 hover:underline"
                    >
                      {c.title}
                      <span className="text-gray-400">→</span>
                    </Link>
                  </div>

                  {c.description ? (
                    <p className="mt-2 text-sm text-gray-700">{c.description}</p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-600">
                      <T k="myCourses.noDescription" fallback="No description." />
                    </p>
                  )}

                  <div className="mt-3 text-sm text-gray-800">
                    <div className="flex items-center justify-between">
                      <span>
                         <T k="myCourses.progress" fallback="Progress" />:{" "}
                        <span className="font-medium">
                          {reqDone}/{reqTotal}
                        </span>{" "}
                        ({pct}%)
                      </span>

                      {reqTotal > 0 && reqDone === reqTotal ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          ✓ <T k="myCourses.completed" fallback="Completed" />
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: "#111827" }}
                      />
                    </div>

                    <div className="mt-3">
                      {/* ✅ FIX: white text, no inline styles */}
                      <Link
                        href={courseHref}
                        className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium !text-white hover:bg-gray-900"
                      >
                        <T k="myCourses.openCourse" fallback="Open course" />
                      </Link>
                    </div>

                    <div className="mt-2 text-sm text-gray-800">
                     <T k="myCourses.activities" fallback="Activities" />: <b>{lessonDone}/{lessonTotal}</b> •{" "}
                     <T k="myCourses.quizzesPassed" fallback="Quizzes passed" />: <b>{quizDone}/{quizTotal}</b>
                    </div>
                  </div>

                  {!c.is_published && (
                    <div className="mt-3 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                      <T k="myCourses.notPublished" fallback="Not published" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  </div>
);
}
