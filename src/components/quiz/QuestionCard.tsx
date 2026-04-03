"use client";

import { useTranslation } from "react-i18next";

export default function QuestionCard({
  index,
  required,
  points,
  prompt,
  children,
}: {
  index: number;
  required?: boolean;
  points?: number;
  prompt: string;
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation("common");
  const lang = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);

  const ui = {
    en: { requiredQuestion: "Required question", point: "point", points: "points" },
    el: { requiredQuestion: "Απαιτούμενη ερώτηση", point: "βαθμός", points: "βαθμοί" },
    it: { requiredQuestion: "Domanda obbligatoria", point: "punto", points: "punti" },
    es: { requiredQuestion: "Pregunta obligatoria", point: "punto", points: "puntos" },
    ro: { requiredQuestion: "Întrebare obligatorie", point: "punct", points: "puncte" },
    hr: { requiredQuestion: "Obavezno pitanje", point: "bod", points: "bodova" },
  } as const;

  const t = ui[lang as keyof typeof ui] ?? ui.en;

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-gray-900">
          {index}. {prompt}{" "}
          {required ? <span className="text-red-600">*</span> : null}
        </div>
        {typeof points === "number" ? (
          <div className="text-xs font-semibold text-gray-500">
            {points} {points === 1 ? t.point : t.points}
          </div>
        ) : null}
      </div>

      {required ? (
        <div className="mt-2 text-xs text-gray-500">
          <span className="text-red-600">*</span> {t.requiredQuestion}
        </div>
      ) : null}

      <div className="mt-4">{children}</div>
    </div>
  );
}
