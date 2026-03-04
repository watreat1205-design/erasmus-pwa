import Link from "next/link";
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

type SectionRow = { id: string; title: string; position: number };
type LessonRow = { id: string; section_id: string; title: string; position: number };
type ModuleQuizRow = { id: string; section_id: string; title: string; pass_score: number };

export default async function CourseViewPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
 const { lang } = await getServerTranslation(); 
 const { courseId } = await params;

  if (!courseId) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Course</h2>
        <p style={{ color: "crimson" }}>Missing courseId in URL.</p>
        <Link href="/courses">← Back to Courses</Link>
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
    .single();

  if (cErr || !course) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Course</h2>
        <p style={{ color: "crimson" }}>{cErr?.message ?? "Not found"}</p>
        <Link href="/courses">← Back to Courses</Link>
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
  for (const l of lessons) {
    const arr = lessonsBySection.get(l.section_id) ?? [];
    arr.push(l);
    lessonsBySection.set(l.section_id, arr);
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
  for (const q of moduleQuizzes) {
    if (!quizBySection.has(q.section_id)) quizBySection.set(q.section_id, q);
  }

  const passedQuizSet = new Set<string>();
  if (user) {
    const { data: quizAttempts } = await supabase
      .from("module_quiz_attempts")
      .select("quiz_id")
      .eq("user_id", user.id)
      .eq("passed", true);

    for (const a of quizAttempts ?? []) passedQuizSet.add((a as any).quiz_id);
  }

  const LockedRow = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-800">
      <div className="truncate">{children}</div>
      <span className="ml-3 shrink-0 text-sm font-medium text-gray-600">
        🔒 <TLocked />
      </span>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold !text-white">{pickI18n((course as any).title_i18n, lang, course.title)}</h1>

          {course.description ? (
            <p className="mt-3 text-base !text-white">{pickI18n((course as any).description_i18n, lang, course.description)}</p>
          ) : (
            <p className="mt-3 text-base text-gray-600">
              <TNoDescription />
            </p>
          )}
        </div>

        <AllCoursesButtonClient />
      </div>

      {!isEnrolled && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-gray-900">
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

      <div className="mt-10 space-y-6">
        {!sections.length ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <p className="text-gray-800">
              <TNoSections />
            </p>
          </div>
        ) : (
          sections
            .filter((s) => (lessonsBySection.get(s.id) ?? []).length > 0)
            .map((s) => {
              const sectionLessons = lessonsBySection.get(s.id) ?? [];
              const moduleQuiz = quizBySection.get(s.id) ?? null;

              return (
                <div
                  key={s.id}
                  className="rounded-xl border border-gray-200 bg-white p-8"
                >
                  <div className="text-lg font-semibold text-gray-900">
                    {s.position}. {pickI18n((s as any).title_i18n, lang, s.title)}
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="text-base font-medium text-gray-800">
                      <TLessons />
                    </div>

                    {sectionLessons.length ? (
                      <div className="space-y-3">
                        {sectionLessons.map((l) => {
                          const href = `/courses/${courseId}/lessons/${l.id}`;
                          return isEnrolled ? (
                            <Link
                              key={l.id}
                              href={href}
                              className="block rounded-md border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 hover:bg-gray-50"
                            >
                              {l.position}. {pickI18n((l as any).title_i18n, lang, l.title)}
                            </Link>
                          ) : (
                            <LockedRow key={l.id}>
                              {l.position}. {pickI18n((l as any).title_i18n, lang, l.title)}
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
                      <div className="mt-6">
                        <div className="text-base font-medium text-gray-800">
                          <TModuleQuiz />
                        </div>

                        {isEnrolled ? (
                          <Link
                            href={`/courses/${courseId}/quizzes/${moduleQuiz.id}`}
                            className="mt-3 block rounded-md border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 hover:bg-gray-50"
                          >
                            {pickI18n((moduleQuiz as any).title_i18n, lang, moduleQuiz.title)}
                            {user && passedQuizSet.has(moduleQuiz.id) ? (
                              <span className="ml-2 text-sm text-green-700">
                                ✓ <TPassed />
                              </span>
                            ) : null}
                          </Link>
                        ) : (
                          <div className="mt-3">
                            <LockedRow>{pickI18n((moduleQuiz as any).title_i18n, lang, moduleQuiz.title)}</LockedRow>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
