import Link from "next/link";
import Image from "next/image";

import { redirect } from "next/navigation";
import { markLessonComplete, markLessonIncomplete } from "../../../../courses/actions";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import LessonMaterialsClient from "@/components/lesson/LessonMaterialsClient";
import LockBodyScroll from "@/components/lesson/LockBodyScroll";
import T from "@/components/T";

// -------------------------
// Helpers
// -------------------------
function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();

  if (ext === "pdf") return "📄";
  if (["doc", "docx"].includes(ext || "")) return "📝";
  if (["ppt", "pptx"].includes(ext || "")) return "📊";
  if (["xls", "xlsx"].includes(ext || "")) return "📈";
  if (["jpg", "jpeg", "png", "webp"].includes(ext || "")) return "🖼️";
  if (["mp4", "mov"].includes(ext || "")) return "🎬";
  if (["mp3", "wav"].includes(ext || "")) return "🎧";

  return "📎";
}

function isPdf(name: string) {
  return name.toLowerCase().endsWith(".pdf");
}

function displayName(name: string) {
  const n = String(name);

  if (/presentation\.pdf$/i.test(n)) return "Slides (PDF)";
  if (/presentation\.pptx$/i.test(n)) return "Slides (PowerPoint)";
  if (/facilitator/i.test(n)) return "Facilitator Guide";
  if (/handout/i.test(n)) return "Handout";

  return n;
}

function toYouTubeEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
  } catch {
    // ignore
  }
  return url;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

// -------------------------
// Page
// -------------------------
export default async function LessonPage({
  params,
}: {
  params:
    | { courseId: string; lessonId: string }
    | Promise<{ courseId: string; lessonId: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const { courseId, lessonId } = resolvedParams;

  if (!courseId || !lessonId) {
    return (
      <div style={{ padding: 24 }}>
        <h2><T k="lesson.badRouteTitle" fallback="Bad route" /></h2>
        <p style={{ color: "crimson" }}>
          <T k="lesson.missingParams" fallback="Missing courseId/lessonId in URL." />
        </p>
        <Link href="/courses">← <T k="common.back" fallback="Back" /></Link>
      </div>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return (
      <div style={{ padding: 24 }}>
        <h2><T k="lesson.activity" fallback="Activity" /></h2>
        <p style={{ color: "crimson" }}>
          <T k="auth.mustBeLoggedIn" fallback="You must be logged in." />
        </p>
        <Link href="/login"><T k="auth.goToLogin" fallback="Go to login" /></Link>
      </div>
    );
  }

  // ✅ Enrollment guard
  const { data: enrollment, error: eErr } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (eErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2><T k="lesson.activity" fallback="Activity" /></h2>
        <p style={{ color: "crimson" }}>{eErr.message}</p>
        <Link href={`/my-courses/${courseId}`}>← <T k="lesson.backToCourse" fallback="Back to course" /></Link>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -translate-y-7">
          <Image src="/templates/5.jpg" alt="" fill priority className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 py-6">
          <div className="rounded-xl border border-white/20 bg-white/85 p-3">
            <h2 className="text-xl font-semibold text-gray-900">
              <T k="lesson.accessDenied" fallback="Access denied" />
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              <T k="lesson.notEnrolled" fallback="You are not enrolled in this course." />
            </p>
            <div className="mt-4">
              <Link
                href="/my-courses"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                ← <T k="lesson.backToMyCourses" fallback="Back to My Courses" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course (for title)
  const { data: course, error: cErr } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", courseId)
    .single();

  if (cErr || !course) {
    return (
      <div style={{ padding: 24 }}>
        <h2><T k="lesson.activity" fallback="Activity" /></h2>
        <p style={{ color: "crimson" }}>
          {cErr?.message ?? <T k="courses.notFound" fallback="Course not found" />}
        </p>
        <Link href="/my-courses">← <T k="common.back" fallback="Back" /></Link>
      </div>
    );
  }

  // Sections (for module label)
  const { data: sections, error: sErr } = await supabase
    .from("course_sections")
    .select("id, title, position")
    .eq("course_id", courseId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (sErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2><T k="lesson.activity" fallback="Activity" /></h2>
        <p style={{ color: "crimson" }}>{sErr.message}</p>
        <Link href={`/my-courses/${courseId}`}>← <T k="lesson.backToCourse" fallback="Back to course" /></Link>
      </div>
    );
  }

  const sectionIds = (sections ?? []).map((s) => s.id);

  // Lessons (for prev/next navigation)
  const { data: lessons, error: lErr } = sectionIds.length
    ? await supabase
        .from("course_lessons")
        .select("id, section_id, title, position, kind")
        .in("section_id", sectionIds)
        .order("position", { ascending: true })
    : { data: [], error: null };

  if (lErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2><T k="lesson.activity" fallback="Activity" /></h2>
        <p style={{ color: "crimson" }}>{lErr.message}</p>
        <Link href={`/my-courses/${courseId}`}>← <T k="lesson.backToCourse" fallback="Back to course" /></Link>
      </div>
    );
  }

  // ✅ Current lesson
  const { data: current, error: curErr } = await supabase
    .from("course_lessons")
    .select("id, section_id, title, position, content_md, video_url, is_published, kind, assets_path")
    .eq("id", lessonId)
    .single();

  if (curErr || !current) {
    return (
      <div style={{ padding: 24 }}>
        <h2><T k="lesson.notFoundTitle" fallback="Activity not found" /></h2>
        <p style={{ color: "crimson" }}>{curErr?.message ?? <T k="common.notFound" fallback="Not found" />}</p>
        <Link href={`/my-courses/${courseId}`}>← <T k="lesson.backToCourse" fallback="Back to course" /></Link>
      </div>
    );
  }

  if (current.kind === "quiz") {
    redirect(`/my-courses/${courseId}`);
  }

  // -------------------------
  // ✅ Activity resources (DB) - bypass RLS
  // -------------------------
  type ActivityResource = {
    id: string;
    activity_id: string;
    title: string;
    kind: string;
    url: string | null;
    storage_path: string | null;
    sort_order: number | null;
  };

  const admin = createSupabaseAdminClient();
  const lessonIdClean = String(lessonId).trim();

  const { data: resourcesRaw, error: resErr } = await admin
    .from("activity_resources")
    .select("id, activity_id, title, kind, url, storage_path, sort_order")
    .eq("activity_id", lessonIdClean)
    .order("sort_order", { ascending: true });

  if (resErr) {
    return (
      <div style={{ padding: 24 }}>
        <h2><T k="lesson.lesson" fallback="Lesson" /></h2>
        <p style={{ color: "crimson" }}>{resErr.message}</p>
        <Link href={`/my-courses/${courseId}`}>← <T k="lesson.backToCourse" fallback="Back to course" /></Link>
      </div>
    );
  }

  const resources = (resourcesRaw ?? []) as ActivityResource[];
  const RESOURCE_BUCKET = "course-assets";

  const resourcesWithUrls = await Promise.all(
    resources.map(async (r) => {
      if (r.storage_path) {
        const { data, error } = await admin.storage
          .from(RESOURCE_BUCKET)
          .createSignedUrl(r.storage_path, 60 * 60);

        if (error) return { ...r, resolved_url: null as string | null };
        return { ...r, resolved_url: data?.signedUrl ?? null };
      }
      return { ...r, resolved_url: r.url ?? null };
    })
  );

  // -------------------------
  // 🔥 Activity files (Storage) from assets_path
  // -------------------------
  let files: any[] = [];
  const prefix = (current.assets_path ?? "").replace(/^\/+|\/+$/g, "");

  if (prefix) {
    const { data: exact, error: exactErr } = await supabase.storage
      .from("course-assets")
      .list(prefix, { limit: 100, sortBy: { column: "name", order: "asc" } });

    if (exactErr) console.error("Exact folder list error:", exactErr);
    files = (exact ?? []).filter((f) => f?.name && !String(f.name).endsWith("/"));
  }

  // Completed?
  const { data: prog } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const isCompleted = !!prog?.id;

  // Prev/Next (skip quizzes)
  const ordered = (lessons ?? []).filter(
    (l: unknown) => (l as { kind?: string }).kind !== "quiz"
  );
  const idx = ordered.findIndex((x) => String((x as any).id) === String(lessonId));
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  // Section label
  const section = (sections ?? []).find((s) => s.id === current.section_id);

  // Identify files
  const slidesPdf =
    files.find((f) => /presentation\.pdf$/i.test(String(f.name))) ??
    files.find((f) => /slides/i.test(String(f.name)) && isPdf(String(f.name))) ??
    files.find((f) => /presentation/i.test(String(f.name)) && isPdf(String(f.name))) ??
    null;

  let slidesUrl: string | null = null;
  let coverUrl: string | null = null;

  if (slidesPdf?.name && prefix) {
    const slidesPath = `${prefix}/${slidesPdf.name}`;
    slidesUrl =
      supabase.storage.from("course-assets").getPublicUrl(slidesPath).data.publicUrl;

    const parts = prefix.split("/");
    const moduleIdx = parts.findIndex((p: string) => /^Module-\d+$/i.test(p));
    const coverPath =
      moduleIdx >= 0 ? `${parts.slice(0, moduleIdx + 1).join("/")}/cover.png` : null;

    if (coverPath) {
      coverUrl =
        supabase.storage.from("course-assets").getPublicUrl(coverPath).data.publicUrl;
    }
  }

  const activityPdf =
    files.find((f) => /^activity-1-1.*\.pdf$/i.test(String(f.name))) ??
    files.find((f) => /^activity-.*\.pdf$/i.test(String(f.name))) ??
    null;

  const bucket = "course-assets";
  let pdfUrl: string | null = null;

  if (current.assets_path && activityPdf?.name) {
    const fullPath = `${prefix}/${activityPdf.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fullPath, 60 * 60);

    if (!error) pdfUrl = data?.signedUrl ?? null;
  }

  // ✅ UI: fixed background + one scrollbar
  return (
    <div className="relative h-screen overflow-hidden">
      <LockBodyScroll />
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10 -translate-y-7">
        <Image src="/templates/5.jpg" alt="" fill priority className="object-cover object-center" />
      </div>
      <div className="fixed inset-0 -z-10 bg-black/20" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      {/* Page layout */}
      <div className="mx-auto flex h-screen min-h-0 max-w-4xl flex-col px-6 pt-3 pb-0">
        {/* Compact top bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 text-sm text-white/90">
            <div className="truncate">
              <span className="text-white/80">{course.title}</span>
              <span className="mx-2 text-white/60">•</span>
              <span className="font-semibold text-white">{current.title}</span>
              <span className="mx-2 text-white/60">•</span>
              {section ? (
                <span className="text-white/80">
                  <T k="lesson.module" fallback="Module" /> {section.position}: {section.title} •{" "}
                  <T k="lesson.activity" fallback="Activity" /> {current.position}
                </span>
              ) : (
                <span className="text-white/80">
                  <T k="lesson.activity" fallback="Activity" /> {current.position}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/my-courses/${courseId}`}
              className="rounded-md border border-white/30 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-white"
            >
              ← <T k="common.back" fallback="Back" />
            </Link>

            {isCompleted ? (
              <form action={markLessonIncomplete}>
                <input type="hidden" name="courseId" value={courseId} />
                <input type="hidden" name="lessonId" value={lessonId} />
                <button
                  type="submit"
                  className="rounded-md border border-white/30 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-white"
                >
                  ✅ <T k="lesson.completed" fallback="Completed" />
                </button>
              </form>
            ) : (
              <form action={markLessonComplete}>
                <input type="hidden" name="courseId" value={courseId} />
                <input type="hidden" name="lessonId" value={lessonId} />
                <button
                  type="submit"
                  className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
                >
                  <T k="lesson.markComplete" fallback="Mark complete" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Scroll area */}
        <div className="mt-3 flex-1 min-h-0 overflow-y-auto overscroll-contain pb-24">
          <div className="rounded-xl border border-white/20 bg-white/85 p-3">
            <div className="text-xs text-gray-700">
              <T
                k="lesson.openMaterialsHint"
                fallback="Open the materials below to complete this activity."
              />
            </div>

            <LessonMaterialsClient pdfUrl={pdfUrl} slidesUrl={slidesUrl} coverUrl={coverUrl} />

            {(resourcesWithUrls.length > 0 || files.length > 0) && (
              <div className="mt-6 space-y-6 rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold">
                  <T k="lesson.materials" fallback="Materials" />
                </h3>

                {(() => {
                  const pdf = resourcesWithUrls.find(
                    (r) =>
                      (r.kind === "pdf" ||
                        (r.storage_path ?? "").toLowerCase().endsWith(".pdf")) &&
                      !!(r as any).resolved_url
                  ) as
                    | (ActivityResource & { resolved_url: string | null })
                    | undefined;

                  if (!pdf?.resolved_url) return null;

                  return (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="text-sm font-semibold text-gray-900">{pdf.title}</div>
                      <div className="mt-2 flex justify-end">
                        <a
                          href={pdf.resolved_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          <T k="lesson.openPdf" fallback="Open PDF" />
                        </a>
                      </div>
                    </div>
                  );
                })()}

                {resourcesWithUrls.some((r) => r.kind === "youtube" && (r as any).resolved_url) ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="mb-3 text-sm font-semibold text-gray-900">
                      <T k="lesson.videos" fallback="Videos" />
                    </div>

                    <div className="space-y-5">
                      {resourcesWithUrls
                        .filter((r) => r.kind === "youtube" && (r as any).resolved_url)
                        .map((v) => {
                          const resolved = (v as any).resolved_url as string;
                          const embedUrl = toYouTubeEmbed(resolved);

                          return (
                            <div key={v.id}>
                              <div className="mb-2 text-sm font-semibold text-gray-800">
                                {v.title}
                              </div>

                              <div
                                className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-black"
                                style={{ paddingTop: "56.25%" }}
                              >
                                <iframe
                                  className="absolute left-0 top-0 h-full w-full"
                                  src={embedUrl}
                                  title={v.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                />
                              </div>

                              <div className="mt-2">
                                <a
                                  href={resolved}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-gray-600 underline"
                                >
                                  <T k="lesson.openOnYouTube" fallback="Open on YouTube" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : null}

                {files.length > 0 ? (
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="mb-3 text-sm font-semibold text-gray-900">
                      <T k="lesson.downloads" fallback="Downloads" />
                    </div>

                    <ul className="space-y-3">
                      {files
                        .filter((file) => {
                          const n = String(file.name).toLowerCase();
                          if (n === "presentation.pdf") return false;
                          if (n.startsWith("activity-") && n.endsWith(".pdf")) return false;
                          return true;
                        })
                        .map((file) => {
                          const fullPath = `${prefix}/${file.name}`;
                          const url = supabase.storage
                            .from("course-assets")
                            .getPublicUrl(fullPath).data.publicUrl;

                          return (
                            <li key={fullPath} className="flex items-center justify-between rounded-lg border p-3">
                              <div className="truncate">
                                <span className="mr-2">{fileIcon(file.name)}</span>
                                {displayName(file.name)}
                              </div>

                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                              >
                                <T k="lesson.download" fallback="Download" />
                              </a>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}

            {files.length === 0 && resourcesWithUrls.length === 0 && (
              <p className="mt-4 text-sm text-gray-600">
                <T k="lesson.noMaterials" fallback="No materials found." />
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Prev / Next */}
      <div className="fixed bottom-6 left-6 right-6 z-20 flex items-center justify-between">
        {prev ? (
          <Link
            href={`/my-courses/${courseId}/lessons/${(prev as any).id}`}
            className="rounded-md border border-white/30 bg-white/80 px-3 py-2 text-sm font-medium text-gray-900 hover:bg-white"
          >
            ← <T k="lesson.previous" fallback="Previous" />
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/my-courses/${courseId}/lessons/${(next as any).id}`}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium !text-white hover:bg-black"
          >
            <T k="lesson.next" fallback="Next" /> →
          </Link>
        ) : (
          <div className="text-sm text-white/90">
            <T k="lesson.endOfCourse" fallback="End of course" /> ✅
          </div>
        )}
      </div>
    </div>
  );
}
