// src/components/activity/ActivityContentRenderer.tsx
"use client";

import type { ActivityContent, ActivitySection } from "@/src/lib/activity/content-types";
import { openInPlatform } from "@/components/lesson/openInPlatform";

function getSectionIcon(section: ActivitySection) {
  switch (section.type) {
    case "cards":
      return "🎯";
    case "steps":
      return "🧭";
    case "videos":
      return "🎥";
    case "links":
      return "📖";
    case "list":
      return "✅";
    case "text":
      return "📝";
    default:
      return "•";
  }
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/50 bg-emerald-50/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lime-100/40 via-transparent to-emerald-100/50" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-emerald-50/70 text-lg shadow-sm">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <div className="mt-1 h-[2px] w-16 rounded-full bg-gradient-to-r from-emerald-500/70 to-transparent" />
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function renderSection(section: ActivitySection) {
  const icon = getSectionIcon(section);

  switch (section.type) {
    case "text":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="space-y-4 text-gray-700">
            {section.body.map((p, i) => (
              <p key={i} className="leading-7">
                {p}
              </p>
            ))}
          </div>
        </SectionCard>
      );

    case "list":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {section.items.map((item, i) => (
              <li
                key={i}
                className="rounded-2xl border border-white/60 bg-[#edf8ee]/92 px-4 py-3 text-gray-800 shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      );

    case "cards":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="grid gap-4 lg:grid-cols-2">
            {section.cards.map((card, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/60 bg-[#f2f9f2]/92 p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold text-gray-900">{card.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {card.items.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1 text-emerald-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>
      );

    case "steps":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="space-y-5">
            {section.steps.map((step, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/60 bg-[#f2f9f2]/92 p-5 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {i + 1}. {step.title}
                  </h3>
                  {step.duration ? (
                    <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                      {step.duration}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 space-y-3 text-gray-700">
                  {step.body.map((p, idx) => (
                    <p key={idx} className="leading-7">
                      {p}
                    </p>
                  ))}
                </div>

                {step.bullets?.length ? (
                  <ul className="mt-4 space-y-2 text-gray-700">
                    {step.bullets.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="mt-1 text-emerald-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </SectionCard>
      );

    case "videos":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.items.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openInPlatform(item.url)}
                className="overflow-hidden rounded-3xl border border-white/60 bg-[#f2f9f2]/92 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                      Video preview
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="text-sm font-medium text-emerald-700">Video</div>
                  <div className="mt-2 text-base font-semibold text-gray-900">
                    {item.title}
                  </div>
                  {item.description ? (
                    <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                  ) : null}
                  <div className="mt-4 text-sm font-medium text-blue-700">
                    Open inside platform →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      );

    case "links":
      return (
        <SectionCard key={section.id} title={section.title} icon={icon}>
          <div className="space-y-3">
            {section.items.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openInPlatform(item.url)}
                className="block w-full rounded-3xl border border-white/60 bg-[#f2f9f2]/92 p-4 text-left shadow-sm transition hover:shadow-md"
              >
                <div className="text-base font-semibold text-gray-900">{item.title}</div>
                {item.description ? (
                  <div className="mt-1 text-sm text-gray-600">{item.description}</div>
                ) : null}
                <div className="mt-4 text-sm font-medium text-emerald-700">
                 Open material →
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      );

    default:
      return null;
  }
}

export default function ActivityContentRenderer({
  activity,
}: {
  activity: ActivityContent;
}) {
  const stepsSection = activity.sections.find(
    (section) => section.type === "steps"
  );

  const flowSteps =
    stepsSection && stepsSection.type === "steps"
      ? stepsSection.steps.slice(0, 3)
      : [];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[34px] border border-white/50 bg-emerald-50/70 p-6 shadow-[0_12px_32px_rgba(0,0,0,0.10)] backdrop-blur-md sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lime-100/70 via-emerald-50/35 to-green-100/65" />
        <div className="relative">
          <div className="max-w-3xl">
            <div className="text-sm font-medium text-emerald-700">
              {activity.moduleLabel}
            </div>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              {activity.title}
            </h1>

            {activity.intro ? (
              <p className="mt-5 text-base leading-8 text-gray-700 sm:text-lg">
                {activity.intro}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {activity.meta.map((item, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/75 px-4 py-2 text-sm text-gray-800 shadow-sm backdrop-blur-sm"
              >
                {item.icon ? <span>{item.icon}</span> : null}
                <span className="font-medium">{item.label}:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {flowSteps.length > 0 ? (
        <section className="relative overflow-hidden rounded-[30px] border border-white/50 bg-emerald-50/75 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-lime-100/35 via-transparent to-emerald-100/45" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-emerald-50/70 shadow-sm">
                🚀
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Activity Flow</h2>
                <p className="text-sm text-gray-600">
                  A simple guide to complete this activity
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {flowSteps.map((step, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/60 bg-[#f2f9f2]/92 p-4 shadow-sm"
                >
                  <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Step {index + 1}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-900">
                    {step.title}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {step.body?.[0] ?? ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {activity.sections.map(renderSection)}
    </div>
  );
}
