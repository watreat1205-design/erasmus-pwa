"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import CertificateDownloadButton from "../../../../components/CertificateDownloadButton";

type ModuleQuiz = {
  id: string;
  title: string;
  pass_score: number;
  course_quiz_id: string;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[]; // stored as json/text[]; we normalize to string[]
};

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

export default function ModuleQuizPage() {
  const params = useParams();
  const courseId = String((params as Record<string, unknown>).courseId ?? "");
  const quizId = String((params as Record<string, unknown>).quizId ?? "");

  const supabase = useMemo(() => createClient(), []);

  const [quiz, setQuiz] = useState<ModuleQuiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [certificateUnlocked, setCertificateUnlocked] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    let cancelled = false;

    async function loadQuiz() {
      setLoading(true);

      const { data: quizData, error: quizErr } = await supabase
        .from("module_quizzes")
        .select("id,title,pass_score,course_quiz_id")
        .eq("id", quizId)
        .single();

      if (cancelled) return;

      if (quizErr) {
        console.error("Failed to load quiz:", quizErr);
        setQuiz(null);
        setQuestions([]);
        setAnswers([]);
        setLoading(false);
        return;
      }

      const qz = quizData as ModuleQuiz;

const { data: qData, error: qErr } = await supabase
  .from("quiz_questions")
  .select("id, question, options, created_at")
  .eq("quiz_id", qz.course_quiz_id)
  .order("created_at", { ascending: true });  

      if (cancelled) return;

      if (qErr) {
        console.error("Failed to load questions:", qErr);
        setQuiz(quizData as ModuleQuiz);
        setQuestions([]);
        setAnswers([]);
        setLoading(false);
        return;
      }

      const normalized = normalizeQuestions(qData);

      setQuiz(quizData as ModuleQuiz);
      setQuestions(normalized);
      setAnswers(new Array(normalized.length).fill(null));
      setLoading(false);
    }

    loadQuiz();

    return () => {
      cancelled = true;
    };
  }, [quizId, supabase]);

  async function submitQuiz() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to submit the quiz.");
      return;
    }

    const unanswered = answers.findIndex((v) => v === null || v === undefined);
    if (unanswered !== -1) {
      alert("Please answer all questions before submitting.");
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
      console.error("Submit failed:", data);
      const msg =
        data && typeof data === "object" && "error" in data
          ? String((data as Record<string, unknown>).error ?? "Submit failed")
          : "Submit failed";
      alert(msg);
      return;
    }

    const d = data as Record<string, unknown>;

    setSubmitted(true);
    setScore(typeof d.score_percent === "number" ? d.score_percent : null);

    const unlocked = !!d.certificate_unlocked;
    setCertificateUnlocked(unlocked);

    if (unlocked) alert("🎉 Certificate unlocked!");
  }

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  const passed = score !== null && score >= quiz.pass_score;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>

      {questions.map((q, qi) => (
        <div key={q.id} className="mb-6 border p-4 rounded-lg">
          <p className="font-medium mb-3">
            {qi + 1}. {q.prompt}
          </p>

          {q.options.map((opt, oi) => (
            <label key={oi} className="block">
              <input
                type="radio"
                checked={answers[qi] === oi}
                onChange={() => {
                  const copy = [...answers];
                  copy[qi] = oi;
                  setAnswers(copy);
                }}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={submitQuiz}
          className="px-5 py-2 bg-black text-white rounded-lg"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-6">
          <div className="text-lg">
            Score: {score ?? "-"}% {passed ? "✅ Passed" : "❌ Not passed"}
          </div>

          {certificateUnlocked && passed && courseId ? (
            <div className="mt-4">
              <div className="text-sm font-semibold text-gray-900">
                Certificate unlocked 🎉
              </div>
              <div className="mt-2">
                <CertificateDownloadButton courseId={courseId} />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
