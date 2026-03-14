// src/lib/activity/content/index.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";
import { activity11Content } from "./activity-1-1";
import { activity12Content } from "./activity-1-2";
import { activity13Content } from "./activity-1-3";
import { activity14Content } from "./activity-1-4";
import { activity15Content } from "./activity-1-5";
import { activity21Content } from "./activity-2-1";
import { activity22Content } from "./activity-2-2";
import { activity23Content } from "./activity-2-3";

export function getActivityContentByLesson(
  lessonTitle?: string | null,
  lessonPosition?: number | null
): ActivityContent | null {
  const title = String(lessonTitle ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  // ---------- MODULE 1 ----------
  if (
    title.includes("activity 1.1") ||
    title.includes("exploring teal")
  ) {
    return activity11Content;
  }

  if (
    title.includes("activity 1.2") ||
    title.includes("teal in action") ||
    title.includes("applying teal strategies in real scenarios")
  ) {
    return activity12Content;
  }

  if (
    title.includes("activity 1.3") ||
    title.includes("deepening teal application")
  ) {
    return activity13Content;
  }

  if (
    title.includes("activity 1.4") ||
    title.includes("digital tools for teal")
  ) {
    return activity14Content;
  }

  if (
    title.includes("activity 1.5") ||
    title.includes("designing teal activities with digital integration") ||
    title.includes("designing teal activities")
  ) {
    return activity15Content;
  }

  // ---------- MODULE 2 ----------
  if (
    title.includes("activity 2.1") ||
    title.includes("exploring agenda 2030")
  ) {
    return activity21Content;
  }
  
    if (
    title.includes("activity 2.2") ||
    title.includes("activity 2.2:") ||
    title.includes("to become a changemaker") ||
    title.includes("to become a change maker") ||
    title.includes("change maker")
  ) {
    return activity22Content;
  }

  if (
  title.includes("activity 2.3") ||
  title.includes("needs and wants")
  ) {
  return activity23Content;
  }

  // ---------- LAST-RESORT FALLBACK ----------
  // Use with caution only if title is missing or malformed.
  // For now, keep disabled to avoid cross-module mismatches.
  // if (lessonPosition === 1) return activity11Content;
  // if (lessonPosition === 2) return activity12Content;
  // if (lessonPosition === 3) return activity13Content;
  // if (lessonPosition === 4) return activity14Content;
  // if (lessonPosition === 5) return activity15Content;

  return null;
}
