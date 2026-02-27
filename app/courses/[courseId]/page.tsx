import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SectionRow = {
  id: string;
  title: string;
  position: number;
};

type LessonRow = {
  id: string;
  section_id: string;
  title: string;
  position: number;
};

type ModuleQuizRow = {
  id: string;
  section_id: string;
  title: string;
  pass_score: number;
};

export default async function CourseViewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  if (!courseId) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Course</h2>
        <p style={{ color: "crimson" }}>Missing courseId in URL.</p>
        <Link href={`/my-courses/${courseId}`}>← My Courses</Link>
      </div>
    );
  }

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

  // ✅ Enforce enrollment (server-side guard)
  const { data: enrollment, error: eErr } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (eErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Course</h2>
        <p style={{ color: "crimson" }}>{eErr.message}</p>
        <Link href={`/my-courses/${courseId}`}>← My Courses</Link>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Access denied
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You are not enrolled in this course.
            </p>
            <div className="mt-4">
              <Link
                href={`/my-courses/${courseId}`}
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

  const { data: course, error: cErr } = await supabase
    .from("courses")
    .select("id, title, description")
    .eq("id", courseId)
    .single();

  if (cErr || !course) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Course</h2>
        <p style={{ color: "crimson" }}>{cErr?.message ?? "Not found"}</p>
        <Link href={`/my-courses/${courseId}`}>← Back</Link>
      </div>
    );
  }

  const { data: sectionsData } = await supabase
    .from("course_sections")
    .select("id, title, position")
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  const sections = (sectionsData ?? []) as SectionRow[];
  const sectionIds = sections.map((s) => s.id);

  // Lessons per section
  const { data: lessonsData } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, section_id, title, position")
        .in("section_id", sectionIds)
        .order("position", { ascending: true })
    : { data: [] as LessonRow[] };

  const lessons = (lessonsData ?? []) as LessonRow[];

  const lessonsBySection = new Map<string, LessonRow[]>();
  for (const l of lessons) {
    const arr = lessonsBySection.get(l.section_id) ?? [];
    arr.push(l);
    lessonsBySection.set(l.section_id, arr);
  }

  // ✅ Module quizzes per section (1 quiz per module/section)
  const { data: moduleQuizzesData } = sectionIds.length
    ? await supabase
        .from("module_quizzes")
        .select("id, section_id, title, pass_score")
        .eq("course_id", courseId)
        .eq("is_published", true)
        .in("section_id", sectionIds)
    : { data: [] as ModuleQuizRow[] };

  const moduleQuizzes = (moduleQuizzesData ?? []) as ModuleQuizRow[];

  const quizBySection = new Map<string, ModuleQuizRow>();
  for (const q of moduleQuizzes) {
    if (!quizBySection.has(q.section_id)) quizBySection.set(q.section_id, q);
  }

  // ✅ Passed quiz attempts for this user (any passed attempt counts)
  const { data: quizAttempts } = await supabase
    .from("module_quiz_attempts")
    .select("quiz_id, passed")
    .eq("user_id", user.id)
    .eq("passed", true);

  const passedQuizSet = new Set(
    (quizAttempts ?? []).map((a) => (a as { quiz_id: string }).quiz_id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {course.title}
            </h1>
            {course.description ? (
              <p className="mt-2 text-sm text-gray-600">{course.description}</p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No description.</p>
            )}
          </div>

          <Link
            href={`/my-courses/${courseId}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            ← My Courses
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {!sections.length ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="text-gray-700">No sections yet.</p>
            </div>
          ) : (
            sections.map((s) => {
              const sectionLessons = lessonsBySection.get(s.id) ?? [];
              const moduleQuiz = quizBySection.get(s.id) ?? null;
              const quizPassed = moduleQuiz?.id
                ? passedQuizSet.has(moduleQuiz.id)
                : false;

              return (
                <div
                  key={s.id}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="font-semibold text-gray-900">
                    {s.position}. {s.title}
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700">
                      Lessons
                    </div>

                    <ul className="mt-2 list-disc pl-6 text-gray-800">
                      {sectionLessons.map((l) => (
                        <li key={l.id}>
                          <Link
                            href={`/my-courses/${courseId}/lessons/${l.id}`}
                            className="text-gray-900 hover:underline"
                          >
                            {l.position}. {l.title}
                          </Link>
                        </li>
                      ))}

                      {sectionLessons.length === 0 && (
                        <li className="list-none text-gray-500">
                          No lessons yet.
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* ✅ Module quiz row */}
                  {moduleQuiz?.id ? (
                    <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {moduleQuiz.title}
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          Pass score: {moduleQuiz.pass_score}%
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={
                            "rounded-full px-2 py-1 text-xs font-semibold " +
                            (quizPassed
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-800")
                          }
                        >
                          {quizPassed
                            ? "Module quiz passed"
                            : "Module quiz pending"}
                        </span>

                        <Link
                          href={`/quizzes/${moduleQuiz.id}`}
                          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
                        >
                          {quizPassed ? "View" : "Start"}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 text-sm text-gray-500">
                      No module quiz yet.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
