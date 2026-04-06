// app/courses/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CoursesHeaderClient from "./CoursesHeaderClient";
import CoursesPublicHeader from "./CoursesPublicHeader";
import { getServerTranslation } from "@/lib/i18n/server";

function pickI18n(
  i18n: Record<string, string> | null | undefined,
  lang: string,
  fallback: string
) {
  if (!i18n) return fallback;
  return i18n[lang] || i18n["en"] || fallback;
}

export const dynamic = "force-dynamic";

type CourseRow = {
  id: string;
  title: string;
  title_i18n?: Record<string, string> | null;
  description: string | null;
  description_i18n?: Record<string, string> | null;
  position: number | null;
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

export default async function CoursesPublicPage() {
  const supabase = await createSupabaseServerClient();
  const { t, lang } = await getServerTranslation();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("courses")
    .select("id, title, title_i18n, description, description_i18n, position")
    .eq("is_published", true)
    .order("position", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });

  const courses: CourseRow[] = data ?? [];
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

  const lessonCountByCourse = new Map<string, number>();
  const lessonToCourse = new Map<string, string>();

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

  const quizCountByCourse = new Map<string, number>();
  for (const quiz of quizzes) {
    quizCountByCourse.set(
      quiz.course_id,
      (quizCountByCourse.get(quiz.course_id) ?? 0) + 1
    );
  }

  const completedLessonsByCourse = new Map<string, number>();
  const passedQuizzesByCourse = new Map<string, number>();

  if (user) {
    const { data: lessonProgressData } = lessonIds.length
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .in("lesson_id", lessonIds)
      : { data: [] as { lesson_id: string }[] };

    for (const row of lessonProgressData ?? []) {
      const courseId = lessonToCourse.get(row.lesson_id);
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
          .eq("user_id", user.id)
          .eq("passed", true)
          .in("quiz_id", quizIds)
      : { data: [] as { quiz_id: string }[] };

    const countedPassedQuizzes = new Set<string>();

    for (const row of passedQuizAttempts ?? []) {
      if (countedPassedQuizzes.has(row.quiz_id)) continue;
      countedPassedQuizzes.add(row.quiz_id);

      const courseId = quizToCourse.get(row.quiz_id);
      if (!courseId) continue;

      passedQuizzesByCourse.set(
        courseId,
        (passedQuizzesByCourse.get(courseId) ?? 0) + 1
      );
    }
  }

  if (error) {
    return (
      <div className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mt-8 rounded-2xl border bg-white/80 p-6">
            <h1 className="text-2xl font-semibold">
              {t("courses.title", { defaultValue: "Courses" })}
            </h1>
            <p className="mt-2">
              {t("courses.loadError", {
                defaultValue: "Could not load courses.",
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <CoursesPublicHeader />
          <CoursesHeaderClient />
        </div>

        {!courses.length ? (
          <div className="mt-8 rounded-2xl bg-white/80 p-6">
            <p>
              {t("courses.empty", {
                defaultValue: "No published courses available yet.",
              })}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {courses.map((course) => {
              const lessonCount = lessonCountByCourse.get(course.id) ?? 0;
              const quizCount = Math.min(
                quizCountByCourse.get(course.id) ?? 0,
                1
              );

              const completedLessons =
                completedLessonsByCourse.get(course.id) ?? 0;
              const passedQuizzes =
                Math.min(passedQuizzesByCourse.get(course.id) ?? 0, 1);

              const totalUnits = lessonCount + quizCount;
              const completedUnits = completedLessons + passedQuizzes;
              const progressPercent =
                totalUnits > 0
                  ? Math.round((completedUnits / totalUnits) * 100)
                  : 0;

              return (
                <div key={course.id} className="rounded-[26px] bg-white/80 p-6">
                  <h2 className="text-lg font-semibold">
                    {pickI18n(course.title_i18n, lang, course.title)}
                  </h2>

                  <div className="mt-2 text-sm">
                    {lessonCount} {t("courses.activities")} • {quizCount}{" "}
                    {t("courses.moduleQuiz")}
                  </div>

                     <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-700">
                        {course.description
                        ? pickI18n(course.description_i18n, lang, course.description)
                        : t("courses.noDescription")}
                     </p>               

                  <Link
                    href={`/courses/${course.id}`}
                    className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {t("courses.openCourse")}
                  </Link>

                  {user && (
                    <div className="mt-5">
                      <div className="flex justify-between text-xs">
                        <span>{t("courses.progress")}</span>
                        <span>{progressPercent}%</span>
                      </div>

                      <div className="mt-2 h-2.5 bg-white/70 rounded-full">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="mt-2 text-xs">
                        {completedLessons}/{lessonCount}{" "}
                        {t("courses.activitiesCompleted")} •{" "}
                        {passedQuizzes}/{quizCount}{" "}
                        {t("courses.quizzesPassed")}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
