// app/courses/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import CoursesHeaderClient from "./CoursesHeaderClient";
import CoursesPublicHeader from "./CoursesPublicHeader";
import { getServerTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type CourseRow = {
  id: string;
  title: string;
  description: string | null;
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
  const { t } = await getServerTranslation();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("courses")
    .select("id, title, description, position")
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
          .eq("user_id", user.id)
          .eq("passed", true)
          .in("quiz_id", quizIds)
      : { data: [] as { quiz_id: string }[] };

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
  }

  if (error) {
    return (
      <div className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex items-start justify-between gap-4">
            <CoursesPublicHeader />
            <div className="shrink-0">
              <CoursesHeaderClient />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
            <p className="mt-2 text-gray-800">Could not load courses.</p>

            <pre className="mt-4 overflow-auto rounded-xl bg-black/80 p-4 text-xs text-white">
              {error.message}
            </pre>
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
          <div className="shrink-0">
            <CoursesHeaderClient />
          </div>
        </div>

        {!courses.length ? (
          <div className="mt-8 rounded-2xl border border-white/20 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <p className="text-gray-800">No published courses available yet.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {courses.map((course) => {
              const lessonCount = lessonCountByCourse.get(course.id) ?? 0;

              // For the current approval phase, each module card should show only 1 module quiz
              const quizCount = 1;

              const completedLessons =
                completedLessonsByCourse.get(course.id) ?? 0;
              const passedQuizzesRaw =
                passedQuizzesByCourse.get(course.id) ?? 0;
              const passedQuizzes = Math.min(passedQuizzesRaw, 1);

              const totalUnits = lessonCount + quizCount;
              const completedUnits = completedLessons + passedQuizzes;
              const progressPercent =
                totalUnits > 0
                  ? Math.round((completedUnits / totalUnits) * 100)
                  : 0;

              return (
                <div
                  key={course.id}
                  className="group rounded-[26px] border border-white/25 bg-white/78 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm transition hover:-translate-y-[2px] hover:bg-white/84 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-emerald-50/90 text-lg shadow-sm">
                        📘
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                          {course.title}
                        </h2>

                        <div className="mt-2 text-sm text-gray-600">
                          {lessonCount}{" "}
                          {t("courses.activities", {
                            defaultValue: "Activities",
                          })}{" "}
                          • {quizCount}{" "}
                          {t("courses.moduleQuiz", {
                            defaultValue: "Module quiz",
                          })}
                        </div>
                      </div>
                    </div>

                    <span className="mt-1 text-gray-400 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                  {course.description ? (
                    <p className="mt-4 text-sm leading-6 text-gray-700">
                      {course.description}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {t("courses.noDescription", {
                        defaultValue:
                          "Explore the activities in this module to deepen your understanding of TEAL pedagogy.",
                      })}
                    </p>
                  )}

                  <Link
                    href={`/courses/${course.id}`}
                    className="mt-5 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    {t("courses.openCourse", {
                      defaultValue: "Open course",
                    })}
                  </Link>

                  {user ? (
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs font-medium text-gray-700">
                        <span>
                          {t("courses.progress", {
                            defaultValue: "Progress",
                          })}
                        </span>
                        <span>{progressPercent}%</span>
                      </div>

                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/70">
                        <div
                          className="h-full rounded-full bg-emerald-600 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      <div className="mt-2 text-xs text-gray-600">
                        {completedLessons}/{lessonCount}{" "}
                        {t("courses.activitiesCompleted", {
                          defaultValue: "activities completed",
                        })}
                        {" • "}
                        {passedQuizzes}/{quizCount}{" "}
                        {t("courses.quizzesPassed", {
                          defaultValue: "quizzes passed",
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
