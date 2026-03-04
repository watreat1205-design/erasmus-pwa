"use client";

import { useTranslation } from "react-i18next";

export default function LessonLabelsClient() {
  const { t } = useTranslation("common");

  return {
    resourcesTitle: t("resources.title"),
    openFile: t("resources.open", { defaultValue: "Open" }),
    moduleQuiz: t("quizzes.title", { defaultValue: "Quizzes" }),
    passScore: t("quizzes.passScore"),
    lastAttempt: t("quizzes.lastAttempt"),
    passed: t("quizzes.passed"),
    notPassed: t("quizzes.notPassed"),
    noAttempts: t("quizzes.noAttempts"),
    viewQuiz: t("quizzes.start", { defaultValue: "View quiz" }),
    retakeQuiz: t("quizzes.retake"),
    startQuiz: t("quizzes.start"),
    previous: t("lesson.previous"),
    next: t("lesson.next"),
    endOfCourse: t("lesson.endOfCourse"),
  };
}
