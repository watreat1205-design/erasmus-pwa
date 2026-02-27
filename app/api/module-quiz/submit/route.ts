// app/api/module-quiz/submit/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AnswerPayload = {
  question_id: string;
  chosen_index: number;
};

export async function POST(req: Request) {
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

  // Auth user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 1) Fetch quiz.course_id (needed to check certificate)
  const { data: quiz, error: quizErr } = await supabase
    .from("module_quizzes")
    .select("id, course_id, is_published")
    .eq("id", quiz_id)
    .single();

  if (quizErr || !quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  if (!quiz.is_published) {
    return NextResponse.json({ error: "Quiz not published" }, { status: 403 });
  }

  // 2) Compute attempt_no = max(attempt_no)+1 for this user+quiz
  const { data: prevAttempts, error: prevErr } = await supabase
    .from("module_quiz_attempts")
    .select("attempt_no")
    .eq("quiz_id", quiz_id)
    .eq("user_id", user.id)
    .order("attempt_no", { ascending: false })
    .limit(1);

  if (prevErr) {
    return NextResponse.json({ error: prevErr.message }, { status: 500 });
  }

  const nextAttemptNo =
    (prevAttempts?.[0]?.attempt_no ?? 0) + 1;

  // 3) Create attempt
  const { data: attempt, error: attemptErr } = await supabase
    .from("module_quiz_attempts")
    .insert({
      quiz_id,
      user_id: user.id,
      started_at: new Date().toISOString(),
      attempt_no: nextAttemptNo,
      // submitted_at/score_percent/passed remain NULL initially
    })
    .select("id")
    .single();

  if (attemptErr || !attempt) {
    return NextResponse.json(
      { error: attemptErr?.message ?? "Failed to create attempt" },
      { status: 500 }
    );
  }

  const attempt_id = attempt.id as string;

  // 4) Insert answers (bulk)
  // IMPORTANT: Do NOT send is_correct from client; DB will set it in grading
  const answerRows = answers.map((a) => ({
    attempt_id,
    question_id: a.question_id,
    chosen_index: a.chosen_index,
  }));

  const { error: ansErr } = await supabase
    .from("module_quiz_answers")
    .insert(answerRows);

  if (ansErr) {
    // Optional cleanup: delete attempt if answers insert failed
    await supabase.from("module_quiz_attempts").delete().eq("id", attempt_id);
    return NextResponse.json({ error: ansErr.message }, { status: 500 });
  }

  // 5) Grade attempt (RPC)
  const { data: gradeRows, error: gradeErr } = await supabase
    .rpc("grade_module_quiz_attempt", { p_attempt_id: attempt_id });

  if (gradeErr) {
    return NextResponse.json({ error: gradeErr.message }, { status: 500 });
  }

  const grade = Array.isArray(gradeRows) ? gradeRows[0] : gradeRows;

  // 6) Check if certificate exists now (trigger may have inserted it)
  const { data: cert, error: certErr } = await supabase
    .from("certificates")
    .select("id, file_path, issued_at")
    .eq("user_id", user.id)
    .eq("course_id", quiz.course_id)
    .maybeSingle();

  if (certErr) {
    return NextResponse.json({ error: certErr.message }, { status: 500 });
  }

  return NextResponse.json({
    attempt_id,
    score_percent: grade?.score_percent ?? null,
    passed: grade?.passed ?? null,
    total_questions: grade?.total_questions ?? null,
    correct_answers: grade?.correct_answers ?? null,
    certificate_unlocked: !!cert,
    certificate: cert ?? null,
  });
}
