import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: "trainer" | "admin" | "dev" | null;
  created_at: string | null;
  email: string | null;
};

type LessonCompletionRow = {
  user_id: string;
};

type ModuleProgressRow = {
  user_id: string;
  completed_at: string | null;
};

type CertificateRow = {
  user_id: string;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function countByUser<T extends { user_id: string }>(rows: T[]) {
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.user_id, (map.get(row.user_id) ?? 0) + 1);
  }
  return map;
}

function formatFilenameDate(date: Date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mi = String(date.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}_${hh}-${mi}`;
}

function wrapText(
  text: string,
  maxWidth: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  fontSize: number
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(trial, fontSize);

    if (width <= maxWidth) {
      current = trial;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const [
    profilesRes,
    lessonCompletionsRes,
    moduleProgressRes,
    certificatesRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role, created_at, email")
      .order("created_at", { ascending: false }),

    supabase.from("lesson_completions").select("user_id"),

    supabase
      .from("module_progress")
      .select("user_id, completed_at")
      .not("completed_at", "is", null),

    supabase.from("certificates").select("user_id"),
  ]);

  if (profilesRes.error) {
    return new Response(`PDF export failed: ${profilesRes.error.message}`, { status: 500 });
  }
  if (lessonCompletionsRes.error) {
    return new Response(`PDF export failed: ${lessonCompletionsRes.error.message}`, {
      status: 500,
    });
  }
  if (moduleProgressRes.error) {
    return new Response(`PDF export failed: ${moduleProgressRes.error.message}`, {
      status: 500,
    });
  }
  if (certificatesRes.error) {
    return new Response(`PDF export failed: ${certificatesRes.error.message}`, {
      status: 500,
    });
  }

  const profiles = (profilesRes.data ?? []) as ProfileRow[];
  const lessonCompletions = (lessonCompletionsRes.data ?? []) as LessonCompletionRow[];
  const moduleProgress = (moduleProgressRes.data ?? []) as ModuleProgressRow[];
  const certificates = (certificatesRes.data ?? []) as CertificateRow[];

  const lessonCountByUser = countByUser(lessonCompletions);
  const moduleCountByUser = countByUser(moduleProgress);
  const certificateCountByUser = countByUser(certificates);

  const totalUsers = profiles.length;
  const trainerCount = profiles.filter((p) => p.role === "trainer").length;
  const adminCount = profiles.filter((p) => p.role === "admin").length;
  const devCount = profiles.filter((p) => p.role === "dev").length;
  const completedModulesCount = moduleProgress.length;
  const certificatesIssuedCount = certificates.length;

  const users = profiles.map((profile) => ({
    full_name: profile.full_name?.trim() || "-",
    email: profile.email?.trim() || "-",
    role: profile.role || "-",
    joined: formatDate(profile.created_at),
    lessonProgress: lessonCountByUser.get(profile.id) ?? 0,
    moduleProgress: moduleCountByUser.get(profile.id) ?? 0,
    certificatesCount: certificateCountByUser.get(profile.id) ?? 0,
  }));

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape approx
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 36;
  let y = height - margin;

  const slate900 = rgb(0.06, 0.09, 0.16);
  const slate700 = rgb(0.2, 0.25, 0.32);
  const slate500 = rgb(0.4, 0.46, 0.54);
  const border = rgb(0.85, 0.88, 0.92);
  const headerBg = rgb(0.95, 0.96, 0.98);
  const cardBg = rgb(0.985, 0.99, 1);

  page.drawText("Admin Report", {
    x: margin,
    y,
    size: 20,
    font: bold,
    color: slate900,
  });

  y -= 20;
  page.drawText("Read-only user, progress, and certificate summary", {
    x: margin,
    y,
    size: 10,
    font,
    color: slate700,
  });

  y -= 24;
  page.drawText(`Generated: ${new Date().toLocaleString("en-GB")}`, {
    x: margin,
    y,
    size: 9,
    font,
    color: slate500,
  });

  y -= 30;

  const cardW = 145;
  const cardH = 54;
  const cardGap = 10;

  const cards = [
    ["Total users", String(totalUsers)],
    ["Trainers", String(trainerCount)],
    ["Admins", String(adminCount)],
    ["Devs", String(devCount)],
    ["Completed modules", String(completedModulesCount)],
  ];

  cards.forEach(([label, value], i) => {
    const x = margin + i * (cardW + cardGap);
    page.drawRectangle({
      x,
      y: y - cardH,
      width: cardW,
      height: cardH,
      color: cardBg,
      borderColor: border,
      borderWidth: 1,
    });

    page.drawText(label, {
      x: x + 10,
      y: y - 18,
      size: 9,
      font,
      color: slate500,
    });

    page.drawText(value, {
      x: x + 10,
      y: y - 40,
      size: 18,
      font: bold,
      color: slate900,
    });
  });

  y -= cardH + 24;

  page.drawRectangle({
    x: margin,
    y: y - 44,
    width: 250,
    height: 44,
    color: cardBg,
    borderColor: border,
    borderWidth: 1,
  });

  page.drawText("Certificates issued", {
    x: margin + 10,
    y: y - 16,
    size: 9,
    font,
    color: slate500,
  });

  page.drawText(String(certificatesIssuedCount), {
    x: margin + 10,
    y: y - 34,
    size: 16,
    font: bold,
    color: slate900,
  });

  y -= 68;

  page.drawText("Users overview", {
    x: margin,
    y,
    size: 13,
    font: bold,
    color: slate900,
  });

  y -= 18;

  const colX = [margin, 200, 390, 465, 540, 625, 715];
  const headers = [
    "Name",
    "Email",
    "Role",
    "Joined",
    "Lessons",
    "Modules",
    "Cert.",
  ];

  page.drawRectangle({
    x: margin,
    y: y - 22,
    width: width - margin * 2,
    height: 22,
    color: headerBg,
    borderColor: border,
    borderWidth: 1,
  });

  headers.forEach((h, i) => {
    page.drawText(h, {
      x: colX[i] + 6,
      y: y - 15,
      size: 9,
      font: bold,
      color: slate700,
    });
  });

  y -= 22;

  const rowFontSize = 8;
  const lineHeight = 10;
  const maxRows = 14;

  users.slice(0, maxRows).forEach((user) => {
    const nameLines = wrapText(user.full_name, 180, font, rowFontSize);
    const emailLines = wrapText(user.email, 185, font, rowFontSize);
    const rowLines = Math.max(nameLines.length, emailLines.length, 1);
    const rowHeight = Math.max(20, rowLines * lineHeight + 8);

    page.drawRectangle({
      x: margin,
      y: y - rowHeight,
      width: width - margin * 2,
      height: rowHeight,
      borderColor: border,
      borderWidth: 1,
    });

    nameLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colX[0] + 6,
        y: y - 14 - idx * lineHeight,
        size: rowFontSize,
        font,
        color: slate900,
      });
    });

    emailLines.forEach((line, idx) => {
      page.drawText(line, {
        x: colX[1] + 6,
        y: y - 14 - idx * lineHeight,
        size: rowFontSize,
        font,
        color: slate900,
      });
    });

    page.drawText(String(user.role), {
      x: colX[2] + 6,
      y: y - 14,
      size: rowFontSize,
      font,
      color: slate900,
    });

    page.drawText(user.joined, {
      x: colX[3] + 6,
      y: y - 14,
      size: rowFontSize,
      font,
      color: slate900,
    });

    page.drawText(String(user.lessonProgress), {
      x: colX[4] + 18,
      y: y - 14,
      size: rowFontSize,
      font,
      color: slate900,
    });

    page.drawText(String(user.moduleProgress), {
      x: colX[5] + 18,
      y: y - 14,
      size: rowFontSize,
      font,
      color: slate900,
    });

    page.drawText(String(user.certificatesCount), {
      x: colX[6] + 12,
      y: y - 14,
      size: rowFontSize,
      font,
      color: slate900,
    });

    y -= rowHeight;
  });

  if (users.length > maxRows) {
    y -= 16;
    page.drawText(
      `Showing first ${maxRows} users out of ${users.length}. Use CSV export for the full dataset.`,
      {
        x: margin,
        y,
        size: 9,
        font,
        color: slate500,
      }
    );
  }

  const pdfBytes = await pdfDoc.save();
  const filename = `admin-report_${formatFilenameDate(new Date())}.pdf`;

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
