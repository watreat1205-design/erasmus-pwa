import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

function getErrorMessage(e: unknown) {
  return e instanceof Error ? e.message : String(e);
}
export async function POST(req: Request) {
  try {
    const { course_id } = await req.json();

    // Use service role client (server-only)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Identify user from auth cookie (recommended approach)
    // If you're using Supabase SSR helpers already, tell me and I'll align with your exact setup.
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user_id = userData.user.id;
    const email = userData.user.email ?? "";

    // Fetch course title
    const { data: course, error: cErr } = await supabase
      .from("courses")
      .select("id,title")
      .eq("id", course_id)
      .single();

    if (cErr || !course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check certificate eligibility (must already exist or must be eligible)
    // If you only create certificate row when eligible, just upsert here.
    const { data: certRow, error: certErr } = await supabase
      .from("certificates")
      .select("id, file_path, issued_at")
      .eq("user_id", user_id)
      .eq("course_id", course_id)
      .maybeSingle();

    // Ensure certificate exists (optional)
    if (!certRow) {
      // Only allow generation if eligible
      // If you have public.course_completed(p_course_id) function, call it with RPC in app context.
      // For now, we assume certificate row exists when eligible.
      return NextResponse.json({ error: "Certificate not issued yet" }, { status: 400 });
    }

    // --- Generate PDF ---
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape-ish
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const issuedAt = certRow.issued_at ? new Date(certRow.issued_at) : new Date();
    const issuedText = issuedAt.toISOString().slice(0, 10);

    // Simple layout
    page.drawText("Certificate of Completion", {
      x: 240,
      y: 520,
      size: 28,
      font: bold,
    });

    page.drawText(`This certifies that`, { x: 330, y: 450, size: 14, font });
    page.drawText(email || user_id, { x: 220, y: 410, size: 22, font: bold });

    page.drawText(`has successfully completed:`, { x: 300, y: 360, size: 14, font });
    page.drawText(course.title, { x: 120, y: 320, size: 20, font: bold });

    page.drawText(`Issued: ${issuedText}`, { x: 80, y: 120, size: 12, font });
    page.drawText(`Course ID: ${course.id}`, { x: 80, y: 100, size: 9, font });

    const pdfBytes = await pdfDoc.save();

    // File path in bucket
    const filename = `course_${course_id}/user_${user_id}/certificate_${certRow.id}.pdf`;

    // Upload to Storage (overwrite allowed)
     const { error: uploadErr } = await supabase.storage
  .from("certificates")
  .upload(filename, pdfBytes, {
    contentType: "application/pdf",
    upsert: true,
  });

if (uploadErr) {
  return NextResponse.json({ error: uploadErr.message }, { status: 500 });
}
    // Update file_path
     const { error: updateErr } = await supabase
  .from("certificates")
  .update({ file_path: filename })
  .eq("id", certRow.id);

if (updateErr) {
  return NextResponse.json({ error: updateErr.message }, { status: 500 });
}
    // Create signed URL (1 hour)
    const { data: signed, error: sErr } = await supabase.storage
      .from("certificates")
      .createSignedUrl(filename, 60 * 60);

    if (sErr) {
      return NextResponse.json({ error: sErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, file_path: filename, url: signed.signedUrl });
    } catch (e: unknown) {
  return NextResponse.json(
    { ok: false, error: getErrorMessage(e) },
    { status: 500 }
  );
}
}
