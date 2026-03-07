import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import PdfDocumentViewerNoSSR from "@/components/lesson/PdfDocumentViewerNoSSR";
import LessonActionsClient from "./LessonActionsClient";
import ResourcesTitleClient from "./ResourcesTitleClient";
import { getServerTranslation } from "@/lib/i18n/server";
import { pickI18n } from "@/lib/i18n/pick";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const { lang } = await getServerTranslation();

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

  // Enrollment guard
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

  const { data: course, error: cErr } = await supabase
    .from("courses")
    .select("id, title, title_i18n")
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

  const { data: sections, error: sErr } = await supabase
    .from("course_sections")
    .select("id, title, position, title_i18n")
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

  const { data: lessons, error: lErr } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select(
          "id, section_id, title, position, content, assets_path, title_en, title_el, title_it, title_es, title_ro, title_hr"
        )
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

  const { data: current, error: curErr } = await supabase
    .from("course_lessons")
    .select(
      "id, section_id, title, position, content, assets_path, title_i18n, content_i18n"
    )
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

  // Load resources from Storage folder
  let lessonFiles: { name: string }[] = [];

  if (current.assets_path) {
    const { data, error: listErr } = await supabase.storage
      .from("course-assets")
      .list(current.assets_path, { limit: 100 });

    if (!listErr) {
      lessonFiles = (data ?? [])
        .filter((x) => x?.name && !x.name.startsWith("."))
        .filter((x: any) => x.metadata !== null)
        .map((x) => ({ name: x.name }));
    }
  }

  // Put the lesson PDF first
  const isLessonPdf = (name: string) => /activity-.*pages-.*\.pdf$/i.test(name);

  lessonFiles = [...lessonFiles].sort((a, b) => {
    const aName = a.name ?? "";
    const bName = b.name ?? "";

    const aLesson = isLessonPdf(aName) ? 0 : 1;
    const bLesson = isLessonPdf(bName) ? 0 : 1;
    if (aLesson !== bLesson) return aLesson - bLesson;

    const aPdf = aName.toLowerCase().endsWith(".pdf") ? 0 : 1;
    const bPdf = bName.toLowerCase().endsWith(".pdf") ? 0 : 1;
    if (aPdf !== bPdf) return aPdf - bPdf;

    return aName.localeCompare(bName);
  });

  const { data: moduleQuiz } = await supabase
    .from("module_quizzes")
    .select("id, title, description, pass_score, is_published, title_i18n, description_i18n")
    .eq("course_id", courseId)
    .eq("section_id", current.section_id)
    .eq("is_published", true)
    .maybeSingle();

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

  const { data: prog } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const isCompleted = !!prog?.id;

  const ordered = lessons ?? [];
  const idx = ordered.findIndex((x) => String(x.id) === String(lessonId));
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  const section = (sections ?? []).find((s) => s.id === current.section_id);

  // Split: lesson PDF (render inline) vs other PDFs (iframe)
  const lessonPdf = lessonFiles.find((f) => isLessonPdf(f.name));
  const otherFiles = lessonFiles.filter((f) => f.name !== lessonPdf?.name);

  const getPublicUrl = (name: string) =>
    supabase.storage
      .from("course-assets")
      .getPublicUrl(`${current.assets_path}/${name}`).data.publicUrl;
       return (
  <div className="mx-auto max-w-5xl px-6 py-6">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="text-sm !text-white">
          {pickI18n((course as any).title_i18n, lang, course.title)}
        </div>

        <h1 className="text-3xl font-semibold leading-tight !text-white sm:text-4xl">
          {pickI18n((current as any).title_i18n, lang, current.title)}
        </h1>

        <div className="mt-1 text-sm !text-white">
          {section ? (
            <>
              Module {section.position}:{" "}
              {pickI18n((section as any).title_i18n, lang, section.title)} • Lesson{" "}
              {current.position}
            </>
          ) : (
            <>Lesson {current.position}</>
          )}
        </div>
      </div>

      <div className="w-full sm:w-auto">
        <LessonActionsClient
          courseId={courseId}
          lessonId={lessonId}
          isCompleted={isCompleted}
        />
      </div>
    </div>

    {/* Optional lesson text */}
      {current.content && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
            {pickI18n((current as any).content_i18n, lang, current.content)}
          </div>
        </div>
      )}

      {/* Resources */}
      {lessonFiles.length > 0 && current.assets_path && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            <ResourcesTitleClient />
          </h3>

          {/* Lesson PDF inline */}
          {lessonPdf && (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium text-gray-900">{lessonPdf.name}</div>
              <PdfDocumentViewerNoSSR url={getPublicUrl(lessonPdf.name)} />
            </div>
          )}

          {/* Other files */}
          {otherFiles.length > 0 && (
            <div className="mt-8 space-y-8">
              {otherFiles.map((file) => {
                const publicUrl = getPublicUrl(file.name);
                const isPdf = file.name.toLowerCase().endsWith(".pdf");

                return (
                  <div key={file.name} className="space-y-2">
                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                      {isPdf ? (
                       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-2">
                        <PdfDocumentViewerNoSSR url={publicUrl} />
                       </div>
                      ) : (
                  
                      <Link
                        href={publicUrl}
                        target="_blank"
                        className="text-sm text-blue-700 underline"
                      >
                        Open file
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Module Quiz */}
      {moduleQuiz?.id && (
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Module Quiz</h2>
              <p className="mt-1 text-sm text-gray-700">
                {pickI18n((moduleQuiz as any).title_i18n, lang, moduleQuiz.title)}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Pass score: <span className="font-medium">{moduleQuiz.pass_score}%</span>
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
              className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold !text-white hover:bg-gray-900"
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
            href={`/courses/${courseId}/lessons/${prev.id}`}
            className="rounded-md border border-gray-300 bg-gray-800 px-4 py-2 text-sm font-medium !text-white hover:bg-gray-100"
          >
            ← Previous
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/courses/${courseId}/lessons/${next.id}`}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium !text-white hover:bg-gray-800"
          >
            Next →
          </Link>
        ) : (
          <div className="text-sm text-gray-500">End of course ✅</div>
        )}
      </div>
    </div>
  );
}
