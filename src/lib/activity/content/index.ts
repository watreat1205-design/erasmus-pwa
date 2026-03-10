import type { ActivityContent } from "@/src/lib/activity/content-types";
import { activity11Content } from "./activity-1-1";
import { activity12Content } from "./activity-1-2";

export function getActivityContentByLesson(
  lessonTitle?: string | null,
  lessonPosition?: number | null
): ActivityContent | null {
  const title = String(lessonTitle ?? "").toLowerCase().trim();

  if (
    title.includes("activity 1.1") ||
    title.includes("exploring teal") ||
    lessonPosition === 1
  ) {
    return activity11Content;
  }

  if (
    title.includes("activity 1.2") ||
    title.includes("teal in action") ||
    title.includes("applying teal strategies in real scenarios") ||
    lessonPosition === 2
  ) {
    return activity12Content;
  }

  return null;
}
