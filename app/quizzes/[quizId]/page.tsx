"use client";

import { createClient } from "@/lib/supabase/client";
import QuizPaper from "@/components/quiz/QuizPaper";
import QuestionCard from "@/components/quiz/QuestionCard";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type ModuleQuiz = {
  id: string;
  title: string;
  pass_score: number;
  course_quiz_id: string;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

function BackgroundShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-y-auto">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url(/templates/5.jpg)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center -120px",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function QuizDetailPage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const params = useParams();
  const quizId = String((params as Record<string, unknown>).quizId ?? "");
  const supabase = useMemo(() => createClient(), []);

  const [quiz, setQuiz] = useState<ModuleQuiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data: quizData, error: quizErr } = await supabase
        .from("module_quizzes")
        .select("id,title,pass_score,course_quiz_id")
        .eq("id", quizId)
        .single();

      if (cancelled) return;

      if (quizErr) {
        setError(quizErr.message);
        setLoading(false);
        return;
      }

      if (!quizData?.course_quiz_id) {
        setError(t("quizzes.misconfigured"));
        setLoading(false);
        return;
      }

      setQuiz(quizData);

      const { data: qData, error: qErr } = await supabase
        .from("quiz_questions")
        .select("id, question, options")
        .eq("quiz_id", quizData.course_quiz_id);

      if (cancelled) return;

      if (qErr) {
        setError(qErr.message);
        setLoading(false);
        return;
      }

      const normalized =
        (qData ?? []).map((q: any) => ({
          id: q.id,
          prompt: q.question,
          options: Array.isArray(q.options) ? q.options : [],
        })) ?? [];

      setQuestions(normalized);
      setAnswers(new Array(normalized.length).fill(null));
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [quizId, supabase, t]);

  async function submit() {
    setSubmitting(true);
    setError(null);

    const unanswered = answers.findIndex((v) => v == null);
    if (unanswered !== -1) {
      setSubmitting(false);
      setError(t("quizzes.pleaseAnswerAll"));
      return;
    }

    const res = await fetch("/api/module-quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quiz_id: quizId,
        answers: questions.map((q, i) => ({
          question_id: q.id,
          chosen_index: answers[i],
        })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSubmitting(false);
      setError(data?.error ?? t("quizzes.submitFailed"));
      return;
    }

    setResult({
      score: data.score_percent ?? 0,
      passed: data.passed ?? false,
    });

    setSubmitting(false);
  }

  if (loading) {
    return (
      <BackgroundShell>
        <div className="mx-auto max-w-3xl p-6 text-white">
          {t("quizzes.loading")}
        </div>
      </BackgroundShell>
    );
  }

  if (error) {
    return (
      <BackgroundShell>
        <div className="mx-auto max-w-3xl p-6 text-white">
          <button onClick={() => router.back()} className="underline">
            {t("common.back")}
          </button>
          <div className="mt-4 text-red-200">{error}</div>
        </div>
      </BackgroundShell>
    );
  }

  if (!quiz) {
    return (
      <BackgroundShell>
        <div className="mx-auto max-w-3xl p-6 text-white">
          {t("quizzes.notFound")}
        </div>
      </BackgroundShell>
    );
  }

  return (
    <BackgroundShell>
      <QuizPaper
        activityTitle={quiz.title}
        quizTitle={t("quizzes.welcomeTitle", { title: quiz.title })}
      >
        {questions.map((q, qi) => (
          <QuestionCard key={q.id} index={qi + 1} prompt={q.prompt} required points={1}>
            {q.options.map((opt, oi) => (
              <label key={oi} className="flex gap-2 text-sm">
                <input
                  type="radio"
                  checked={answers[qi] === oi}
                  onChange={() => {
                    const copy = [...answers];
                    copy[qi] = oi;
                    setAnswers(copy);
                  }}
                />
                {opt}
              </label>
            ))}
          </QuestionCard>
        ))}

        {!result ? (
          <div className="mt-6 text-right">
            <button
              disabled={submitting}
              onClick={submit}
              className="rounded-md bg-black px-5 py-2 text-white"
            >
              {submitting ? t("quizzes.submitting") : t("quizzes.submit")}
            </button>
          </div>
        ) : (
          <div className="mt-6 bg-white p-4 text-sm">
            <div>
              {t("quizzes.score")}: <b>{result.score}%</b>{" "}
              {result.passed ? t("quizzes.passed") : t("quizzes.notPassed")}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => router.back()}
                className="rounded-md bg-gray-600 px-4 py-2 text-white"
              >
                {t("common.back")}
              </button>

              {!result.passed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers(Array(questions.length).fill(null));
                  }}
                  className="rounded-md bg-black px-4 py-2 text-white"
                >
                  {t("quizzes.tryAgain")}
                </button>
              )}
            </div>
          </div>
        )}
      </QuizPaper>
    </BackgroundShell>
  );
}
