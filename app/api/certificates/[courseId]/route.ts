import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { PDFDocument, PDFFont, PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs/promises";
import path from "path";
import QRCode from "qrcode";

function normalizeText(s: string) {
  return (s || "").replace(/[–—]/g, "-");
}

// --- helpers ---
function textWidth(font: PDFFont, text: string, size: number) {
  return font.widthOfTextAtSize(text, size);
}

function drawCentered(
  page: PDFPage,
  font: PDFFont,
  text: string,
  y: number,
  size: number
) {
  const w = textWidth(font, text, size);
  page.drawText(text, {
    x: page.getWidth() / 2 - w / 2,
    y,
    size,
    font,
  });
}

function drawRight(
  page: PDFPage,
  font: PDFFont,
  text: unknown,
  xRight: number,
  y: number,
  size: number
) {
  const s = String(text ?? "");
  const w = font.widthOfTextAtSize(s, size);
  page.drawText(s, { x: xRight - w, y, size, font });
}

function drawLeft(
  page: PDFPage,
  font: PDFFont,
  text: unknown,
  x: number,
  y: number,
  size: number
) {
  page.drawText(String(text ?? ""), { x, y, size, font });
}

function wrapText(font: PDFFont, text: string, size: number, maxWidth: number) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w;
    if (textWidth(font, candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);

      // single very-long word -> hard break
      if (textWidth(font, w, size) <= maxWidth) {
        line = w;
      } else {
        let chunk = "";
        for (const ch of w) {
          const c2 = chunk + ch;
          if (textWidth(font, c2, size) <= maxWidth) chunk = c2;
          else {
            if (chunk) lines.push(chunk);
            chunk = ch;
          }
        }
        line = chunk;
      }
    }
  }

  if (line) lines.push(line);
  return lines;
}

function drawCenteredBlock(
  page: PDFPage,
  font: PDFFont,
  lines: string[],
  yTop: number,
  size: number,
  leading?: number
) {
  let y = yTop;
  const lead = leading ?? Math.round(size * 1.2);
  for (const line of lines) {
    drawCentered(page, font, line, y, size);
    y -= lead;
  }
  return y;
}

  function drawCertificateFrame(page: PDFPage, width: number, height: number) {
  const outer = 20;
  const inner = 34;

  // Outer rectangle using 4 lines (no fill)
  page.drawLine({ start: { x: outer, y: outer }, end: { x: width - outer, y: outer }, thickness: 2.5 });
  page.drawLine({ start: { x: outer, y: height - outer }, end: { x: width - outer, y: height - outer }, thickness: 2.5 });
  page.drawLine({ start: { x: outer, y: outer }, end: { x: outer, y: height - outer }, thickness: 2.5 });
  page.drawLine({ start: { x: width - outer, y: outer }, end: { x: width - outer, y: height - outer }, thickness: 2.5 });

  // Inner rectangle using 4 lines (no fill)
  page.drawLine({ start: { x: inner, y: inner }, end: { x: width - inner, y: inner }, thickness: 1 });
  page.drawLine({ start: { x: inner, y: height - inner }, end: { x: width - inner, y: height - inner }, thickness: 1 });
  page.drawLine({ start: { x: inner, y: inner }, end: { x: inner, y: height - inner }, thickness: 1 });
  page.drawLine({ start: { x: width - inner, y: inner }, end: { x: width - inner, y: height - inner }, thickness: 1 });

  // Corner accents
  const c = 18;
  const t = 2;

  // TL
  page.drawLine({ start: { x: inner, y: height - inner }, end: { x: inner + c, y: height - inner }, thickness: t });
  page.drawLine({ start: { x: inner, y: height - inner }, end: { x: inner, y: height - inner - c }, thickness: t });

  // TR
  page.drawLine({ start: { x: width - inner, y: height - inner }, end: { x: width - inner - c, y: height - inner }, thickness: t });
  page.drawLine({ start: { x: width - inner, y: height - inner }, end: { x: width - inner, y: height - inner - c }, thickness: t });

  // BL
  page.drawLine({ start: { x: inner, y: inner }, end: { x: inner + c, y: inner }, thickness: t });
  page.drawLine({ start: { x: inner, y: inner }, end: { x: inner, y: inner + c }, thickness: t });

  // BR
  page.drawLine({ start: { x: width - inner, y: inner }, end: { x: width - inner - c, y: inner }, thickness: t });
  page.drawLine({ start: { x: width - inner, y: inner }, end: { x: width - inner, y: inner + c }, thickness: t });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;

  // Certificate row must exist
  const { data: cert, error: certErr } = await supabase
    .from("certificates")
    .select("id, verification_code, certificate_number")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (certErr) {
    console.error("certificates select error:", certErr);
    return NextResponse.json({ error: "Failed to check certificate" }, { status: 500 });
  }

  if (!cert?.id) {
    return NextResponse.json({ error: "Certificate not earned yet" }, { status: 403 });
  }

  // Course title
  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .select("title")
    .eq("id", courseId)
    .single();

  if (courseErr || !course?.title) {
    console.error("courses select error:", courseErr);
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const courseTitle = normalizeText(course.title);

  // Recipient from profiles.full_name if available
  let recipient = user.email || user.id;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) recipient = profile.full_name;
  } catch {}
  recipient = normalizeText(recipient);

  // (cleaner issued format)
  const issued = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  // ---- Build PDF using Unicode font (Noto Sans) ----
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const regularPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");
  const boldPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Bold.ttf");

  const [regularBytes, boldBytes] = await Promise.all([
    fs.readFile(regularPath),
    fs.readFile(boldPath),
  ]);

  const fontRegular = await pdfDoc.embedFont(regularBytes);
  const fontBold = await pdfDoc.embedFont(boldBytes);

  // A4 landscape
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  // Layout box (align everything to this)
  const M = { left: 70, right: 70, top: 56, bottom: 44 };
  const content = {
    x: M.left,
    w: width - M.left - M.right,
    yTop: height - M.top,
  };

  drawCertificateFrame(page, width, height);

  // --- Logos row ---
  const headerTopY = content.yTop;

  // DROPS logo (top center)
  let logoBottomY = headerTopY; // used to place next content below logo if it exists
  try {
    const logoPath = path.join(process.cwd(), "public", "cert-logos", "drops.png");
    const logoBytes = await fs.readFile(logoPath);
    const logoImg = await pdfDoc.embedPng(logoBytes);

    const logoW = 150;
    const logoH = (logoImg.height / logoImg.width) * logoW;

    const logoY = headerTopY - logoH; // anchor to top margin
    page.drawImage(logoImg, {
      x: width / 2 - logoW / 2,
      y: logoY,
      width: logoW,
      height: logoH,
    });

    logoBottomY = logoY;
  } catch {
    // ok if logo not present
  }

  // Start content below logo with consistent spacing
  let cy = logoBottomY - 32;

  // --- Title (CENTERED) ---
  drawCentered(page, fontBold, "CERTIFICATE OF COMPLETION", cy, 32);
  cy -= 40;

  // --- Subtitle (CENTERED) ---
  drawCentered(page, fontRegular, "This certifies that", cy, 14);
  cy -= 34;

  // --- Name (big, centered) ---
  const nameSize = 30;
  drawCentered(page, fontBold, recipient, cy, nameSize);
  cy -= 44;

  // --- Course line (CENTERED) ---
  drawCentered(page, fontRegular, "has successfully completed the training programme", cy, 14);
  cy -= 28;

  // --- Course title (wrapped + centered) ---
  const courseSize = 20;
  const maxCourseWidth = content.w * 0.88;
  const courseLines = wrapText(fontBold, courseTitle, courseSize, maxCourseWidth);
  cy = drawCenteredBlock(page, fontBold, courseLines, cy, courseSize, 26);
  cy -= 18;

  // --- Statement (centered, 2 lines) ---
  const line1 = "You are now expert in TEAL methodology";
  const line2 = "to apply green skills.";
  drawCentered(page, fontRegular, line1, cy, 14);
  cy -= 22;
  drawCentered(page, fontRegular, line2, cy, 14);

  // --- Footer baseline ---
  const footerY = 92;

  // Issued (left)
  drawLeft(page, fontRegular, `Issued on: ${issued}`, M.left, footerY, 11);

  // Certificate ID (above QR)
if (cert.certificate_number && cert.verification_code) {
  const certNo = `Certificate ID: ${cert.certificate_number}`;
  const qrSize = 72;
  const qrY = 95; // must match your QR block
  drawRight(page, fontRegular, certNo, width - M.right, qrY + qrSize + 10, 11);
} else if (cert.certificate_number) {
  const certNo = `Certificate ID: ${cert.certificate_number}`;
  drawRight(page, fontRegular, certNo, width - M.right, footerY, 11);
}

  // --- Signature blocks (aligned + symmetric) ---
  const sigLineY = 58;
  const sigTextY = 40;
  const sigBlockW = 220;

  // Left signature
  drawLeft(page, fontRegular, "__________________________", M.left, sigLineY, 11);
  drawLeft(page, fontRegular, "Trainer / Project Lead", M.left, sigTextY, 10);

  // Right signature (right-aligned block)
  const rightBlockX = width - M.right - sigBlockW;
  drawLeft(page, fontRegular, "__________________________", rightBlockX, sigLineY, 11);
  drawLeft(page, fontRegular, "DROPS Representative", rightBlockX, sigTextY, 10);

  // --- QR verify (bottom-right) ---
  if (cert.verification_code) {
     const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const verifyUrl = `${baseUrl}/verify-certificate?code=${encodeURIComponent(
  cert.verification_code
)}`;

const qrDataUrl = await QRCode.toDataURL(verifyUrl, { errorCorrectionLevel: "M" });
const qrBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
const qrImage = await pdfDoc.embedPng(qrBytes);
    
     const qrSize = 72; // slightly smaller = cleaner
const qrMarginBottom = 50; // lift it up a bit
const qrX = width - M.right - qrSize;
const qrY = qrMarginBottom;

// Draw QR
page.drawImage(qrImage, {
  x: qrX,
  y: qrY,
  width: qrSize,
  height: qrSize,
});

// Label under QR
drawLeft(
  page,
  fontRegular,
  "scan to verify",
  qrX,
  qrY - 10,
  9
);
    drawLeft(page, fontRegular, "scan to verify", qrX, qrY - 10, 9);
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-${courseId}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
