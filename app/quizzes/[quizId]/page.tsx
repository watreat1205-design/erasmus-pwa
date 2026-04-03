// app/quizzes/[quizId]/page.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import QuizPaper from "@/components/quiz/QuizPaper";
import QuestionCard from "@/components/quiz/QuestionCard";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

type Lang = "en" | "el" | "it" | "es" | "ro" | "hr";

type ModuleQuiz = {
  id: string;
  title: string;
  title_i18n?: Record<string, string> | null;
  description: string | null;
  description_i18n?: Record<string, string> | null;
  pass_score: number;
  course_quiz_id: string | null;
};

type QuizQuestion = {
  id: string;
  prompt: string;
  prompt_i18n?: Record<string, string> | null;
  options: string[];
  options_i18n?: Record<string, string[]> | null;
  position: number;
};

type ReviewItem = {
  question_id: string;
  chosen_index: number;
  is_correct: boolean;
  correct_index: number | null;
};

function normalizeLang(input?: string | null): Lang {
  const short = (input || "en").slice(0, 2).toLowerCase();
  if (["en", "el", "it", "es", "ro", "hr"].includes(short)) {
    return short as Lang;
  }
  return "en";
}

function pickI18nText(
  i18nValue: Record<string, string> | null | undefined,
  lang: Lang,
  fallback = ""
) {
  if (!i18nValue || typeof i18nValue !== "object") return fallback;
  return i18nValue[lang] || i18nValue.en || fallback;
}

function pickI18nOptions(
  i18nValue: Record<string, string[]> | null | undefined,
  lang: Lang,
  fallback: string[] = []
) {
  if (!i18nValue || typeof i18nValue !== "object") return fallback;
  return i18nValue[lang] || i18nValue.en || fallback;
}

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

function getQuizIntro(quizId: string, lang: Lang) {
  if (quizId === "0691176a-40d3-49f7-8b16-6f22274aff03") {
    const map = {
      en: {
        intro:
          "This short quiz assesses your understanding of the TEAL approach. Please answer the following questions based on what you have learned in ACTIVITY 1.1: Exploring TEAL of MODULE 1: Introduction to TEAL teaching methodology. The quiz will examine your knowledge of the definition of TEAL, its core components (active learning, technology integration, and collaboration), its origins, and how it compares to traditional teaching methods.",
        quote:
          "\"The best teachers are those who show you where to look, but don't tell you what to see.\" – Alexandra K. Trenfor. We hope this quiz helps you see how TEAL can enhance your teaching!",
        note:
          "Note: The quiz is for learning. You can retake it if needed.",
      },
      it: {
        intro:
          "Questo breve quiz valuta la tua comprensione dell’approccio TEAL. Rispondi alle seguenti domande in base a ciò che hai appreso nell’ATTIVITÀ 1.1: Esplorando il TEAL del MODULO 1: Introduzione alla metodologia didattica TEAL. Il quiz verificherà la tua conoscenza della definizione di TEAL, dei suoi componenti principali (apprendimento attivo, integrazione tecnologica e collaborazione), delle sue origini e del confronto con i metodi di insegnamento tradizionali.",
        quote:
          "\"I migliori insegnanti sono quelli che ti mostrano dove guardare, ma non ti dicono cosa vedere.\" – Alexandra K. Trenfor. Speriamo che questo quiz ti aiuti a capire come il TEAL possa migliorare il tuo insegnamento!",
        note:
          "Nota: il quiz è pensato per l’apprendimento. Puoi ripeterlo se necessario.",
      },
      el: {
        intro:
          "Αυτό το σύντομο κουίζ αξιολογεί την κατανόησή σου για την προσέγγιση TEAL. Απάντησε στις παρακάτω ερωτήσεις με βάση όσα έμαθες στη ΔΡΑΣΤΗΡΙΟΤΗΤΑ 1.1: Εξερεύνηση του TEAL της ΕΝΟΤΗΤΑΣ 1: Εισαγωγή στη διδακτική μεθοδολογία TEAL. Το κουίζ εξετάζει τη γνώση σου σχετικά με τον ορισμό του TEAL, τα βασικά του στοιχεία (ενεργητική μάθηση, ενσωμάτωση τεχνολογίας και συνεργασία), την προέλευσή του και τη σύγκρισή του με τις παραδοσιακές διδακτικές μεθόδους.",
        quote:
          "\"Οι καλύτεροι δάσκαλοι είναι εκείνοι που σου δείχνουν πού να κοιτάξεις, αλλά δεν σου λένε τι να δεις.\" – Alexandra K. Trenfor. Ελπίζουμε αυτό το κουίζ να σε βοηθήσει να δεις πώς το TEAL μπορεί να ενισχύσει τη διδασκαλία σου!",
        note:
          "Σημείωση: Το κουίζ είναι για μάθηση. Μπορείς να το επαναλάβεις αν χρειαστεί.",
      },
      es: {
        intro:
          "Este breve cuestionario evalúa tu comprensión del enfoque TEAL. Responde a las siguientes preguntas según lo que aprendiste en la ACTIVIDAD 1.1: Explorando TEAL del MÓDULO 1: Introducción a la metodología de enseñanza TEAL. El cuestionario evaluará tu conocimiento de la definición de TEAL, sus componentes principales (aprendizaje activo, integración tecnológica y colaboración), sus orígenes y su comparación con los métodos de enseñanza tradicionales.",
        quote:
          "\"Los mejores profesores son aquellos que te muestran dónde mirar, pero no te dicen qué ver.\" – Alexandra K. Trenfor. Esperamos que este cuestionario te ayude a ver cómo TEAL puede mejorar tu enseñanza.",
        note:
          "Nota: Este cuestionario es para aprender. Puedes repetirlo si lo necesitas.",
      },
      ro: {
        intro:
          "Acest scurt test evaluează înțelegerea ta asupra abordării TEAL. Te rugăm să răspunzi la următoarele întrebări pe baza a ceea ce ai învățat în ACTIVITATEA 1.1: Explorarea TEAL din MODULUL 1: Introducere în metodologia de predare TEAL. Testul va verifica cunoștințele tale despre definiția TEAL, componentele sale de bază (învățare activă, integrarea tehnologiei și colaborare), originile sale și comparația cu metodele tradiționale de predare.",
        quote:
          "\"Cei mai buni profesori sunt cei care îți arată unde să te uiți, dar nu îți spun ce să vezi.\" – Alexandra K. Trenfor. Sperăm ca acest test să te ajute să vezi cum TEAL îți poate îmbunătăți predarea!",
        note:
          "Notă: Testul este pentru învățare. Îl poți relua dacă este nevoie.",
      },
      hr: {
        intro:
          "Ovaj kratki kviz procjenjuje tvoje razumijevanje TEAL pristupa. Odgovori na sljedeća pitanja na temelju onoga što si naučio/la u AKTIVNOSTI 1.1: Istraživanje TEAL-a u MODULU 1: Uvod u TEAL metodologiju poučavanja. Kviz će provjeriti tvoje znanje o definiciji TEAL-a, njegovim ključnim komponentama (aktivno učenje, integracija tehnologije i suradnja), njegovim korijenima i usporedbi s tradicionalnim metodama poučavanja.",
        quote:
          "\"Najbolji učitelji su oni koji ti pokažu gdje gledati, ali ti ne govore što da vidiš.\" – Alexandra K. Trenfor. Nadamo se da će ti ovaj kviz pomoći da vidiš kako TEAL može unaprijediti tvoje poučavanje!",
        note:
          "Napomena: Ovaj kviz služi učenju. Možeš ga ponoviti ako je potrebno.",
      },
    } as const;

    return map[lang] ?? map.en;
  }

  return {
    intro:
      "This short quiz assesses your understanding of the topics covered in this module. Please answer the following questions based on the material you studied.",
    quote: "",
    note: "Note: The quiz is for learning. You can retake it if needed.",
  };
}

export default function QuizDetailPage() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const params = useParams();
  const quizId = String((params as Record<string, unknown>).quizId ?? "");
  const supabase = useMemo(() => createClient(), []);
  const lang = normalizeLang(i18n.resolvedLanguage || i18n.language);

  const [quiz, setQuiz] = useState<ModuleQuiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!quizId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data: quizData, error: quizErr } = await supabase
        .from("module_quizzes")
        .select("id,title,title_i18n,description,description_i18n,pass_score,course_quiz_id")
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
        .select("id, prompt, prompt_i18n, options, options_i18n, position")
        .eq("quiz_id", quizData.id)
        .order("position", { ascending: true });

      if (cancelled) return;

      if (qErr) {
        setError(qErr.message);
        setLoading(false);
        return;
      }

      const normalized: QuizQuestion[] = (qData ?? []).map((q: any) => ({
        id: q.id,
        prompt: pickI18nText(q.prompt_i18n, lang, q.prompt ?? ""),
        prompt_i18n: q.prompt_i18n,
        options: pickI18nOptions(
          q.options_i18n,
          lang,
          Array.isArray(q.options) ? q.options : []
        ),
        options_i18n: q.options_i18n,
        position: Number(q.position ?? 0),
      }));

      setQuestions(normalized);
      setAnswers(new Array(normalized.length).fill(null));
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [quizId, supabase, lang]);

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

  if (!mounted) {
    return (
      <BackgroundShell>
        <div className="mx-auto max-w-3xl p-6 text-white">Loading...</div>
      </BackgroundShell>
    );
  }

  if (loading) {
    return (
      <BackgroundShell>
        <div className="mx-auto max-w-3xl p-6 text-white">Loading...</div>
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

  const resolvedQuizTitle = pickI18nText(quiz.title_i18n, lang, quiz.title);
  const resolvedQuizDescription = pickI18nText(
    quiz.description_i18n,
    lang,
    quiz.description ?? ""
  );

  const quizIntro = getQuizIntro(quizId, lang);

  return (
    <BackgroundShell>
      <QuizPaper
        activityTitle={resolvedQuizTitle}
        quizTitle={t("quizzes.welcomeTitle", { title: resolvedQuizTitle })}
      >
        <div className="mb-6 rounded-md border border-gray-200 bg-white p-5 text-sm text-gray-700">
          {resolvedQuizDescription ? (
            <p className="mb-3">{resolvedQuizDescription}</p>
          ) : null}

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
              <QuestionCard
                key={q.id}
                index={qi + 1}
                prompt={q.prompt}
                required
                points={1}
              >
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
