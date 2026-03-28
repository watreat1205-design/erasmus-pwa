// app/lib/certificates/final.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  generateCertificateNumber,
  generateVerificationCode,
} from "@/app/lib/certificates/verification";

type CourseRow = {
  id: string;
  title: string;
};

type SectionRow = {
  id: string;
  course_id: string;
};

type LessonRow = {
  id: string;
  section_id: string;
  kind: string | null;
};

type ModuleQuizRow = {
  id: string;
  course_id: string;
};

type FinalCertificateRow = {
  id: string;
  user_id: string;
  course_id: string | null;
  file_path: string | null;
  issued_at: string;
  verification_code: string | null;
  certificate_number: string | null;
  scope: string;
};

export async function getFinalCertificateEligibilityForCurrentUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    throw new Error("Not authenticated");
  }

  const { data: coursesData, error: coursesErr } = await supabase
    .from("courses")
    .select("id, title")
    .eq("is_published", true)
    .order("position", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });

  if (coursesErr) throw coursesErr;

  const courses = (coursesData ?? []) as CourseRow[];
  const courseIds = courses.map((c) => c.id);

  const { data: sectionsData, error: sectionsErr } = courseIds.length
    ? await supabase
        .from("course_sections")
        .select("id, course_id")
        .in("course_id", courseIds)
    : { data: [] as SectionRow[], error: null };

  if (sectionsErr) throw sectionsErr;

  const sections = (sectionsData ?? []) as SectionRow[];
  const sectionIds = sections.map((s) => s.id);

  const { data: lessonsData, error: lessonsErr } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, section_id, kind")
        .eq("kind", "lesson")
        .in("section_id", sectionIds)
    : { data: [] as LessonRow[], error: null };

  if (lessonsErr) throw lessonsErr;

  const lessons = (lessonsData ?? []) as LessonRow[];
  const lessonIds = lessons.map((l) => l.id);

  const { data: quizzesData, error: quizzesErr } = courseIds.length
    ? await supabase
        .from("module_quizzes")
        .select("id, course_id")
        .eq("is_published", true)
        .in("course_id", courseIds)
    : { data: [] as ModuleQuizRow[], error: null };

  if (quizzesErr) throw quizzesErr;

  const quizzes = (quizzesData ?? []) as ModuleQuizRow[];
  const quizIds = quizzes.map((q) => q.id);

  const sectionToCourse = new Map<string, string>();
  for (const section of sections) {
    sectionToCourse.set(section.id, section.course_id);
  }

  const lessonToCourse = new Map<string, string>();
  const lessonCountByCourse = new Map<string, number>();

  for (const lesson of lessons) {
    const courseId = sectionToCourse.get(lesson.section_id);
    if (!courseId) continue;

    lessonToCourse.set(lesson.id, courseId);
    lessonCountByCourse.set(
      courseId,
      (lessonCountByCourse.get(courseId) ?? 0) + 1
    );
  }

  const { data: lessonProgressData, error: lessonProgressErr } = lessonIds.length
    ? await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .in("lesson_id", lessonIds)
    : { data: [] as { lesson_id: string }[], error: null };

  if (lessonProgressErr) throw lessonProgressErr;

  const completedLessonsByCourse = new Map<string, number>();

  for (const row of lessonProgressData ?? []) {
    const courseId = lessonToCourse.get((row as { lesson_id: string }).lesson_id);
    if (!courseId) continue;

    completedLessonsByCourse.set(
      courseId,
      (completedLessonsByCourse.get(courseId) ?? 0) + 1
    );
  }

  const quizToCourse = new Map<string, string>();
  for (const quiz of quizzes) {
    quizToCourse.set(quiz.id, quiz.course_id);
  }

  const { data: passedQuizAttempts, error: passedQuizErr } = quizIds.length
    ? await supabase
        .from("module_quiz_attempts")
        .select("quiz_id")
        .eq("user_id", user.id)
        .eq("passed", true)
        .in("quiz_id", quizIds)
    : { data: [] as { quiz_id: string }[], error: null };

  if (passedQuizErr) throw passedQuizErr;

  const passedQuizzesByCourse = new Map<string, number>();
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

  const perCourse = courses.map((course) => {
    const lessonCount = lessonCountByCourse.get(course.id) ?? 0;
    const completedLessonCount = completedLessonsByCourse.get(course.id) ?? 0;
    const hasQuiz = quizzes.some((quiz) => quiz.course_id === course.id);
    const passedQuizCount = Math.min(
      passedQuizzesByCourse.get(course.id) ?? 0,
      1
    );

    const lessonsComplete =
      lessonCount > 0 && completedLessonCount >= lessonCount;

    const completed = hasQuiz
      ? lessonsComplete && passedQuizCount >= 1
      : lessonsComplete;

    return {
      course_id: course.id,
      course_title: course.title,
      hasQuiz,
      lessonCount,
      completedLessonCount,
      passedQuizCount,
      completed,
    };
  });

  const eligible =
    perCourse.length > 0 && perCourse.every((course) => course.completed);

  return {
    userId: user.id,
    eligible,
    totalCourses: courses.length,
    completedCourses: perCourse.filter((c) => c.completed).length,
    perCourse,
  };
}

export async function ensureFinalCertificateIssuedForCurrentUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    throw new Error("Not authenticated");
  }

  const eligibility = await getFinalCertificateEligibilityForCurrentUser();

  if (!eligibility.eligible) {
    return {
      issued: false,
      eligible: false,
      certificate: null,
      completedCourses: eligibility.completedCourses,
      totalCourses: eligibility.totalCourses,
    };
  }

  const { data: existingRows, error: existingErr } = await supabase
    .from("certificates")
    .select(
      "id, user_id, course_id, file_path, issued_at, verification_code, certificate_number, scope"
    )
    .eq("user_id", user.id)
    .eq("scope", "final")
    .order("issued_at", { ascending: false });

  if (existingErr) throw existingErr;

  const existing = (existingRows?.[0] ?? null) as FinalCertificateRow | null;

  if (!existing) {
    const insertPayload = {
      user_id: user.id,
      course_id: null,
      file_path: null,
      issued_at: new Date().toISOString(),
      verification_code: generateVerificationCode(),
      certificate_number: generateCertificateNumber(),
      scope: "final",
    };

    const { data: inserted, error: insertErr } = await supabase
      .from("certificates")
      .insert(insertPayload)
      .select(
        "id, user_id, course_id, file_path, issued_at, verification_code, certificate_number, scope"
      )
      .single();

    if (insertErr) {
      if (insertErr.code === "23505") {
        const { data: retryRows, error: retryErr } = await supabase
          .from("certificates")
          .select(
            "id, user_id, course_id, file_path, issued_at, verification_code, certificate_number, scope"
          )
          .eq("user_id", user.id)
          .eq("scope", "final")
          .order("issued_at", { ascending: false });

        if (retryErr) throw retryErr;

        const retryExisting = (retryRows?.[0] ?? null) as FinalCertificateRow | null;

        if (!retryExisting) {
          throw insertErr;
        }

        if (
          !retryExisting.verification_code ||
          !retryExisting.certificate_number
        ) {
          const { data: repaired, error: repairErr } = await supabase
            .from("certificates")
            .update({
              verification_code:
                retryExisting.verification_code ?? generateVerificationCode(),
              certificate_number:
                retryExisting.certificate_number ?? generateCertificateNumber(),
            })
            .eq("id", retryExisting.id)
            .select(
              "id, user_id, course_id, file_path, issued_at, verification_code, certificate_number, scope"
            )
            .single();

          if (repairErr) throw repairErr;

          return {
            issued: true,
            eligible: true,
            certificate: repaired as FinalCertificateRow,
            completedCourses: eligibility.completedCourses,
            totalCourses: eligibility.totalCourses,
          };
        }

        return {
          issued: true,
          eligible: true,
          certificate: retryExisting,
          completedCourses: eligibility.completedCourses,
          totalCourses: eligibility.totalCourses,
        };
      }

      throw insertErr;
    }

    return {
      issued: true,
      eligible: true,
      certificate: inserted as FinalCertificateRow,
      completedCourses: eligibility.completedCourses,
      totalCourses: eligibility.totalCourses,
    };
  }

  if (!existing.verification_code || !existing.certificate_number) {
    const { data: updated, error: updateErr } = await supabase
      .from("certificates")
      .update({
        verification_code:
          existing.verification_code ?? generateVerificationCode(),
        certificate_number:
          existing.certificate_number ?? generateCertificateNumber(),
      })
      .eq("id", existing.id)
      .select(
        "id, user_id, course_id, file_path, issued_at, verification_code, certificate_number, scope"
      )
      .single();

    if (updateErr) throw updateErr;

    return {
      issued: true,
      eligible: true,
      certificate: updated as FinalCertificateRow,
      completedCourses: eligibility.completedCourses,
      totalCourses: eligibility.totalCourses,
    };
  }

  return {
    issued: true,
    eligible: true,
    certificate: existing,
    completedCourses: eligibility.completedCourses,
    totalCourses: eligibility.totalCourses,
  };
}
