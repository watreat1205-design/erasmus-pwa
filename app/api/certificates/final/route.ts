// app/api/certificates/final/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PDFDocument, PDFFont, PDFPage, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs/promises";
import path from "path";
import QRCode from "qrcode";
import { ensureFinalCertificateIssuedForCurrentUser } from "@/app/lib/certificates/final";

function normalizeText(s: string) {
  return (s || "").replace(/[–—]/g, "-").trim();
}

function textWidth(font: PDFFont, text: string, size: number) {
  return font.widthOfTextAtSize(text, size);
}

function drawCentered(
  page: PDFPage,
  font: PDFFont,
  text: string,
  y: number,
  size: number,
  color = rgb(0.12, 0.12, 0.12)
) {
  const w = textWidth(font, text, size);
  page.drawText(text, {
    x: page.getWidth() / 2 - w / 2,
    y,
    size,
    font,
    color,
  });
}

function drawLeft(
  page: PDFPage,
  font: PDFFont,
  text: string,
  x: number,
  y: number,
  size: number,
  color = rgb(0.12, 0.12, 0.12)
) {
  page.drawText(text, { x, y, size, font, color });
}

function drawRight(
  page: PDFPage,
  font: PDFFont,
  text: string,
  xRight: number,
  y: number,
  size: number,
  color = rgb(0.12, 0.12, 0.12)
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: xRight - w,
    y,
    size,
    font,
    color,
  });
}

function wrapText(font: PDFFont, text: string, size: number, maxWidth: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
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
  leading = Math.round(size * 1.25),
  color = rgb(0.12, 0.12, 0.12)
) {
  let y = yTop;
  for (const line of lines) {
    drawCentered(page, font, line, y, size, color);
    y -= leading;
  }
  return y;
}

async function embedBackground(pdfDoc: PDFDocument) {
  const pngPath = path.join(
    process.cwd(),
    "public",
    "cert-templates",
    "drops-final-bg.png"
  );
  const jpgPath = path.join(
    process.cwd(),
    "public",
    "cert-templates",
    "drops-final-bg.jpg"
  );

  try {
    const pngBytes = await fs.readFile(pngPath);
    return { image: await pdfDoc.embedPng(pngBytes), type: "png" as const };
  } catch {
    const jpgBytes = await fs.readFile(jpgPath);
    return { image: await pdfDoc.embedJpg(jpgBytes), type: "jpg" as const };
  }
}

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await ensureFinalCertificateIssuedForCurrentUser();

  if (!result.eligible || !result.certificate) {
    return NextResponse.json(
      { error: "Final certificate not earned yet" },
      { status: 403 }
    );
  }

  const cert = result.certificate;

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

  const issued = new Date(cert.issued_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const regularPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "NotoSans-Regular.ttf"
  );
  const boldPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "NotoSans-Bold.ttf"
  );

  const [regularBytes, boldBytes] = await Promise.all([
    fs.readFile(regularPath),
    fs.readFile(boldPath),
  ]);

  const fontRegular = await pdfDoc.embedFont(regularBytes);
  const fontBold = await pdfDoc.embedFont(boldBytes);

  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  const bg = await embedBackground(pdfDoc);
  page.drawImage(bg.image, {
    x: 0,
    y: 0,
    width,
    height,
  });

  page.drawRectangle({
    x: 92,
    y: 145,
    width: width - 184,
    height: 280,
    color: rgb(1, 1, 1),
    opacity: 0.72,
  });

  let y = 390;

  drawCentered(
    page,
    fontBold,
    "CERTIFICATE OF COMPLETION",
    y,
    26,
    rgb(0.12, 0.16, 0.36)
  );
  y -= 38;

  drawCentered(page, fontRegular, "This certifies that", y, 14);
  y -= 34;

  drawCentered(page, fontBold, recipient, y, 28, rgb(0.08, 0.08, 0.08));
  y -= 42;

  drawCentered(
    page,
    fontRegular,
    "has successfully completed the DROPS e-learning programme",
    y,
    14
  );
  y -= 28;

  const statement =
    "covering sustainable development, TEAL methodology, and green skills for transformative education.";
  const lines = wrapText(fontBold, statement, 17, 520);
  y = drawCenteredBlock(page, fontBold, lines, y, 17, 24, rgb(0.12, 0.16, 0.36));
  y -= 18;

  const footerText =
    "including all required modules, activities, and assessments.";
  drawCentered(page, fontRegular, footerText, y, 13);

  const footerY = 105;
  drawLeft(page, fontRegular, `Issued on: ${issued}`, 58, footerY, 11);

  if (cert.certificate_number) {
    drawRight(
      page,
      fontRegular,
      `Certificate ID: ${cert.certificate_number}`,
      width - 58,
      footerY + 82,
      11
    );
  }

  drawLeft(page, fontRegular, "__________________________", 58, 72, 11);
  drawLeft(page, fontRegular, "Trainer / Project Lead", 58, 54, 10);

  drawLeft(
    page,
    fontRegular,
    "__________________________",
    width - 278,
    72,
    11
  );
  drawLeft(page, fontRegular, "DROPS Representative", width - 278, 54, 10);

  if (cert.verification_code) {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verify-certificate?code=${encodeURIComponent(
      cert.verification_code
    )}`;

    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "M",
      margin: 1,
    });

    const qrBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
    const qrImage = await pdfDoc.embedPng(qrBytes);

    const qrSize = 72;
    const qrX = width - 58 - qrSize;
    const qrY = 84;

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    });

    drawLeft(page, fontRegular, "scan to verify", qrX, qrY - 10, 9);
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="drops-final-certificate.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
