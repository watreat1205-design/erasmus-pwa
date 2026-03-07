// app/quizzes/page.tsx
import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import QuizzesClient from "./QuizzesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function QuizzesPage() {
  noStore();

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-y-auto">
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: "url(/templates/5.jpg)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center -220px",
          }}
        />
        <div className="fixed inset-0 -z-10 bg-black/20" />

        <div className="relative mx-auto max-w-5xl p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold !text-white">Quizzes</h1>
              <p className="mt-1 text-sm text-gray-900">
                Please log in to view your quizzes.
              </p>
            </div>

            <a
              href="/login?next=/quizzes"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { data: quizzes } = await supabase
    .from("module_quizzes")
    .select("id, title, pass_score, order_index, course_id, courses(title)")
    .eq("is_published", true)
    .order("order_index", { ascending: true });

  const { data: attempts } = await supabase
    .from("module_quiz_attempts")
    .select("quiz_id, score_percent, passed, attempt_no")
    .eq("user_id", user.id)
    .order("attempt_no", { ascending: false });

  const lastAttemptByQuiz = new Map<string, any>();
  for (const attempt of attempts ?? []) {
    if (!lastAttemptByQuiz.has(attempt.quiz_id)) {
      lastAttemptByQuiz.set(attempt.quiz_id, attempt);
    }
  }

  const quizList =
    (quizzes ?? []).map((quiz: any, index: number) => {
      const prevQuiz = quizzes?.[index - 1];
      const prevPassed = prevQuiz
        ? lastAttemptByQuiz.get(prevQuiz.id)?.passed
        : true;

      return {
        id: quiz.id,
        title: quiz.title ?? "Quiz",
        pass_score: quiz.pass_score ?? null,
        courseTitle: quiz.courses?.title ?? "Course",
        lastAttempt: lastAttemptByQuiz.get(quiz.id) ?? null,
        isUnlocked: index === 0 || !!prevPassed,
      };
    }) ?? [];

  return (
    <div className="relative min-h-screen overflow-y-auto">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url(/templates/5.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center -220px",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />

      <div className="relative">
        <QuizzesClient quizzes={quizList} />
      </div>
    </div>
  );
}
