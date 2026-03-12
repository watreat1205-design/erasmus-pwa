// app/courses/[courseId]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import EnrollButton from "../EnrollButton";
import AllCoursesButtonClient from "./AllCoursesButtonClient";
import { getServerTranslation } from "@/lib/i18n/server";
import { pickI18n } from "@/lib/i18n/pick";
import {
  TNoDescription,
  TEnrollTitle,
  TEnrollBody,
  TLoginHint,
  TNoSections,
  TLessons,
  TNoLessons,
  TModuleQuiz,
  TLocked,
  TPassed,
} from "./CourseText";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CourseRow = {
  id: string;
  title: string;
  description: string | null;
  title_i18n?: Record<string, string> | null;
  description_i18n?: Record<string, string> | null;
};

type SectionRow = {
  id: string;
  title: string;
  position: number;
  title_i18n?: Record<string, string> | null;
};

type LessonRow = {
  id: string;
  section_id: string;
  title: string;
  position: number;
  title_i18n?: Record<string, string> | null;
};

type ModuleQuizRow = {
  id: string;
  section_id: string;
  title: string;
  pass_score: number;
  title_i18n?: Record<string, string> | null;
};

export default async function CourseViewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  noStore();

  const { lang } = await getServerTranslation();
  const { courseId } = await params;

  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-900">Course</h2>
          <p className="mt-3 text-red-600">Missing courseId in URL.</p>
          <Link href="/courses" className="mt-4 inline-block text-sm underline">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course, error: cErr } = await supabase
    .from("courses")
    .select("id, title, description, title_i18n, description_i18n")
    .eq("id", courseId)
    .single<CourseRow>();

  if (cErr || !course) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <Image
          src="/templates/5.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-10 text-white">
          <h2 className="text-2xl font-semibold">Course</h2>
          <p className="mt-3 text-red-200">{cErr?.message ?? "Not found"}</p>
          <Link
            href="/courses"
            className="mt-4 inline-flex rounded-md bg-black/40 px-3 py-2 text-sm font-medium !text-white hover:bg-black/60"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  let isEnrolled = false;

  if (user) {
    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("id")
      .eq("course_id", courseId)
      .eq("user_id", user.id)
      .maybeSingle();

    isEnrolled = !!enrollment;
  }

  const { data: sectionsData } = await supabase
    .from("course_sections")
    .select("id, title, position, title_i18n")
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  const sections = (sectionsData ?? []) as SectionRow[];
  const sectionIds = sections.map((s) => s.id);

  const { data: lessonsData } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, section_id, title, position, title_i18n")
        .in("section_id", sectionIds)
        .order("position", { ascending: true })
    : { data: [] as LessonRow[] };

  const lessons = (lessonsData ?? []) as LessonRow[];

  const lessonsBySection = new Map<string, LessonRow[]>();
  for (const lesson of lessons) {
    const arr = lessonsBySection.get(lesson.section_id) ?? [];
    arr.push(lesson);
    lessonsBySection.set(lesson.section_id, arr);
  }

  const { data: moduleQuizzesData } = sectionIds.length
    ? await supabase
        .from("module_quizzes")
        .select("id, section_id, title, pass_score, title_i18n")
        .eq("course_id", courseId)
        .eq("is_published", true)
        .in("section_id", sectionIds)
    : { data: [] as ModuleQuizRow[] };

  const moduleQuizzes = (moduleQuizzesData ?? []) as ModuleQuizRow[];

  const quizBySection = new Map<string, ModuleQuizRow>();
  for (const quiz of moduleQuizzes) {
    if (!quizBySection.has(quiz.section_id)) {
      quizBySection.set(quiz.section_id, quiz);
    }
  }

  const passedQuizSet = new Set<string>();
  if (user) {
    const { data: quizAttempts } = await supabase
      .from("module_quiz_attempts")
      .select("quiz_id")
      .eq("user_id", user.id)
      .eq("passed", true);

    for (const attempt of quizAttempts ?? []) {
      passedQuizSet.add((attempt as { quiz_id: string }).quiz_id);
    }
  }

  const visibleSections = sections.filter(
    (section) => (lessonsBySection.get(section.id) ?? []).length > 0
  );

  const LockedRow = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-4 text-base text-gray-800 shadow-sm">
      <div className="truncate">{children}</div>
      <span className="ml-3 shrink-0 text-sm font-medium text-gray-600">
        🔒 <TLocked />
      </span>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/templates/5.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative z-10">
        <div className="mx-auto max-w-5xl px-6 pt-10 pb-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight !text-white sm:text-5xl">
                {pickI18n(course.title_i18n, lang, course.title)}
              </h1>

              {course.description ? (
                <p className="mt-3 max-w-2xl text-base leading-7 !text-white">
                  {pickI18n(course.description_i18n, lang, course.description)}
                </p>
              ) : (
                <p className="mt-3 text-base text-white/80">
                  <TNoDescription />
                </p>
              )}
            </div>

            <div className="w-full sm:w-auto">
              <AllCoursesButtonClient />
            </div>
          </div>

          {!isEnrolled && (
            <div className="mt-8 rounded-[30px] border border-white/50 bg-emerald-50/70 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                <TEnrollTitle />
              </h2>

              <p className="mt-2 text-base text-gray-700">
                <TEnrollBody />
              </p>

              <div className="mt-5">
                <EnrollButton courseId={courseId} />
                {!user && (
                  <p className="mt-3 text-sm text-gray-600">
                    <TLoginHint />
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-10">
            {!visibleSections.length ? (
              <div className="rounded-[30px] border border-white/50 bg-emerald-50/70 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                <p className="text-gray-800">
                  <TNoSections />
                </p>
              </div>
            ) : (
              <div className="rounded-[30px] border border-white/50 bg-emerald-50/70 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                <div className="space-y-8">
                  {visibleSections.map((section, index) => {
                    const sectionLessons = lessonsBySection.get(section.id) ?? [];
                    const moduleQuiz = quizBySection.get(section.id) ?? null;

                    return (
                      <div key={section.id}>
                        <div className="text-xl font-semibold tracking-tight text-gray-900">
                          {section.position}.{" "}
                          {pickI18n(section.title_i18n, lang, section.title)}
                        </div>

                        <div className="mt-6 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-lg shadow-sm">
                              📚
                            </div>
                            <div>
                              <div className="text-base font-semibold text-gray-900">
                                <TLessons />
                              </div>
                              <div className="mt-1 h-[2px] w-14 rounded-full bg-gradient-to-r from-emerald-500/70 to-transparent" />
                            </div>
                          </div>

                          {sectionLessons.length ? (
                            <div className="space-y-3">
                              {sectionLessons.map((lesson) => {
                                const href = `/courses/${courseId}/lessons/${lesson.id}`;

                                return isEnrolled ? (
                                  <Link
                                    key={lesson.id}
                                    href={href}
                                    className="block rounded-2xl border border-white/60 bg-white/75 px-4 py-4 text-base text-gray-900 shadow-sm transition hover:bg-white/90 hover:shadow-md"
                                  >
                                    {lesson.position}.{" "}
                                    {pickI18n(
                                      lesson.title_i18n,
                                      lang,
                                      lesson.title
                                    )}
                                  </Link>
                                ) : (
                                  <LockedRow key={lesson.id}>
                                    {lesson.position}.{" "}
                                    {pickI18n(
                                      lesson.title_i18n,
                                      lang,
                                      lesson.title
                                    )}
                                  </LockedRow>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-base text-gray-600">
                              <TNoLessons />
                            </p>
                          )}

                          {moduleQuiz && (
                            <div className="mt-8">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-lg shadow-sm">
                                  🧠
                                </div>
                                <div>
                                  <div className="text-base font-semibold text-gray-900">
                                    <TModuleQuiz />
                                  </div>
                                  <div className="mt-1 h-[2px] w-14 rounded-full bg-gradient-to-r from-emerald-500/70 to-transparent" />
                                </div>
                              </div>

                              {isEnrolled ? (
                                <Link
                                  href={`/quizzes/${moduleQuiz.id}`}
                                  className="mt-3 block rounded-2xl border border-white/60 bg-[#f2f9f2]/92 px-4 py-4 text-base text-gray-900 shadow-sm transition hover:shadow-md"
                                >
                                  {pickI18n(
                                    moduleQuiz.title_i18n,
                                    lang,
                                    moduleQuiz.title
                                  )}
                                  {user && passedQuizSet.has(moduleQuiz.id) ? (
                                    <span className="ml-2 text-sm text-green-700">
                                      ✓ <TPassed />
                                    </span>
                                  ) : null}
                                </Link>
                              ) : (
                                <div className="mt-3">
                                  <LockedRow>
                                    {pickI18n(
                                      moduleQuiz.title_i18n,
                                      lang,
                                      moduleQuiz.title
                                    )}
                                  </LockedRow>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {index < visibleSections.length - 1 ? (
                          <div className="mt-8 border-t border-white/40" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
