// src/lib/activity/content/index.ts
import type { ActivityContent } from "@/src/lib/activity/content-types";
import { activity11Content } from "./activity-1-1";
import { activity12Content } from "./activity-1-2";
import { activity13Content } from "./activity-1-3";
import { activity14Content } from "./activity-1-4";
import { activity15Content } from "./activity-1-5";
import { activity21Content } from "./activity-2-1";

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

  if (
    title.includes("activity 1.3") ||
    title.includes("deepening teal application") ||
    lessonPosition === 3
  ) {
    return activity13Content;
  }

  if (
  title.includes("activity 1.4") ||
  title.includes("digital tools for teal") ||
  lessonPosition === 4
) {
  return activity14Content;
}

if (
  title.includes("activity 1.5") ||
  title.includes("designing teal activities") ||
  lessonPosition === 5
) {
  return activity15Content;
}

if (
  title.includes("activity 2.1") ||
  title.includes("exploring agenda 2030") ||
  title.includes("lesson 2.1") ||
  lessonPosition === 1
) {
  return activity21Content;
}

return null;
}
