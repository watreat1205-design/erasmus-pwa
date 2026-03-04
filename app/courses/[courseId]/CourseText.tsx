"use client";

import { useTranslation } from "react-i18next";

export function TNoDescription() {
  const { t } = useTranslation("common");
  return <>{t("courses.noDescription", { defaultValue: "No description." })}</>;
}

export function TEnrollTitle() {
  const { t } = useTranslation("common");
  return <>{t("auth.login", { defaultValue: "Enroll to unlock activities" })}</>;
}

export function TEnrollBody() {
  const { t } = useTranslation("common");
  return (
    <>
      {t("courses.trainerLogin", {
        defaultValue:
          "You can browse the outline, but lessons and quizzes unlock after enrollment.",
      })}
    </>
  );
}

export function TLoginHint() {
  const { t } = useTranslation("common");
  return (
    <>
      {t("auth.goToLogin", {
        defaultValue: "You’ll be asked to log in to complete enrollment.",
      })}
    </>
  );
}

export function TNoSections() {
  const { t } = useTranslation("common");
  return <>{t("courses.empty", { defaultValue: "No sections yet." })}</>;
}

/* ✅ FIXED: use plural key */
export function TLessons() {
  const { t } = useTranslation("common");
  return <>{t("myCourses.activities", { defaultValue: "Lessons" })}</>;
}

export function TNoLessons() {
  const { t } = useTranslation("common");
  return <>{t("lesson.notFoundTitle", { defaultValue: "No lessons." })}</>;
}

export function TModuleQuiz() {
  const { t } = useTranslation("common");
  return <>{t("quizzes.title", { defaultValue: "Module Quiz" })}</>;
}

export function TLocked() {
  const { t } = useTranslation("common");
  return <>{t("quizzes.locked", { defaultValue: "Locked" })}</>;
}

export function TPassed() {
  const { t } = useTranslation("common");
  return <>{t("quizzes.passed", { defaultValue: "Passed" })}</>;
}
