import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

function supabaseAnon() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  if (!anon) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createClient(url, anon, { auth: { persistSession: false } });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") ?? "").trim();
  if (!code) return bad("Missing code");

  const supabase = supabaseAnon();

  // Uses your existing view: public.certificate_public_verify
  const { data, error } = await supabase
    .from("certificate_public_verify")
    .select("*")
    .or(`verification_code.eq.${code},certificate_number.eq.${code}`)
    .limit(1)
    .maybeSingle();

  if (error) return bad(error.message, 500);
  if (!data) return bad("Certificate not found", 404);

  return NextResponse.json({ ok: true, certificate: data });
}
