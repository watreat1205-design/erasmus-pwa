import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type QuizListItem = {
  id: string;
  title: string;
  pass_score: number | null;
  course_id: string | null;
  courses?: { title?: string } | null;
};

type AttemptRow = {
  quiz_id: string;
  passed: boolean;
  score_percent: number | null;
  submitted_at: string | null;
  attempt_no: number | null;
};

export default async function QuizzesPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <p className="mt-2 text-sm text-gray-600">Please log in.</p>
        <Link className="mt-4 inline-block underline" href="/login">
          Go to login
        </Link>
      </div>
    );
  }

  // MVP: show all quizzes (you can later restrict to enrolled courses)
  const { data: quizzes, error } = await supabase
    .from("module_quizzes")
    .select("id, title, pass_score, created_at, course_id, courses(title)")
    .eq("is_published", true)
    .order("order_index", { ascending: true })

  const quizList: QuizListItem[] = (quizzes ?? []).map((q) => {
    const r = q as Record<string, unknown>;

    return {
      id: typeof r.id === "string" ? r.id : "",
      title: typeof r.title === "string" ? r.title : "Quiz",
      pass_score: typeof r.pass_score === "number" ? r.pass_score : null,
      course_id: typeof r.course_id === "string" ? r.course_id : null,
      courses:
        r.courses && typeof r.courses === "object"
          ? (r.courses as { title?: string })
          : null,
    };
  });

  // Fetch last attempt per quiz
  const { data: attempts } = await supabase
    .from("module_quiz_attempts")
    .select("quiz_id, score_percent, passed, submitted_at, attempt_no")
    .eq("user_id", user.id)
    .order("attempt_no", { ascending: false });

  const attemptList: AttemptRow[] = (attempts ?? []).map((a) => {
    const r = a as Record<string, unknown>;
    return {
      quiz_id: typeof r.quiz_id === "string" ? r.quiz_id : "",
      passed: typeof r.passed === "boolean" ? r.passed : false,
      score_percent: typeof r.score_percent === "number" ? r.score_percent : null,
      submitted_at: typeof r.submitted_at === "string" ? r.submitted_at : null,
      attempt_no: typeof r.attempt_no === "number" ? r.attempt_no : null,
    };
  });

  // Keep latest attempt per quiz (because attempts are ordered by attempt_no desc)
  const lastAttemptByQuiz = new Map<string, AttemptRow>();
  for (const a of attemptList) {
    if (!a.quiz_id) continue;
    if (!lastAttemptByQuiz.has(a.quiz_id)) lastAttemptByQuiz.set(a.quiz_id, a);
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Take a quiz and view your results.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
        >
          Back
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error.message}
        </p>
      )}

      {quizList.length === 0 ? (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">No quizzes yet</h2>
          <p className="mt-1 text-sm text-gray-600">
            When a quiz is added to a course, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">

              {quizList.map((q, index) => {
  const quizId = q.id; // already a string
  const courseTitle = q.courses?.title ?? "Course";
  const last = quizId ? lastAttemptByQuiz.get(quizId) ?? null : null;

  // ✅ LOCK RULE (MVP): only first quiz unlocked; next unlocks when previous quiz is PASSED
  const prevQuizId = index > 0 ? quizList[index - 1]?.id : null;
  const prevLast = prevQuizId ? lastAttemptByQuiz.get(prevQuizId) ?? null : null;
  const isUnlocked = index === 0 || !!prevLast?.passed;

  return (

              <div
                key={quizId || "quiz-list"}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="text-sm text-gray-600">{courseTitle}</div>

                <div className="mt-1 text-base font-semibold text-gray-900">
                  {q.title}
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  Pass score:{" "}
                  <span className="font-medium">{q.pass_score ?? "-"}%</span>
                </div>

                {last ? (
                  <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Last attempt</span>
                      <span
                        className={
                          "rounded-full px-2 py-1 text-xs font-medium " +
                          (last.passed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700")
                        }
                      >
                        {last.passed ? "Passed" : "Not passed"}
                      </span>
                    </div>
                    <div className="mt-1 text-gray-700">
                      Score:{" "}
                      <span className="font-medium">
                        {last.score_percent ?? "-"}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-gray-600">No attempts yet.</div>
                )}

                {quizId ? (
  isUnlocked ? (
    <Link
      href={`/quizzes/${quizId}`}
      className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold !text-white hover:bg-gray-900"
      style={{ color: "#fff" }}
    >
      {last ? "Retake quiz" : "Start quiz"}
    </Link>
  ) : (
    <button
      type="button"
      disabled
      className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 cursor-not-allowed"
      title="Complete the previous module quiz to unlock"
    >
      🔒 Locked
    </button>
  )
) : (
  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
    Quiz is misconfigured (missing ID).
  </div>
)}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
