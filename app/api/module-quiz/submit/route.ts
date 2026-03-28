// app/api/module-quiz/submit/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureFinalCertificateIssuedForCurrentUser } from "@/app/lib/certificates/final";

type AnswerPayload = {
  question_id: string;
  chosen_index: number;
};

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      quiz_id,
      answers,
    }: { quiz_id: string; answers: AnswerPayload[] } = await req.json();

    if (!quiz_id || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "quiz_id and answers are required" },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: quiz, error: quizErr } = await supabase
      .from("module_quizzes")
      .select("id, course_id, is_published")
      .eq("id", quiz_id)
      .single();

    if (quizErr || !quiz) {
      console.error("quiz lookup error:", quizErr);
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (!quiz.is_published) {
      return NextResponse.json({ error: "Quiz not published" }, { status: 403 });
    }

    const { data: prevAttempts, error: prevErr } = await supabase
      .from("module_quiz_attempts")
      .select("attempt_no")
      .eq("quiz_id", quiz_id)
      .eq("user_id", user.id)
      .order("attempt_no", { ascending: false })
      .limit(1);

    if (prevErr) {
      console.error("prevAttempts error:", prevErr);
      return NextResponse.json({ error: prevErr.message }, { status: 500 });
    }

    const nextAttemptNo = (prevAttempts?.[0]?.attempt_no ?? 0) + 1;

    const { data: attempt, error: attemptErr } = await supabase
      .from("module_quiz_attempts")
      .insert({
        quiz_id,
        user_id: user.id,
        started_at: new Date().toISOString(),
        attempt_no: nextAttemptNo,
      })
      .select("id")
      .single();

    if (attemptErr || !attempt) {
      console.error("attempt insert error:", attemptErr);
      return NextResponse.json(
        { error: attemptErr?.message ?? "Failed to create attempt" },
        { status: 500 }
      );
    }

    const attempt_id = attempt.id as string;

    const answerRows = answers.map((a) => ({
      attempt_id,
      question_id: a.question_id,
      chosen_index: a.chosen_index,
    }));

    const { error: ansErr } = await supabase
      .from("module_quiz_answers")
      .insert(answerRows);

    if (ansErr) {
      console.error("answers insert error:", ansErr);
      await supabase.from("module_quiz_attempts").delete().eq("id", attempt_id);
      return NextResponse.json({ error: ansErr.message }, { status: 500 });
    }

    const { data: gradeRows, error: gradeErr } = await supabase.rpc(
      "grade_module_quiz_attempt",
      { p_attempt_id: attempt_id }
    );

    if (gradeErr) {
      console.error("grade rpc error:", gradeErr);
      return NextResponse.json({ error: gradeErr.message }, { status: 500 });
    }

    const grade = Array.isArray(gradeRows) ? gradeRows[0] : gradeRows;

    let finalCertificate = null;
    let finalCertificateUnlocked = false;

    if (grade?.passed) {
      try {
        const finalResult = await ensureFinalCertificateIssuedForCurrentUser();
        finalCertificate = finalResult.certificate ?? null;
        finalCertificateUnlocked = !!finalResult.certificate;
      } catch (e) {
        console.error("final certificate error:", e);
        finalCertificate = null;
        finalCertificateUnlocked = false;
      }
    }

    const { data: reviewRows, error: reviewErr } = await supabase
      .from("module_quiz_answers")
      .select("question_id, chosen_index, is_correct")
      .eq("attempt_id", attempt_id);

    if (reviewErr) {
      console.error("reviewRows error:", reviewErr);
      return NextResponse.json({ error: reviewErr.message }, { status: 500 });
    }

    const questionIds = (reviewRows ?? []).map((r) => r.question_id);

    const { data: questionRows, error: questionErr } = questionIds.length
      ? await supabase
          .from("module_quiz_questions")
          .select("id, correct_index")
          .in("id", questionIds)
      : { data: [], error: null };

    if (questionErr) {
      console.error("questionRows error:", questionErr);
      return NextResponse.json({ error: questionErr.message }, { status: 500 });
    }

    const correctIndexByQuestionId = new Map(
      (questionRows ?? []).map((q) => [q.id, q.correct_index])
    );

    const review = (reviewRows ?? []).map((r) => ({
      question_id: r.question_id,
      chosen_index: r.chosen_index,
      is_correct: r.is_correct,
      correct_index: correctIndexByQuestionId.get(r.question_id) ?? null,
    }));

    return NextResponse.json({
      attempt_id,
      score_percent: grade?.score_percent ?? null,
      passed: grade?.passed ?? null,
      total_questions: grade?.total_questions ?? null,
      correct_answers: grade?.correct_answers ?? null,
      final_certificate_unlocked: finalCertificateUnlocked,
      final_certificate: finalCertificate,
      review,
    });
  } catch (e) {
    console.error("POST /api/module-quiz/submit unexpected error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unexpected server error" },
      { status: 500 }
    );
  }
}
