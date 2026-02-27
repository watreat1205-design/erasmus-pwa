"use server";
import { generateCertificateNumber, generateVerificationCode } from "../lib/certificates/verification";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Issues (upserts) a certificate ONLY if:
 *  - course progress is 100%
 *  - quiz is passed
 *
 * Adjust the table/column names in the 2 checks below to match your schema.
 */
export async function ensureCertificateIssued(courseId: string) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();

  if (uErr || !user) throw new Error("Not logged in");

  // -----------------------------
  // ✅ CHECK #1: Course progress = 100%
  // -----------------------------
  // OPTION A (common): a course_progress table with pct/percent
  const { data: prog, error: pErr } = await supabase
    .from("course_progress")
    .select("percent")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (pErr) throw pErr;

  const percent = prog?.percent ?? 0;
  const isComplete = Number(percent) >= 100;

  // -----------------------------
  // ✅ CHECK #2: Quiz passed
  // -----------------------------
  // OPTION A (common): quiz_attempts table with passed boolean
  const { data: attempt, error: qErr } = await supabase
    .from("quiz_attempts")
    .select("passed")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (qErr) throw qErr;

  const isPassed = !!attempt?.passed;

  // If not eligible, do nothing (idempotent)
  if (!isComplete || !isPassed) {
    return { issued: false, isComplete, isPassed };
  }

  // -----------------------------
  // ✅ Issue certificate (idempotent)
  // Requires unique constraint on (user_id, course_id)
  // -----------------------------

const { data: existing } = await supabase
  .from("certificates")
  .select("id, verification_code, certificate_number")
  .eq("user_id", user.id)
  .eq("course_id", courseId)
  .maybeSingle();

if (!existing) {
  await supabase.from("certificates").insert({
    user_id: user.id,
    course_id: courseId,
    file_path: null,
    issued_at: new Date().toISOString(),
    verification_code: generateVerificationCode(),
    certificate_number: generateCertificateNumber(),
  });
} else if (!existing.verification_code || !existing.certificate_number) {
  await supabase.from("certificates").update({
    verification_code: existing.verification_code ?? generateVerificationCode(),
    certificate_number: existing.certificate_number ?? generateCertificateNumber(),
  }).eq("id", existing.id);
}


  return { issued: true, isComplete, isPassed };
}
