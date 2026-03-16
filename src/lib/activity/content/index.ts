import type { ActivityContent } from "@/src/lib/activity/content-types";

import { activity11Content } from "./activity-1-1";
import { activity12Content } from "./activity-1-2";
import { activity13Content } from "./activity-1-3";
import { activity14Content } from "./activity-1-4";
import { activity15Content } from "./activity-1-5";

import { activity21Content } from "./activity-2-1";
import { activity22Content } from "./activity-2-2";
import { activity23Content } from "./activity-2-3";
import { activity24Content } from "./activity-2-4";
import { activity25Content } from "./activity-2-5";

import { activity31Content } from "./activity-3-1";
import { activity32Content } from "./activity-3-2";
import { activity33Content } from "./activity-3-3";
import { activity34Content } from "./activity-3-4";

export function getActivityContentByLesson(
  lessonTitle?: string | null,
  lessonPosition?: number | null
): ActivityContent | null {
  const title = String(lessonTitle ?? "")
    .toLowerCase()
    .replace(/[–—:]/g, " ")
    .replace(/\./g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // ---------- MODULE 1 ----------

  if (title.includes("activity 1 1") || title.includes("exploring teal")) {
    return activity11Content;
  }

  if (
    title.includes("activity 1 2") ||
    title.includes("teal in action") ||
    title.includes("applying teal strategies in real scenarios")
  ) {
    return activity12Content;
  }

  if (
    title.includes("activity 1 3") ||
    title.includes("deepening teal application")
  ) {
    return activity13Content;
  }

  if (
    title.includes("activity 1 4") ||
    title.includes("digital tools for teal")
  ) {
    return activity14Content;
  }

  if (
    title.includes("activity 1 5") ||
    title.includes("designing teal activities with digital integration") ||
    title.includes("designing teal activities")
  ) {
    return activity15Content;
  }

  // ---------- MODULE 2 ----------

  if (title.includes("activity 2 1") || title.includes("exploring agenda 2030")) {
    return activity21Content;
  }

  if (
    title.includes("activity 2 2") ||
    title.includes("to become a changemaker") ||
    title.includes("to become a change maker") ||
    title.includes("change maker")
  ) {
    return activity22Content;
  }

  if (title.includes("activity 2 3") || title.includes("needs and wants")) {
    return activity23Content;
  }

  if (
    title.includes("activity 2 4") ||
    title.includes("to promote green deal policies") ||
    title.includes("green deal")
  ) {
    return activity24Content;
  }

  if (
    title.includes("activity 2 5") ||
    title.includes("fit for 55 packages") ||
    title.includes("fit for 55")
  ) {
    return activity25Content;
  }

  // ---------- MODULE 3 ----------

  if (
    title.includes("activity 3 1") ||
    title.includes("digital eco quest") ||
    (title.includes("lesson 3 1") && lessonPosition === 1)
  ) {
    return activity31Content;
  }

  if (
    title.includes("activity 3 2") ||
    title.includes("eco footprint challenge") ||
    (title.includes("lesson 3 2") && lessonPosition === 2)
  ) {
    return activity32Content;
  }

  if (
    title.includes("activity 3 3") ||
    title.includes("sustainable cities educated citizens") ||
    title.includes("community becomes an ecological learning space") ||
    (title.includes("lesson 3 3") && lessonPosition === 3)
  ) {
    return activity33Content;
  }

  if (
    title.includes("activity 3 4") ||
    title.includes("environmental education as awareness raising on climate change") ||
    title.includes("climate change") ||
    (title.includes("lesson 3 4") && lessonPosition === 4)
  ) {
    return activity34Content;
  }

  return null;
}
