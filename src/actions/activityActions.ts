"use server";

/**
 * Temporary stub to satisfy imports during build.
 * Replace with real implementation (Supabase insert/upsert) when Activities are enabled.
 */
export async function upsertBlockSubmission(
  _args: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  return { ok: false, error: "Activity submissions are disabled." };
}
