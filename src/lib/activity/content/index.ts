//  src/lib/activity/content/index.ts 
import type { ActivityContent } from "@/lib/activity/content-types";
import { activity11Content } from "./activity-1-1";

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

  return null;
}
