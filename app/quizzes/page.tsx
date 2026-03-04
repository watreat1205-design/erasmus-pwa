import { createSupabaseServerClient } from "@/lib/supabase/server";
import bgTemplate5 from "../../Templates/5.jpg";
import QuizzesClient from "./QuizzesClient";

export default async function QuizzesPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
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
  for (const a of attempts ?? []) {
    if (!lastAttemptByQuiz.has(a.quiz_id)) {
      lastAttemptByQuiz.set(a.quiz_id, a);
    }
  }

  const quizList =
    (quizzes ?? []).map((q: any, index: number) => {
      const prevQuiz = quizzes?.[index - 1];
      const prevPassed = prevQuiz
        ? lastAttemptByQuiz.get(prevQuiz.id)?.passed
        : true;

      return {
        id: q.id,
        title: q.title ?? "Quiz",
        pass_score: q.pass_score ?? null,
        courseTitle: q.courses?.title ?? "Course",
        lastAttempt: lastAttemptByQuiz.get(q.id) ?? null,
        isUnlocked: index === 0 || !!prevPassed,
      };
    }) ?? [];

  return (
    <div className="relative min-h-screen overflow-y-auto">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgTemplate5.src})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center -410px",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />

      <div className="relative">
        <QuizzesClient quizzes={quizList} />
      </div>
    </div>
  );
}
