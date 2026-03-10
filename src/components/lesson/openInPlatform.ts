// src/components/lesson/openInPlatform.ts
import { toEmbed } from "@/lib/toEmbed";

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
