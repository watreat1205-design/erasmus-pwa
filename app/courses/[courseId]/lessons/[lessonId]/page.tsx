// app/courses/[courseId]/lessons/[lessonId]/page.tsx

import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LessonActionsClient from "./LessonActionsClient";
import { getServerTranslation } from "@/lib/i18n/server";
import { pickI18n } from "@/lib/i18n/pick";
import ActivityContentRenderer from "@/components/activity/ActivityContentRenderer";
import { getActivityContentByLesson } from "@/src/lib/activity/content";

type Lang = "en" | "el" | "it" | "es" | "ro" | "hr";

function normalizeLang(input?: string | null): Lang {
  const short = (input || "en").slice(0, 2).toLowerCase();
  if (["en", "el", "it", "es", "ro", "hr"].includes(short)) {
    return short as Lang;
  }
  return "en";
}

function lessonUiText(lang: Lang) {
  const t = {
    en: {
      resources: "Resources",
      supportingPdf: "Supporting PDF",
      presentationFile: "Presentation file",
      supportingFile: "Supporting file",
      openFile: "Open file",
      moduleQuiz: "Module Quiz",
      passScore: "Pass score",
      lastAttempt: "Last attempt",
      passed: "Passed",
      notPassed: "Not passed",
      noAttemptsYet: "No attempts yet.",
      viewQuiz: "View quiz",
      retakeQuiz: "Retake quiz",
      startQuiz: "Start quiz",
      next: "Next",
      previous: "Previous",
      endOfCourse: "End of course ✅",
      module: "Module",
      lesson: "Lesson",
    },
    it: {
      resources: "Risorse",
      supportingPdf: "PDF di supporto",
      presentationFile: "File di presentazione",
      supportingFile: "File di supporto",
      openFile: "Apri file",
      moduleQuiz: "Quiz del modulo",
      passScore: "Punteggio minimo",
      lastAttempt: "Ultimo tentativo",
      passed: "Superato",
      notPassed: "Non superato",
      noAttemptsYet: "Nessun tentativo ancora.",
      viewQuiz: "Apri quiz",
      retakeQuiz: "Ripeti quiz",
      startQuiz: "Inizia quiz",
      next: "Avanti",
      previous: "Precedente",
      endOfCourse: "Fine del corso ✅",
      module: "Modulo",
      lesson: "Lezione",
    },
    el: {
      resources: "Πόροι",
      supportingPdf: "Υποστηρικτικό PDF",
      presentationFile: "Αρχείο παρουσίασης",
      supportingFile: "Υποστηρικτικό αρχείο",
      openFile: "Άνοιγμα αρχείου",
      moduleQuiz: "Κουίζ ενότητας",
      passScore: "Βαθμός επιτυχίας",
      lastAttempt: "Τελευταία προσπάθεια",
      passed: "Επιτυχία",
      notPassed: "Μη επιτυχία",
      noAttemptsYet: "Καμία προσπάθεια ακόμη.",
      viewQuiz: "Άνοιγμα κουίζ",
      retakeQuiz: "Επανάληψη κουίζ",
      startQuiz: "Έναρξη κουίζ",
      next: "Επόμενο",
      previous: "Προηγούμενο",
      endOfCourse: "Τέλος μαθήματος ✅",
      module: "Ενότητα",
      lesson: "Μάθημα",
    },
    es: {
      resources: "Recursos",
      supportingPdf: "PDF de apoyo",
      presentationFile: "Archivo de presentación",
      supportingFile: "Archivo de apoyo",
      openFile: "Abrir archivo",
      moduleQuiz: "Cuestionario del módulo",
      passScore: "Puntuación mínima",
      lastAttempt: "Último intento",
      passed: "Aprobado",
      notPassed: "No aprobado",
      noAttemptsYet: "Aún no hay intentos.",
      viewQuiz: "Ver cuestionario",
      retakeQuiz: "Repetir cuestionario",
      startQuiz: "Empezar cuestionario",
      next: "Siguiente",
      previous: "Anterior",
      endOfCourse: "Fin del curso ✅",
      module: "Módulo",
      lesson: "Lección",
    },
    ro: {
      resources: "Resurse",
      supportingPdf: "PDF suport",
      presentationFile: "Fișier de prezentare",
      supportingFile: "Fișier suport",
      openFile: "Deschide fișierul",
      moduleQuiz: "Testul modulului",
      passScore: "Prag de promovare",
      lastAttempt: "Ultima încercare",
      passed: "Promovat",
      notPassed: "Nepromovat",
      noAttemptsYet: "Nicio încercare încă.",
      viewQuiz: "Deschide testul",
      retakeQuiz: "Reia testul",
      startQuiz: "Începe testul",
      next: "Următorul",
      previous: "Anteriorul",
      endOfCourse: "Sfârșitul cursului ✅",
      module: "Modul",
      lesson: "Lecția",
    },
    hr: {
      resources: "Resursi",
      supportingPdf: "PDF podrške",
      presentationFile: "Datoteka prezentacije",
      supportingFile: "Datoteka podrške",
      openFile: "Otvori datoteku",
      moduleQuiz: "Kviz modula",
      passScore: "Prag prolaza",
      lastAttempt: "Posljednji pokušaj",
      passed: "Položeno",
      notPassed: "Nije položeno",
      noAttemptsYet: "Još nema pokušaja.",
      viewQuiz: "Otvori kviz",
      retakeQuiz: "Ponovi kviz",
      startQuiz: "Započni kviz",
      next: "Dalje",
      previous: "Prethodno",
      endOfCourse: "Kraj tečaja ✅",
      module: "Modul",
      lesson: "Lekcija",
    },
  } as const;

  return t[lang] ?? t.en;
}

function pickLessonContentI18n(contentI18n: any, lang: Lang) {
  if (!contentI18n) return null;
  if (contentI18n[lang]) return contentI18n[lang];
  if (contentI18n["en"]) return contentI18n["en"];
  return null;
}

function isRealStorageFile(x: any) {
  return !!x?.name && !x.name.startsWith(".") && x.metadata !== null;
}

async function listLessonFilesForLanguage(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  basePath: string,
  lang: Lang
): Promise<{ files: { name: string }[]; resolvedLang: Lang; resolvedPath: string }> {
  const candidatePaths = [
    { path: `${basePath}/${lang}`, resolvedLang: lang as Lang },
    { path: `${basePath}/en`, resolvedLang: "en" as Lang },
    { path: basePath, resolvedLang: lang as Lang }, // fallback for old/plain folder structure
  ];

  for (const candidate of candidatePaths) {
    const { data, error } = await supabase.storage
      .from("course-assets")
      .list(candidate.path, { limit: 100 });

    const files = error
      ? []
      : (data ?? [])
          .filter(isRealStorageFile)
          .map((x) => ({ name: x.name }));

    if (files.length > 0) {
      return {
        files,
        resolvedLang: candidate.resolvedLang,
        resolvedPath: candidate.path,
      };
    }
  }

  return {
    files: [],
    resolvedLang: "en",
    resolvedPath: basePath,
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  noStore();

  const { courseId, lessonId } = await params;
  const { lang } = await getServerTranslation();
  const normalizedLang = normalizeLang(lang);
  const ui = lessonUiText(normalizedLang);

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role ?? null;
  const canAccessLearning =
    role === "trainer" || role === "admin" || role === "dev";

  if (!canAccessLearning) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Lesson</h2>
        <p style={{ color: "crimson" }}>You do not have access to this lesson.</p>
        <Link href="/dashboard">Go to dashboard</Link>
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

  // Load resources from Storage language folder with EN fallback
  let lessonFiles: { name: string }[] = [];
  let resolvedAssetsPath = current.assets_path ?? "";
  let resolvedAssetsLang: Lang = "en";

  if (current.assets_path) {
    const result = await listLessonFilesForLanguage(
      supabase,
      current.assets_path,
      normalizedLang
    );

    lessonFiles = result.files;
    resolvedAssetsPath = result.resolvedPath;
    resolvedAssetsLang = result.resolvedLang;
  }

  // Put the lesson PDF first
  const isLessonPdf = (name: string) =>
  /activity-.*pages-.*\.pdf$/i.test(name) ||
  /^a\d+-\d+-presentation\.pdf$/i.test(name);

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
    .select(
      "id, title, description, pass_score, is_published, title_i18n, description_i18n"
    )
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

  const resolvedCourseTitle = pickI18n(
    (course as any).title_i18n,
    lang,
    course.title
  );

  const resolvedLessonTitle = pickI18n(
    (current as any).title_i18n,
    lang,
    current.title
  );

  const dbContent = pickLessonContentI18n(
    (current as any).content_i18n,
    normalizedLang
  );

  const activityContent =
    dbContent ??
    getActivityContentByLesson(
      resolvedCourseTitle,
      resolvedLessonTitle,
      current.position
    );

  // Split: lesson PDF (render inline) vs other PDFs/resources
  const lessonPdf = lessonFiles.find((f) => isLessonPdf(f.name));
  const otherFiles = lessonFiles.filter(
    (f) =>
      !/^activity-.*\.pdf$/i.test(f.name) &&
      !/^case-study-/i.test(f.name)
  );

  const getPublicUrl = (name: string) =>
    supabase.storage
      .from("course-assets")
      .getPublicUrl(`${resolvedAssetsPath}/${name}`).data.publicUrl;

  return (
    <div className="mx-auto max-w-5xl px-6 pt-10 pb-6">
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
                {ui.module} {section.position}:{" "}
                {pickI18n((section as any).title_i18n, lang, section.title)} •{" "}
                {ui.lesson} {current.position}
              </>
            ) : (
              <>
                {ui.lesson} {current.position}
              </>
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

      {/* Structured activity content */}
      {activityContent ? (
        <div className="mt-6">
          <ActivityContentRenderer
            activity={activityContent}
            lang={normalizedLang}
          />
        </div>
      ) : null}


      {/* Other files / slides */}
      {otherFiles.length > 0 && current.assets_path && (
        <div className="mt-6 rounded-[30px] border border-white/50 bg-emerald-50/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-lg shadow-sm">
              📚
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {ui.resources}
              </h3>
              <div className="mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r from-emerald-500/70 to-transparent" />
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Files language: {resolvedAssetsLang.toUpperCase()}
          </div>

          <div className="mt-4 grid gap-4">
            {otherFiles.map((file) => {
              const publicUrl = getPublicUrl(file.name);
              const isPdf = file.name.toLowerCase().endsWith(".pdf");
              const isPpt =
                file.name.toLowerCase().endsWith(".ppt") ||
                file.name.toLowerCase().endsWith(".pptx");

              return (
                <div
                  key={file.name}
                  className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-[#f2f9f2]/92 p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {file.name}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {isPpt
                        ? ui.presentationFile
                        : isPdf
                        ? ui.supportingPdf
                        : ui.supportingFile}
                    </div>
                  </div>

                  <Link
                    href={`/courses/${courseId}/lessons/${lessonId}/external?url=${encodeURIComponent(
                      publicUrl
                    )}`}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium !text-white hover:bg-emerald-800"
                  >
                    {ui.openFile}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Module Quiz */}
      {moduleQuiz?.id && (
        <div
          id="module-quiz"
          className="mt-10 rounded-[30px] border border-white/50 bg-emerald-50/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-lg shadow-sm">
                  🧠
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                    {ui.moduleQuiz}
                  </h2>
                  <div className="mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r from-emerald-500/70 to-transparent" />
                </div>
              </div>

              <p className="mt-1 text-sm text-gray-700">
                {pickI18n((moduleQuiz as any).title_i18n, lang, moduleQuiz.title)}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {ui.passScore}:{" "}
                <span className="font-medium">{moduleQuiz.pass_score}%</span>
              </p>

              {lastAttempt ? (
                <div className="mt-3 text-sm text-gray-700">
                  <span className="font-medium">{ui.lastAttempt}:</span>{" "}
                  {lastAttempt.score_percent}%{" "}
                  <span
                    className={
                      "ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold " +
                      (lastAttempt.passed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700")
                    }
                  >
                    {lastAttempt.passed ? ui.passed : ui.notPassed}
                  </span>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-600">{ui.noAttemptsYet}</p>
              )}
            </div>

            <Link
              href={`/quizzes/${moduleQuiz.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold !text-white shadow-sm hover:bg-emerald-800"
            >
              {lastAttempt
                ? lastAttempt.passed
                  ? ui.viewQuiz
                  : ui.retakeQuiz
                : ui.startQuiz}
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
            ← {ui.previous}
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/courses/${courseId}/lessons/${next.id}`}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium !text-white hover:bg-emerald-800"
          >
            {ui.next} →
          </Link>
        ) : (
          <div className="text-sm text-gray-500">{ui.endOfCourse}</div>
        )}
      </div>
    </div>
  );
}
