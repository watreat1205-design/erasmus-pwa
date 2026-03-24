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

function pdfSafeText(value: string | null | undefined) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "");
}

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
  const safeText = pdfSafeText(text);
  const words = safeText.split(/\s+/).filter(Boolean);
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
  return lines.length ? lines : [safeText];
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

  const profiles = (profilesRes.data ?? []) as ProfileRow[];
  const lessonCompletions = (lessonCompletionsRes.data ?? []) as LessonCompletionRow[];
  const moduleProgress = (moduleProgressRes.data ?? []) as ModuleProgressRow[];
  const certificates = (certificatesRes.data ?? []) as CertificateRow[];

  const lessonCountByUser = countByUser(lessonCompletions);
  const moduleCountByUser = countByUser(moduleProgress);
  const certificateCountByUser = countByUser(certificates);

  const users = profiles.map((profile) => ({
    full_name: pdfSafeText(profile.full_name?.trim() || "-"),
    email: pdfSafeText(profile.email?.trim() || "-"),
    role: pdfSafeText(profile.role || "-"),
    joined: pdfSafeText(formatDate(profile.created_at)),
    lessonProgress: lessonCountByUser.get(profile.id) ?? 0,
    moduleProgress: moduleCountByUser.get(profile.id) ?? 0,
    certificatesCount: certificateCountByUser.get(profile.id) ?? 0,
  }));

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 36;
  let y = height - margin;

  const slate900 = rgb(0.06, 0.09, 0.16);

  page.drawText("Admin Report", {
    x: margin,
    y,
    size: 20,
    font: bold,
    color: slate900,
  });

  y -= 40;

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

  headers.forEach((h, i) => {
    page.drawText(h, {
      x: colX[i],
      y,
      size: 10,
      font: bold,
    });
  });

  y -= 20;

  users.slice(0, 15).forEach((user) => {
    const nameLines = wrapText(user.full_name, 180, font, 8);
    const emailLines = wrapText(user.email, 180, font, 8);

    page.drawText(nameLines[0], { x: colX[0], y, size: 8, font });
    page.drawText(emailLines[0], { x: colX[1], y, size: 8, font });
    page.drawText(user.role, { x: colX[2], y, size: 8, font });
    page.drawText(user.joined, { x: colX[3], y, size: 8, font });
    page.drawText(String(user.lessonProgress), { x: colX[4], y, size: 8, font });
    page.drawText(String(user.moduleProgress), { x: colX[5], y, size: 8, font });
    page.drawText(String(user.certificatesCount), { x: colX[6], y, size: 8, font });

    y -= 18;
  });

  const pdfBytes = await pdfDoc.save();
  const filename = `admin-report_${formatFilenameDate(new Date())}.pdf`;

  return new Response(new Uint8Array(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
