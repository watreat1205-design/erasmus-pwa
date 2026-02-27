import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { markLessonComplete, markLessonIncomplete } from "@/app/courses/actions";
import ResourceViewer from "@/components/lesson/ResourceViewer";
import ActivityLayout from "@/components/learn/ActivityLayout";
import { ResourcesSidebar, ResourceCard } from "@/components/learn/ResourcesUI";

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string };
}) {
  const { courseId, lessonId } = params;

  if (!courseId || !lessonId) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Bad route</h2>
        <p style={{ color: "crimson" }}>Missing courseId/lessonId in URL.</p>
        <Link href="/courses">← Back</Link>
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
        <h2>Lesson</h2>
        <p style={{ color: "crimson" }}>You must be logged in.</p>
        <Link href="/login">Go to login</Link>
      </div>
    );
  }

  // ✅ Enrollment guard
  const { data: enrollment, error: eErr } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (eErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Lesson</h2>
        <p style={{ color: "crimson" }}>{eErr.message}</p>
        <Link href={`/courses/${courseId}`}>← Back to course</Link>
      </div>
    );
  }

      if (!enrollment) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Lesson</h2>
        <p style={{ color: "crimson" }}>You are not enrolled in this course.</p>
        <Link href={`/courses/${courseId}`}>← Back to course</Link>
      </div>
    );
  }
  // Course (for title)
  const { data: course, error: cErr } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", courseId)
    .single();

  if (cErr || !course) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Lesson</h2>
        <p style={{ color: "crimson" }}>{cErr?.message ?? "Course not found"}</p>
        <Link href="/courses">← Back</Link>
      </div>
    );
  }

  // Sections
  const { data: sections, error: sErr } = await supabase
    .from("course_sections")
    .select("id, title, position")
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  if (sErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Lesson</h2>
        <p style={{ color: "crimson" }}>{sErr.message}</p>
        <Link href={`/courses/${courseId}`}>← Back to course</Link>
      </div>
    );
  }

  const sectionIds = (sections ?? []).map((s) => s.id);

  // Lessons (for prev/next)
  const { data: lessons, error: lErr } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, section_id, title, position, content, assets_path")
        .in("section_id", sectionIds)
        .order("position", { ascending: true })
    : { data: [], error: null };

  if (lErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Lesson</h2>
        <p style={{ color: "crimson" }}>{lErr.message}</p>
        <Link href={`/courses/${courseId}`}>← Back to course</Link>
      </div>
    );
  }

  // Current lesson (always fetch by lessonId)
  const { data: current, error: curErr } = await supabase
    .from("course_lessons")
    .select("id, section_id, title, position, content, assets_path")
    .eq("id", lessonId)
    .single();

  if (curErr || !current) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Lesson not found</h2>
        <p style={{ color: "crimson" }}>{curErr?.message}</p>
        <Link href={`/courses/${courseId}`}>← Back to course</Link>
      </div>
    );
  }

  // ✅ Auto-load resources from Storage folder (assets_path)
  let lessonFiles: { name: string }[] = [];

  if (current.assets_path) {
    const { data, error: listErr } = await supabase.storage
      .from("course-assets")
      .list(current.assets_path, { limit: 100 });

    if (!listErr) lessonFiles = (data ?? []).filter((x) => !!x?.name);
  }

  // Find module quiz for this lesson's section
  const { data: moduleQuiz } = await supabase
    .from("module_quizzes")
    .select("id, title, description, pass_score, is_published")
    .eq("course_id", courseId)
    .eq("section_id", current.section_id)
    .eq("is_published", true)
    .maybeSingle();

  // Latest attempt for this user + quiz
  const { data: lastAttempt } = moduleQuiz?.id
    ? await supabase
        .from("module_quiz_attempts")
        .select("score_percent, passed, submitted_at, attempt_no")
        .eq("quiz_id", moduleQuiz.id)
        .eq("user_id", user.id)
        .order("attempt_no", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  // Completed?
  const { data: prog } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const isCompleted = !!prog?.id;

  // Prev/Next
  const ordered = lessons ?? [];
  const idx = ordered.findIndex((x) => String(x.id) === String(lessonId));
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  // Section title
  const section = (sections ?? []).find((s) => s.id === current.section_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">{course.title}</div>
            <h1 className="mt-1 text-3xl font-semibold text-gray-900">
              {current.title}
            </h1>

            <div className="mt-2 text-sm text-gray-600">
              {section ? (
                <>
                  Module {section.position}: {section.title} • Lesson {current.position}
                </>
              ) : (
                <>Lesson {current.position}</>
              )}
            </div>

            {/* ✅ Completion button (server actions) */}
            <div className="mt-4">
              {isCompleted ? (
                <form action={markLessonIncomplete}>
                  <input type="hidden" name="courseId" value={courseId} />
                  <input type="hidden" name="lessonId" value={lessonId} />
                  <button
                    type="submit"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    ✅ Completed (click to undo)
                  </button>
                </form>
              ) : (
                <form action={markLessonComplete}>
                  <input type="hidden" name="courseId" value={courseId} />
                  <input type="hidden" name="lessonId" value={lessonId} />
                  <button
                    type="submit"
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Mark as completed
                  </button>
                </form>
              )}
            </div>
          </div>

          <Link
            href={`/courses/${courseId}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            ← Back to course
          </Link>
        </div>

        {/* Lesson content (show exactly what NGO provided) */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          {current.content ? (
            <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
              {current.content}
            </div>
          ) : (
            <p className="text-gray-500">Lesson content coming soon.</p>
          )}
        </div>

        {/* Resources from Storage (assets_path) */}
        {lessonFiles.length > 0 && current.assets_path && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
            <div className="mt-4 space-y-3">
              {lessonFiles.map((file) => {
                const publicUrl =
                  supabase.storage
                    .from("course-assets")
                    .getPublicUrl(`${current.assets_path}/${file.name}`).data.publicUrl;

                return (
                  <ResourceViewer
                    key={file.name}
                    url={publicUrl}
                    label={file.name}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Module Quiz */}
        {moduleQuiz?.id && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Module Quiz</h2>
                <p className="mt-1 text-sm text-gray-700">{moduleQuiz.title}</p>

                <p className="mt-2 text-sm text-gray-600">
                  Pass score:{" "}
                  <span className="font-medium">{moduleQuiz.pass_score}%</span>
                </p>

                {lastAttempt ? (
                  <div className="mt-3 text-sm text-gray-700">
                    <span className="font-medium">Last attempt:</span>{" "}
                    {lastAttempt.score_percent}%{" "}
                    <span
                      className={
                        "ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold " +
                        (lastAttempt.passed
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700")
                      }
                    >
                      {lastAttempt.passed ? "Passed" : "Not passed"}
                    </span>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-600">No attempts yet.</p>
                )}
              </div>

              <Link
                href={`/quizzes/${moduleQuiz.id}`}
                className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
              >
                {lastAttempt
                  ? lastAttempt.passed
                    ? "View quiz"
                    : "Retake quiz"
                  : "Start quiz"}
              </Link>
            </div>
          </div>
        )}

        {/* Prev / Next */}
        <div className="mt-6 flex items-center justify-between">
          {prev ? (
            <Link
              href={`/courses/${courseId}/lessons/lessons/${prev.id}`}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              ← Previous
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/courses/${courseId}/lessons/lessons/${next.id}`}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Next →
            </Link>
          ) : (
            <div className="text-sm text-gray-500">End of course ✅</div>
          )}
                  </div>
      </div>
    </div>
  );
}
