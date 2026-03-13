// src/components/lesson/openInPlatform.ts
import { toEmbed } from "@/lib/toEmbed";

/**
 * Videos that cannot be embedded should open in a new tab.
 * Add only the YouTube VIDEO ID here.
 */
const FORCE_VIDEO_NEW_TAB = ["CsasywVt6E8"];

function getYouTubeId(url: string) {
  try {
    const u = new URL(url);

    // youtu.be format
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }

    // embed format
    if (u.pathname.includes("/embed/")) {
      return u.pathname.split("/embed/")[1]?.split("/")[0] ?? null;
    }

    // normal watch?v= format
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

export function openInPlatform(url: string) {
  if (typeof window === "undefined") return;

  const lower = url.toLowerCase();

  const isYouTube =
    lower.includes("youtube.com/") ||
    lower.includes("youtu.be/") ||
    lower.includes("youtube-nocookie.com/");

  const isVimeo = lower.includes("vimeo.com/");
  const isVideo = isYouTube || isVimeo;

  const isForms =
    lower.includes("docs.google.com/forms") || lower.includes("forms.gle/");

  const isPdf = lower.endsWith(".pdf");

  /**
   * If this is a YouTube video that cannot be embedded,
   * open it directly in a new tab.
   */
  if (isYouTube) {
    const youtubeId = getYouTubeId(url);

    if (youtubeId && FORCE_VIDEO_NEW_TAB.includes(youtubeId)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
  }

  const finalUrl = isVideo ? toEmbed(url) : url;

  // Open inside the platform
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
    window.location.assign(`${base}/external?url=${encodeURIComponent(finalUrl)}`);
    return;
  }

  // Everything else opens normally
  window.open(url, "_blank", "noopener,noreferrer");
}
