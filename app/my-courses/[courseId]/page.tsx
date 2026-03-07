import Link from "next/link";
import Image from "next/image";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/getRole";

type CourseLessonLite = {
  id: string;
  section_id: string | null;
  title: string;
  position: number;
  kind: string | null;
  is_published: boolean | null;
};

function normalizeCourseLessons(value: unknown): CourseLessonLite[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((l) => {
      if (!l || typeof l !== "object") return null;
      const r = l as Record<string, unknown>;

      const id = typeof r.id === "string" ? r.id : null;
      const section_id = typeof r.section_id === "string" ? r.section_id : null;
      const title = typeof r.title === "string" ? r.title : "";
      const position = typeof r.position === "number" ? r.position : 0;
      const kind = typeof r.kind === "string" ? r.kind : null;
      const is_published =
        typeof r.is_published === "boolean" ? r.is_published : null;

      if (!id) return null;
      return { id, section_id, title, position, kind, is_published };
    })
    .filter((x): x is CourseLessonLite => x !== null);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CourseViewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  if (!courseId || courseId === "undefined") redirect("/my-courses");

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Course</h2>
        <p style={{ color: "crimson" }}>You must be logged in.</p>
        <Link href="/login">Go to login</Link>
      </div>
    );
  }

  const role = await getCurrentUserRole();

  // 0) Load course (needed for title + learner publish guard)
  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .select("id, title, description, is_published")
    .eq("id", courseId)
    .single();

  if (courseErr || !course) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Course</h2>
        <p style={{ color: "crimson" }}>{courseErr?.message ?? "Not found"}</p>
        <Link href="/my-courses">← Back</Link>
      </div>
    );
  }

  // Learner: course must be published
  if (role === "learner" && !course.is_published) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Course</h2>
        <p style={{ color: "crimson" }}>This course is not available yet.</p>
        <Link href="/my-courses">← Back to My Courses</Link>
      </div>
    );
  }

  // 1) Enrollment guard (ONLY learners)
  if (role === "learner") {
    const { data: enrollment, error: enrollErr } = await supabase
      .from("course_enrollments")
      .select("id")
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (enrollErr) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Course</h2>
          <p style={{ color: "crimson" }}>{enrollErr.message}</p>
          <Link href="/my-courses">← My Courses</Link>
        </div>
      );
    }

    if (!enrollment) {
      return (
        <div className="relative min-h-screen overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 -translate-y-3">
            <Image
              src="/templates/5.jpg"
              alt=""
              fill
              priority
              className="object-cover object-[center_-180px]"
            />
          </div>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

          <div className="relative z-10 mx-auto max-w-3xl px-6 py-10">
            <div className="rounded-xl border border-white/20 bg-white/85 p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Access denied
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                You are not enrolled in this course.
              </p>
              <div className="mt-4">
                <Link
                  href="/my-courses"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                >
                  ← Back to My Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // 2) Sections (published only)
  const { data: sections, error: sectionsErr } = await supabase
    .from("course_sections")
    .select("id, title, position, is_published")
    .eq("course_id", courseId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (sectionsErr) throw sectionsErr;

  const visibleSections = (sections ?? []).filter((s) => s.is_published === true);
  const sectionIds = visibleSections.map((s) => s.id);

  // Module quizzes
  const { data: moduleQuizzes, error: quizErr } = await supabase
    .from("module_quizzes")
    .select("id, section_id, is_published")
    .eq("course_id", courseId);

  if (quizErr) throw quizErr;

  const quizIds = (moduleQuizzes ?? []).map((q) => q.id);
  const quizPassedSectionSet = new Set<string>();

  if (quizIds.length > 0) {
    const { data: quizAttempts, error: attemptErr } = await supabase
      .from("module_quiz_attempts")
      .select("quiz_id")
      .eq("user_id", user.id)
      .eq("passed", true)
      .in("quiz_id", quizIds);

    if (attemptErr) throw attemptErr;

    const quizIdToSectionId = new Map(
      (moduleQuizzes ?? []).map((q) => [q.id, q.section_id] as const)
    );

    for (const a of quizAttempts ?? []) {
      const quiz_id = (a as { quiz_id?: string }).quiz_id;
      if (!quiz_id) continue;
      const sectionId = quizIdToSectionId.get(quiz_id);
      if (sectionId) quizPassedSectionSet.add(sectionId);
    }
  }

  // 3) Lessons under sections
  const { data: courseLessons, error: lessonsErr } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, section_id, title, position, is_published, kind")
        .in("section_id", sectionIds)
        .order("position", { ascending: true })
    : { data: [], error: null };

  if (lessonsErr) throw lessonsErr;

  // 4) Filter visible lessons
  const lessons = normalizeCourseLessons(courseLessons);

  const visibleLessons =
    role === "learner"
      ? lessons.filter((l) => l.is_published === true && l.kind !== "quiz")
      : lessons.filter((l) => l.kind !== "quiz");

  const lessonIds = visibleLessons.map((l) => l.id);
  const total = lessonIds.length;

  // 5) Completed set
  let completedSet = new Set<string>();

  if (total > 0) {
    const { data: comps, error: progressErr } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds);

    if (progressErr) throw progressErr;

    completedSet = new Set(
      (comps ?? []).map((x) => String((x as { lesson_id?: string }).lesson_id))
    );
  }

  const done = completedSet.size;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const totalVisibleQuizzes = sectionIds.length;
  const passedVisibleQuizzes = sectionIds.filter((sid) =>
    quizPassedSectionSet.has(sid)
  ).length;

  const allQuizzesPassed =
    totalVisibleQuizzes > 0 && passedVisibleQuizzes === totalVisibleQuizzes;

  // 6) Group lessons by section
  const lessonsBySection = new Map<string, CourseLessonLite[]>();

  for (const l of visibleLessons) {
    if (!l.section_id) continue;
    const arr = lessonsBySection.get(l.section_id) ?? [];
    arr.push(l);
    lessonsBySection.set(l.section_id, arr);
  }

  // ✅ UI: fixed background + only content scrolls
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10 -translate-y-7">
        <Image
          src="/templates/5.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[center_-140px]"
        />
      </div>
      <div className="fixed inset-0 -z-10 bg-black/20" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      <div className="mx-auto flex h-screen max-w-4xl flex-col px-6 py-10">
        {/* Header (does NOT scroll) */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">{course.title}</h1>

            {course.description ? (
              <p className="mt-2 text-sm text-white/90">{course.description}</p>
            ) : (
              <p className="mt-2 text-sm text-white/80">No description.</p>
            )}

            <div className="mt-3 text-sm text-white/90">
              Progress:{" "}
              <span className="font-medium">
                {done}/{total}
              </span>{" "}
              ({pct}%)
            </div>

            {totalVisibleQuizzes > 0 && (
              <div className="mt-2 text-sm font-medium text-white/90">
                Quizzes passed:{" "}
                <span className="text-white">
                  {passedVisibleQuizzes}/{totalVisibleQuizzes}
                </span>
                {allQuizzesPassed ? (
                  <span className="ml-2 text-green-200">
                    ✅ All visible module quizzes passed
                  </span>
                ) : null}
              </div>
            )}
          </div>

          <Link
            href="/my-courses"
            className="rounded-md border border-white/30 bg-white/80 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-white"
          >
            ← My Courses
          </Link>
        </div>

        {/* Scroll area (ONLY this scrolls) */}
        <div className="mt-8 flex-1 overflow-y-auto">
          <div className="space-y-4 pb-10">
            {!visibleSections.length ? (
              <div className="rounded-xl border border-white/20 bg-white/85 p-6">
                <p className="text-gray-800">No sections yet.</p>
              </div>
            ) : (
              visibleSections.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-white/20 bg-white/85 p-6"
                >
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <span>
                      {s.position}. {s.title}
                    </span>

                    {quizPassedSectionSet.has(s.id) ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                        Quiz passed
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
                        Quiz pending
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-sm text-gray-600">
                    Select an activity to continue.
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700">
                      Activities
                    </div>

                    <div className="mt-3 space-y-2">
                      {(lessonsBySection.get(s.id) ?? []).map((l) => (
                        <Link
                          key={l.id}
                          href={`/my-courses/${courseId}/lessons/${l.id}`}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition hover:bg-gray-50"
                        >
                          <div className="min-w-0">
                            <div className="font-medium">{l.title}</div>

                            <div className="mt-1 flex flex-wrap gap-2">
                              {completedSet.has(l.id) ? (
                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                  Activity completed
                                </span>
                              ) : (
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                                  Not completed
                                </span>
                              )}
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                              Activity {l.position}
                            </div>
                          </div>

                          <span className="text-gray-400">→</span>
                        </Link>
                      ))}

                      {(lessonsBySection.get(s.id) ?? []).length === 0 && (
                        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                          No activities yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
