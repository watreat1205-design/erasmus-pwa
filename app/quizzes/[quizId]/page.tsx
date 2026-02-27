"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import QuizPaper from "@/components/quiz/QuizPaper";
import QuestionCard from "@/components/quiz/QuestionCard";

type ModuleQuiz = {
  id: string;
  title: string;
  pass_score: number;
  course_quiz_id: string; // ✅ add this
};

type QuizQuestion = {
  id: string;
  prompt: string;   // UI uses prompt
  options: string[];
};

function normalizeQuiz(value: unknown): ModuleQuiz | null {
  if (!value || typeof value !== "object") return null;
  const r = value as Record<string, unknown>;

  if (
    typeof r.id !== "string" ||
    typeof r.title !== "string" ||
    typeof r.pass_score !== "number" ||
    typeof r.course_quiz_id !== "string"
  ) {
    return null;
  }

  return {
    id: r.id,
    title: r.title,
    pass_score: r.pass_score,
    course_quiz_id: r.course_quiz_id,
  };
}

function normalizeQuestions(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((q) => {
      if (!q || typeof q !== "object") return null;
      const r = q as Record<string, unknown>;

      const id = typeof r.id === "string" ? r.id : null;
      const prompt = typeof r.question === "string" ? r.question : "";
      const optionsRaw = r.options;

      const options = Array.isArray(optionsRaw)
        ? optionsRaw.filter((x): x is string => typeof x === "string")
        : [];

      if (!id) return null;
      return { id, prompt, options };
    })
    .filter((x): x is QuizQuestion => x !== null);
}

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();

  const quizId = String((params as Record<string, unknown>).quizId ?? "");

  const supabase = useMemo(() => createClient(), []);

  const [quiz, setQuiz] = useState<ModuleQuiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(
    null
  );
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
        setQuiz(null);
        setQuestions([]);
        setAnswers([]);
        setLoading(false);
        return;
      }

      const normalizedQuiz = normalizeQuiz(quizData);
if (!normalizedQuiz) {
  setError("Quiz is misconfigured (missing course_quiz_id).");
  setQuiz(null);
  setQuestions([]);
  setAnswers([]);
  setLoading(false);
  return;
}

const { data: qData, error: qErr } = await supabase
  .from("quiz_questions")
  .select("id, question, options, created_at")
  .eq("quiz_id", normalizedQuiz.course_quiz_id)
  .order("created_at", { ascending: true });

      if (cancelled) return;

      if (qErr) {
        setError(qErr.message);
        setQuiz(normalizeQuiz(quizData));
        setQuestions([]);
        setAnswers([]);
        setLoading(false);
        return;
      }

      const qNorm = normalizeQuestions(qData);
      setQuiz(normalizeQuiz(quizData));
      setQuestions(qNorm);
      setAnswers(new Array(qNorm.length).fill(null));
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

    const unanswered = answers.findIndex((v) => v === null || v === undefined);
    if (unanswered !== -1) {
      setSubmitting(false);
      setError("Please answer all questions before submitting.");
      return;
    }

    const payload = {
      quiz_id: quizId,
      answers: questions.map((q, index) => ({
        question_id: q.id,
        chosen_index: answers[index] as number,
      })),
    };

    const res = await fetch("/api/module-quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: unknown = await res.json();

    if (!res.ok) {
      const msg =
        data && typeof data === "object" && "error" in data
          ? String((data as Record<string, unknown>).error ?? "Submit failed")
          : "Submit failed";
      setSubmitting(false);
      setError(msg);
      return;
    }

    const d = data as Record<string, unknown>;
    const score =
      typeof d.score_percent === "number" ? d.score_percent : Number.NaN;
    const passed = typeof d.passed === "boolean" ? d.passed : false;

    setResult({ score: Number.isFinite(score) ? score : 0, passed });
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="text-sm text-gray-600">Loading quiz…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Quiz</h1>
          <button
            onClick={() => router.back()}
            className="text-sm underline"
            type="button"
          >
            Back
          </button>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <button onClick={() => router.back()} className="text-sm underline" type="button">
          Back
        </button>
        <div className="mt-4 text-sm text-gray-700">Quiz not found.</div>
      </div>
    );
  }

return (
  <QuizPaper
    activityTitle={quiz.title}
    quizTitle={`Welcome to the ${quiz.title} Quiz!`}
  >
    <div className="space-y-5">
      {questions.map((q, qi) => (
        <QuestionCard
          key={q.id}
          index={qi + 1}
          prompt={q.prompt}
          required
          points={1}
        >
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <label
                key={oi}
                className="flex cursor-pointer items-start gap-2 text-sm"
              >
                <input
                  type="radio"
                  className="mt-1"
                  checked={answers[qi] === oi}
                  onChange={() => {
                    const copy = [...answers];
                    copy[qi] = oi;
                    setAnswers(copy);
                  }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </QuestionCard>
      ))}
    </div>

    {!result ? (
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={submitting}
          onClick={submit}
          className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>

      ) : (
  <div className="mt-6 rounded-md border border-gray-200 bg-white p-4 text-sm">
    <div>
      Score: <b>{result.score}%</b>{" "}
      {result.passed ? (
        <span className="ml-2 text-green-700">Passed</span>
      ) : (
        <span className="ml-2 text-red-700">Not passed</span>
      )}
    </div>

    <div className="mt-4 flex gap-3">
      {/* 🔙 Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
      >
        Back
      </button>

      {/* 🔁 Try again (only if failed) */}
      {!result.passed && (
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setAnswers(Array(questions.length).fill(null));
            setError(null);
          }}
          className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900"
        >
          Try again
        </button>
      )}
      </div>
      </div>
    )}
  </QuizPaper>
);
}
