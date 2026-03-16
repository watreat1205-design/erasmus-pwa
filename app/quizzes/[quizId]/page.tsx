// app/quizzes/[quizId]/page.tsx
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
  course_quiz_id: string | null;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  position: number;
};

type ReviewItem = {
  question_id: string;
  chosen_index: number;
  is_correct: boolean;
  correct_index: number | null;
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
          backgroundPosition: "center -10px",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />
      <div className="relative">{children}</div>
    </div>
  );
}

function getQuizIntro(quizTitle: string) {
  const title = quizTitle.toLowerCase();

  if (title.includes("module 1")) {
    return {
      intro:
        "This short quiz assesses your understanding of the TEAL approach. Please answer the following questions based on what you have learned in ACTIVITY 1.1: Exploring TEAL of MODULE 1: Introduction to TEAL teaching methodology. The quiz will examine your knowledge of the definition of TEAL, its core components (active learning, technology integration, and collaboration), its origins, and how it compares to traditional teaching methods.",
      quote:
        "\"The best teachers are those who show you where to look, but don't tell you what to see.\" – Alexandra K. Trenfor. We hope this quiz helps you see how TEAL can enhance your teaching!",
      note:
        "Note: The quiz is for learning. You can retake it if needed.",
    };
  }

  if (title.includes("module 2")) {
    return {
      intro:
        "This short quiz assesses your understanding of the topics covered in Module 2. Please answer the following questions based on the material you studied about the Agenda 2030 and the Sustainable Development Goals (SDGs).",
      quote:
        "\"There is a lot of important information about the SDGs that is worth knowing and sharing with your friends, family, and society.\"",
      note:
        "Note: The quiz is for learning. You can retake it if needed.",
    };
  }

  return {
    intro:
      "This short quiz assesses your understanding of the topics covered in this module. Please answer the following questions based on the material you studied.",
    quote: "",
    note: "Note: The quiz is for learning. You can retake it if needed.",
  };
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
  const [review, setReview] = useState<ReviewItem[]>([]);
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

      setQuiz(quizData);

      const { data: qData, error: qErr } = await supabase
        .from("module_quiz_questions")
        .select("id, prompt, options, position")
        .eq("quiz_id", quizData.id)
        .order("position", { ascending: true });

      if (cancelled) return;

      if (qErr) {
        setError(qErr.message);
        setLoading(false);
        return;
      }

      const normalized: QuizQuestion[] =
        (qData ?? []).map((q: any) => ({
          id: q.id,
          prompt: q.prompt,
          options: Array.isArray(q.options) ? q.options : [],
          position: Number(q.position ?? 0),
        })) ?? [];

      setQuestions(normalized);
      setAnswers(new Array(normalized.length).fill(null));
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [quizId, supabase]);

  async function submit() {
    setSubmitting(true);
    setError(null);

    if (!questions.length) {
      setSubmitting(false);
      setError("This quiz has no questions yet.");
      return;
    }

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

    setReview(Array.isArray(data.review) ? data.review : []);
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

  const quizIntro = getQuizIntro(quiz.title);

  return (
    <BackgroundShell>
      <QuizPaper
        activityTitle={quiz.title}
        quizTitle={t("quizzes.welcomeTitle", { title: quiz.title })}
      >
        <div className="mb-6 rounded-md border border-gray-200 bg-white p-5 text-sm text-gray-700">
          <p>{quizIntro.intro}</p>

          {quizIntro.quote ? <p className="mt-3">{quizIntro.quote}</p> : null}

          <p className="mt-3">{quizIntro.note}</p>
        </div>

        {!questions.length ? (
          <div className="rounded-md bg-white p-4 text-sm text-gray-700">
            This quiz has no questions yet.
          </div>
        ) : (
          questions.map((q, qi) => {
            const reviewItem = review.find(
              (r) => String(r.question_id) === String(q.id)
            );

            return (
              <QuestionCard key={q.id} index={qi + 1} prompt={q.prompt} required points={1}>
                {q.options.map((opt, oi) => {
                  const chosen = answers[qi] === oi;
                  const isSelectedCorrect = !!reviewItem?.is_correct && chosen;
                  const isSelectedWrong = !!reviewItem && chosen && !reviewItem.is_correct;

                  return (
                    <div key={oi} className="mb-2">
                      <label className="flex gap-2 text-sm">
                        <input
                          type="radio"
                          disabled={!!result}
                          checked={answers[qi] === oi}
                          onChange={() => {
                            const copy = [...answers];
                            copy[qi] = oi;
                            setAnswers(copy);
                          }}
                        />
                        <span>{opt}</span>
                      </label>

                      {result && chosen && isSelectedCorrect && (
                        <div className="ml-6 mt-1 text-sm text-green-600">
                          ✓ Correct
                        </div>
                      )}

                      {result && chosen && isSelectedWrong && (
                        <div className="ml-6 mt-1 text-sm text-red-600">
                          ✗ Incorrect
                        </div>
                      )}
                    </div>
                  );
                })}

                {result && reviewItem && !reviewItem.is_correct && (
                  <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    <div>
                      Your answer:{" "}
                      <span className="font-medium">
                        {q.options[reviewItem.chosen_index] ?? "Not available"}
                      </span>
                    </div>
                    <div className="mt-1">
                      Correct answer:{" "}
                      <span className="font-medium">
                        {q.options[reviewItem.correct_index ?? -1] ?? "Not available"}
                      </span>
                    </div>
                  </div>
                )}
              </QuestionCard>
            );
          })
        )}

        {!result ? (
          <div className="mt-6 text-right">
            <button
              disabled={submitting || !questions.length}
              onClick={submit}
              className="rounded-md bg-black px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
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
                    setReview([]);
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
