// src/components/lesson/openInPlatform.ts
import { toEmbed } from "@/lib/toEmbed";

/**
 * Videos that cannot be embedded should open in a new tab.
 * Add only the YouTube VIDEO ID here.
 */
const FORCE_VIDEO_NEW_TAB = ["CsasywVt6E8"];

/**
 * PDFs that should open directly in a new tab.
 * Keep this list very specific so we do not affect other modules.
 */
const FORCE_PDF_NEW_TAB = [
  "unevoc.unesco.org/pub/nqc_graeducation_fiap.pdf",
];

function getYouTubeId(url: string) {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }

    if (u.pathname.includes("/embed/")) {
      return u.pathname.split("/embed/")[1]?.split("/")[0] ?? null;
    }

    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

function normalizeSupabaseCourseAssetUrl(url: string) {
  return url
    .replace(/Activity-%20(\d+-\d+)/gi, "Activity-$1")
    .replace(/Activity%20-(\d+-\d+)/gi, "Activity-$1")
    .replace(/Activity20-(\d+-\d+)/gi, "Activity-$1")
    .replace(/Activity -(\d+-\d+)/gi, "Activity-$1")
    .replace(/Activity-\s+(\d+-\d+)/gi, "Activity-$1");
}

export function openInPlatform(url: string) {
  if (typeof window === "undefined") return;

  const trimmedUrl = normalizeSupabaseCourseAssetUrl(url.trim());
  const lower = trimmedUrl.toLowerCase();

  const isYouTube =
    lower.includes("youtube.com/") ||
    lower.includes("youtu.be/") ||
    lower.includes("youtube-nocookie.com/");

  const isVimeo = lower.includes("vimeo.com/");
  const isVideo = isYouTube || isVimeo;

  const isForms =
    lower.includes("docs.google.com/forms") || lower.includes("forms.gle/");

  const isPdf = lower.includes(".pdf");

  if (isYouTube) {
    const youtubeId = getYouTubeId(trimmedUrl);

    if (youtubeId && FORCE_VIDEO_NEW_TAB.includes(youtubeId)) {
      window.open(trimmedUrl, "_blank", "noopener,noreferrer");
      return;
    }
  }

  if (isPdf && FORCE_PDF_NEW_TAB.some((pdf) => lower.includes(pdf))) {
    window.open(trimmedUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const finalUrl = isVideo ? toEmbed(trimmedUrl) : trimmedUrl;

  if (isVideo || isForms || isPdf) {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const courseId = parts[1];
    const lessonId = parts[3];

    if (parts[0] === "courses" && courseId && lessonId) {
      window.location.assign(
        `/courses/${courseId}/lessons/${lessonId}/external?url=${encodeURIComponent(finalUrl)}`
      );
      return;
    }

    const base = window.location.pathname.replace(/\/external\/?$/, "");
    window.location.assign(
      `${base}/external?url=${encodeURIComponent(finalUrl)}`
    );
    return;
  }

  window.open(trimmedUrl, "_blank", "noopener,noreferrer");
}

