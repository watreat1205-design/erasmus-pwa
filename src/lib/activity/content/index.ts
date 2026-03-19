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
import { activity24Content } from "./activity-2-4";
import { activity25Content } from "./activity-2-5";

import { activity31Content } from "./activity-3-1";
import { activity32Content } from "./activity-3-2";
import { activity33Content } from "./activity-3-3";
import { activity34Content } from "./activity-3-4";

import { activity51Content } from "./activity-5-1";

import { activity61Content } from "./activity-6-1";
import { activity62Content } from "./activity-6-2";
import { activity63Content } from "./activity-6-3";
import { activity64Content } from "./activity-6-4";

function normalize(value?: string | null) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[–—:]/g, " ")
    .replace(/\./g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getActivityContentByLesson(
  courseTitle?: string | null,
  lessonTitle?: string | null,
  lessonPosition?: number | null
): ActivityContent | null {
  const course = normalize(courseTitle);
  const title = normalize(lessonTitle);

  // ---------- PRIMARY MATCH: COURSE + POSITION ----------

  // Module 1
  if (
    course.includes("teal pedagogy") ||
    course.includes("module 1") ||
    course.includes("εισαγωγή στη μεθοδολογία διδασκαλίας teal")
  ) {
    switch (lessonPosition) {
      case 1:
        return activity11Content;
      case 2:
        return activity12Content;
      case 3:
        return activity13Content;
      case 4:
        return activity14Content;
      case 5:
        return activity15Content;
      default:
        return null;
    }
  }

  // Module 2
  if (
    course.includes("sustainable transition policies") ||
    course.includes("stp") ||
    course.includes("module 2") ||
    course.includes("θεμελιώσεις της περιβαλλοντικής εκπαίδευσης")
  ) {
    switch (lessonPosition) {
      case 1:
        return activity21Content;
      case 2:
        return activity22Content;
      case 3:
        return activity23Content;
      case 4:
        return activity24Content;
      case 5:
        return activity25Content;
      default:
        return null;
    }
  }

  // Module 3
  if (
    course.includes("acta") ||
    course.includes("module 3") ||
    course.includes("from knowledge to skills for a transformative education") ||
    course.includes("από τη γνώση στις δεξιότητες για έναν μετασχηματιστικό τύπο εκπαίδευσης")
  ) {
    switch (lessonPosition) {
      case 1:
        return activity31Content;
      case 2:
        return activity32Content;
      case 3:
        return activity33Content;
      case 4:
        return activity34Content;
      default:
        return null;
    }
  }

       // Module 5
  if (
    course.includes("adult education for environmental sustainability") ||
    course.includes("module 5")
  ) {
    switch (lessonPosition) {
      case 1:
        return activity51Content;
      default:
        return null;
    }
  }

    // Module 6
  if (
    course.includes("ccif") ||
    course.includes("module 6") ||
    course.includes("green skills training") ||
    course.includes("green skills for transformative education")
  ) {
    switch (lessonPosition) {
      case 1:
        return activity61Content;
      case 2:
        return activity62Content;
      case 3:
        return activity63Content;
      case 4:
        return activity64Content;
      default:
        return null;
    }
  }

  // ---------- FALLBACK: LESSON TITLE ----------

  // Module 1
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

  // Module 2
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

  // Module 3
  if (title.includes("activity 3 1") || title.includes("digital eco quest")) {
    return activity31Content;
  }

  if (title.includes("activity 3 2") || title.includes("eco footprint challenge")) {
    return activity32Content;
  }

  if (
    title.includes("activity 3 3") ||
    title.includes("sustainable cities educated citizens") ||
    title.includes("community becomes an ecological learning space")
  ) {
    return activity33Content;
  }

  if (
    title.includes("activity 3 4") ||
    title.includes("environmental education as awareness raising on climate change") ||
    title.includes("climate change")
  ) {
    return activity34Content;
  }

    // Module 6
  if (title.includes("activity 6 1") || title.includes("green skills")) {
    return activity61Content;
  }

  if (
    title.includes("activity 6 2") ||
    title.includes("teaching sustainability with tech")
  ) {
    return activity62Content;
  }

  if (
    title.includes("activity 6 3") ||
    title.includes("greening the workplace")
  ) {
    return activity63Content;
  }

  if (
    title.includes("activity 6 4") ||
    title.includes("esd in action personal blog")
  ) {
    return activity64Content;
  }

  return null;
}
